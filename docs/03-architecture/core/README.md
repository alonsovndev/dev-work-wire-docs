# Core Architecture

## Overview

Core architecture documents define the system shape: the solution design, the architecture style, and the technology stack.

## Documents

| Document                                                          | Description                                                |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| [Architecture Solution Design](./architecture-solution-design.md) | System context, components, data flow, and trade-offs      |
| [Architecture Styles](./architecture-styles.md)                   | Style evaluation, bounded contexts, and evolution strategy |
| [Technology Stack](./technology-stack.md)                         | Component-level technology choices                         |

## Selected Architecture

**Hexagonal (Ports & Adapters), organized as vertical feature slices over a shared kernel,
shipped as one distributable Python package.**

Two rules carry most of the design's weight:

1. **`WorkItemService` and the confirm gate live in the shared kernel, never in a slice.**
   Both front doors — the `dwire` CLI and the MCP server — are thin adapters over it, which
   is what [FR-004-01](../../01-requirements/f-004-mcp-tool-surface.md) means by "no
   divergent logic path".
2. **Nothing but `infrastructure/external/jira` knows Jira exists.** That is what makes the
   Phase 2 Linear and Azure DevOps adapters additive rather than a rewrite.

## Related ADRs

The decisions recorded in these documents are captured as:

- [ADR-001](../../04-decisions/adr-001-hexagonal-vertical-slices.md) — Hexagonal architecture with vertical feature slices
- [ADR-002](../../04-decisions/adr-002-python-runtime-cli-platforms.md) — Python 3.11+ runtime, Typer CLI, supported platforms
- [ADR-003](../../04-decisions/adr-003-jira-rest-httpx.md) — Jira access via direct REST v3 over `httpx`
- [ADR-004](../../04-decisions/adr-004-mcp-stdio-confirm-gate.md) — MCP server on stdio with a preview-handle confirm gate

- [ADR Decision Log](../../04-decisions/README.md)
