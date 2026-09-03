# Architectural Decisions

This folder contains the Architectural Decision Records (ADRs) for DevWorkWire. An ADR
captures a significant architectural decision, the context that led to it, and the
consequences.

## Decision Log

> One row per ADR. Use sequential IDs (`ADR-001`, `ADR-002`, …) and file names
> `adr-XXX-short-slug.md`. Statuses follow the lifecycle:
> `Proposed → Accepted → (Superseded by ADR-xxx | Deprecated)`.

| ADR ID  | Title                                                                 | Status   |
| ------- | --------------------------------------------------------------------- | -------- |
| [ADR-001](./adr-001-hexagonal-vertical-slices.md) | Hexagonal Architecture with Vertical Feature Slices | Proposed |
| [ADR-002](./adr-002-python-runtime-cli-platforms.md) | Python 3.11+ Runtime, Typer CLI, and Supported Platforms | Proposed |
| [ADR-003](./adr-003-jira-rest-httpx.md) | Jira Access via Direct REST v3 over httpx | Proposed |
| [ADR-004](./adr-004-mcp-stdio-confirm-gate.md) | MCP Server on stdio with a Preview-Handle Confirm Gate | Proposed |
| [ADR-005](./adr-005-local-sqlite-state-store.md) | Local SQLite State Store as a Rebuildable Cache | Proposed |
| [ADR-006](./adr-006-config-and-secrets.md) | Per-Project YAML Config with an Environment-Variable Secret | Proposed |
| [ADR-007](./adr-007-packaging-and-release.md) | Hatchling Packaging with PyPI/pipx/Homebrew Distribution and Trusted Publishing | Proposed |
| [ADR-008](./adr-008-quality-toolchain-github-actions.md) | Quality and Security Toolchain on GitHub Actions | Proposed |
| [ADR-009](./adr-009-no-telemetry.md) | No Telemetry — Local Diagnosability Only | Proposed |
| [ADR-010](./adr-010-git-workflow-branch-strategy.md) | Two-Branch Fork-Based Workflow with CI as the Merge Gate | Proposed |

All ten are **Proposed**: the decisions were made deliberately during the architecture pass,
but nothing is implemented yet and the architecture documents remain at `Draft`. Promote each
to **Accepted** as its Phase 0 / MVP implementation confirms it.

## Recommended Decision Areas

Not every project needs all of these, but significant choices in these areas should each get
an ADR. Use as a checklist during Phase 0 / early MVP:

- [x] High-level architecture pattern (monolith, modular monolith, microservices) — [ADR-001](./adr-001-hexagonal-vertical-slices.md)
- [x] Backend framework and language — [ADR-002](./adr-002-python-runtime-cli-platforms.md)
- [ ] Frontend framework and language — **not applicable**, no browser UI
- [x] Database choice — [ADR-005](./adr-005-local-sqlite-state-store.md)
- [x] Authentication and authorization strategy — [ADR-006](./adr-006-config-and-secrets.md) (outbound credentials), [ADR-004](./adr-004-mcp-stdio-confirm-gate.md) (the confirm gate)
- [x] Deployment platform — [ADR-007](./adr-007-packaging-and-release.md) (distribution, not hosting)
- [ ] ORM / data access choice — **not applicable**, stdlib `sqlite3` with no ORM ([ADR-005](./adr-005-local-sqlite-state-store.md))
- [x] Build tooling — [ADR-007](./adr-007-packaging-and-release.md)
- [x] Monitoring and observability — [ADR-009](./adr-009-no-telemetry.md)
- [x] Testing framework strategy — [ADR-008](./adr-008-quality-toolchain-github-actions.md)
- [x] Secrets management — [ADR-006](./adr-006-config-and-secrets.md)
- [ ] Containerization strategy — **not applicable**, no containers
- [ ] Infrastructure as Code strategy — **not applicable**, no infrastructure to provision
- [x] Environment strategy (local / CI / dev / staging / prod) — [ADR-007](./adr-007-packaging-and-release.md) (local, CI, TestPyPI, PyPI)
- [x] Code quality tooling (linters, formatters, type checkers) — [ADR-008](./adr-008-quality-toolchain-github-actions.md)
- [x] Git workflow and branch strategy — [ADR-010](./adr-010-git-workflow-branch-strategy.md)
- [x] Database migration strategy — [ADR-005](./adr-005-local-sqlite-state-store.md)

Every applicable area is covered. The four marked *not applicable* reflect that DevWorkWire
is a locally installed CLI and stdio MCP server with no browser UI, no server database, no
containers, and no infrastructure — see
[Deployment Architecture](../03-architecture/ops/deployment-architecture.md).

## Open Items Inside Accepted Decisions

These are decisions recorded as made, with a specific value or tension still unresolved.
They are tracked here so they are not lost inside the ADR bodies.

| Item | ADR | Needs |
| ---- | --- | ------ |
| **`preview.plan_json` stores issue content on disk for its TTL**, in tension with [NFR-X02](../01-requirements/README.md#cross-cutting-quality-baseline) as written | [ADR-005](./adr-005-local-sqlite-state-store.md) | **Product Owner decision:** amend `NFR-X02` to permit transient, TTL-bounded plan storage, or drop cross-process previews |
| Preview handle TTL of 30 minutes is unvalidated | [ADR-004](./adr-004-mcp-stdio-confirm-gate.md) | Revisit against real usage |
| `commit_run` retention of 30 days is unvalidated | [ADR-005](./adr-005-local-sqlite-state-store.md) | Revisit against real usage |
| Refusing `.env` auto-loading may cause MCP setup friction, since harnesses do not always pass shell environment through | [ADR-006](./adr-006-config-and-secrets.md) | Revisit if it becomes a common complaint |
| Raise branch protection to 1/2 approvals | [ADR-010](./adr-010-git-workflow-branch-strategy.md) | Trigger: a second maintainer joins |
| Mocked adapter tests cannot catch a Jira API contract change | [ADR-008](./adr-008-quality-toolchain-github-actions.md) | Manual live-Jira pass on the release checklist |

## Creating a New ADR

Use the [ADR Template](./adr-template.md) for all new decisions. Continue numbering from
`ADR-011`.

## Related Documents

- [Architecture Overview](../03-architecture/README.md)
- [Technology Stack](../03-architecture/core/technology-stack.md)
- [Feature Requirements](../01-requirements/README.md)

---

**Last Updated**: 2026-09-02
