# F-004 MCP Server Tool Surface

| Attribute        | Value                       |
| ----------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Clarified                       |
| **Readiness**    | Clarified                       |
| **Owner**        | Product Owner               |

## Context

- **Problem**: Idris wants an AI agent to load work on their behalf without a separate, looser code path than the CLI's confirm gate; ad-hoc scripts and generic project-management MCP integrations give an agent no validation, preview, or confirm step before it writes to the tracker.
- **Primary Persona**: [Idris, Developer Directing an AI Agent](../00-context/user-personas.md#persona-2-developer-directing-an-ai-agent-secondary)
- **In Scope**: `import.preview` and `import.commit` MCP tools sharing the same `WorkItemService` and confirm-before-execute gate as the CLI; a client-supplied idempotency key on `import.commit` calls.
- **Out of Scope**: Progress-reporting tools (add comment, status transition) — deferred to a later feature; any MCP tool or parameter path that bypasses the confirm gate (explicitly excluded, security-by-design per [Overview](../00-context/overview.md#technical-goals)).

## Open Questions

None currently blocking this feature.

## Functional Requirements

| ID        | Requirement                                                                                                                       | Source                                                        | Priority | Owner (DRI)   | Acceptance Criteria                                                                                                                                | Status |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FR-004-01 | The system exposes an `import.preview` MCP tool that runs the same validation and preview generation as the CLI's `dwire import` preview step, using the shared `WorkItemService`. | [Overview](../00-context/overview.md#key-differentiators)         | Must     | Product Owner | Given the same source document, `import.preview` and `dwire import`'s preview step produce equivalent preview content (same creates/updates/drift flags), with no divergent logic path. | Clarified  |
| FR-004-02 | The system exposes an `import.commit` MCP tool that only commits changes previously returned by a matching `import.preview` call, requiring explicit confirmation analogous to the CLI's yes/no gate. | [Overview](../00-context/overview.md#technical-goals)             | Must     | Product Owner | Given a prior `import.preview` result, calling `import.commit` without explicit confirmation is rejected; calling it with confirmation applies exactly the previewed creates/updates to Jira. | Clarified  |
| FR-004-03 | The system does not expose any MCP tool or parameter path that commits changes without going through `import.preview` first.       | [Overview](../00-context/overview.md#key-differentiators)         | Must     | Product Owner | Given an attempt to call a commit-equivalent tool without a preceding preview reference, the call is rejected.                                     | Clarified  |
| FR-004-04 | The system accepts a client-supplied idempotency key on `import.commit` calls so that a retried call with the same key does not produce duplicate writes to Jira. | User clarification (F-004 idempotency)                            | Must     | Product Owner | Given two `import.commit` calls with the same idempotency key and same preview reference, only one set of Jira writes occurs; the second call returns the original result without re-writing. | Clarified  |

## Feature-Scoped Non-Functional Requirements

| ID         | Requirement                                                                                          | Metric / Target                                                                                          | Priority | Owner (DRI) | Status |
| ---------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------- | ----------- | ------ |
| NFR-004-01 | MCP tool responses clearly distinguish preview-only results from committed results, so an agent cannot mistake a preview for a completed write. | Response schema includes an explicit status/type field distinguishing "preview" from "committed" for every `import.*` tool call, verified by test. | Must     | Tech Lead   | Clarified  |

## Dependencies and Risks

- **Dependencies**: [F-001](./f-001-validate-preview-commit.md), [F-002](./f-002-dedup-on-rerun.md), the shared `WorkItemService` per [Overview](../00-context/overview.md#technical-goals).
- **Risks**: An agent retrying without preserving the preview reference or idempotency key could still create duplicates — mitigated by MCP tool schema documentation requiring both.

## Traceability

- **Related User Stories**: TBD
- **Related Architecture/ADR**: [Architecture Solution Design](../03-architecture/core/architecture-solution-design.md), [ADR-xxx](../04-decisions/README.md)
- **Related Prototype**: [Prototype Brief](../05-prototype/prototype-brief.md)

---

**Last Updated**: 2026-08-28
