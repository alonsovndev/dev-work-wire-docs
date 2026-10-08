# F-005 Individual Work Item Read and Create

| Attribute | Value |
|---|---|
| **Project** | DevWorkWire |
| **Version** | 0.2 |
| **Status** | Partial; update planned |
| **Owner** | Product Owner |

## Context

Not every Jira operation needs a folder import. The current CLI can fetch and
create individual Epics and Stories. It has no command to update an existing
issue. Direct creates write immediately within the user's task approval model
in [ADR-011](../04-decisions/adr-011-cli-first-agent-integration.md).

## Functional requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-005-01 | Fetch an Epic or Story by Jira key. | The direct command returns its details, or a nonzero `NOT_FOUND` result in JSON mode. |
| FR-005-02 | Create one Epic from direct command arguments. | Jira creates exactly one Epic and the CLI returns its key. |
| FR-005-03 | Create one Story under an existing Epic. | The command verifies the parent Epic, creates the Story, and returns its key. |
| FR-005-04 | Keep agent writes within the approved task. | The portable skill describes immediate writes and asks the agent to obtain clarification when the requested item is outside task scope. The CLI cannot verify conversation approval. |

A future update command needs its own preview, retry, and recovery design. No
current command provides single-item update or the earlier one-item
preview-handle gate.
