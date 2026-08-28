# F-006 MCP Work-Context Query

| Attribute        | Value                       |
| ----------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Clarified                       |
| **Readiness**    | Clarified                       |
| **Owner**        | Product Owner               |

## Context

- **Problem**: Idris's agent needs to ask "what's ready to work, in progress, etc." to get context before acting with the LLM, without a separate ad-hoc query path outside DevWorkWire.
- **Primary Persona**: [Idris, Developer Directing an AI Agent](../00-context/user-personas.md#persona-2-developer-directing-an-ai-agent-secondary)
- **In Scope**: An MCP query tool filtering work items by Jira's native status categories (To Do / In Progress / Done) and by assignee. This is a read-only action, so per the [glossary's Trust Tier definition](../00-context/glossary.md#technical-terms) it is fully autonomous — no confirm gate needed.
- **Out of Scope**: Custom DevWorkWire-defined states layered on top of Jira statuses; free-form JQL-style query passthrough (would couple the tool too tightly to Jira, against the provider-agnostic goal).

## Open Questions

None currently blocking this feature.

## Functional Requirements

| ID        | Requirement                                                                                          | Source                                              | Priority | Owner (DRI)   | Acceptance Criteria                                                                                                                        | Status |
| --------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FR-006-01 | The system exposes an MCP tool that returns work items filtered by native status category (To Do / In Progress / Done). | User clarification (F-006 query states)                | Must     | Product Owner | Given a status-category filter, the tool returns only work items currently in that category.                                                    | Clarified  |
| FR-006-02 | The system supports filtering the same query by assignee.                                              | User clarification (F-006 assignee filter)             | Must     | Product Owner | Given an assignee filter (e.g. "assigned to me"), the tool returns only work items assigned to that user, combinable with the status filter.     | Clarified  |
| FR-006-03 | The system returns enough per-item context (title, Acceptance Criteria, parent Epic, status) for the calling agent to act without a follow-up call. | [Overview](../00-context/overview.md#core-concept)     | Must     | Product Owner | Given a query result, each returned item includes title, Acceptance Criteria, parent Epic reference, and status without requiring a second call. | Clarified  |

## Feature-Scoped Non-Functional Requirements

| ID         | Requirement                                            | Metric / Target                                                                     | Priority | Owner (DRI) | Status |
| ---------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | -------- | ----------- | ------ |
| NFR-006-01 | The query tool makes zero write calls to Jira.               | Zero Jira write API calls observed during query execution (verified by test/mock).        | Must     | Tech Lead   | Clarified  |

## Dependencies and Risks

- **Dependencies**: `WorkItemProvider` (read path); shared `WorkItemService`.
- **Risks**: Status-category-only filtering may feel coarse to users used to custom Jira workflows — accepted for MVP, noted as a future enhancement.

## Traceability

- **Related User Stories**: TBD
- **Related Architecture/ADR**: [Architecture Solution Design](../03-architecture/core/architecture-solution-design.md), [ADR-xxx](../04-decisions/README.md)
- **Related Prototype**: [Prototype Brief](../05-prototype/prototype-brief.md)

---

**Last Updated**: 2026-08-28
