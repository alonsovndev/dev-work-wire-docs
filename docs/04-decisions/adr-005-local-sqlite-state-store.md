# ADR-005: Local SQLite State Store as a Rebuildable Cache

- **Status**: Proposed
- **Date**: 2026-09-02

## Context

Jira is the system of record for every work item; DevWorkWire owns none of that data. But
three requirements need state that has nowhere else to live:

- **Drift detection** — [FR-002-03](../01-requirements/f-002-dedup-on-rerun.md) compares an
  issue against "the value recorded at last import", which requires a baseline.
- **Idempotency** — [FR-004-04](../01-requirements/f-004-mcp-tool-surface.md) requires a
  retried commit to replay its original result without re-writing.
- **Preview handles** — [ADR-004](./adr-004-mcp-stdio-confirm-gate.md) persists each plan so
  the commit executes what was reviewed.

Two hard constraints: a fail-fast commit
([FR-001-06](../01-requirements/f-001-validate-preview-commit.md)) must leave a *resumable*
state, so a crash mid-batch cannot corrupt the record of what was already written; and
there is no operator — the "DBA" is a developer running `dwire` who does not know this file
exists.

Crucially, the authoritative link between a document item and a Jira issue is the reference
field stored **on the Jira issue itself**
([FR-002-01](../01-requirements/f-002-dedup-on-rerun.md)), and matching is primarily via
that field ([FR-002-02](../01-requirements/f-002-dedup-on-rerun.md)).

## Decision

Use **SQLite via the stdlib `sqlite3` module**, at `.devworkwire/state.db` in the project
directory, `0600`, gitignored — one store per configured project.

**The store is a rebuildable cache, not a source of truth.** Deleting `state.db` must never
cause duplicate issues: a rebuild re-queries Jira for issues carrying the reference field
and restores the index. Only drift history is genuinely lost.

Five tables: `imported_item` (the dedup index and drift baselines), `preview` (issued
handles and the plans they authorize), `commit_run` / `commit_run_item` (idempotency and
per-item outcomes), and `schema_version`.

Key rules:

- **`PRAGMA foreign_keys = ON`** on every connection — SQLite ignores foreign keys otherwise.
- **Two uniqueness constraints** on `imported_item` prevent both failure modes that matter:
  duplicate issues for one item, and two items claiming the same issue.
- **Index rows are written per item**, immediately after each successful Jira write — the
  property that makes a fail-fast stop resumable.
- **The drift baseline is a hash** of DevWorkWire-managed fields only (summary, description,
  acceptance criteria, parent link, issue type) over a canonical serialization. Status,
  assignee, comments, and labels are excluded so ordinary team activity does not read as
  drift.
- **Migrations run in-process on store open**, versioned and transactional, additive-first.
  A store newer than the running binary is refused rather than misread.
- **Retention (proposed, unvalidated):** `preview` rows past their 30-minute TTL are pruned;
  `commit_run` rows are pruned after 30 days; `imported_item` rows are **never** pruned.

Full schema: [Database Design](../03-architecture/database/database-design.md).

## Consequences

### Positive

- Atomic transactions mean a crash mid-commit cannot leave a half-written index, which is
  what makes the fail-fast retry in `FR-001-06` safe.
- Zero dependencies — `sqlite3` is stdlib.
- Because the store is a cache, **no backup strategy is required**, and users can delete the
  file without fear. This also gives migrations an escape hatch: a change that would be
  breaking can drop and rebuild from Jira instead.
- Hashing rather than snapshotting keeps issue content out of the permanent index.
- Uniqueness constraints enforce the anti-duplication guarantee at the storage layer rather
  than by convention.

### Negative

- **`preview.plan_json` stores issue content on disk** for the TTL window — titles,
  descriptions, and acceptance criteria. This is a genuine tension with
  [NFR-X02](../01-requirements/README.md#cross-cutting-quality-baseline), which states local
  storage holds no PII beyond connection settings. **That NFR predates this design and needs
  a Product Owner decision:** amend it to permit transient, TTL-bounded plan storage, or drop
  cross-process previews. **Open — not resolved by this ADR.**
- A hash baseline detects *that* something changed but not *what*, so the overwrite-or-skip
  choice in [FR-002-04](../01-requirements/f-002-dedup-on-rerun.md) is less informed than a
  snapshot would allow. *Possible mitigation:* fetch and diff the live issue on demand
  without persisting it.
- A binary file users cannot inspect or hand-repair.
- Schema migrations must be tested forward from every released version, since users upgrade
  on their own schedule and may skip many versions.
- Retention windows (30 minutes, 30 days) are **guesses** and should be revisited against
  real usage.

## Alternatives Considered

1. **JSON file with atomic replace**
   - Considered because it is human-readable, diffable, and hand-repairable — real benefits
     for an open-source tool whose users will hit edge cases.
   - Rejected: no transaction across a multi-item commit, so a crash mid-batch could leave
     the index inconsistent with Jira — the one failure this store exists to prevent.
2. **No local store — derive everything from Jira**
   - Considered as the simplest possible model.
   - Rejected: drift baselines (`FR-002-03`), idempotency records (`FR-004-04`), and preview
     plans have nowhere to live. All three requirements would need reworking.
3. **Snapshot the managed fields instead of hashing**
   - Considered because it would let the preview show an exact before/after diff.
   - Rejected: stores Jira content in the *permanent* index, worsening the `NFR-X02` tension
     well beyond the bounded exposure the preview table already carries.
4. **Jira's `updated` timestamp as the drift signal**
   - Considered as the cheapest option, storing nothing.
   - Rejected: flags drift for *any* edit, including DevWorkWire's own writes and irrelevant
     label or watcher changes — false warnings train users to click through the gate.
5. **Store in the user's home directory instead of the project**
   - Considered to avoid any chance of an accidental commit.
   - Rejected: state would drift out of step with the repo and config it describes.
