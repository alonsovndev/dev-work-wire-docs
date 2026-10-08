---
sidebar_position: 1
---

# Role mapping

This map names responsibilities for the CLI-first direction. It does not imply
separate people or a committed delivery schedule. The earlier CLI/MCP RACI was
based on a deferred server design.

| Responsibility | Work |
|---|---|
| Product decisions | Choose scope, approval model, and priorities for future CLI features. |
| CLI engineering | Maintain direct commands, JSON results, local import recovery, and tests. |
| Jira integration | Maintain the provider adapter and configuration behavior. |
| Documentation and skill | Keep the CLI reference, design docs, and portable skill aligned with shipped commands. |

The current agent integration decision is
[ADR-011](../04-decisions/adr-011-cli-first-agent-integration.md). Ownership
for future work items and delivery dates is `TBD` in the
[phased roadmap](./phased-roadmap.md).
