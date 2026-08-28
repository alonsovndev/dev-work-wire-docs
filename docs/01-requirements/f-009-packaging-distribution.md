# F-009 Packaging & Distribution

| Attribute        | Value                       |
| ----------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Clarified                       |
| **Readiness**    | Clarified                       |
| **Owner**        | Product Owner               |

## Context

- **Problem**: Without a proper packaging and release story, developers can't easily install or trust DevWorkWire updates — the stated goal of broad, frictionless distribution depends on this.
- **Primary Persona**: [Maya, Solo/Small-Team Developer](../00-context/user-personas.md#persona-1-solosmall-team-developer-primary) (installs via pip/pipx); also [Idris](../00-context/user-personas.md#persona-2-developer-directing-an-ai-agent-secondary) (installs to run the MCP server).
- **In Scope**: A PyPI package (`devworkwire`) installable via `pip install devworkwire`; pipx documented as the recommended install path; a self-maintained Homebrew tap (`alonsovndev/devworkwire`); Semantic Versioning; a changelog following Keep a Changelog conventions.
- **Out of Scope**: Homebrew core submission; standalone binaries — both explicitly deferred per [Out of Scope for MVP](../00-context/out-of-scope.md).

## Open Questions

None currently blocking this feature.

## Functional Requirements

| ID        | Requirement                                                                                                    | Source                                              | Priority | Owner (DRI)   | Acceptance Criteria                                                                                                                                    | Status |
| --------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FR-009-01 | The system is published as an installable PyPI package named `devworkwire`.                                     | [Overview](../00-context/overview.md#business-goals)   | Must     | Product Owner | Given `pip install devworkwire` (or `pipx install devworkwire`) on a supported Python version, the `dwire` CLI command becomes available.                | Clarified  |
| FR-009-02 | The project documents pipx as the recommended installation method, with pip as a supported alternative.         | [Overview](../00-context/overview.md#business-goals)   | Should   | Product Owner | Given the project's installation documentation, pipx is presented as the recommended path, with pip documented as a supported alternative.               | Clarified  |
| FR-009-03 | The system is distributed via a self-maintained Homebrew tap (`alonsovndev/devworkwire`).                       | [Overview](../00-context/overview.md#business-goals)   | Should   | Product Owner | Given the documented tap command, `dwire` becomes available and runnable on a supported macOS/Homebrew environment.                                      | Clarified  |
| FR-009-04 | Each release follows Semantic Versioning and records its changes in a changelog following Keep a Changelog conventions. | User clarification (F-009 release conventions); [Overview](../00-context/overview.md#technical-goals) | Must     | Product Owner | Given a new release, its version number follows SemVer relative to the prior release, and the changelog gains a new entry categorized per Keep a Changelog before the release is published. | Clarified  |

## Feature-Scoped Non-Functional Requirements

| ID         | Requirement                                                                                     | Metric / Target                                                                                       | Priority | Owner (DRI) | Status |
| ---------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | -------- | ----------- | ------ |
| NFR-009-01 | The package installs cleanly on a clean environment for each supported distribution channel (PyPI/pipx, Homebrew tap). | A fresh install (clean venv or container) succeeds with no manual dependency fixes, verified before each release. | Must     | Tech Lead   | Clarified  |

## Dependencies and Risks

- **Dependencies**: `pyproject.toml` packaging setup and build-backend choice — an infrastructure decision to be captured as an ADR in [04-decisions](../04-decisions/README.md), not detailed further here.
- **Risks**: Maintaining a Homebrew tap in parallel with PyPI adds release overhead — mitigated by scripting/automating the release process as future CI work, not a blocking requirement for this feature.

## Traceability

- **Related User Stories**: TBD
- **Related Architecture/ADR**: [Architecture Solution Design](../03-architecture/core/architecture-solution-design.md), [ADR-xxx](../04-decisions/README.md)
- **Related Prototype**: [Prototype Brief](../05-prototype/prototype-brief.md)

---

**Last Updated**: 2026-08-28
