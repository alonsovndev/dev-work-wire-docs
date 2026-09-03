---
sidebar_position: 1
---

# Interface Design Standards

| Attribute   | Value       |
| ----------- | ----------- |
| **Project** | DevWorkWire |
| **Version** | 0.1         |
| **Status**  | Draft       |

## Table of Contents

- [Interface Inventory](#interface-inventory)
- [MCP Tool Surface Standards](#mcp-tool-surface-standards)
  - [Trust Tier Classification](#trust-tier-classification)
- [The Confirm Gate as a Contract Rule](#the-confirm-gate-as-a-contract-rule)
  - [Preview Handle Lifecycle](#preview-handle-lifecycle)
  - [Idempotency](#idempotency)
- [Versioning Strategy](#versioning-strategy)
- [Error Handling Standards](#error-handling-standards)
  - [Error Payload Shape](#error-payload-shape)
  - [Canonical Error Codes](#canonical-error-codes)
- [Response Format Conventions](#response-format-conventions)
- [CLI Surface Standards](#cli-surface-standards)
  - [Exit Codes](#exit-codes)
- [Outbound Jira Client Standards](#outbound-jira-client-standards)
- [Authentication and Authorization Patterns](#authentication-and-authorization-patterns)
- [Rate Limiting and Throttling](#rate-limiting-and-throttling)
- [Observability](#observability)
- [Deployment Impact](#deployment-impact)
- [Source References](#source-references)

## Interface Inventory

| Interface          | Direction | Protocol                                      | Audience                                                                                 | Stability                                                                              |
| ------------------ | --------- | --------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| MCP tool surface   | Inbound   | JSON-RPC 2.0 over stdio                       | AI agents via any MCP harness ([F-004](../../01-requirements/f-004-mcp-tool-surface.md)) | **Public contract** — breaking changes are major-version events                        |
| `dwire` CLI        | Inbound   | Process args, stdin/stdout/stderr, exit codes | Developers ([F-003](../../01-requirements/f-003-cli-dwire-flow.md))                      | **Public contract** — command names, flags, and exit codes are versioned               |
| Jira Cloud REST v3 | Outbound  | HTTPS + JSON                                  | Consumed by `infrastructure/external/jira`                                               | External — DevWorkWire adapts to it, and absorbs its changes behind `WorkItemProvider` |

The first two are the same behavior with different surfaces. Any rule below that governs
the gate, error taxonomy, or idempotency applies to **both**, because both are thin
adapters over one `WorkItemService`
([FR-004-01](../../01-requirements/f-004-mcp-tool-surface.md)).

## MCP Tool Surface Standards

- **Transport:** stdio only. The harness spawns the server as a subprocess. There is no
  listening port and no inbound authentication surface.
- **stdout is protocol-only.** All logging, diagnostics, and progress output go to stderr.
  Writing anything else to stdout corrupts the JSON-RPC stream — this is the single
  easiest way to break the server, and it should be enforced by a logging configuration
  test.
- **Naming:** dotted `namespace.verb`, lowercase. Namespaces are `import`, `workitem`, and
  `progress`. This matches the `import.preview` / `import.commit` names already fixed in
  the [Glossary](../../00-context/glossary.md#technical-terms).
- **Field naming:** `snake_case` for all tool arguments and result fields. Pydantic v2
  generates the tool JSON schemas directly from Python field names, so no alias layer
  exists to drift out of sync with the code.
- **Timestamps:** ISO-8601 UTC (`2026-01-15T14:30:00Z`).
- **Every tool declares its Trust Tier** in its description, and the description states
  plainly whether the tool writes to the tracker. The agent reads this text; it is part of
  the contract, not decoration.
- **Tool descriptions must not overstate capability.** A preview tool says it writes
  nothing; a commit tool says it writes irreversibly. Ambiguity here is a safety defect.

### Trust Tier Classification

Every tool is exactly one of two kinds, per the
[Glossary](../../00-context/glossary.md#technical-terms):

| Tier                   | Meaning                      | Tools                                                                  | Gate                           |
| ---------------------- | ---------------------------- | ---------------------------------------------------------------------- | ------------------------------ |
| **Read-only**          | No externally-visible effect | `import.preview`, `progress.preview`, `workitem.get`, `workitem.query` | None — fully autonomous        |
| **Externally visible** | Writes to the tracker        | `import.commit`, `progress.commit`                                     | Confirm-before-execute, always |

There is no third tier and no exception list. A new tool that writes anything is an
externally-visible tool and inherits the gate.

## The Confirm Gate as a Contract Rule

This is the product's central claim
([Key Differentiators](../../00-context/overview.md#key-differentiators)), so it is stated
here as a set of contract rules rather than left implicit in each endpoint:

1. **No commit without a preview.** Every `*.commit` call requires a `preview_handle`
   issued by the matching `*.preview` call
   ([FR-004-03](../../01-requirements/f-004-mcp-tool-surface.md)). A commit with an
   unknown, expired, or mismatched handle is rejected.
2. **No commit without explicit confirmation.** The handle alone is not consent. The
   caller must also pass `confirmed: true`
   ([FR-004-02](../../01-requirements/f-004-mcp-tool-surface.md),
   [FR-007-04](../../01-requirements/f-007-progress-reporting.md)).
3. **The commit executes the stored plan, not a recomputed one.** `*.preview` persists the
   plan with its handle; `*.commit` loads and executes exactly that plan. This is what
   makes "no divergence from the preview"
   ([FR-001-05](../../01-requirements/f-001-validate-preview-commit.md)) a property rather
   than a hope.
4. **Previews never write.** Zero tracker write calls during any `*.preview`
   ([NFR-001-01](../../01-requirements/f-001-validate-preview-commit.md),
   [NFR-006-01](../../01-requirements/f-006-mcp-work-context-query.md)) — verified by test
   against a mock provider that fails the test on any write.
5. **No parameter, flag, or tool bypasses rules 1–4.** Not for agents, not for scripting,
   not for tests against a live instance. If a future need appears to require one, it
   requires an ADR and a threat-model revision, not a flag.
6. **Result type is always explicit.** Every response carries a `result_type` of
   `"preview"` or `"committed"`, so an agent cannot mistake a plan for a completed write
   ([NFR-004-01](../../01-requirements/f-004-mcp-tool-surface.md)).

### Preview Handle Lifecycle

- Issued by `*.preview`, persisted in the local state store with the plan it describes.
- Persisted rather than held in memory so a preview survives an MCP server restart or a
  separate CLI invocation — agent harnesses restart subprocesses routinely, and losing a
  preview to that would push users toward re-previewing reflexively, which erodes the gate.
- **TTL: 30 minutes (proposed).** Long enough for an agent or human to review a large
  plan; short enough that a commit cannot execute against a picture of the tracker that is
  hours stale. _Open for ADR-004._
- Single-use: a handle is consumed on successful commit. Re-committing the same handle is
  handled by the idempotency rules below, not by re-execution.
- Expired handles are pruned on store open, with the retention job described in
  [Database Design](../database/database-design.md).

### Idempotency

- `*.commit` accepts a client-supplied `idempotency_key`
  ([FR-004-04](../../01-requirements/f-004-mcp-tool-surface.md),
  [NFR-007-01](../../01-requirements/f-007-progress-reporting.md)).
- A repeated key with the **same** `preview_handle` replays the stored result with zero new
  writes.
- A repeated key with a **different** handle is a client error
  (`IDEMPOTENCY_KEY_REUSED`), not a replay — reusing a key across different plans is a bug
  worth surfacing rather than silently resolving.
- A key whose run is still `in_progress` means a previous attempt died mid-commit. It
  returns `COMMIT_INTERRUPTED` with what is known, and the caller re-previews; the dedup
  index makes the retry safe.
- The CLI generates a key per confirmed commit, so both front doors use the same mechanism
  rather than the CLI having an untested path.

## Versioning Strategy

There is no URL to version. The tool surface and CLI surface are versioned **with the
package**, under SemVer ([FR-009-04](../../01-requirements/f-009-packaging-distribution.md)).

| Change                                                                       | Version impact                                           |
| ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| New tool, new optional argument, new result field                            | Minor                                                    |
| New CLI command or optional flag                                             | Minor                                                    |
| Renaming/removing a tool or argument; changing an argument's type or meaning | **Major**                                                |
| Removing a result field an agent could depend on                             | **Major**                                                |
| Changing a CLI exit code's meaning                                           | **Major**                                                |
| Adding or tightening a gate                                                  | Minor — a gate is never a breaking change worth avoiding |
| New stable error code                                                        | Minor                                                    |
| Changing what an existing error code means                                   | **Major**                                                |

- **Server capability reporting:** the MCP server reports its package version on
  initialize, so a harness or agent can detect a surface it does not expect.
- **Deprecation:** a deprecated tool or flag keeps working for at least one minor release,
  announces itself in its description (tools) or on stderr (CLI), and is listed under
  `Deprecated` in the changelog before removal.
- **No parallel major versions.** Unlike a hosted API, users upgrade on their own
  schedule by not upgrading. Maintaining two surfaces in one package would be cost with no
  beneficiary.

## Error Handling Standards

Both front doors share one error taxonomy, because both wrap one service. A failure that
produces `JIRA_PERMISSION_DENIED` from the CLI produces the same code over MCP.

- **MCP:** errors are returned through the protocol's error channel — never as a success
  response containing a failure, which reads to an agent as though the write succeeded.
- **`code` is stable and machine-readable**; agents branch on it. Changing its meaning is a
  major version change.
- **`message` is human-readable and actionable** — it names the offending item, field, or
  permission. "Story `s-3` references epic `e-9`, which is not defined in this document"
  is the standard; "validation failed" is not.
- **`details`** carries structured per-item context, which is how a multi-error validation
  failure reports every problem at once rather than only the first.
- **Never leak the token.** No error message, at any verbosity, may include the API token
  or an `Authorization` header value
  ([NFR-008-01](../../01-requirements/f-008-provider-auth-configuration.md)).
- **Never surface a raw Jira response body.** Translate at the adapter boundary.

### Error Payload Shape

```json
{
  "code": "PREVIEW_EXPIRED",
  "message": "This preview expired 12 minutes ago. Run import.preview again to get a current plan.",
  "details": [],
  "retryable": false
}
```

`retryable` tells an agent whether re-attempting the identical call could succeed
(`JIRA_RATE_LIMITED` yes; `CONFIG_INVALID` no). Without it, agents retry unretryable
failures in a loop.

### Canonical Error Codes

| Code                      | Meaning                                                       | Retryable             | Raised by                                                                                        |
| ------------------------- | ------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| `CONFIG_MISSING`          | No `.devworkwire.yaml` found                                  | No                    | Any Jira-touching call ([FR-008-03](../../01-requirements/f-008-provider-auth-configuration.md)) |
| `CONFIG_INVALID`          | Missing/invalid field; names the field                        | No                    | Any Jira-touching call                                                                           |
| `CREDENTIALS_MISSING`     | Token env var not set                                         | No                    | Any Jira-touching call                                                                           |
| `REFERENCE_FIELD_MISSING` | The import-source custom field does not exist in the project  | No                    | Config validation ([F-002](../../01-requirements/f-002-dedup-on-rerun.md))                       |
| `SOURCE_NOT_FOUND`        | Source document path does not exist                           | No                    | `import.preview`                                                                                 |
| `SOURCE_PARSE_FAILED`     | Document could not be parsed into the hierarchy               | No                    | `import.preview` ([FR-001-01](../../01-requirements/f-001-validate-preview-commit.md))           |
| `VALIDATION_FAILED`       | Structural validation failed; `details` lists every problem   | No                    | `import.preview` ([FR-001-02](../../01-requirements/f-001-validate-preview-commit.md))           |
| `PREVIEW_NOT_FOUND`       | Unknown handle                                                | No                    | `*.commit` ([FR-004-03](../../01-requirements/f-004-mcp-tool-surface.md))                        |
| `PREVIEW_EXPIRED`         | Handle past its TTL                                           | No                    | `*.commit`                                                                                       |
| `CONFIRMATION_REQUIRED`   | `confirmed` not `true`                                        | No                    | `*.commit` ([FR-004-02](../../01-requirements/f-004-mcp-tool-surface.md))                        |
| `IDEMPOTENCY_KEY_REUSED`  | Key already used with a different handle                      | No                    | `*.commit`                                                                                       |
| `COMMIT_INTERRUPTED`      | A prior run with this key died mid-commit                     | No                    | `*.commit`                                                                                       |
| `COMMIT_PARTIAL`          | Fail-fast stop; `details` splits committed / failed / untried | Yes, after re-preview | `*.commit` ([FR-001-06](../../01-requirements/f-001-validate-preview-commit.md))                 |
| `WORK_ITEM_NOT_FOUND`     | Unknown issue key or reference                                | No                    | `workitem.*`                                                                                     |
| `JIRA_UNAUTHORIZED`       | Token rejected (401)                                          | No                    | Any Jira call                                                                                    |
| `JIRA_PERMISSION_DENIED`  | Authenticated but not permitted (403)                         | No                    | Any Jira call                                                                                    |
| `JIRA_RATE_LIMITED`       | 429; retried with backoff before surfacing                    | Yes                   | Any Jira call                                                                                    |
| `JIRA_UNAVAILABLE`        | 5xx or network failure after retries                          | Yes                   | Any Jira call                                                                                    |
| `INTERNAL_ERROR`          | Unexpected fault                                              | No                    | Anywhere                                                                                         |

## Response Format Conventions

- **Format:** JSON, `snake_case` fields, ISO-8601 UTC timestamps.
- **`result_type`** on every tool result: `"preview"` or `"committed"`
  ([NFR-004-01](../../01-requirements/f-004-mcp-tool-surface.md)).
- **Collections are bounded and honest.** `workitem.query` returns
  `{ "items": [...], "returned": N, "truncated": true|false }`. There is no page/offset
  envelope — an agent asking "what's ready to work" wants a bounded, immediately usable
  list, not a cursor to walk. `truncated` tells it to narrow the filter instead of silently
  seeing a partial view.
- **Query results are self-sufficient:** title, acceptance criteria, parent epic, and
  status on every item, so no follow-up call is needed
  ([FR-006-03](../../01-requirements/f-006-mcp-work-context-query.md)).
- **No nulls for absent optional fields** — omit the key. Keeps the LLM-facing payload
  small and unambiguous.

## CLI Surface Standards

- **One guided command per workflow**, not discrete step subcommands
  ([F-003](../../01-requirements/f-003-cli-dwire-flow.md) explicitly defers
  `dwire validate` / `preview` / `commit`).
- **stdout carries results; stderr carries logs, warnings, and errors.** Keeps output
  pipeable and matches the MCP server's stream discipline.
- **Text prefixes, never color alone**, on every error and warning — `Error:`, `Warning:`,
  `Skipped:` ([NFR-X06](../../01-requirements/README.md#cross-cutting-quality-baseline)).
  Color is an enhancement layered on top, and must degrade to a non-TTY correctly.
- **Preview output stays readable at 80 columns**
  ([NFR-003-01](../../01-requirements/f-003-cli-dwire-flow.md)).
- **The confirm prompt defaults to "no".** A stray Enter must never commit.
- **Non-interactive is an error, not an assumption.** With no TTY, a command needing
  confirmation exits with `CONFIRMATION_REQUIRED` rather than proceeding — there is no
  `--yes` flag, since that would be the bypass rule 5 forbids.

### Exit Codes

| Code | Meaning                                                                    |
| ---- | -------------------------------------------------------------------------- |
| `0`  | Success, including a user declining at the confirm prompt with zero writes |
| `1`  | Validation failed — nothing was written                                    |
| `2`  | Configuration or credentials error                                         |
| `3`  | Tracker error (auth, permission, unavailable)                              |
| `4`  | Partial commit — fail-fast stop; some items were written                   |
| `70` | Internal error                                                             |

Exit code `4` is deliberately distinct: "some of your items are now in Jira" is
operationally different from "nothing happened", and a script or agent must be able to
tell them apart without parsing output.

## Outbound Jira Client Standards

Confined entirely to `infrastructure/external/jira`. No Jira vocabulary crosses the
`WorkItemProvider` port.

- **API:** Jira Cloud REST API **v3**. Descriptions and comments use ADF (Atlassian
  Document Format); the adapter owns Markdown ↔ ADF conversion so no other layer learns
  about it.
- **Auth:** `Authorization: Basic base64(email:api_token)`, token from the environment.
- **Retry:** exponential backoff with jitter on `429` and `5xx` only, honoring
  `Retry-After`. Bounded attempts, then `JIRA_RATE_LIMITED` / `JIRA_UNAVAILABLE`.
- **Never blind-retry a create.** A timed-out create may have succeeded; retrying it is how
  duplicates get made — the exact failure this product exists to prevent. Re-establish
  state by searching for the reference field before any create retry.
- **Write ordering:** Epics before their Stories, so parent links always resolve.
- **Pagination:** Jira's `startAt`/`maxResults` is fully consumed inside the adapter. Ports
  return complete result sets; paging never leaks inward.
- **Timeouts:** explicit connect and read timeouts on every call. A hung request must fail,
  not block a developer's terminal indefinitely.
- **One `httpx.Client` per run**, so a batch does not pay TLS handshake cost per item.
- **Status mapping:** Jira status _categories_ (To Do / In Progress / Done) map to domain
  states. Custom workflow statuses are not modeled
  ([F-006](../../01-requirements/f-006-mcp-work-context-query.md) out-of-scope).

## Authentication and Authorization Patterns

- **Inbound: none, by design.** stdio MCP has no network surface; the CLI runs as the
  invoking user. There are no accounts, sessions, roles, tokens, or login flow. The
  template's `/api/v1/auth/*` endpoints do not exist and are not planned.
- **Outbound: the user's own Jira credentials.** DevWorkWire holds no service account and
  no privilege of its own, so its blast radius is bounded to what the user could already do
  in Jira.
- **Authorization is delegated to Jira.** A 403 is surfaced, never worked around.
- **The trust boundary that matters is the confirm gate**, not an identity check. The
  threat is an agent acting on the user's real credentials with correct authorization but
  without their intent — see [Threat Model](../security/threat-model.md).

## Rate Limiting and Throttling

- **Inbound: not applicable.** One local user, one process; there is nothing to throttle
  and no attacker to throttle it against.
- **Outbound: Jira's limits are the constraint.** The adapter is a well-behaved client:
  honors `Retry-After`, backs off with jitter, bounds attempts, and surfaces
  `JIRA_RATE_LIMITED` with a message telling the user what to do rather than looping
  silently.
- Sustained 429s during a large commit are a signal to reduce batch size or add delay —
  not to parallelize.

## Observability

- Every operation carries a `run_id`, logged to stderr and included in error `details`, so
  a user reporting a bug can be asked for one identifier that ties the whole run together.
- Logged per run: tool or command invoked, item counts by classification (create / update /
  drift), commit outcomes, Jira retry counts.
- **Never logged:** the API token, the `Authorization` header, or raw Jira response bodies.
- Nothing is exported anywhere. See
  [Monitoring and Observability](../ops/monitoring-observability.md).

## Deployment Impact

- The tool and CLI surfaces ship inside the package, so a contract change is a release, and
  users adopt it by upgrading. There is no server-side rollout and no way to force it.
- **Rollback is `pipx install devworkwire==<previous>`** — which only works if every
  release is on PyPI and the changelog says what changed
  ([FR-009-04](../../01-requirements/f-009-packaging-distribution.md)).
- Contract changes must be checked against the version rules above **in review**, since a
  breaking tool-schema change is invisible in a diff until an agent breaks against it.
  Worth a CI check that snapshots the generated tool schemas and fails on unreviewed
  changes.
- The MCP server has no independent release cadence — it ships with the CLI.

## Source References

- [Interface Contract](./interface-contract.md)
- [Architecture Solution Design](../core/architecture-solution-design.md)
- [Technology Stack](../core/technology-stack.md)
- [Database Design](../database/database-design.md)
- [Security Architecture](../security/security-architecture.md)
- [Feature Requirements](../../01-requirements/README.md)
- [Glossary](../../00-context/glossary.md)

---

**Last Updated**: 2026-08-31
