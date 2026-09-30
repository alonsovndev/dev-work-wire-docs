---
sidebar_position: 3
---

# Glossary

Terms used in the current CLI-first documentation.

## Work items

**Epic**: The top-level Jira issue described by `epic.md`.

**Story**: A Jira Story linked to an Epic and described by a stable ID in
`stories.md`.

**Acceptance criteria**: Conditions written in the Story Markdown and sent as
part of the Story description.

**WorkItemProvider**: The core port implemented by the Jira adapter for the
supported create and read operations.

## CLI and agent terms

**`dwire`**: The installed DevWorkWire command. Direct commands can return
human-readable text or one JSON result.

**Preview**: Read-only local parsing and validation of a source folder, with
create/skip information from its resume file. It does not search Jira for all
possible duplicates.

**Import state**: The `.devworkwire-import.json` file beside source Markdown.
It records created Jira keys and pending attempts so a folder import can
resume.

**Agent skill**: The portable `SKILL.md` instructions that teach a
terminal-capable agent how to use `dwire`. It adds no Jira capability or CLI
approval enforcement.

**Approved task**: The user's instruction authorizing an agent to perform
specific work. The agent must stay within its scope; the CLI cannot inspect
or verify that conversation.

**Partial import**: An import that created at least one item in the current
invocation but ended with an error. The caller must inspect created keys and
Jira before retrying.

**MCP**: A possible future adapter for clients that cannot run local commands
or require native tool discovery. No MCP server is currently shipped.
