---
sidebar_position: 2
---

# User personas

These are illustrative roles, not findings from user interviews. They guide
CLI and skill design; individual preferences remain assumptions to validate.

## Persona 1: Solo/Small-Team Developer (Primary)

**Maya** prepares an Epic and Stories in Markdown, runs `dwire` in a terminal,
and wants a clear preview before importing. She also fetches, lists, and
creates individual Jira issues. A re-run with its local state file should skip
items already uploaded. Updating those items in Jira is a future capability;
current re-runs do not do it.

## Persona 2: Developer Directing an AI Agent (Secondary)

**Idris** approves a bounded task for a terminal-capable coding agent. The
agent uses the installed `dwire` CLI and the portable skill to read or create
work items. Idris wants the agent to inspect a folder preview, stay within the
approved task, report created keys, and stop after uncertain or partial
results. The first skill does not perform comments, transitions, or PR
references because those commands do not exist yet.

The CLI cannot verify the agent's task approval. Direct create commands write
immediately; `import-folder --yes` writes without a terminal prompt after its
local preview. Idris's agent host controls shell permission, and the skill
supplies workflow guidance. See
[ADR-011](../04-decisions/adr-011-cli-first-agent-integration.md).

## Source references

- [Project overview](./overview.md)
- [CLI agent requirements](../01-requirements/f-004-mcp-tool-surface.md)
