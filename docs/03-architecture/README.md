# Architecture

DevWorkWire currently publishes one local CLI. Developers and terminal-capable
agents use the same commands; agents may load a portable skill for workflow
guidance. [ADR-011](../04-decisions/adr-011-cli-first-agent-integration.md)
is the active interface decision.

## Current architecture

- [Architecture solution design](./core/architecture-solution-design.md) — current components and data flow.
- [Interface contract](./interfaces/interface-contract.md) — direct commands and JSON results.
- [Sequence diagrams](./diagrams/sequence-diagrams.md) — current read and import flows.
- [Deployment architecture](./ops/deployment-architecture.md) — local package and skill.
- [Security architecture](./security/security-architecture.md) — agent task approval, credentials, and recovery.

Other pages in this section contain earlier planning material. Where they
mention an MCP server, SQLite preview handles, Jira-side drift resolution, or
a per-write server confirmation gate, treat those parts as historical proposals
until revised. Current behavior is described by the pages above and the
application repository's CLI reference.
