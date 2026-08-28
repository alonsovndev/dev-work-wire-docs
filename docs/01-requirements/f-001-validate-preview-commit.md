# F-001 Validate → Preview → Commit

| Attribute        | Value                       |
| ----------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |
| **Readiness**    | Draft                       |
| **Owner**        | Product Owner               |

## Context

- **Problem**: Turning a refined Epic/Story/AC document into Jira tickets today means hand-creating each item in the UI — slow, error-prone, and with no safety check before anything is written.
- **Primary Persona**: [Maya, Solo/Small-Team Developer](../00-context/user-personas.md#persona-1-solosmall-team-developer-primary)
- **In Scope**: Parsing a Markdown source document with heading-based Epic/Story/AC hierarchy; structural validation (required fields, parent/child link resolution, orphan detection, declared-count matching); preview generation showing exactly what will be created or updated; a confirm-before-execute gate; committing confirmed changes to Jira through the `WorkItemProvider` port.
- **Out of Scope**: Semantic or content-quality validation of Epic/Story/AC text; Jira-specific field-mapping validation beyond structural checks; determining which items are creates vs. updates on re-run (see [F-002](./f-002-dedup-on-rerun.md)); non-Jira providers.

## Open Questions

None currently blocking this feature.

## Functional Requirements

| ID        | Requirement                                                                                                                          | Source                                          | Priority | Owner (DRI)   | Acceptance Criteria                                                                                                                                          | Status |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FR-001-01 | The system parses a Markdown source document with a heading-based hierarchy (H1 = Epic, H2 = Story, bullet list = Acceptance Criteria) into an internal work-item structure. | [Overview](../00-context/overview.md#core-concept) | Must     | Product Owner | Given a valid Markdown document with Epics/Stories/ACs, when parsed, every item appears in the internal structure with correct parent/child relationships.       | Draft  |
| FR-001-02 | The system runs structural validation on the parsed structure: required fields present, parent/child links resolve, no orphan Stories or ACs, and any declared counts match actuals. | [Overview](../00-context/overview.md#the-solution)  | Must     | Product Owner | Given a document with a missing required field, an unresolved parent reference, or a mismatched count, validation fails with a specific, item-identifying error; a structurally valid document passes with no errors. | Draft  |
| FR-001-03 | The system generates a preview showing exactly what will be created or updated in Jira before any write occurs.                        | [Overview](../00-context/overview.md#the-solution)  | Must     | Product Owner | Given a validated structure, the preview lists every Epic/Story/AC to be created or updated, distinguishing "create" from "update" per item, with zero writes to Jira. | Draft  |
| FR-001-04 | The system requires explicit user confirmation before committing any change to Jira.                                                  | [Overview](../00-context/overview.md#technical-goals) | Must     | Product Owner | Given a generated preview, no write reaches Jira until the user explicitly confirms; declining confirmation results in zero writes.                                | Draft  |
| FR-001-05 | The system commits confirmed changes to Jira through the `WorkItemProvider` port, creating new issues and updating matched existing issues exactly as shown in the preview. | [Overview](../00-context/overview.md#technical-goals) | Must     | Product Owner | Given user confirmation, every item marked "create" results in a new Jira issue and every item marked "update" results in the matched issue being updated, with no divergence from the preview. | Draft  |

## Feature-Scoped Non-Functional Requirements

| ID         | Requirement                                                                 | Metric / Target                                                                 | Priority | Owner (DRI) | Status |
| ---------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------- | ----------- | ------ |
| NFR-001-01 | Validation and preview generation complete without any network write calls to Jira until the commit step. | Zero Jira write API calls observed during validate/preview phases (verified by test/mock). | Must     | Tech Lead   | Draft  |

## Dependencies and Risks

- **Dependencies**: The `WorkItemProvider` port for Jira (adapter specifics to be documented as an ADR in [04-decisions](../04-decisions/README.md)); [F-002](./f-002-dedup-on-rerun.md) supplies the create-vs-update determination consumed by the preview.
- **Risks**: Ambiguous Markdown heading nesting (e.g. extra heading levels) could misparse the hierarchy — mitigated by strict structural validation with clear, item-identifying error messages.

## Traceability

- **Related User Stories**: TBD
- **Related Architecture/ADR**: [Architecture Solution Design](../03-architecture/core/architecture-solution-design.md), [ADR-xxx](../04-decisions/README.md)
- **Related Prototype**: [Prototype Brief](../05-prototype/prototype-brief.md)

---

**Last Updated**: 2026-08-28
