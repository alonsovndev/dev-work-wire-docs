---
sidebar_position: 4
---

# Out of Scope for MVP

> **Design status:** This page includes earlier planning assumptions. The [current CLI contract](../03-architecture/interfaces/interface-contract.md) and [ADR-011](../04-decisions/adr-011-cli-first-agent-integration.md) govern the CLI-first agent integration; MCP, SQLite preview handles, and server-side confirmation described below are not shipped.

| Attribute   | Value             |
| ----------- | ----------------- |
| **Project** | DevWorkWire       |
| **Version** | 0.1               |
| **Status**  | Clarified         |
| **Owner**   | Product Owner     |

## Purpose

This document explicitly lists features, capabilities, and enhancements that are **intentionally excluded** from the MVP scope. These may be considered for future releases.

> For each excluded item, record the rationale and a traceability reference (feature ID or `—`). If a stakeholder later asks "why isn't X in the MVP?", the answer should be findable here.

---

## Deferred Features

### Input Interpretation

| Item                                                              | Rationale                                                                                                                                    | Traceability |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Interpreting/refining free-form or ambiguous text into structure | That responsibility belongs to whoever prepares the input (a person or an upstream agent), not DevWorkWire. It only validates and loads structure that already arrives complete. | [—] |

### Git & Source Control Automation

| Item                                                        | Rationale                                                                          | Traceability |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------ |
| Git/GitHub automation (branching, committing, PR creation)     | Left to the developer's existing coding-agent skills/tooling — not DevWorkWire's job. | [—]          |

### Additional Providers (Phase 3)

| Item                  | Rationale                                                                                                    | Traceability |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- | ------------ |
| Linear adapter          | Jira ships first (Phase 1) to prove the `WorkItemProvider` port depth before broadening to other providers.   | [—]          |
| Azure DevOps adapter    | Same as above — deferred to Phase 3, added behind the same port with no core/CLI/MCP changes expected.        | [—]          |

### Governance (Phase 4, only if demand emerges)

| Item                                                | Rationale                                                                                     | Traceability |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------ |
| Audit trail of agent-driven writes                     | Not part of the open-source core roadmap unless clearly needed — avoids building governance speculatively. | [—]          |
| Policy layer (who/what can bypass the confirm gate)    | Same as above — deferred until real team demand for this exists.                              | [—]          |

---

## Revisit Criteria

These out-of-scope items may be reconsidered when:

- MVP has validated the core value proposition with real users
- User feedback indicates strong demand for specific capabilities
- Technical debt from MVP has been addressed
- Team capacity allows for expansion beyond core workflows

---

**Last Updated**: 2026-08-28
