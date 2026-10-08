# F-004 CLI Access for AI Agents

| Attribute | Value |
|---|---|
| **Project** | DevWorkWire |
| **Version** | 0.2 |
| **Status** | Implemented |
| **Owner** | Product Owner |

## Context

A developer wants a terminal-capable AI agent to read and load refined work
through the same installed `dwire` command used by people. The first integration
covers existing fetch, list, create, preview, and import workflows. A portable
skill teaches the command sequence; it does not add a second Jira client.

The user-approved agent task authorizes its Jira writes. The CLI cannot inspect
that conversation. The skill must stay within the task, and the agent's host
controls shell permission. Per-write preview handles from the earlier MCP
proposal are not part of this feature.

## Functional requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-004-01 | Direct CLI commands provide machine-readable results. | `dwire --format json COMMAND` returns one JSON object on stdout with command, status, data, and error; a failure exits nonzero. |
| FR-004-02 | A portable Agent Skills file documents the current CLI workflow. | A terminal-capable agent can use the skill to fetch, list, create, preview, and import without MCP or a second Jira integration. |
| FR-004-03 | The skill respects user task approval. | It describes immediate direct-create writes, preview before folder import, `--yes` for non-interactive import, and stopping after uncertain or partial outcomes. |
| FR-004-04 | JSON distinguishes read, preview, write, no-change, partial, and error outcomes. | Tests cover representative read, create, preview, completed import, no-change import, and partial import results. |

## Boundaries

- Current import deduplication relies on the local resume file, not a Jira-wide
  matching query. Changed uploaded items are skipped, not updated.
- Search, update, richer work queries, comments, transitions, and PR references
  remain separate planned CLI work.
- MCP is deferred until a concrete client cannot run local commands or requires
  native tool discovery.

## References

- [ADR-011: CLI-First AI Agent Integration](../04-decisions/adr-011-cli-first-agent-integration.md)
- [Interface Contract](../03-architecture/interfaces/interface-contract.md)
