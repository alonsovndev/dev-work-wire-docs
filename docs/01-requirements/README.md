# Requirements

| Attribute     | Value         |
| ------------- | ------------- |
| **Project**   | DevWorkWire   |
| **Version**   | 0.1           |
| **Status**    | Clarified     |
| **Readiness** | Clarified     |
| **Owner**     | Product Owner |

## Purpose

Single source of truth for requirements organized by feature slices.
Detailed requirements are maintained in dedicated feature files — copy
[f-000-feature-template.md](./f-000-feature-template.md) for each new feature.

---

## Feature Map

| Feature ID | Feature Name                 | Outcome                                                                                | Priority | Status | Owner         | Details                                     |
| ---------- | ---------------------------- | -------------------------------------------------------------------------------------- | -------- | ------ | ------------- | ------------------------------------------- |
| F-001      | Validate → Preview → Commit  | Loads a validated Epic/Story/AC document into Jira only after a confirmed preview.     | Must     | Clarified | Product Owner | [F-001](./f-001-validate-preview-commit.md) |
| F-002      | Dedup on Re-Run              | Re-running an import updates matched Jira issues in place instead of duplicating them. | Must     | Clarified | Product Owner | [F-002](./f-002-dedup-on-rerun.md)          |
| F-003      | CLI (dwire) Interactive Flow | Gives Maya a guided terminal flow to import, search, and insert work items.            | Must     | Clarified | Product Owner | [F-003](./f-003-cli-dwire-flow.md)          |
| F-004      | MCP Server Tool Surface      | Gives an AI agent the same validate → preview → confirm gate as the CLI, via MCP.      | Should   | Clarified | Product Owner | [F-004](./f-004-mcp-tool-surface.md)        |
| F-005      | Individual Work Item CRUD    | Creates, reads, and updates a single Epic/Story without a full folder re-import.     | Should   | Clarified | Product Owner | [F-005](./f-005-work-item-crud.md)          |
| F-006      | MCP Work-Context Query       | Lets an agent ask what's ready to work / in progress before acting with the LLM.       | Should   | Clarified | Product Owner | [F-006](./f-006-mcp-work-context-query.md)  |
| F-007      | Progress Reporting           | Reports comments, status transitions, and PR references through the same confirm gate. | Should   | Clarified | Product Owner | [F-007](./f-007-progress-reporting.md)      |
| F-008      | Provider Authentication & Configuration | Lets dwire/the MCP server authenticate to Jira and target a configured project.  | Must     | Clarified | Product Owner | [F-008](./f-008-provider-auth-configuration.md) |
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

F-001 through F-009 are **Clarified**: every functional requirement has testable
acceptance criteria, each feature's Open Questions are resolved, and dependencies
between features are identified. F-008 (Provider Authentication & Configuration) is a
foundational dependency for every other feature. Next step: implementation team
technical-feasibility review to advance to **Ready for Implementation**.

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
| NFR-X01 | Security             | Credentials/tokens are never stored or logged in plaintext (see [F-008](./f-008-provider-auth-configuration.md)); dependencies are scanned for known vulnerabilities; write paths align with OWASP Top 10 practices relevant to a CLI/MCP tool. | Zero plaintext secrets in config files/logs, verified by review; dependency vulnerability scan runs in CI with no unresolved Critical/High findings. | Must     | Tech Lead     | Clarified |
| NFR-X02 | Privacy              | DevWorkWire stores no personal data beyond what it reads from/writes to the configured Jira instance; local config/cache holds no PII beyond connection settings. | No PII fields persisted in local DevWorkWire storage beyond the config covered by [F-008](./f-008-provider-auth-configuration.md), verified by code review. | Must     | Tech Lead     | Clarified |
| NFR-X03 | Testability          | Core application logic (`WorkItemService`, provider adapters) is covered by automated tests. | ≥80% line coverage on `WorkItemService` and provider adapter modules, measured in CI. | Must     | Tech Lead     | Clarified |
| NFR-X04 | Performance          | Interactive CLI/MCP operations (preview, query) remain responsive for typical document/backlog sizes. | TBD — no fixed latency target yet; to be set once representative document/backlog sizes are known. | Should   | Tech Lead     | Draft  |
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
