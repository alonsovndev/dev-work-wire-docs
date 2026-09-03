---
sidebar_position: 2
---

# Interface Contract

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Table of Contents

- [Scope and Conventions](#scope-and-conventions)
- [MCP Tool Catalog](#mcp-tool-catalog)
- [CLI Command Catalog](#cli-command-catalog)
- [Shared Schemas](#shared-schemas)
- [Detailed Tool Contracts](#detailed-tool-contracts)
- [Error Catalog by Tool](#error-catalog-by-tool)
- [Consumed Jira Endpoints](#consumed-jira-endpoints)
- [Observability](#observability)
- [Deployment Impact](#deployment-impact)
- [Source References](#source-references)

## Scope and Conventions

This is the contract for the two surfaces DevWorkWire **publishes** — the MCP tool surface
and the `dwire` CLI — plus the Jira endpoints it **consumes**. There is no HTTP API and no
base path.

- Conventions (naming, Trust Tiers, gate rules, error taxonomy, versioning) are defined in
  [Interface Design Standards](./interface-standards.md).
- Field naming is `snake_case`; timestamps are ISO-8601 UTC.
- Every result carries `result_type`: `"preview"` or `"committed"`.
- **Phase** below refers to the [Phased Roadmap](../../02-planning/phased-roadmap.md). The
  CLI ships in the MVP; the entire MCP surface is Phase 1.

## MCP Tool Catalog

| Tool | Trust Tier | Writes to Jira | Description | Feature | Phase |
| ---- | ---------- | -------------- | ----------- | ------- | ----- |
| `import.preview` | Read-only | No | Parse, validate, and classify a source document (or a single inline item) into a commit plan. Returns a `preview_handle`. | [F-001](../../01-requirements/f-001-validate-preview-commit.md), [F-002](../../01-requirements/f-002-dedup-on-rerun.md), [F-005](../../01-requirements/f-005-work-item-crud.md) | 1 |
| `import.commit` | **Externally visible** | **Yes** | Execute a previously previewed plan, after explicit confirmation. | [F-001](../../01-requirements/f-001-validate-preview-commit.md), [F-005](../../01-requirements/f-005-work-item-crud.md) | 1 |
| `progress.preview` | Read-only | No | Build a plan for comments, status transitions, and PR references. Returns a `preview_handle`. | [F-007](../../01-requirements/f-007-progress-reporting.md) | 1 |
| `progress.commit` | **Externally visible** | **Yes** | Execute a previewed progress plan, after explicit confirmation. | [F-007](../../01-requirements/f-007-progress-reporting.md) | 1 |
| `workitem.get` | Read-only | No | Fetch one work item by Jira key or source reference. | [F-005](../../01-requirements/f-005-work-item-crud.md) | 1 |
| `workitem.query` | Read-only | No | List work items filtered by status category and/or assignee, with enough context to act on. | [F-006](../../01-requirements/f-006-mcp-work-context-query.md) | 1 |

**There are exactly two write tools.** Both require a handle from their matching preview
plus `confirmed: true`. No other tool writes, and no argument on any tool enables a write
([FR-004-03](../../01-requirements/f-004-mcp-tool-surface.md)).

### Why single-item CRUD has no tools of its own

[F-005](../../01-requirements/f-005-work-item-crud.md) requires "a one-item preview, not a
lighter variant", and
[NFR-005-01](../../01-requirements/f-005-work-item-crud.md) requires no divergent code
path between bulk and single-item flows. Rather than guaranteeing that with tests across
two tool pairs, `import.preview` accepts an **inline single item** as an alternative to a
document path, producing a one-item plan that `import.commit` executes through the
identical code. The requirement is satisfied structurally: a divergent path does not exist
to drift.

## CLI Command Catalog

| Command | Trust Tier | Description | Feature | Phase |
| ------- | ---------- | ----------- | ------- | ----- |
| `dwire` | Mixed | Interactive menu — the guided entry point. | [FR-003-01](../../01-requirements/f-003-cli-dwire-flow.md) | MVP |
| `dwire import <file>` | **Externally visible** | The full guided flow in one invocation: validate → preview → confirm → commit. | [FR-003-01](../../01-requirements/f-003-cli-dwire-flow.md) | MVP |
| `dwire search <term>` | Read-only | Search and select existing Jira work items. | [FR-003-04](../../01-requirements/f-003-cli-dwire-flow.md) | MVP |
| `dwire insert <item-id>` | **Externally visible** | Create or update one tracked source item, through the same gate. | [FR-003-05](../../01-requirements/f-003-cli-dwire-flow.md) | MVP |
| `dwire config check` | Read-only | Validate config, credentials, connectivity, and the presence of the reference custom field. | [FR-008-03](../../01-requirements/f-008-provider-auth-configuration.md) | MVP |
| `dwire mcp` | — | Run the MCP server on stdio. Invoked by a harness, not by hand. | [F-004](../../01-requirements/f-004-mcp-tool-surface.md) | 1 |

`dwire import` performs internally exactly what `import.preview` + `import.commit` do; the
confirm step is an InquirerPy prompt instead of a `confirmed` argument. Discrete
`validate` / `preview` / `commit` subcommands are deliberately **not** offered
([F-003](../../01-requirements/f-003-cli-dwire-flow.md) out-of-scope).

## Shared Schemas

### `WorkItem`

Returned by `workitem.get` and `workitem.query`. Provider-neutral — no Jira-specific
fields leak through.

```json
{
  "issue_key": "PROJ-123",
  "source_item_id": "story-3",
  "item_type": "story",
  "title": "Sign in with email and password",
  "description": "...",
  "acceptance_criteria": [
    "User can sign in with email and password",
    "Invalid credentials return a clear error message"
  ],
  "parent": { "issue_key": "PROJ-100", "title": "Authentication" },
  "status": "in_progress",
  "status_category": "in_progress",
  "assignee": "Maya",
  "url": "https://example.atlassian.net/browse/PROJ-123"
}
```

`status_category` is one of `to_do`, `in_progress`, `done` — the only status model
DevWorkWire commits to. `status` carries the tracker's own label for display, and must not
be branched on.

### `PlanItem`

One entry in a commit plan. The unit both the preview and the commit operate on.

```json
{
  "source_item_id": "story-3",
  "item_type": "story",
  "action": "update",
  "issue_key": "PROJ-123",
  "parent_source_item_id": "epic-1",
  "drift": {
    "detected": true,
    "changed_since": "2026-08-14T09:12:00Z",
    "resolution": "skip"
  },
  "changes": [
    { "field": "title", "from": "Sign in", "to": "Sign in with email and password" },
    { "field": "acceptance_criteria", "from_count": 2, "to_count": 3 }
  ]
}
```

- `action` is `create`, `update`, or `noop`.
- `issue_key` is absent for `create`.
- `drift` appears only when the tracker changed since last import
  ([FR-002-03](../../01-requirements/f-002-dedup-on-rerun.md)). `resolution` is `overwrite`
  or `skip`, and is **absent from the preview** — the caller supplies it at commit time
  ([FR-002-04](../../01-requirements/f-002-dedup-on-rerun.md)).
- `changes` describes the intended edit. For a drifted item it reflects source-vs-tracker,
  which is what the user needs to decide overwrite-or-skip.

### `Preview`

```json
{
  "result_type": "preview",
  "preview_handle": "pv_01J8XQ2M4N",
  "expires_at": "2026-08-31T15:02:00Z",
  "source_document": "docs/epics/auth.md",
  "project_key": "PROJ",
  "summary": { "create": 4, "update": 2, "noop": 1, "drifted": 1 },
  "requires_drift_resolution": ["story-3"],
  "items": [],
  "run_id": "run_01J8XQ2M4N"
}
```

`requires_drift_resolution` lists the `source_item_id`s that **must** carry a resolution at
commit time. A commit omitting any of them is rejected — a drifted item cannot be resolved
by default, since defaulting would silently overwrite a teammate's edit.

### `CommitResult`

```json
{
  "result_type": "committed",
  "preview_handle": "pv_01J8XQ2M4N",
  "idempotency_key": "agent-run-42",
  "status": "completed",
  "committed": [
    { "source_item_id": "epic-1", "issue_key": "PROJ-100", "action": "create" }
  ],
  "failed": null,
  "untried": [],
  "replayed": false,
  "run_id": "run_01J8XQ2M4N"
}
```

- `status` is `completed` or `partial`.
- The `committed` / `failed` / `untried` three-way split is the fail-fast contract from
  [FR-001-06](../../01-requirements/f-001-validate-preview-commit.md). On success, `failed`
  is `null` and `untried` is empty.
- `replayed: true` means an idempotency-key replay returned a stored result with **zero new
  writes** ([FR-004-04](../../01-requirements/f-004-mcp-tool-surface.md)).

### `Error`

```json
{
  "code": "VALIDATION_FAILED",
  "message": "3 structural problems found. Nothing was written to Jira.",
  "details": [
    { "source_item_id": "story-3", "issue": "references epic 'epic-9', which is not defined in this document" },
    { "source_item_id": "story-7", "issue": "declares 3 acceptance criteria but has 2" },
    { "source_item_id": "story-9", "issue": "has no parent epic" }
  ],
  "retryable": false
}
```

Codes and their meanings are catalogued in
[Interface Design Standards](./interface-standards.md#canonical-error-codes).

## Detailed Tool Contracts

### 1) `import.preview`

**Trust Tier:** read-only. Makes zero Jira write calls
([NFR-001-01](../../01-requirements/f-001-validate-preview-commit.md)).

Parses and validates a source document — or a single inline item — resolves each item
against the tracker via its stored reference, detects drift, and returns a plan with a
handle. Safe for an agent to call freely.

**Request** — document form:

```json
{
  "source_document": "docs/epics/auth.md"
}
```

**Request** — inline single-item form ([F-005](../../01-requirements/f-005-work-item-crud.md)):

```json
{
  "item": {
    "source_item_id": "story-12",
    "item_type": "story",
    "title": "Add rate limiting to sign-in",
    "description": "...",
    "acceptance_criteria": ["Sign-in is limited to 5 attempts per minute"],
    "parent_issue_key": "PROJ-100"
  }
}
```

Exactly one of `source_document` or `item` is required.

**Response — `Preview`.** See [Preview](#preview).

**Errors:** `CONFIG_MISSING`, `CONFIG_INVALID`, `CREDENTIALS_MISSING`,
`REFERENCE_FIELD_MISSING`, `SOURCE_NOT_FOUND`, `SOURCE_PARSE_FAILED`, `VALIDATION_FAILED`,
`JIRA_*`.

---

### 2) `import.commit`

**Trust Tier: externally visible. This tool writes to Jira.**

Executes the stored plan for `preview_handle` — not a recomputed one — after explicit
confirmation.

**Request**

```json
{
  "preview_handle": "pv_01J8XQ2M4N",
  "confirmed": true,
  "idempotency_key": "agent-run-42",
  "drift_resolutions": [
    { "source_item_id": "story-3", "resolution": "skip" }
  ]
}
```

| Field | Required | Notes |
| ----- | -------- | ----- |
| `preview_handle` | Yes | From `import.preview`. Unknown/expired → rejected ([FR-004-03](../../01-requirements/f-004-mcp-tool-surface.md)) |
| `confirmed` | Yes | Must be `true`. The handle alone is not consent ([FR-004-02](../../01-requirements/f-004-mcp-tool-surface.md)) |
| `idempotency_key` | Yes | Client-supplied; enables safe retry ([FR-004-04](../../01-requirements/f-004-mcp-tool-surface.md)) |
| `drift_resolutions` | Only if the preview listed `requires_drift_resolution` | Must cover every listed item ([FR-002-04](../../01-requirements/f-002-dedup-on-rerun.md)) |

**Response — `CommitResult`.** See [CommitResult](#commitresult).

**Behavior:**

- Epics are written before their Stories, so parent links resolve.
- On a write failure the batch **stops immediately**. Items already written stay written,
  and the result separates committed / failed / untried
  ([FR-001-06](../../01-requirements/f-001-validate-preview-commit.md)).
- Each successful write records its reference and drift baseline **per item**, so a
  fail-fast stop is resumable: re-previewing matches what was committed and retries only
  the rest.
- A `noop` item is reported, never written.

**Errors:** `PREVIEW_NOT_FOUND`, `PREVIEW_EXPIRED`, `CONFIRMATION_REQUIRED`,
`IDEMPOTENCY_KEY_REUSED`, `COMMIT_INTERRUPTED`, `COMMIT_PARTIAL`, `JIRA_*`.

---

### 3) `progress.preview`

**Trust Tier:** read-only.

Builds a plan for progress actions. Mirrors `import.preview` so both write paths share one
gate mechanism rather than maintaining a parallel one
([FR-007-04](../../01-requirements/f-007-progress-reporting.md)).

**Request**

```json
{
  "actions": [
    { "type": "comment", "issue_key": "PROJ-123", "body": "Implemented in #482." },
    { "type": "transition", "issue_key": "PROJ-123", "to_status_category": "done" },
    { "type": "link_pull_request", "issue_key": "PROJ-123", "url": "https://github.com/org/repo/pull/482" }
  ]
}
```

`link_pull_request` **records a reference to a PR created elsewhere**. DevWorkWire never
calls a Git or GitHub API and never creates a PR
([FR-007-03](../../01-requirements/f-007-progress-reporting.md),
[Out of Scope](../../00-context/out-of-scope.md#git--source-control-automation)).

**Response — `Preview`,** with `items` describing each action and validating that target
issues exist and requested transitions are available.

**Errors:** `WORK_ITEM_NOT_FOUND`, `VALIDATION_FAILED` (unavailable transition, malformed
URL), `CONFIG_*`, `JIRA_*`.

---

### 4) `progress.commit`

**Trust Tier: externally visible. This tool writes to Jira.**

Same contract as `import.commit`: `preview_handle`, `confirmed: true`, and
`idempotency_key` ([NFR-007-01](../../01-requirements/f-007-progress-reporting.md)).
Returns a `CommitResult`. Same fail-fast semantics.

---

### 5) `workitem.get`

**Trust Tier:** read-only.

**Request** — exactly one identifier:

```json
{ "issue_key": "PROJ-123" }
```

```json
{ "source_item_id": "story-3" }
```

**Response**

```json
{ "result_type": "preview", "item": {} }
```

The `item` is a [`WorkItem`](#workitem). Satisfies
[FR-005-01](../../01-requirements/f-005-work-item-crud.md).

**Errors:** `WORK_ITEM_NOT_FOUND`, `CONFIG_*`, `JIRA_*`.

---

### 6) `workitem.query`

**Trust Tier:** read-only. Makes zero Jira write calls
([NFR-006-01](../../01-requirements/f-006-mcp-work-context-query.md)).

The "what should I work on?" tool. Filters combine with AND.

**Request**

```json
{
  "status_category": "to_do",
  "assignee": "me",
  "limit": 50
}
```

| Field | Required | Notes |
| ----- | -------- | ----- |
| `status_category` | No | `to_do`, `in_progress`, or `done` ([FR-006-01](../../01-requirements/f-006-mcp-work-context-query.md)). Native categories only — no custom states, no JQL passthrough |
| `assignee` | No | An account identifier or the literal `"me"` ([FR-006-02](../../01-requirements/f-006-mcp-work-context-query.md)) |
| `limit` | No | Default 50, maximum 200 |

**Response**

```json
{
  "result_type": "preview",
  "items": [],
  "returned": 12,
  "truncated": false
}
```

Every item carries title, acceptance criteria, parent epic, and status, so the agent can
act without a second call ([FR-006-03](../../01-requirements/f-006-mcp-work-context-query.md)).
`truncated: true` means narrow the filter — there is no cursor to walk.

**Errors:** `CONFIG_*`, `JIRA_*`.

## Error Catalog by Tool

| Tool | Can raise |
| ---- | --------- |
| `import.preview` | `SOURCE_NOT_FOUND`, `SOURCE_PARSE_FAILED`, `VALIDATION_FAILED`, `REFERENCE_FIELD_MISSING`, `CONFIG_*`, `CREDENTIALS_MISSING`, `JIRA_*` |
| `import.commit` | `PREVIEW_NOT_FOUND`, `PREVIEW_EXPIRED`, `CONFIRMATION_REQUIRED`, `IDEMPOTENCY_KEY_REUSED`, `COMMIT_INTERRUPTED`, `COMMIT_PARTIAL`, `JIRA_*` |
| `progress.preview` | `WORK_ITEM_NOT_FOUND`, `VALIDATION_FAILED`, `CONFIG_*`, `JIRA_*` |
| `progress.commit` | Same as `import.commit` |
| `workitem.get` | `WORK_ITEM_NOT_FOUND`, `CONFIG_*`, `JIRA_*` |
| `workitem.query` | `CONFIG_*`, `JIRA_*` |

`CONFIG_*` (`CONFIG_MISSING`, `CONFIG_INVALID`, `CREDENTIALS_MISSING`) can precede **any**
tool, because configuration is validated before any Jira-touching call
([FR-008-03](../../01-requirements/f-008-provider-auth-configuration.md)).

## Consumed Jira Endpoints

Jira Cloud REST API v3, called only from `infrastructure/external/jira`. Listed to make the
provider's surface area — and therefore the Phase 2 port-parity question — explicit.

| Purpose | Method | Endpoint | Used by |
| ------- | ------ | -------- | ------- |
| Validate connectivity and identity | GET | `/rest/api/3/myself` | `dwire config check` |
| Verify project exists and is accessible | GET | `/rest/api/3/project/{projectKey}` | Config validation |
| Confirm the reference custom field exists | GET | `/rest/api/3/field` | Config validation |
| Match items by reference field | GET | `/rest/api/3/search/jql` | `import.preview` dedup ([FR-002-02](../../01-requirements/f-002-dedup-on-rerun.md)) |
| Read issue for drift comparison | GET | `/rest/api/3/issue/{issueIdOrKey}` | `import.preview`, `workitem.get` |
| List by status category / assignee | GET | `/rest/api/3/search/jql` | `workitem.query` |
| Create issue | POST | `/rest/api/3/issue` | `import.commit` |
| Update issue | PUT | `/rest/api/3/issue/{issueIdOrKey}` | `import.commit` |
| Add comment | POST | `/rest/api/3/issue/{issueIdOrKey}/comment` | `progress.commit` |
| List available transitions | GET | `/rest/api/3/issue/{issueIdOrKey}/transitions` | `progress.preview` |
| Perform transition | POST | `/rest/api/3/issue/{issueIdOrKey}/transitions` | `progress.commit` |

**Notes:** descriptions and comments are ADF, converted at the adapter boundary. Search
pagination is consumed entirely inside the adapter. A create is **never blind-retried** —
a timed-out create may have succeeded, and retrying it is precisely how duplicates get
made.

## Observability

- Every tool call and CLI invocation carries a `run_id`, returned in results and errors and
  logged to stderr, so one identifier ties a whole run together in a bug report.
- New error codes are registered in
  [Interface Design Standards](./interface-standards.md#canonical-error-codes) as they are
  introduced — the catalog is the contract, not a convenience.
- Nothing is exported off the user's machine.

## Deployment Impact

- Contract changes follow the versioning rules in
  [Interface Design Standards](./interface-standards.md#versioning-strategy). Renaming a tool or
  argument, or changing an error code's meaning, is a **major** version.
- Users adopt contract changes by upgrading; there is no server-side rollout, so a breaking
  change reaches users at unpredictable times and cannot be recalled.
- A breaking tool-schema change is invisible in a normal diff. CI should snapshot the
  generated tool schemas and fail on unreviewed changes.
- Rollback is `pipx install devworkwire==<previous>`.

## Source References

- [Interface Design Standards](./interface-standards.md)
- [Architecture Solution Design](../core/architecture-solution-design.md)
- [Database Design](../database/database-design.md)
- [Security Architecture](../security/security-architecture.md)
- [Sequence Diagrams](../diagrams/sequence-diagrams.md)
- [Feature Requirements](../../01-requirements/README.md)

---

**Last Updated**: 2026-08-31
