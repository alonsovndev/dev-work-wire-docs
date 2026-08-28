# F-000 Feature Template

> **This file is a template, not a feature.** To define a new feature, copy this file to
> `f-XXX-short-slug.md` (next free ID from the [Feature Map](./README.md#feature-map)),
> fill in every bracketed placeholder, and register the feature in the Feature Map.

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | [Project Name]              |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |
| **Readiness**    | Draft                       |
| **Owner**        | Product Owner               |

## Context

- **Problem**: [The user problem this feature solves, in one sentence.]
- **Primary Persona**: [Persona from [user-personas.md](../00-context/user-personas.md) who benefits most.]
- **In Scope**: [Comma-separated list of capabilities included.]
- **Out of Scope**: [Comma-separated list of explicitly excluded capabilities.]

## Open Questions

> List unresolved questions blocking this feature's requirements as they come up.
> Delete each bullet once it's answered — don't let stale entries persist here.

- [Open question blocking a requirement below.]

## Functional Requirements

> Use IDs `FR-XXX-NN` where `XXX` matches the feature number. Every requirement needs
> testable acceptance criteria.

| ID        | Requirement                                                        | Source               | Priority | Owner (DRI)   | Acceptance Criteria                                                        | Status    |
| --------- | ------------------------------------------------------------------ | -------------------- | -------- | ------------- | -------------------------------------------------------------------------- | --------- |
| FR-000-01 | [The system allows …]                                              | Overview             | Must     | Product Owner | [Observable, testable outcome.]                                            | Draft     |
| FR-000-02 | [The system allows …]                                              | [Source doc/section] | Must     | Product Owner | [Observable, testable outcome.]                                            | Draft     |

## Feature-Scoped Non-Functional Requirements

> Use IDs `NFR-XXX-NN`. Cross-cutting NFRs belong in the
> [README quality baseline](./README.md#cross-cutting-quality-baseline) instead.

| ID         | Requirement                                                        | Metric / Target                                                                 | Priority | Owner (DRI) | Status    |
| ---------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------- | -------- | ----------- | --------- |
| NFR-000-01 | [Quality requirement scoped to this feature.]                      | [Measurable target; reference cross-cutting NFR-Xnn where applicable.]          | Must     | Tech Lead   | Draft     |

## Dependencies and Risks

- **Dependencies**: [Other features, ADRs, or infrastructure this feature relies on.]
- **Risks**: [Known risks and their mitigations.]

## Traceability

- **Related User Stories**: [Link to work items in your tracker (e.g. Jira)]
- **Related Architecture/ADR**: [Architecture Solution Design](../03-architecture/core/architecture-solution-design.md), [ADR-xxx](../04-decisions/README.md)
- **Related Prototype**: [Prototype Brief](../05-prototype/prototype-brief.md)

---

**Last Updated**: YYYY-MM-DD
