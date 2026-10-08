# ADR-011: CLI-First AI Agent Integration

- **Status**: Accepted
- **Date**: 2026-09-30
- **Supersedes**: [ADR-004](./adr-004-mcp-stdio-confirm-gate.md)

## Context

DevWorkWire already ships direct `dwire` commands for fetching, listing,
creating, previewing, and importing Jira work. The proposed MCP server has no
implementation. Terminal-capable coding agents can invoke the installed CLI,
as they do other developer tools, without a second integration surface.

The original MCP design required a per-write preview handle and confirmation.
The product decision now treats the user's approved agent task as authorization
for its writes. The CLI cannot inspect that conversation or verify its scope.

## Decision

Use `dwire` as the single executable interface for people, scripts, and
terminal-capable AI agents. Ship a portable `SKILL.md` that teaches agents the
supported commands and write boundaries. Add machine-readable JSON results to
direct commands; keep human-readable output as the default.

An agent may write only within the user's approved task. The skill describes
that rule, while the calling agent's permission system controls shell access.
Direct `create-epic` and `create-story` commands write immediately.
`import-folder` previews and validates locally, then prompts in an interactive
terminal or requires the explicit `--yes` flag in a non-interactive run. No
preview handle or cross-process confirmation service is part of this decision.

Defer MCP until a concrete client cannot run local commands or requires native
tool discovery. Any later MCP adapter must reuse CLI/application behavior and
receive its own interface and security review.

## Alternatives considered

1. **Continue building MCP now.** This adds a server, tool contracts, client
   setup, and state handling before a client need is demonstrated.
2. **Use CLI output without a structured format.** Human-readable panels are
   useful in terminals but brittle for an agent to parse.

## Consequences

- The same installed command is available to humans and agents with shell
  access; a skill supplies workflow guidance rather than new Jira capabilities.
- User task approval is a rule for the agent, not a guarantee enforced by
  `dwire`. Documentation must not claim a server-side per-write gate.
- Current import state prevents repeat creation only when its local resume file
  is present. The current importer skips changed uploaded items; it does not
  update them in Jira.
- [ADR-005](./adr-005-local-sqlite-state-store.md)'s proposed SQLite preview
  store is not required for this integration and is deferred separately.
