---
sidebar_position: 0
description: Understand DevWorkWire, preview and import prepared work, and find the right documentation for your task.
---

# Introduction

**DevWorkWire** brings already refined Epic and Story Markdown into Jira through
one local CLI, `dwire`. Use it from your terminal or let a terminal-capable AI
agent use the same commands through a portable skill.

Start with the [project overview](./00-context/overview.md) for the problem and
scope, or go directly to the [CLI contract](./03-architecture/interfaces/interface-contract.md)
for supported commands and recovery behavior.

## What you can do today

- Fetch individual Epics and Stories, list an Epic's Stories, and list open work
  assigned to a user.
- Create individual Epics and Stories using direct CLI commands.
- Validate and preview a prepared Markdown folder locally, without Jira writes.
- Import missing items and resume using the local record of created Jira keys.
- Use direct commands with `dwire --format json COMMAND ...` from scripts and
  terminal-capable agents.

Run `dwire` without a command for the interactive menu. For installation and
configuration, follow the application repository's
[CLI reference](https://github.com/alonsovndev/dev-work-wire/blob/dev/docs/guides/cli-reference.md)
and [AI agent skill setup guide](https://github.com/alonsovndev/dev-work-wire/blob/dev/docs/guides/ai-agent-skill.md).

## From Markdown to Jira

These examples assume `dwire` is installed and Jira access is configured. Replace
`./work-items/my-epic` with your prepared folder.

1. **Prepare the work.** Put one Epic in `epic.md` and its optional Stories in
   `stories.md`. DevWorkWire imports defined work; it does not refine an idea
   into requirements or acceptance criteria.
2. **Preview locally.** Inspect validation errors and the items marked for
   creation, skipping, or resolution before any Jira write.

   ```sh
   dwire preview-folder ./work-items/my-epic
   ```

3. **Review and import.** The import command validates and previews again, then
   asks for confirmation in an interactive terminal.

   ```sh
   dwire import-folder ./work-items/my-epic
   ```

4. **Keep the resume file.** Preserve `.devworkwire-import.json` beside your
   Markdown. Re-running with that file skips recorded items and can continue
   missing ones. Changed uploaded items are skipped, not updated in Jira.

:::note Write boundaries and recovery
Direct `create-epic` and `create-story` commands write immediately. JSON-mode and
other non-interactive imports require `--yes` when there is work to create.
Agents must stay within the user's approved task; the CLI cannot verify a
conversation's authorization.

Without the resume file, the importer cannot identify earlier uploads from Jira
alone. If a write's outcome is uncertain, inspect Jira before resolving or
retrying it. Read the [write and recovery rules](./03-architecture/interfaces/interface-contract.md#writes-and-recovery).
:::

## Choose a reading path

| Your goal | Start here | Continue with |
|---|---|---|
| Understand the product | [Overview](./00-context/overview.md) | [Personas](./00-context/user-personas.md) and [scope boundaries](./00-context/out-of-scope.md) |
| Use or automate the CLI | [CLI contract](./03-architecture/interfaces/interface-contract.md) | [CLI-first agent integration](./04-decisions/adr-011-cli-first-agent-integration.md) |
| Contribute to implementation | [Feature map](./01-requirements/README.md) | [Current solution design](./03-architecture/core/architecture-solution-design.md) and [decisions](./04-decisions/README.md) |
| Review future direction | [Planning](./02-planning/README.md) | [Prototype references](./05-prototype/README.md) |

## Explore the documentation

| Section | What you will find |
|---|---|
| [Context](./00-context/README.md) | Overview, personas, terminology, and scope |
| [Requirements](./01-requirements/README.md) | Feature requirements and implementation status |
| [Planning](./02-planning/README.md) | Draft roadmap, roles, and workstreams |
| [Architecture](./03-architecture/README.md) | Core design, interfaces, persistence, diagrams, operations, and security |
| [Decisions](./04-decisions/README.md) | Accepted, proposed, and superseded Architectural Decision Records |
| [Prototype](./05-prototype/README.md) | Prototype brief, design direction, and interaction references |

## Current behavior and proposals

Some architecture and requirement pages retain earlier target designs. A
`Clarified` requirement or `Proposed` ADR is not proof of an implemented feature.
Use the feature map, current CLI contract, and accepted
[ADR-011](./04-decisions/adr-011-cli-first-agent-integration.md) to interpret them.

MCP, the SQLite preview store, Jira-side matching, updates, richer queries,
comments, status transitions, and PR references remain deferred or planned.
The current integration is the installed CLI plus a portable skill.
