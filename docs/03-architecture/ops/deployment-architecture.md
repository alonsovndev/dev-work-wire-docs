---
sidebar_position: 1
---

# Deployment architecture

DevWorkWire is a local Python package exposing the `dwire` console script.
There is no deployed service, listener, or MCP server. An AI agent invokes the
same installed command from a local shell. See
[ADR-011](../../04-decisions/adr-011-cli-first-agent-integration.md).

## Distribution model

The application repository declares a Python 3.12+ package and a `dwire`
console entry point. Installation and release channel details must be checked
against the current [packaging requirement](../../01-requirements/f-009-packaging-distribution.md)
and [proposed ADR-007](../../04-decisions/adr-007-packaging-and-release.md);
this page does not claim PyPI or Homebrew publication has occurred.

The portable skill ships as `skills/devworkwire/SKILL.md` in the application
repository. Users place it in their agent's supported skills directory and
ensure the agent's shell can find the installed `dwire` command. The skill has
no separate Jira credentials or runtime.

## Runtime environment

Each invocation runs on the user's machine with access to the configured Jira
project and, for folder imports, the Markdown and local resume file. Direct
commands may return one JSON result on stdout with `--format json`; logs go to
stderr. A CLI upgrade changes the behavior seen by both people and agents.

## Data durability and recovery

`.devworkwire-import.json` beside the source Markdown stores the Jira
connection identity, created issue keys, and source hashes. It must be kept
with the folder for safe re-runs. If Jira's response to a write is uncertain,
inspect Jira before resolving the pending local attempt. There is no SQLite
preview store in the current CLI.

## Future deployment questions

A future MCP server would need its own client requirement, security review,
and distribution design. It is not part of the current package interface.
