# Requirements

| Attribute     | Value          |
| ------------- | -------------- |
| **Project**   | [Project Name] |
| **Version**   | 0.1            |
| **Status**    | Draft          |
| **Readiness** | Draft          |
| **Owner**     | Product Owner  |

## Purpose

Single source of truth for requirements organized by feature slices.
Detailed requirements are maintained in dedicated feature files — copy
[f-000-feature-template.md](./f-000-feature-template.md) for each new feature.

---

## Feature Map

| Feature ID | Feature Name   | Outcome                                 | Priority | Status | Owner         | Details |
| ---------- | -------------- | --------------------------------------- | -------- | ------ | ------------- | ------- |
| F-001      | [Feature name] | [One-line outcome the feature delivers] | Must     | Draft  | Product Owner | F-001   |
| F-002      | [Feature name] | [One-line outcome the feature delivers] | Should   | Draft  | Product Owner | F-002   |

---

## Status Definitions

| Status                       | Meaning                                                                             | Criteria                                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Draft**                    | Requirements are documented but not yet validated or complete                       | Requirements capture initial understanding; may have open questions or missing acceptance criteria                                                     |
| **Review Pending**           | Baseline is complete and under validation review                                    | All requirements documented with acceptance criteria; open questions resolved; pending final product owner validation before implementation handoff    |
| **Clarified**                | Core requirements are validated and stable; ready for implementation planning       | All functional requirements reviewed and approved; no open questions; dependencies identified; ready for implementation team to begin technical design |
| **Ready for Implementation** | All requirements validated, reviewed, and implementation team confirmed feasibility | Feature marked "Clarified" + all individual requirements marked "Clarified" + implementation team reviewed and confirmed feasibility                   |

### Current Feature Status

[List the current status of each feature and the next step, e.g.:]

All features are currently in **Draft** status.

**Transition Path**: Draft → Review Pending → Clarified → Ready for Implementation

---

## Cross-Cutting Quality Baseline

> Cross-cutting NFRs use IDs `NFR-X01`, `NFR-X02`, … and apply across features. Feature-scoped NFRs live inside each feature file. Adjust the quality areas to your project; every row needs a measurable **Metric / Target**.

| ID      | Quality Area         | Requirement                                                          | Metric / Target                                                                 | Priority | Owner (DRI)   | Status |
| ------- | -------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------- | ------------- | ------ |
| NFR-X01 | Security             | [Security requirement, e.g. adherence to a known security baseline.] | [Measurable target, e.g. checklist satisfied, hashing and rate limiting rules.] | Must     | Tech Lead     | Draft  |
| NFR-X02 | Privacy              | [Privacy requirement, e.g. deletion and archival support.]           | [Measurable target, e.g. deletion SLA.]                                         | Must     | Tech Lead     | Draft  |
| NFR-X03 | Testability          | [Test coverage requirement for core logic.]                          | [Coverage threshold, e.g. 70% of core application logic.]                       | Must     | Backend Lead  | Draft  |
| NFR-X04 | Performance          | [Responsiveness requirement under expected load.]                    | [Load definition + latency target.]                                             | Should   | Tech Lead     | Draft  |
| NFR-X05 | Scalability          | [Capacity requirement without data loss or degradation.]             | [Concrete capacity numbers.]                                                    | Should   | Tech Lead     | Draft  |
| NFR-X06 | Accessibility        | [Accessibility standard for primary workflows.]                      | [Standard, e.g. WCAG 2.1 AA for contrast, keyboard, screen readers.]            | Should   | UI/UX Lead    | Draft  |
| NFR-X07 | Delivery Feasibility | [Scope must remain deliverable in the planned schedule.]             | [Delivery window.]                                                              | Should   | Product Owner | Draft  |

---

## Infrastructure Decisions for Implementation Team

The following infrastructure choices impact requirements scope and should guide implementation:

| Decision Area          | Specified Choice               | Impact on Requirements             | Rationale                              |
| ---------------------- | ------------------------------ | ---------------------------------- | -------------------------------------- |
| **Database**           | _Implementation Team Decision_ | [Which NFRs constrain the choice.] | [Constraints the choice must satisfy.] |
| **Hosting**            | _Implementation Team Decision_ | [Which NFRs constrain the choice.] | [Constraints the choice must satisfy.] |
| **Session Management** | _Implementation Team Decision_ | [Which NFRs constrain the choice.] | [Constraints the choice must satisfy.] |

**Note**: All infrastructure decisions should be documented as ADRs in [04-decisions](../04-decisions/README.md), not in this requirements specification. Chosen technologies must satisfy the non-functional requirements above.

**Validation Checklist for "Ready for Implementation"**:

Implementation team has confirmed:

- [ ] All feature requirements are clear and unambiguous
- [ ] Acceptance criteria are testable and measurable
- [ ] Technical feasibility confirmed (no hidden blockers)
- [ ] Dependencies between features are understood
- [ ] Quality baselines are achievable with specified infrastructure
- [ ] Infrastructure choices are appropriate for requirements
- [ ] Scope boundaries ([out-of-scope.md](../00-context/out-of-scope.md)) are agreed upon
- [ ] No unresolved `## Open Questions` notes remain in this feature's file

## Source References

- [Project Overview](../00-context/overview.md)
- [User Personas](../00-context/user-personas.md)
- [Out of Scope Items](../00-context/out-of-scope.md)

---

**Last Updated**: YYYY-MM-DD
