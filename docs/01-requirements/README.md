# Requirements

| Attribute     | Value         |
| ------------- | ------------- |
| **Project**   | DevWorkWire   |
| **Version**   | 0.1           |
| **Status**    | Clarified     |
| **Readiness** | Clarified     |
| **Owner**     | Product Owner |

## Purpose

Requirements organized by feature slices. Some files retain earlier target
designs that differ from the shipped CLI; their implementation notes identify
those gaps. [ADR-011](../04-decisions/adr-011-cli-first-agent-integration.md)
is the active decision for AI integration.
Detailed requirements are maintained in dedicated feature files — copy
[f-000-feature-template.md](./f-000-feature-template.md) for each new feature.

---

## Feature Map

| Feature ID | Feature Name                 | Outcome                                                                                | Priority | Status | Owner         | Details                                     |
| ---------- | ---------------------------- | -------------------------------------------------------------------------------------- | -------- | ------ | ------------- | ------------------------------------------- |
| F-001      | Validate → Preview → Commit  | Validates and previews a folder, then creates missing items. Update semantics remain planned. | Must | Partial | Product Owner | [F-001](./f-001-validate-preview-commit.md) |
| F-002      | Dedup on Re-Run              | Uses a local resume file to skip created items; Jira-side matching and updates remain planned. | Must | Partial | Product Owner | [F-002](./f-002-dedup-on-rerun.md) |
| F-003      | CLI (dwire) Interactive Flow | Provides a menu and direct commands; search and insert remain planned. | Must | Partial | Product Owner | [F-003](./f-003-cli-dwire-flow.md) |
| F-004      | CLI Access for AI Agents     | Uses JSON direct commands and a portable skill for existing workflows. | Should | Implemented | Product Owner | [F-004](./f-004-mcp-tool-surface.md) |
| F-005      | Individual Work Item CRUD    | Reads and creates individual Epics/Stories; update remains planned. | Should | Partial | Product Owner | [F-005](./f-005-work-item-crud.md) |
| F-006      | CLI Work-Context Query       | Plans a richer query by status and assignee. | Should | Planned | Product Owner | [F-006](./f-006-mcp-work-context-query.md) |
| F-007      | Progress Reporting           | Plans comments, status transitions, and PR references through CLI commands. | Should | Planned | Product Owner | [F-007](./f-007-progress-reporting.md) |
| F-008      | Provider Authentication & Configuration | Configures Jira access for the CLI. | Must | Partial | Product Owner | [F-008](./f-008-provider-auth-configuration.md) |
| F-009      | Packaging & Distribution     | Ships DevWorkWire as an installable, versioned PyPI/pipx/Homebrew package.             | Must     | Clarified | Product Owner | [F-009](./f-009-packaging-distribution.md)  |

---

## Status Definitions

| Status                       | Meaning                                                                             | Criteria                                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Draft**                    | Requirements are documented but not yet validated or complete                       | Requirements capture initial understanding; may have open questions or missing acceptance criteria                                                     |
| **Review Pending**           | Baseline is complete and under validation review                                    | All requirements documented with acceptance criteria; open questions resolved; pending final product owner validation before implementation handoff    |
| **Clarified**                | Core requirements are validated and stable; ready for implementation planning       | All functional requirements reviewed and approved; no open questions; dependencies identified; ready for implementation team to begin technical design |
| **Ready for Implementation** | All requirements validated, reviewed, and implementation team confirmed feasibility | Feature marked "Clarified" + all individual requirements marked "Clarified" + implementation team reviewed and confirmed feasibility                   |

### Current Feature Status

The feature map distinguishes implemented, partial, and planned behavior.
Existing requirement tables with `Clarified` rows describe a target design,
not proof that every row has shipped. Check the implementation note in each
feature and the [current CLI contract](../03-architecture/interfaces/interface-contract.md)
before using a command.

Three cross-cutting NFRs in the [Quality Baseline](#cross-cutting-quality-baseline)
below (`NFR-X04` Performance, `NFR-X05` Scalability, `NFR-X07` Delivery Feasibility)
remain **Draft** — their targets are still `TBD` and not yet measurable, so they don't
qualify as Clarified until a concrete target is set.

**Transition Path**: Draft → Review Pending → Clarified → Ready for Implementation

---

## Cross-Cutting Quality Baseline

> Cross-cutting NFRs use IDs `NFR-X01`, `NFR-X02`, … and apply across features. Feature-scoped NFRs live inside each feature file. Adjust the quality areas to your project; every row needs a measurable **Metric / Target**.

| ID      | Quality Area         | Requirement                                                          | Metric / Target                                                                 | Priority | Owner (DRI)   | Status |
| ------- | -------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------- | ------------- | ------ |
| NFR-X01 | Security             | Credentials/tokens are never stored or logged in plaintext (see [F-008](./f-008-provider-auth-configuration.md)); dependencies are scanned for known vulnerabilities; write paths align with OWASP Top 10 practices relevant to a CLI tool. | Zero plaintext secrets in config files/logs, verified by review; dependency vulnerability scan runs in CI with no unresolved Critical/High findings. | Must     | Tech Lead     | Clarified |
| NFR-X02 | Privacy              | DevWorkWire stores no personal data beyond what it reads from/writes to the configured Jira instance; local config/cache holds no PII beyond connection settings. | No PII fields persisted in local DevWorkWire storage beyond the config covered by [F-008](./f-008-provider-auth-configuration.md), verified by code review. | Must     | Tech Lead     | Clarified |
| NFR-X03 | Testability          | Core application logic (`WorkItemService`, provider adapters) is covered by automated tests. | ≥80% line coverage on `WorkItemService` and provider adapter modules, measured in CI. | Must     | Tech Lead     | Clarified |
| NFR-X04 | Performance          | CLI operations (preview, query) remain responsive for typical document/backlog sizes. | TBD — no fixed latency target yet; to be set once representative document/backlog sizes are known. | Should   | Tech Lead     | Draft  |
| NFR-X05 | Scalability          | Backlog volume stays within what a single Jira project can hold, per the single-project-per-config scope in [F-008](./f-008-provider-auth-configuration.md). | TBD — no fixed capacity number; scope is bounded by single-project use. Revisit if multi-project support is added. | Should   | Tech Lead     | Draft  |
| NFR-X06 | Accessibility        | Not applicable as a GUI standard — `dwire` is a terminal CLI with no graphical interface. Terminal output avoids color-only signaling of state. | CLI errors/warnings are prefixed with text (not signaled by color alone), verified by manual review. | Should   | Tech Lead     | Clarified |
| NFR-X07 | Delivery Feasibility | Scope must remain deliverable in the planned schedule.               | TBD — no committed delivery window yet.                                        | Should   | Product Owner | Draft  |

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

**Last Updated**: 2026-08-28
