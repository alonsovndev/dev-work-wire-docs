# DevWorkWire overview

**DevWorkWire** is a locally installed CLI for loading an already refined Epic
and its Stories into Jira. It reads `epic.md` and optional `stories.md`, validates
and previews the folder, then creates missing Jira issues. The same `dwire`
executable is usable by a developer in a terminal or by a terminal-capable AI
agent through the portable skill.

## Who it serves

- A developer working directly in the terminal can inspect, create, and
  import work items without manually entering each ticket in Jira.
- A developer directing an AI agent can authorize a task and have the agent
  use the installed CLI. The agent skill explains command use and recovery;
  the CLI does not know what the developer approved in the conversation.

## Current behavior

- Direct commands fetch or create individual Epics and Stories, list an Epic's
  Stories, and list open work assigned to a user.
- `preview-folder` validates local Markdown without Jira writes.
- `import-folder` validates and previews locally. It prompts in an interactive
  terminal or requires `--yes` in a non-interactive run before creating missing
  items. Direct create commands write immediately.
- A `.devworkwire-import.json` file beside the Markdown records created keys.
  Re-running with that file skips created items. Changed uploaded items are not
  updated, and a folder without its file cannot be matched against earlier
  Jira uploads automatically.
- Direct commands offer `--format json` for scripts and agents. Human-readable
  output remains the default.

## Future direction

Search, updates, richer work queries, comments, status transitions, PR
references, and additional tracker providers are future capabilities. MCP is
deferred until a concrete AI client needs an interface beyond the local CLI.
The earlier MCP preview-handle design is retained as a superseded decision,
not as current behavior.

See the [feature requirements](../01-requirements/README.md), [current CLI
contract](../03-architecture/interfaces/interface-contract.md), and
[CLI-first decision](../04-decisions/adr-011-cli-first-agent-integration.md).

## Core concept

The input is a prepared Epic/Story folder. DevWorkWire validates its structure
and creates Jira issues; it does not refine ambiguous ideas into work items.

## The solution

A local preview shows what the current importer will create or skip. The
resume file records uploaded keys so a re-run can continue without repeating
known creates.

## Key differentiators

The same installed CLI serves people and terminal-capable agents. The agent
skill documents safe use of the commands and their recovery paths.

## Technical goals

Keep Jira access behind the provider port, expose stable CLI JSON for scripts,
and make import outcomes explicit. Future write features need their own retry
and recovery designs.

## Business goals

Reduce manual Jira ticket entry while retaining a clear local record of what
the CLI created.
