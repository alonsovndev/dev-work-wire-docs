---
sidebar_position: 2
---

# Phased Roadmap

| Attribute   | Value          |
| ----------- | -------------- |
| **Project** | DevWorkWire    |
| **Version** | 0.1            |
| **Status**  | Review Pending |
| **Owner**   | Alonso VN      |

## Table of Contents

- [Planning Principles](#planning-principles)
- [Phase Overview](#phase-overview)
- [Phase -1 (Validation \& Prototyping)](#phase--1-validation--prototyping)
  - [Goals](#goals)
  - [Prioritized Tasks](#prioritized-tasks)
  - [Key Deliverables](#key-deliverables)
  - [Acceptance Criteria](#acceptance-criteria)
  - [Dependencies and Blockers](#dependencies-and-blockers)
- [Phase 0 (Foundation \& Engineering Readiness)](#phase-0-foundation--engineering-readiness)
  - [Goals](#goals-1)
  - [Prioritized Tasks](#prioritized-tasks-1)
  - [Key Deliverables](#key-deliverables-1)
  - [Acceptance Criteria](#acceptance-criteria-1)
  - [Dependencies and Blockers](#dependencies-and-blockers-1)
- [MVP Phase](#mvp-phase)
  - [Goals](#goals-2)
  - [Prioritized Epics](#prioritized-epics)
  - [Key Deliverables](#key-deliverables-2)
  - [Acceptance Criteria](#acceptance-criteria-2)
  - [Prerequisites](#prerequisites)
- [Phase 1 (Enhancement)](#phase-1-enhancement)
  - [Goals](#goals-3)
  - [Prioritized Epics](#prioritized-epics-1)
  - [Key Deliverables](#key-deliverables-3)
  - [Acceptance Criteria](#acceptance-criteria-3)
- [Phase 2 (Future)](#phase-2-future)
  - [Goals](#goals-4)
- [Feature Traceability Matrix](#feature-traceability-matrix)
- [Risks and Blockers](#risks-and-blockers)
- [Source References](#source-references)

## Planning Principles

- Validate the `dwire` CLI flow and MCP tool surface design before scaling engineering effort — this is CLI/MCP tooling, not a GUI needing broad user testing.
- Foundation work (repo, CI/CD, environments, architecture skeleton) precedes feature work.
- Only **Must** priorities enter the MVP phase; **Should** items ([F-004](../01-requirements/f-004-mcp-tool-surface.md), [F-005](../01-requirements/f-005-work-item-crud.md), [F-006](../01-requirements/f-006-mcp-work-context-query.md), [F-007](../01-requirements/f-007-progress-reporting.md)) are deferred to Phase 1 consciously.
- Every phase has explicit acceptance criteria before the next phase starts.
- [F-008](../01-requirements/f-008-provider-auth-configuration.md) (Provider Authentication & Configuration) is a foundational dependency for every other feature and is sequenced first within the MVP phase.

## Phase Overview

> **Target Window** below is a rough, relative estimate (part-time/evenings-weekends
> pace, no fixed calendar start) — not a committed schedule. Revisit once
> `NFR-X07 Delivery Feasibility` moves off `TBD` in
> [Requirements](../01-requirements/README.md#cross-cutting-quality-baseline).

| Phase    | Name                               | Objective                                                                                                        | Status | Target Window | Execution Mode |
| -------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------ | ------------- | -------------- |
| Phase -1 | Validation & Prototyping           | Validate the `dwire` CLI flow and MCP tool surface design before engineering starts.                             | Draft  | Weeks 1–2      | Serial         |
| Phase 0  | Foundation & Engineering Readiness | Repo, CI/CD, dev environment, and architecture skeleton ready — scaffolding only, no feature work.               | Draft  | Weeks 3–5      | Serial         |
| MVP      | Validate → Preview → Commit (Jira) | Ship the Must-priority features: import validated Epic/Story/AC documents into Jira, safely, without duplicates. | Draft  | Weeks 6–15     | Serial         |
| Phase 1  | Enhancement                        | Ship the Should-priority features: MCP tool surface, individual CRUD, work-context query, progress reporting.    | Draft  | Weeks 16–21    | Serial         |
| Phase 2  | Future                             | Add Linear/Azure DevOps `WorkItemProvider` adapters; explore Homebrew core / standalone binary distribution.     | Draft  | Post-Week 21, TBD | Deferred    |

---

## Phase -1 (Validation & Prototyping)

### Goals

- Validate the `dwire` CLI's interactive flow ([F-001](../01-requirements/f-001-validate-preview-commit.md), [F-003](../01-requirements/f-003-cli-dwire-flow.md)) with a walkthrough before writing engineering code.
- Validate the MCP server's tool surface design ([F-004](../01-requirements/f-004-mcp-tool-surface.md)) so the CLI and MCP front doors share one coherent flow from the start.

### Prioritized Tasks

| Priority | Task                                                              | Owner            | Estimate | Deliverable             |
| -------- | ----------------------------------------------------------------- | ---------------- | -------- | ----------------------- |
| Must     | Draft `dwire` CLI flow walkthrough (validate → preview → confirm) | CLI/MCP Engineer | TBD      | CLI flow walkthrough    |
| Must     | Draft MCP tool surface sketch (tool names, inputs, confirm gate)  | CLI/MCP Engineer | TBD      | MCP tool surface sketch |

### Key Deliverables

- Approved prototype brief and design direction (see [05-prototype](../05-prototype/README.md)).
- CLI flow walkthrough and MCP tool surface sketch, reviewed against F-001/F-003/F-004.

### Acceptance Criteria

- [ ] CLI flow walkthrough reviewed and approved.
- [ ] MCP tool surface sketch reviewed and approved against F-004.

### Dependencies and Blockers

- **Blocks**: Phase 0 (engineering readiness work starts once the flow is validated).
- **Requires**: [Project Overview](../00-context/overview.md) and F-001/F-003/F-004 at Clarified status (met).
- **Can Run in Parallel With**: None — single-developer, serial execution.
- **Coordination Points**: None — solo effort (see [Role Mapping](./role-mapping.md)).

---

## Phase 0 (Foundation & Engineering Readiness)

### Goals

- Repository structure, CI/CD pipeline, and development environment ready.
- Hexagonal architecture skeleton in place: `WorkItemProvider` port stubbed, no adapter implementation yet.
- Package skeleton (`pyproject.toml`, `dwire` console script entry point) scaffolded, ahead of full [F-009](../01-requirements/f-009-packaging-distribution.md) delivery in MVP.

### Prioritized Tasks

| Priority | Task                                                                               | Owner     | Estimate | Deliverable                  |
| -------- | ---------------------------------------------------------------------------------- | --------- | -------- | ---------------------------- |
| Must     | Repo scaffold, CI pipeline (lint, type-check, test)                                | Tech Lead | TBD      | Green CI on empty scaffold   |
| Must     | `pyproject.toml` skeleton and `dwire` console script stub                          | Tech Lead | TBD      | `pip install -e .` works     |
| Must     | Hexagonal architecture skeleton (`WorkItemProvider` port, `WorkItemService` shell) | Tech Lead | TBD      | Architecture skeleton merged |

### Key Deliverables

- CI pipeline green on the empty scaffold.
- Package installable locally in editable mode.
- Architecture skeleton that F-001/F-002/F-008 can be built into without restructuring.

### Acceptance Criteria

- [ ] Repo builds, lints, and runs tests in CI.
- [ ] `pip install -e .` succeeds and the `dwire` command is available.
- [ ] `WorkItemProvider` port and `WorkItemService` shell exist with no feature logic yet.

### Dependencies and Blockers

- **Blocks**: MVP phase.
- **Requires**: Phase -1's validated CLI flow and MCP tool surface design.
- **Can Run in Parallel With**: None — single-developer, serial execution.
- **Coordination Points**: None — solo effort.

---

## MVP Phase

### Goals

- Ship the full validate → preview → commit flow against Jira, safe re-run behavior, provider authentication, and a distributable package.

### Prioritized Epics

> Epics are tracked in your work-item tracker once one is set up (see `/docs-work-items`). Epic IDs below are placeholders until they exist in a tracker.

| Priority | Epic   | Linked Feature(s)                                                | Linked Requirements | Owner                         |
| -------- | ------ | ---------------------------------------------------------------- | ------------------- | ----------------------------- |
| Must     | EPIC-1 | [F-008](../01-requirements/f-008-provider-auth-configuration.md) | See F-008           | Provider Integration Engineer |
| Must     | EPIC-2 | [F-001](../01-requirements/f-001-validate-preview-commit.md)     | See F-001           | CLI/MCP Engineer              |
| Must     | EPIC-3 | [F-002](../01-requirements/f-002-dedup-on-rerun.md)              | See F-002           | CLI/MCP Engineer              |
| Must     | EPIC-4 | [F-003](../01-requirements/f-003-cli-dwire-flow.md)              | See F-003           | CLI/MCP Engineer              |
| Must     | EPIC-5 | [F-009](../01-requirements/f-009-packaging-distribution.md)      | See F-009           | Tech Lead                     |

### Key Deliverables

- `dwire` CLI installable via PyPI/pipx, authenticates to a configured Jira project.
- Validate → preview → confirm flow imports an Epic/Story/AC document into Jira.
- Re-running an import updates matched issues in place instead of duplicating them.

### Acceptance Criteria

- [ ] See each linked feature's own acceptance criteria in [F-001](../01-requirements/f-001-validate-preview-commit.md), [F-002](../01-requirements/f-002-dedup-on-rerun.md), [F-003](../01-requirements/f-003-cli-dwire-flow.md), [F-008](../01-requirements/f-008-provider-auth-configuration.md), [F-009](../01-requirements/f-009-packaging-distribution.md).

### Prerequisites

- Phase 0 acceptance criteria met.

---

## Phase 1 (Enhancement)

### Goals

- Give an AI agent the same validate → preview → confirm gate as the CLI, via MCP, plus lighter-weight CRUD, work-context query, and progress-reporting capabilities.

### Prioritized Epics

| Priority | Epic   | Linked Feature(s)                                           | Linked Requirements | Owner            |
| -------- | ------ | ----------------------------------------------------------- | ------------------- | ---------------- |
| Should   | EPIC-6 | [F-004](../01-requirements/f-004-mcp-tool-surface.md)       | See F-004           | CLI/MCP Engineer |
| Should   | EPIC-7 | [F-005](../01-requirements/f-005-work-item-crud.md)         | See F-005           | CLI/MCP Engineer |
| Should   | EPIC-8 | [F-006](../01-requirements/f-006-mcp-work-context-query.md) | See F-006           | CLI/MCP Engineer |
| Should   | EPIC-9 | [F-007](../01-requirements/f-007-progress-reporting.md)     | See F-007           | CLI/MCP Engineer |

### Key Deliverables

- MCP server usable by an AI agent (Claude Code, OpenCode, Copilot, etc.), sharing the same confirm-before-execute gate as the CLI.
- Individual Epic/Story CRUD without a full document re-import.
- Work-context query and progress reporting (comments, transitions, PR references) through the confirm gate.

### Acceptance Criteria

- [ ] See each linked feature's own acceptance criteria in [F-004](../01-requirements/f-004-mcp-tool-surface.md), [F-005](../01-requirements/f-005-work-item-crud.md), [F-006](../01-requirements/f-006-mcp-work-context-query.md), [F-007](../01-requirements/f-007-progress-reporting.md).

---

## Phase 2 (Future)

### Goals

- Add Linear and Azure DevOps `WorkItemProvider` adapters on top of the port established in MVP — no changes to the core service, CLI, or MCP tool definitions required.
- Explore broader distribution: Homebrew core and standalone binaries, deferred until there's real traction (see [Project Overview](../00-context/overview.md#business-goals)).

---

## Feature Traceability Matrix

| Feature ID | Feature Name                            | Phase   | Priority | Linked Epic(s) | Linked Stories | Status |
| ---------- | --------------------------------------- | ------- | -------- | -------------- | -------------- | ------ |
| F-001      | Validate → Preview → Commit             | MVP     | Must     | EPIC-2         | TBD            | Draft  |
| F-002      | Dedup on Re-Run                         | MVP     | Must     | EPIC-3         | TBD            | Draft  |
| F-003      | CLI (dwire) Interactive Flow            | MVP     | Must     | EPIC-4         | TBD            | Draft  |
| F-004      | MCP Server Tool Surface                 | Phase 1 | Should   | EPIC-6         | TBD            | Draft  |
| F-005      | Individual Work Item CRUD               | Phase 1 | Should   | EPIC-7         | TBD            | Draft  |
| F-006      | MCP Work-Context Query                  | Phase 1 | Should   | EPIC-8         | TBD            | Draft  |
| F-007      | Progress Reporting                      | Phase 1 | Should   | EPIC-9         | TBD            | Draft  |
| F-008      | Provider Authentication & Configuration | MVP     | Must     | EPIC-1         | TBD            | Draft  |
| F-009      | Packaging & Distribution                | MVP     | Must     | EPIC-5         | TBD            | Draft  |

## Risks and Blockers

| Risk                                                                                                     | Phase Impacted | Probability | Impact | Mitigation                                                                               | Owner         |
| -------------------------------------------------------------------------------------------------------- | -------------- | ----------- | ------ | ---------------------------------------------------------------------------------------- | ------------- |
| Single-developer bandwidth — every phase depends on one person; unavailability delays the whole roadmap. | All phases     | Medium      | High   | Keep MVP scope strictly to Must-priority features; defer all Should features to Phase 1. | Product Owner |

## Source References

- [Project Overview](../00-context/overview.md)
- [Project Requirements](../01-requirements/README.md)
- [User Personas](../00-context/user-personas.md)

---

**Last Updated**: 2026-08-28
