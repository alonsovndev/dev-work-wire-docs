# F-002 Dedup on Re-Run

| Attribute        | Value                       |
| ----------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |
| **Readiness**    | Draft                       |
| **Owner**        | Product Owner               |

## Context

- **Problem**: There is no safe way to re-run a load after the source document changes, so teams either avoid updating already-imported work or end up with duplicate Epics and Stories in the backlog.
- **Primary Persona**: [Maya, Solo/Small-Team Developer](../00-context/user-personas.md#persona-1-solosmall-team-developer-primary)
- **In Scope**: Storing a stable import-source reference on each created Jira issue; matching source-document items to existing issues on re-run primarily via that reference; detecting drift (a matched issue changed in the tracker since its last import, independent of source changes); a per-item overwrite-or-skip choice at confirm time for drifted items.
- **Out of Scope**: Cross-provider dedup (Jira only for this feature); automatic conflict-resolution policies beyond the per-item confirm choice; an audit trail of dedup decisions (deferred per [Out of Scope for MVP](../00-context/out-of-scope.md#governance-phase-4-only-if-demand-emerges)).

## Open Questions

None currently blocking this feature.

## Functional Requirements

| ID        | Requirement                                                                                                                  | Source                                             | Priority | Owner (DRI)   | Acceptance Criteria                                                                                                                                  | Status |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FR-002-01 | The system assigns and stores a stable import-source reference (e.g. a custom field or label) on each Jira issue created from a source-document item, linking it back to a stable ID within that document. | [Overview](../00-context/overview.md#the-solution)   | Must     | Product Owner | Given a newly created Jira issue from an import, the issue carries a stored reference value that uniquely identifies the source-document item it came from. | Draft  |
| FR-002-02 | The system matches source-document items to existing Jira issues on re-run primarily via the stored import-source reference. | [Overview](../00-context/overview.md#the-solution)   | Must     | Product Owner | Given a source document previously imported and re-run unchanged, every item matches its existing Jira issue via the stored reference and zero new issues are created. | Draft  |
| FR-002-03 | The system detects when a matched Jira issue has been modified in the tracker since its last import (drift), independent of the source document's own changes. | User clarification (F-002 dedup key)                  | Must     | Product Owner | Given a matched issue whose tracked fields differ from the value recorded at last import time, the system flags that item as "changed in tracker" before it reaches the preview's default update action. | Draft  |
| FR-002-04 | The system lets the user choose, per drifted item, whether to overwrite the tracker's value with the source document's value or skip that item, at confirm time. | User clarification (F-002 conflict handling)          | Must     | Product Owner | Given one or more drifted items in a preview, the confirm step presents each drifted item with an explicit choice; only user-approved overwrites reach commit and skipped items are left untouched in Jira. | Draft  |

## Feature-Scoped Non-Functional Requirements

| ID         | Requirement                                                                                          | Metric / Target                                                                                    | Priority | Owner (DRI) | Status |
| ---------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------- | ----------- | ------ |
| NFR-002-01 | The stored import-source reference survives typical Jira field/label editing unrelated to DevWorkWire. | Reference field is a dedicated custom field (or equivalent) not overwritten by unrelated issue edits, verified by test. | Must     | Tech Lead   | Draft  |

## Dependencies and Risks

- **Dependencies**: [F-001](./f-001-validate-preview-commit.md) consumes this feature's create/update/drift determination for its preview and commit steps.
- **Risks**: Users manually deleting or altering the reference field would break matching — mitigated by documentation; a reference re-linking recovery path is deferred, not part of the MVP.

## Traceability

- **Related User Stories**: TBD
- **Related Architecture/ADR**: [Architecture Solution Design](../03-architecture/core/architecture-solution-design.md), [ADR-xxx](../04-decisions/README.md)
- **Related Prototype**: [Prototype Brief](../05-prototype/prototype-brief.md)

---

**Last Updated**: 2026-08-28
