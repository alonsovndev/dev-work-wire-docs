# F-005 Individual Work Item CRUD

| Attribute        | Value                       |
| ----------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Clarified                       |
| **Readiness**    | Clarified                       |
| **Owner**        | Product Owner               |

## Context

- **Problem**: Not every change to a backlog is a full document re-import — Maya (and Idris's agent, via MCP) needs to create, read, or update a single Epic or Story without re-running the whole load.
- **Primary Persona**: [Maya, Solo/Small-Team Developer](../00-context/user-personas.md#persona-1-solosmall-team-developer-primary) (secondary: [Idris](../00-context/user-personas.md#persona-2-developer-directing-an-ai-agent-secondary), via MCP)
- **In Scope**: Create, Read, and Update of a single work item, reusing the exact same preview-then-confirm gate as [F-001](./f-001-validate-preview-commit.md) (a one-item preview, not a lighter variant).
- **Out of Scope**: Delete (deferred — a destructive action kept out of the MVP risk surface); any path that bypasses the preview+confirm gate.

## Open Questions

None currently blocking this feature.

## Functional Requirements

| ID        | Requirement                                                                                                       | Source                                                | Priority | Owner (DRI)   | Acceptance Criteria                                                                                                                              | Status |
| --------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FR-005-01 | The system reads a single work item by its ID or stored reference.                                                   | User clarification (F-005 CRUD scope)                    | Must     | Product Owner | Given a valid work item ID, the system returns that item's current fields (title, AC, parent Epic, status).                                       | Clarified  |
| FR-005-02 | The system creates a single work item, generating a one-item preview via the same preview mechanism as F-001 before requiring confirmation. | User clarification (F-005 confirm gate)                  | Must     | Product Owner | Given valid fields for a new work item, the system shows a one-item preview and creates it in Jira only after explicit confirmation.               | Clarified  |
| FR-005-03 | The system updates a single existing work item, generating a one-item preview via the same preview mechanism as F-001 before requiring confirmation. | User clarification (F-005 confirm gate)                  | Must     | Product Owner | Given a valid work item ID and changed fields, the system shows a one-item preview of the change and applies it only after explicit confirmation.  | Clarified  |
| FR-005-04 | The system rejects any create or update call that does not go through the preview+confirm step.                       | [Overview](../00-context/overview.md#technical-goals)     | Must     | Product Owner | Given a create/update call without a preceding preview+confirmation, the call is rejected and no write reaches Jira.                                | Clarified  |

## Feature-Scoped Non-Functional Requirements

| ID         | Requirement                                                                                       | Metric / Target                                                                                  | Priority | Owner (DRI) | Status |
| ---------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | -------- | ----------- | ------ |
| NFR-005-01 | No divergent code path exists between bulk-import preview/confirm (F-001) and single-item preview/confirm. | Both paths call the same `WorkItemService` preview/confirm logic, verified by test.                | Must     | Tech Lead   | Clarified  |

## Dependencies and Risks

- **Dependencies**: [F-001](./f-001-validate-preview-commit.md) (shares its preview+confirm mechanism); [F-002](./f-002-dedup-on-rerun.md) (dedup/matching, for update-vs-create determination on a single item).
- **Risks**: Building a separate single-item code path instead of reusing F-001's could cause behavior drift between bulk and single-item flows — mitigated by NFR-005-01.

## Traceability

- **Related User Stories**: TBD
- **Related Architecture/ADR**: [Architecture Solution Design](../03-architecture/core/architecture-solution-design.md), [ADR-xxx](../04-decisions/README.md)
- **Related Prototype**: [Prototype Brief](../05-prototype/prototype-brief.md)

---

**Last Updated**: 2026-08-28
