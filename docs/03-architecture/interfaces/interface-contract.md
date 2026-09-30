---
sidebar_position: 2
---

# Interface contract

DevWorkWire publishes the local `dwire` CLI. Terminal-capable agents use that
same executable through the portable skill. There is no current MCP server or
HTTP API. [ADR-011](../../04-decisions/adr-011-cli-first-agent-integration.md)
records the integration decision.

## Commands

| Command | Effect | Result data |
|---|---|---|
| `dwire fetch-epic KEY` | Read an epic | `epic` |
| `dwire fetch-story KEY` | Read a story | `story` |
| `dwire list-stories EPIC_KEY` | Read stories in an epic | `epic_key`, `stories` |
| `dwire list-assigned [--assignee ACCOUNT_ID]` | Read open assigned work | `assignee`, `items` |
| `dwire create-epic --title TITLE [options]` | Create an epic immediately | `key`, `type` |
| `dwire create-story EPIC_KEY --title TITLE [options]` | Create a story immediately | `key`, `type`, `epic_key` |
| `dwire preview-folder FOLDER` | Validate and preview local Markdown | `epic`, `stories`, `errors` |
| `dwire import-folder FOLDER [--yes]` | Import missing local items | Preview fields, `created` when applicable |
| `dwire resolve-import FOLDER --item ID (--key KEY \| --retry)` | Resolve an uncertain local import attempt | `item`, `key`, `action` |
| `dwire rebind-import-story FOLDER OLD_ID NEW_ID` | Keep a key after a story ID rename | `story_id`, `new_story_id` |
| `dwire retire-import-story FOLDER STORY_ID` | Remove a missing story from local state | `story_id`, `new_story_id` (`null`) |

Run `dwire` without a command for the interactive menu. Direct commands support
`dwire --format json COMMAND ...`; the menu is text-only. Use each command's
`--help` for the full argument list.

## JSON result

JSON mode writes one object to stdout. Diagnostics and logs go to stderr. A
nonzero process exit status means the command failed or an import was partial.
Argument errors detected before a command runs use the `INVALID_ARGUMENT`
code and exit nonzero.

```json
{
  "command": "create-epic",
  "status": "completed",
  "data": {"key": "PROJ-123", "type": "epic"},
  "error": null
}
```

`status` is one of:

| Status | Meaning |
|---|---|
| `completed` | A read or write succeeded. |
| `preview` | Local validation and preview succeeded; no Jira write occurred. |
| `no_change` | All folder items were already recorded as uploaded. |
| `error` | The command failed without creating a new item in this invocation. |
| `partial` | An import created at least one item in this invocation but did not finish. |

On failure, `error` contains `code` and `message`. Current codes include
`INVALID_ARGUMENT`, `NOT_FOUND`, `VALIDATION_FAILED`, `CONFIRMATION_REQUIRED`, and
`COMMAND_FAILED`; callers must also handle future codes. In a preview,
`epic` and each story identify action `create`, `skip`, or `unresolved`, plus
its recorded key and whether the source changed. `errors` contain `file`,
`line`, and `message`. A `skip` item is not updated in Jira even when its
`changed` field is true.

## Writes and recovery

Direct create commands write immediately. `import-folder` validates and shows
its local plan before writing. It prompts in an interactive terminal; JSON
mode and other non-interactive runs require `--yes` when there is work to
create. An agent must use write commands only within the user's approved task;
`dwire` cannot inspect that approval. `--yes` is an explicit CLI action, not a
server-verified human confirmation.

Imports persist `.devworkwire-import.json` beside the Markdown. With that file,
a re-run skips created items and can resume missing ones. Without it, the CLI
cannot identify an earlier upload from Jira alone. A definite story rejection
allows later stories to be attempted; an uncertain result stops the import and
requires inspection of Jira before `resolve-import` or a retry. See the
CLI reference at `dev-work-wire/docs/guides/cli-reference.md` for operational
detail.

## Deferred interfaces

Search, update of existing Jira items, richer work-context queries, comments,
status transitions, and PR references are planned CLI capabilities, not
current commands. MCP remains deferred until a concrete client requirement
justifies it. The earlier proposed MCP contract is retained in
[ADR-004](../../04-decisions/adr-004-mcp-stdio-confirm-gate.md) as history.
