# ADR-003: Jira Access via Direct REST v3 over httpx

- **Status**: Proposed
- **Date**: 2026-09-02

## Context

The Jira adapter is the sole implementation of the `WorkItemProvider` port from
[ADR-001](./adr-001-hexagonal-vertical-slices.md), and Jira ships first with Linear and
Azure DevOps to follow in Phase 2.

Two properties matter more than convenience:

- **Testability.** [NFR-X03](../01-requirements/README.md#cross-cutting-quality-baseline)
  requires ≥80% line coverage on provider adapters, and
  [NFR-001-01](../01-requirements/f-001-validate-preview-commit.md) requires proving that
  preview performs *zero* write calls. Both need a mocking seam that intercepts HTTP
  reliably.
- **Duplicate avoidance.** Preventing duplicate issues is the product's reason to exist
  ([F-002](../01-requirements/f-002-dedup-on-rerun.md)). A timed-out create may have
  succeeded, so retry behavior must be controlled precisely — a wrapper library that
  silently retries writes would be actively dangerous here.

## Decision

Call the **Jira Cloud REST API v3 directly using `httpx`**, entirely within
`infrastructure/external/jira`. No Jira SDK or wrapper library.

Adapter rules:

- **Auth:** `Authorization: Basic base64(email:api_token)`, token from the environment
  ([ADR-006](./adr-006-config-and-secrets.md)).
- **Retry:** exponential backoff with jitter on `429` and `5xx` only, honoring
  `Retry-After`, bounded attempts.
- **Creates are never blind-retried.** State is re-established by searching the reference
  field before any create retry.
- **Write ordering:** Epics before their Stories, so parent links always resolve.
- **Error translation:** `401`/`403`/`404`/`429` become typed domain errors with actionable
  messages. Raw response bodies never propagate outward or into logs.
- **Pagination** is fully consumed inside the adapter; ports return complete result sets.
- **Explicit connect and read timeouts** on every call; one `httpx.Client` reused per run.
- **Markdown ↔ ADF** (Atlassian Document Format) conversion is owned here, so no other layer
  learns about it.
- **TLS verification is always on** — no bypass option exists, and none may be added.

## Consequences

### Positive

- `httpx`'s transport layer gives a clean mocking seam, so adapter tests are deterministic
  and network-free — including a test that fails on any write during preview.
- Retry policy is explicit and auditable, which is what keeps a timed-out create from
  becoming a duplicate.
- No wrapper library's model or release cadence to track, and no risk of it changing write
  semantics under us.
- An async path stays open if a future transport needs one.
- Confining every Jira concept behind the port keeps the Phase 2 provider swap honest.

### Negative

- More code than a wrapper: pagination, ADF conversion, field mapping, and error taxonomy
  are all ours to write and maintain.
- Jira REST API changes land on us directly, with no library release absorbing them.
  *Mitigation:* the manual pre-release verification pass against a real Jira project
  ([ADR-008](./adr-008-quality-toolchain-github-actions.md)).
- ADF is verbose and under-documented compared to Markdown; conversion is a likely source of
  formatting bugs.
- Mocked adapter tests cannot catch a Jira-side contract change — a known coverage gap, not
  a solved problem.

## Alternatives Considered

1. **`atlassian-python-api` or a similar wrapper**
   - Considered to avoid boilerplate for common calls.
   - Rejected: couples the adapter to a third-party model and release cadence, and obscures
     retry behavior on writes — precisely where this product cannot afford surprises.
2. **`requests` instead of `httpx`**
   - Considered as the most familiar synchronous HTTP client.
   - Rejected: no async path, and a less convenient transport-level mocking story.
3. **An official Atlassian SDK**
   - Considered for first-party support.
   - Rejected: heavier surface than a handful of endpoints needs, and the same coupling
     objection as (1).
