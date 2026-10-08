---
sidebar_position: 1
---

# Phased roadmap

DevWorkWire's active direction is one local CLI used by people and
terminal-capable agents. [ADR-011](../04-decisions/adr-011-cli-first-agent-integration.md)
records the decision. The earlier week-by-week MCP roadmap is no longer the
implementation baseline.

## Current baseline

The CLI can fetch an epic or story, list stories or open assigned work, create
an epic or story, preview a Markdown folder, import missing folder items, and
resolve local import state. Direct commands provide JSON output. A portable
skill covers those commands. Import deduplication depends on the local resume
file; uploaded items are skipped on re-run and are not updated.

## Next CLI work

| Area | Outcome | Status |
|---|---|---|
| Search and individual updates | Find existing Jira work and update selected items through CLI commands | Planned |
| Work-context query | Filter by status category and assignee, returning sufficient item detail | Planned |
| Progress reporting | Add comments, transitions, and PR references with safe retry behavior | Planned |
| Provider expansion | Evaluate Linear and Azure DevOps adapters behind the provider port | Future |

Command names, delivery dates, and owners for these features are `TBD` until
specified. Their requirement files describe intent, not current commands.

## MCP trigger

MCP remains deferred. Reconsider it only when a target AI client cannot run a
local command or requires native tool discovery. At that point, define a
specific client requirement, a new interface contract, and a security review
before implementing a server.
