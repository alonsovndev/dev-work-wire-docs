# F-003 CLI (dwire) Interactive Flow

| Attribute        | Value                       |
| ----------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |
| **Readiness**    | Draft                       |
| **Owner**        | Product Owner               |

## Context

- **Problem**: Maya needs a guided terminal flow to load a refined plan into Jira, without hand-creating tickets in the UI or babysitting a lower-level API.
- **Primary Persona**: [Maya, Solo/Small-Team Developer](../00-context/user-personas.md#persona-1-solosmall-team-developer-primary)
- **In Scope**: A single guided `dwire import <file>` command running validate → preview → confirm → commit; a read-only preview with one yes/no confirmation prompt; search/select of existing Jira work items; insert-by-id for a single tracked item.
- **Out of Scope**: Separate discrete step subcommands (`dwire validate`, `dwire preview`, `dwire commit`); inline editing of preview values; CI/scripting-oriented flags — all deferred beyond this pass.

## Open Questions

None currently blocking this feature.

## Functional Requirements

| ID        | Requirement                                                                                                          | Source                                                   | Priority | Owner (DRI)   | Acceptance Criteria                                                                                                                                       | Status |
| --------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | -------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FR-003-01 | The system provides a `dwire import <file>` command that runs validation, preview generation, and (on confirmation) commit as a single guided flow. | User clarification (F-003 CLI commands); [Overview](../00-context/overview.md#core-concept) | Must     | Product Owner | Given a valid source file path, running `dwire import <file>` shows validation results, then a preview, then a yes/no confirm prompt, then commits on "yes" — all within one invocation. | Draft  |
| FR-003-02 | The system halts the guided flow and reports specific errors if validation fails, without proceeding to preview.     | [Overview](../00-context/overview.md#the-solution)          | Must     | Product Owner | Given a structurally invalid source document, `dwire import` prints item-identifying validation errors and exits without generating a preview or writing to Jira. | Draft  |
| FR-003-03 | The system displays a read-only preview of all creates/updates and a single yes/no confirmation prompt before commit. | User clarification (F-003 preview interactivity)            | Must     | Product Owner | Given a validated document, the CLI renders the full preview to the terminal and blocks on one yes/no prompt; answering "no" cancels with zero writes.     | Draft  |
| FR-003-04 | The system provides a way to search and select existing Jira work items from the CLI for everyday backlog work outside the import flow. | [User Personas](../00-context/user-personas.md#needs--expectations) | Should   | Product Owner | Given a search term, the CLI returns matching Jira work items the user can select from, without requiring a full document import.                         | Draft  |
| FR-003-05 | The system provides a way to insert a stored source-document item into Jira by its ID, without re-running a full document import. | [User Personas](../00-context/user-personas.md#needs--expectations) | Should   | Product Owner | Given a known item ID from a previously validated/tracked source document, the CLI creates or updates just that item in Jira via the confirm gate.        | Draft  |

## Feature-Scoped Non-Functional Requirements

| ID         | Requirement                                                                        | Metric / Target                                                                                                          | Priority | Owner (DRI) | Status |
| ---------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- | ----------- | ------ |
| NFR-003-01 | Preview output remains readable in a standard 80-column terminal for typical document sizes. | Manual review of preview rendering at 80 columns for a representative document (e.g. 5 Epics / 20 Stories) shows no unreadable truncation of essential fields. | Should   | Tech Lead   | Draft  |

## Dependencies and Risks

- **Dependencies**: [F-001](./f-001-validate-preview-commit.md) (validate/preview/commit engine), [F-002](./f-002-dedup-on-rerun.md) (dedup matching), the shared `WorkItemService` per [Overview](../00-context/overview.md#technical-goals).
- **Risks**: Terminal rendering of large previews could become unwieldy — mitigation (e.g. pagination or summarization) is a design decision, not a blocking requirement.

## Traceability

- **Related User Stories**: TBD
- **Related Architecture/ADR**: [Architecture Solution Design](../03-architecture/core/architecture-solution-design.md), [ADR-xxx](../04-decisions/README.md)
- **Related Prototype**: [Prototype Brief](../05-prototype/prototype-brief.md)

---

**Last Updated**: 2026-08-28
