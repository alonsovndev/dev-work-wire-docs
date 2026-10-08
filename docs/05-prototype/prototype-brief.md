# Prototype brief

DevWorkWire has no graphical interface. These terminal examples illustrate the
current CLI-first workflow for a developer and a terminal-capable agent. The
older MCP and drift-resolution screens represented an unimplemented proposal.

## Purpose

Check that a person or agent can distinguish a local preview from a completed
Jira write, recognize a partial import, and find the created keys.

## Screens

### Local preview

```text
$ dwire preview-folder work-items/
Epic: Authentication
    epic: to create
Stories (1):
  - Login (stories.md:1)
    US-1: to create
```

The equivalent `dwire --format json preview-folder work-items/` result has
`status: "preview"`, with `epic`, `stories`, and `errors` in `data`.

### Non-interactive import

```text
$ dwire --format json import-folder work-items/ --yes
{"command":"import-folder","status":"completed","data":{"created":[{"type":"epic","key":"PROJ-1"}]},"error":null}
```

The JSON example is abbreviated; actual `data` also includes preview fields.
A terminal-capable agent uses `--yes` only within an approved user task.

### Partial import

A `partial` JSON result has a nonzero process exit code, created keys in
`data.created`, and an `error`. The caller stops automated writes and inspects
Jira and the local state file before retrying.

## Out of scope

Search, updating existing issues, richer work-context queries, comments,
transitions, PR references, and MCP are outside the first skill's workflow.

## Requirements coverage

- [F-003 CLI flow](../01-requirements/f-003-cli-dwire-flow.md)
- [F-004 CLI access for agents](../01-requirements/f-004-mcp-tool-surface.md)
- [Current interface contract](../03-architecture/interfaces/interface-contract.md)
