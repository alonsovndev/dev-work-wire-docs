---
sidebar_position: 1
---

# Role Mapping

| Attribute   | Value          |
| ----------- | -------------- |
| **Project** | DevWorkWire    |
| **Version** | 0.1            |
| **Status**  | Review Pending |
| **Owner**   | Alonso VN      |

## Role Definitions

> List every role that participates in planning and delivery, with its primary focus.
> The roster below reflects DevWorkWire's actual shape — a CLI + MCP server with no
> GUI (see [NFR-X06](../01-requirements/README.md#cross-cutting-quality-baseline)) — not
> a generic web-app team.

| Role                          | Primary Planning Focus                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product Owner                 | Scope, prioritization, requirements validation, roadmap sequencing.                                                                                                 |
| Tech Lead                     | Architecture decisions (hexagonal `WorkItemProvider` port), ADRs, quality gates.                                                                                    |
| CLI/MCP Engineer              | `dwire` CLI flow, MCP server tool surface, shared `WorkItemService` core logic.                                                                                     |
| Provider Integration Engineer | Jira adapter (MVP), authentication/configuration ([F-008](../01-requirements/f-008-provider-auth-configuration.md)), future Linear/Azure DevOps adapters (Phase 2). |

> **Alonso VN performs all four roles solo** for this project — there is no separate
> team per role. This roster exists to keep planning docs unambiguous about which
> concern is being addressed, not to imply separate people.

## RACI (Optional)

> Alonso VN fills all four roles solo (see note above), so this matrix marks which
> **hat** is active per workstream, not a different person. Rows follow the phases
> in [Phased Roadmap](./phased-roadmap.md); the MVP phase is split in two since it
> has two distinct epic owners there.

| Workstream / Deliverable                                  | Product Owner | Tech Lead | CLI/MCP Engineer | Provider Integration Engineer |
| --------------------------------------------------------- | ------------- | --------- | ---------------- | ----------------------------- |
| Phase -1: Validation & Prototyping                        | A             | C         | R                | I                             |
| Phase 0: Foundation & Engineering Readiness               | A             | R         | C                | I                             |
| MVP: F-008 Provider Auth & Configuration                  | A             | C         | I                | R                             |
| MVP: F-001/F-002/F-003/F-009 (CLI flow, dedup, packaging) | A             | C         | R                | I                             |
| Phase 1: Enhancement (F-004–F-007, MCP surface)           | A             | C         | R                | I                             |
| Phase 2: Future (Linear/Azure DevOps adapters)            | A             | C         | I                | R                             |

## Source References

- [Project Overview](../00-context/overview.md)
- [Phased Roadmap](./phased-roadmap.md)

---

**Last Updated**: 2026-08-28
