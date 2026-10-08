# F-006 CLI Work-Context Query

| Attribute | Value |
|---|---|
| **Project** | DevWorkWire |
| **Version** | 0.2 |
| **Status** | Planned |
| **Owner** | Product Owner |

## Context

The current CLI can list open work assigned to a user and stories in a known
epic. It does not yet offer a combined query by status category and assignee,
or return full acceptance criteria in list results. An agent can fetch a known
story for details in the meantime.

## Functional requirements

| ID | Planned requirement | Acceptance criteria |
|---|---|---|
| FR-006-01 | Add a read-only CLI query filtered by Jira's native To Do, In Progress, or Done status category. | Results contain only items in the requested category. |
| FR-006-02 | Allow the query to filter by assignee, including the authenticated user. | Status and assignee filters work together. |
| FR-006-03 | Return enough context for the agent to choose work. | Each JSON item includes title, acceptance criteria, parent epic, and status where available. |

This feature adds a CLI command to the existing JSON contract, not an MCP tool.
It is outside the first skill's required command set.

## References

- [ADR-011: CLI-First AI Agent Integration](../04-decisions/adr-011-cli-first-agent-integration.md)
- [Interface Contract](../03-architecture/interfaces/interface-contract.md)
