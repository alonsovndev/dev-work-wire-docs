# F-003 `dwire` CLI Flow

| Attribute | Value |
|---|---|
| **Project** | DevWorkWire |
| **Version** | 0.2 |
| **Status** | Implemented for current commands |
| **Owner** | Product Owner |

## Context

The CLI provides an interactive menu for a developer and direct commands for
people, scripts, and terminal-capable agents. Direct commands may return text
or JSON. The current command names are in the
[interface contract](../03-architecture/interfaces/interface-contract.md).

## Functional requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-003-01 | Provide a guided folder import through `dwire import-folder FOLDER`. | Valid input is previewed, then a terminal user is prompted or a non-interactive caller must pass `--yes`. |
| FR-003-02 | Stop before writing on structural validation errors. | The command exits nonzero with file-specific errors and makes no Jira write. |
| FR-003-03 | Provide `preview-folder` as a separate read-only command. | It reports create/skip and validation information with no Jira write. |
| FR-003-04 | Provide direct fetch and list commands. | A caller can fetch an Epic/Story and list an Epic's Stories or open assigned work. |
| FR-003-05 | Provide direct one-item create commands. | A caller can create an Epic or a Story under an existing Epic and receive its key. |
| FR-003-06 | Provide machine-readable direct-command output. | `--format json` returns a structured result for executed commands, including success and error outcomes. |

Search, insert-by-id from a tracked source item, and `config check` appeared in
older interface sketches but are not current commands. For agent authorization,
see [ADR-011](../04-decisions/adr-011-cli-first-agent-integration.md).
