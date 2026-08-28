# F-008 Provider Authentication & Configuration

| Attribute        | Value                       |
| ----------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Clarified                       |
| **Readiness**    | Clarified                       |
| **Owner**        | Product Owner               |

## Context

- **Problem**: Every other feature assumes DevWorkWire is already authenticated against Jira and pointed at the right project — but nothing yet defines how credentials or the target project are configured, so the tool cannot function without this.
- **Primary Persona**: [Maya, Solo/Small-Team Developer](../00-context/user-personas.md#persona-1-solosmall-team-developer-primary) (also [Idris](../00-context/user-personas.md#persona-2-developer-directing-an-ai-agent-secondary), whose MCP server needs the same connection).
- **In Scope**: A local configuration file holding non-secret settings (Jira base URL, project key); the Jira API token supplied via an environment variable, never stored in the config file; configuration validated before any Jira-touching command runs; one configuration scoped to a single Jira project/instance.
- **Out of Scope**: Multi-project or multi-instance configuration; an interactive OS-keychain-based credential wizard (deferred); non-Jira providers (Jira only, per Phase 1 `WorkItemProvider` scope).

## Open Questions

None currently blocking this feature.

## Functional Requirements

| ID        | Requirement                                                                                                          | Source                                        | Priority | Owner (DRI)   | Acceptance Criteria                                                                                                                                       | Status |
| --------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | -------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FR-008-01 | The system reads Jira connection settings (base URL, project key) from a local configuration file.                       | User clarification (F-008 auth method)            | Must     | Product Owner | Given a valid config file with a base URL and project key, `dwire` and the MCP server successfully connect to Jira using those values.                     | Clarified  |
| FR-008-02 | The system reads the Jira API token from an environment variable, never from the configuration file.                     | User clarification (F-008 auth method)            | Must     | Product Owner | Given the API token set as an environment variable and absent from the config file, the system authenticates successfully; the token is never read from or written to the config file. | Clarified  |
| FR-008-03 | The system validates configuration (required fields, connectivity) before any command or MCP tool call that reads or writes Jira, failing with a clear, actionable error if the config is missing or invalid. | Derived from cross-feature dependency on F-008    | Must     | Product Owner | Given a missing or invalid config, any command/tool call needing Jira access fails with an error naming the missing/invalid field, before any Jira API call is attempted. | Clarified  |
| FR-008-04 | The system scopes a single configuration to exactly one Jira project/instance.                                           | User clarification (F-008 project scope)          | Must     | Product Owner | Given a single config file, all commands operate against that one configured project; there is no per-command project override in this MVP.                | Clarified  |

## Feature-Scoped Non-Functional Requirements

| ID         | Requirement                                                                                   | Metric / Target                                                                                     | Priority | Owner (DRI) | Status |
| ---------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------- | ----------- | ------ |
| NFR-008-01 | The Jira API token is never written to disk in plaintext by DevWorkWire (not logged, not cached to a config file). | Code/security review confirms the token value never appears in any file DevWorkWire writes (config, cache, logs). | Must     | Tech Lead   | Clarified  |

## Dependencies and Risks

- **Dependencies**: The `WorkItemProvider` port for Jira consumes this configuration; every other feature ([F-001](./f-001-validate-preview-commit.md)–[F-007](./f-007-progress-reporting.md)) depends on this being resolved first, since none of them can reach Jira without it.
- **Risks**: Environment-variable-only secrets can leak via shell history or process listings on shared machines — mitigated by documentation guidance (e.g. a git-ignored `.env` file or shell profile export) rather than DevWorkWire enforcing a specific secret store.

## Traceability

- **Related User Stories**: TBD
- **Related Architecture/ADR**: [Architecture Solution Design](../03-architecture/core/architecture-solution-design.md), [ADR-xxx](../04-decisions/README.md)
- **Related Prototype**: [Prototype Brief](../05-prototype/prototype-brief.md)

---

**Last Updated**: 2026-08-28
