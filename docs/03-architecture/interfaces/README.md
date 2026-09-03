# Interfaces and Contracts

## Overview

The contracts DevWorkWire publishes and consumes.

## Documents

| Document                                        | Description                                                                                                                                   |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [Interface Standards](./interface-standards.md) | Interface inventory, MCP tool conventions, the confirm gate as contract rules, versioning, error taxonomy, CLI conventions, Jira client rules |
| [Interface Contract](./interface-contract.md)   | MCP tool catalog and detailed contracts, CLI command catalog, shared schemas, error catalog, consumed Jira endpoints                          |

## The Two Write Tools

Everything in this domain exists to protect one rule: **exactly two MCP tools write to
Jira** — `import.commit` and `progress.commit` — and both require a handle from their
matching `*.preview` call plus explicit `confirmed: true`. No other tool writes, and no
argument on any tool enables a write
([FR-004-03](../../01-requirements/f-004-mcp-tool-surface.md)). The CLI reaches the same
gate through an interactive prompt rather than an argument, because both front doors are
thin adapters over one `WorkItemService`
([FR-004-01](../../01-requirements/f-004-mcp-tool-surface.md)).

## Related ADRs

The decisions recorded here are captured as:

- [ADR-004](../../04-decisions/adr-004-mcp-stdio-confirm-gate.md) — MCP server on the official Python SDK, stdio transport only; preview-handle binding, TTL, and idempotency semantics.
- [ADR-003](../../04-decisions/adr-003-jira-rest-httpx.md) — Jira access via direct REST v3 over `httpx`.

See the full [ADR Decision Log](../../04-decisions/README.md).

## Requirements Coverage

| Requirement                                                               | Contract element                                                       |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [FR-003-01](../../01-requirements/f-003-cli-dwire-flow.md)                | `dwire import <file>`                                                  |
| [FR-003-04/05](../../01-requirements/f-003-cli-dwire-flow.md)             | `dwire search`, `dwire insert`                                         |
| [FR-004-01](../../01-requirements/f-004-mcp-tool-surface.md)              | `import.preview` and the CLI preview step share one `WorkItemService`  |
| [FR-004-02/03](../../01-requirements/f-004-mcp-tool-surface.md)           | `preview_handle` + `confirmed` required on every `*.commit`            |
| [FR-004-04](../../01-requirements/f-004-mcp-tool-surface.md)              | `idempotency_key` with stored-result replay                            |
| [FR-005-01…04](../../01-requirements/f-005-work-item-crud.md)             | `workitem.get`; single-item CRUD via `import.preview`'s inline form    |
| [FR-006-01…03](../../01-requirements/f-006-mcp-work-context-query.md)     | `workitem.query`                                                       |
| [FR-007-01…04](../../01-requirements/f-007-progress-reporting.md)         | `progress.preview` / `progress.commit`                                 |
| [FR-008-03](../../01-requirements/f-008-provider-auth-configuration.md)   | `CONFIG_*` errors precede any Jira-touching call; `dwire config check` |
| [NFR-004-01](../../01-requirements/f-004-mcp-tool-surface.md)             | `result_type` on every result                                          |
| [NFR-X06](../../01-requirements/README.md#cross-cutting-quality-baseline) | Text-prefixed CLI errors, exit-code table                              |
