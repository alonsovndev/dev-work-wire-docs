# Database

## Overview

Database architecture domain: schema design, integrity rules, access patterns, and
migration guidance.

> **Scope note.** DevWorkWire has **no server database**. Jira is the system of record for
> every work item. What this domain covers is a small local **SQLite state store**
> (`.devworkwire/state.db`, gitignored, one per project) that exists solely to make
> re-runs safe and the confirm gate enforceable: it caches the source-item → Jira-issue
> index, records drift baselines, holds issued preview handles with the plans they
> authorize, and stores commit idempotency records. The checklists below are adapted to
> that reality rather than to a hosted relational database.

## Documents

| Document | Description |
| -------- | ----------- |
| [database-design.md](./database-design.md) | Entities, relationships, ERD, constraints, and access patterns |

## Related ADRs

The decisions recorded in [database-design.md](./database-design.md) are captured as
[ADR-005 — Local SQLite State Store as a Rebuildable Cache](../../04-decisions/adr-005-local-sqlite-state-store.md),
which also carries the unresolved `NFR-X02` tension over transient plan storage.

- [ADR Decision Log](../../04-decisions/README.md)

## Scope

This domain covers:

- Logical and physical schema of the local state store
- Constraints and integrity rules that prevent duplicate or cross-claimed issues
- Indexing and access patterns for the preview hot path
- Local file access control and data governance
- In-process schema migration and the rebuild-from-Jira escape hatch

Explicitly **not** in this domain: the Jira schema itself, Jira field configuration
(covered in [F-008](../../01-requirements/f-008-provider-auth-configuration.md)), and any
notion of hosted database operations — there are none.

## Requirements Coverage

| Requirement | Schema Element(s) | Notes |
| ----------- | ----------------- | ----- |
| [FR-002-01](../../01-requirements/f-002-dedup-on-rerun.md) | Jira custom field (external) + `imported_item.source_item_id` | Authoritative reference lives on the issue; the table indexes it |
| [FR-002-02](../../01-requirements/f-002-dedup-on-rerun.md) | `imported_item` unique `(provider, project_key, source_document, source_item_id)` | Re-run matches instead of creating |
| [FR-002-03](../../01-requirements/f-002-dedup-on-rerun.md) | `imported_item.baseline_hash` | Drift = live managed-field hash ≠ stored baseline |
| [FR-001-05](../../01-requirements/f-001-validate-preview-commit.md) | `preview.plan_json` | Commit executes the stored plan, not a recomputed one |
| [FR-001-06](../../01-requirements/f-001-validate-preview-commit.md) | `commit_run_item.outcome`, `sequence` | Committed / failed / untried split for fail-fast batches |
| [FR-004-02/03](../../01-requirements/f-004-mcp-tool-surface.md) | `preview.handle`, `kind`, `expires_at`, `consumed_at` | No commit without a live, matching, unconsumed handle |
| [FR-004-04](../../01-requirements/f-004-mcp-tool-surface.md) | `commit_run.idempotency_key` (unique), `result_json` | Retry replays the stored result with zero new writes |
| [NFR-002-01](../../01-requirements/f-002-dedup-on-rerun.md) | Dedicated Jira custom field, not a label | Survives unrelated issue edits |
| [NFR-008-01](../../01-requirements/f-008-provider-auth-configuration.md) | No credential column exists | Enforced by schema, not policy |
| [NFR-X02](../../01-requirements/README.md#cross-cutting-quality-baseline) | Hash baseline instead of a content snapshot | **Partially covered.** No content in the permanent index, but `preview.plan_json` holds issue content transiently under a TTL — see the open item in [database-design.md](./database-design.md#risks-and-open-questions) |

## Database Best Practices Applied

> Adapted for an embedded, single-user SQLite store. Several standard practices (pooling,
> least-privilege database credentials, row-level security) have no meaning here and are
> noted as such rather than dressed up.

### Schema Design

- Every table has a primary key; `imported_item` carries `created_at` / `updated_at`.
- Enum-like columns (`item_type`, `status`, `outcome`) are constrained with `CHECK`, since
  SQLite has no native enum type.
- Timestamps are ISO-8601 UTC `TEXT` — sortable, and readable when a user opens the file.
- No soft deletion. `imported_item` rows are never pruned; `commit_run` rows are hard-
  deleted by the retention policy.

### Indexing Strategy

- Both uniqueness constraints on `imported_item` back real integrity rules: one Jira issue
  per document item, and one document item per Jira issue.
- The preview hot path loads a document's whole index in one query rather than one lookup
  per item — the per-item cost that matters is the Jira round-trip, not the SQLite read.
- At hundreds of rows, indexes here are about correctness far more than speed. Do not add
  more without a measured need.

### Security & Access Control

- Access control is filesystem permissions: `0600`, inside a gitignored `.devworkwire/`.
  There is one user and no database credential to scope.
- No row-level security model — a single-user embedded store has no principals to
  distinguish.
- No credentials are stored. The Jira API token lives only in the environment and process
  memory ([NFR-008-01](../../01-requirements/f-008-provider-auth-configuration.md)).
- Content storage is minimized, not eliminated: the drift baseline is a hash rather than a
  snapshot, but `preview.plan_json` necessarily holds the content it is about to write —
  transiently, under a TTL. `result_json` and `error_message` must be structured and
  redacted, never raw response bodies. This is a genuine qualification to
  [NFR-X02](../../01-requirements/README.md#cross-cutting-quality-baseline) and is tracked
  as an open item, not treated as settled.

### Data Integrity

- `PRAGMA foreign_keys = ON` on every connection — SQLite does not enforce foreign keys by
  default, so the `commit_run_item` cascade is inert without it.
- Index rows are written per item, only after that item's Jira write succeeds. This is
  what makes a fail-fast stop resumable.
- Business invariants (parent/child validity, count matching, orphan detection) are
  enforced in the domain layer against the parsed document, not by database constraints.

### Connection Management

- No pooling. One process, one connection, opened per command and closed at exit.
- Writes run inside an explicit transaction so a crash cannot leave a partial index.
- A store whose `schema_version` is newer than the running binary is refused with a clear
  message rather than read optimistically.

### Backup and Recovery

- **No backup strategy is needed**, which is the point of treating the store as a cache.
  Losing `state.db` loses drift history only; the reference fields on the Jira issues
  survive, so the next import still matches and does not duplicate.
- The rebuild path — re-query Jira for issues carrying the reference field — doubles as
  the migration escape hatch for changes that would otherwise be breaking.

## Source References

- [Database Design](./database-design.md)
- [Architecture Solution Design](../core/architecture-solution-design.md)
- [Technology Stack](../core/technology-stack.md)
- [ADR Decision Log](../../04-decisions/README.md)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
