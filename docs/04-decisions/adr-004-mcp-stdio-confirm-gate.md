# ADR-004: MCP Server on stdio with a Preview-Handle Confirm Gate

- **Status**: Proposed
- **Date**: 2026-09-02

## Context

DevWorkWire's differentiator is that an AI agent gets **the same trust gate as a human**:
there is no separate, looser path for agents
([Overview → Key Differentiators](../00-context/overview.md#key-differentiators)).
[F-004](../01-requirements/f-004-mcp-tool-surface.md) turns this into requirements — a
commit must follow a preview (`FR-004-03`), must carry explicit confirmation
(`FR-004-02`), and must be safely retryable (`FR-004-04`).

This creates a design problem a simple flag cannot solve. An agent may be mistaken,
overconfident, or manipulated — a source document or Jira comment can carry text aimed at
the calling LLM (T-001/T-002 in the [Threat Model](../03-architecture/security/threat-model.md)).
So "confirmed" must be something the *server* verifies against prior state, not something
the caller merely asserts.

Two further facts constrain the mechanism: agent harnesses restart MCP subprocesses
routinely, so anything held only in process memory is lost unpredictably; and the plan a
human approved must be the plan that executes
([FR-001-05](../01-requirements/f-001-validate-preview-commit.md)).

## Decision

Build the MCP server on the **official `mcp` Python SDK over stdio only**, exposing six
tools of which exactly **two write**: `import.commit` and `progress.commit`.

The gate is a set of contract rules, not a parameter:

1. **No commit without a preview.** Every `*.commit` requires a `preview_handle` issued by
   its matching `*.preview`.
2. **No commit without explicit confirmation.** The handle alone is not consent;
   `confirmed: true` is also required.
3. **The commit executes the stored plan, not a recomputed one.** `*.preview` persists the
   plan alongside its handle; `*.commit` loads and executes exactly that plan.
4. **Previews never write** — zero tracker write calls during any `*.preview`.
5. **No parameter, flag, or tool bypasses rules 1–4** — not for CI, not for tests against
   live instances, not for "trusted" agents.
6. **`result_type`** (`"preview"` or `"committed"`) is mandatory on every result, so an
   agent cannot report a plan as a completed write.

Handles are opaque, randomly generated, `kind`-scoped, single-use, and **persisted in the
local state store** with a **30-minute TTL** (see
[ADR-005](./adr-005-local-sqlite-state-store.md)). `*.commit` accepts a client-supplied
`idempotency_key`; a repeat with the same handle replays the stored result with zero new
writes, while a repeat with a *different* handle is rejected as `IDEMPOTENCY_KEY_REUSED`.

The CLI reaches the same gate through an InquirerPy prompt rather than an argument, because
both front doors are thin adapters over one `WorkItemService`
([ADR-001](./adr-001-hexagonal-vertical-slices.md)).

Full contract: [Interface Design Standards](../03-architecture/interfaces/interface-standards.md).

## Consequences

### Positive

- The gate is enforced by server-side state, so an agent that has been talked into
  committing still cannot produce an unreviewed write.
- stdio means **no listening port and no inbound auth surface** — the smallest possible
  attack surface, and it works with any MCP-compatible harness with no per-harness work.
- Persisting handles means a preview survives a harness restarting the subprocess, so users
  are not trained to re-preview reflexively (which would erode the gate).
- Executing the stored plan makes "no divergence from the preview" structural.
- Idempotency keys make a dropped response safe to retry — the failure mode most likely to
  create duplicates.

### Negative

- **Two round-trips for every write**, including a one-line comment. Accepted: a uniform gate
  is worth more than per-action convenience.
- **Storing plans puts issue content on disk** for the TTL window, which is in tension with
  [NFR-X02](../01-requirements/README.md#cross-cutting-quality-baseline). Tracked as an open
  item in [ADR-005](./adr-005-local-sqlite-state-store.md).
- Handles expire, so a slow human review means re-previewing. **The 30-minute TTL is not yet
  validated against real use** and should be revisited.
- **The server cannot verify its caller** — any local process running as the user can invoke
  it. Accepted: such a process could use the token directly anyway.
- Prompt injection is *bounded*, not eliminated. No control at this layer makes an LLM immune
  to manipulation; the gate ensures manipulation cannot produce an unconfirmed write.
- stdio-only forecloses remote/multi-user MCP without a new ADR and threat model — deliberate.

## Alternatives Considered

1. **A `confirmed: true` flag with no preview handle**
   - Considered as one round-trip instead of two.
   - Rejected: "confirmed" becomes something the caller asserts rather than the server
     verifies — exactly the bypass shape `FR-004-03` exists to prevent.
2. **Handles in process memory only**
   - Considered as simpler, with nothing to persist or prune.
   - Rejected: harness subprocess restarts would silently invalidate previews, and no issue
     content would touch disk — but the usability damage trains users around the gate.
3. **Stateless content-hash binding**
   - Considered to avoid storing plans and managing expiry.
   - Rejected: commit would recompute the plan (re-reading Jira), so the executed plan could
     differ from the reviewed one if the tracker changed in between.
4. **stdio plus an HTTP transport**
   - Considered to allow remote hosting later.
   - Rejected: adds a network surface, inbound authentication, and multi-tenancy to a tool
     that is otherwise purely local, with no requirement asking for it.
5. **Separate single-call progress tools** (`progress.comment`, etc.)
   - Considered because comments and transitions are small, low-risk writes.
   - Rejected: a second, lighter gate mechanism is the divergence this product exists to
     avoid. `progress.preview`/`progress.commit` mirror the import pair instead.
