# F-001 Validate, Preview, and Import

| Attribute | Value |
|---|---|
| **Project** | DevWorkWire |
| **Version** | 0.2 |
| **Status** | Implemented |
| **Owner** | Product Owner |

## Context

A developer needs to turn a prepared Epic/Story folder into Jira issues after
checking its structure and local create/skip preview. This file describes the
current create-only importer. The earlier update-in-place and fail-fast batch
requirements were not implemented and are not part of the current contract.

## Functional requirements

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-001-01 | Parse `epic.md` and optional `stories.md` into an Epic and Stories with their descriptions and acceptance criteria. | Valid input produces the expected items; invalid headings identify a file and line. |
| FR-001-02 | Validate folder structure before any Jira write. | An invalid folder exits nonzero and creates no Jira item. |
| FR-001-03 | Show a local preview of items to create or skip. | `preview-folder` makes no Jira write and reports validation errors, recorded keys, and source changes. |
| FR-001-04 | Require an interactive confirmation or an explicit non-interactive `--yes` for folder import. | A declined prompt or a non-interactive import without `--yes` creates nothing. |
| FR-001-05 | Create missing items and record their Jira keys locally. | The importer creates the Epic before its Stories and stores each accepted key in `.devworkwire-import.json`. |
| FR-001-06 | Distinguish definite and uncertain Jira failures. | A definite story rejection is reported and later stories may run; an uncertain outcome stops and requires manual resolution before retry. |

Direct `create-epic` and `create-story` are separate immediate-write commands.
For an AI agent, user task approval follows
[ADR-011](../04-decisions/adr-011-cli-first-agent-integration.md).

## Future work

Updating matched Jira issues, Jira-side drift detection, and a stored-plan
commit gate require new design and are not current importer behavior.
