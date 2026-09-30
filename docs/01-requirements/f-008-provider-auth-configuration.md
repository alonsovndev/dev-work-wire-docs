# F-008 Provider Authentication and Configuration

| Attribute | Value |
|---|---|
| **Project** | DevWorkWire |
| **Version** | 0.2 |
| **Status** | Implemented for current CLI |
| **Owner** | Product Owner |

## Context

Jira commands need a destination and credentials. The current CLI loads an
application YAML file selected by `APP_ENV`, substitutes environment values,
and may load a local `.env` file. The working directory's `devworkwire.yml`
selects the project and field mappings. See the application repository's
`docs/getting-started/configuration.md` for exact variables and examples.

## Functional requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-008-01 | Load Jira connection values from application configuration and environment substitution. | A valid base URL and email reach the Jira provider. |
| FR-008-02 | Obtain the Jira API token from environment substitution rather than a committed literal in YAML. | The configured token authenticates requests and is not written by the CLI to the import state file or logs. |
| FR-008-03 | Validate required settings before using the Jira provider. | Missing or invalid settings cause a nonzero command result; a separate connectivity preflight is not claimed. |
| FR-008-04 | Scope a project configuration to one Jira project. | Commands use the project key from the working directory's `devworkwire.yml`. |

No MCP server or `dwire config check` command exists. A standalone connectivity
check can be considered as future CLI work.
