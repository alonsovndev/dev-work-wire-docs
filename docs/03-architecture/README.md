# Architecture Overview

## How to Use

- Sections below are in **reading order**: each one depends only on what precedes it. The sidebar follows the same order.
- Every section links to a document that contains the authoritative decision or design for that concern.
- Every significant decision must link to at least one ADR — see the [ADR Decision Log](../04-decisions/README.md), and start from the [ADR Template](../04-decisions/adr-template.md) for new ones. §7 tracks the proposed set.
- Keep this README as the single navigation entry point for the architecture folder.
- Add new sections only when a domain concern is not yet covered.

> **New here?** Read §1 for the system's shape, then §2 to watch it work end to end. Sections 3–6 are the detail behind those flows.

---

## 1. Core Architecture

Files in `core/`:

- **[Core Overview](./core/README.md)**: The selected architecture in brief, and the two rules that carry most of the design's weight.
- **[Architecture Solution Design](./core/architecture-solution-design.md)**: System context, selected pattern, component design, data flow, and high-level trade-offs.
- **[Architecture Styles](./core/architecture-styles.md)**: Architecture style evaluation, bounded context map, and evolution strategy.
- **[Technology Stack](./core/technology-stack.md)**: Component-level technology choices with rationale and trade-offs.

## 2. Diagrams

Files in `diagrams/`:

- **[Diagrams Overview](./diagrams/README.md)**: Diagram inventory across the whole architecture folder, and the Mermaid conventions used.

- **[Sequence Diagrams](./diagrams/sequence-diagrams.md)**: Ten key interaction flows — pre-flight, import, dedup and drift, MCP preview/commit, idempotent retry, fail-fast, rejected commits, query, progress, state rebuild.

Placed early as orientation: seeing the flows first makes the contract and schema detail in §3–§4 far easier to absorb. Each flow's "Key details" note points forward to where a term is defined.

## 3. Interfaces and Contracts

Files in `interfaces/`:

- **[Interfaces Overview](./interfaces/README.md)**: What the three real contracts are, and the two-write-tool rule the domain exists to protect.
- **[Interface Design Standards](./interfaces/interface-standards.md)**: Interface inventory, MCP tool conventions, the confirm gate as contract rules, versioning, error taxonomy, CLI conventions, and Jira client rules.
- **[Interface Contract](./interfaces/interface-contract.md)**: MCP tool catalog and detailed contracts, CLI command catalog, shared schemas, error catalog, and consumed Jira endpoints.

> Read the standards before the contract — the contract uses the conventions, error codes, and gate rules the standards define.

## 4. Database

Files in `database/`:

- **[Database Overview](./database/README.md)**: Scope of the local state store, requirements coverage, and adapted best-practice checklists.
- **[Database Design](./database/database-design.md)**: Entities, relationships, ERD, constraints, access patterns, migration, and data governance.

> Follows §3 deliberately: the `preview` table exists to serve the API's preview-handle binding, so the schema only makes sense once that contract is understood.

## 5. Security

Files in `security/`:

- **[Security Overview](./security/README.md)**: The three threats that shape the design, and the P1 mitigations that must ship with the MVP.
- **[Security Architecture](./security/security-architecture.md)**: Trust boundaries, the confirm gate as a security control, outbound authentication, data protection, OWASP mapping, secrets, and supply chain.
- **[Threat Model](./security/threat-model.md)**: STRIDE-based threat enumeration, risk matrix, and P1/P2/P3 mitigation plan.

## 6. Deployment and Operations

Files in `ops/`:

- **[Operations Overview](./ops/README.md)**: The release-irreversibility constraint that shapes this domain, and the key decisions at a glance.
- **[Deployment Architecture](./ops/deployment-architecture.md)**: Distribution model and channels, supported platforms, version adoption and rollback, data durability, and environment strategy.
- **[CI/CD Pipeline](./ops/ci-cd-pipeline.md)**: Branching and PR conventions, pipeline stages, test matrix, security-critical tests, the publish flow, hotfixes, and state-store migration.
- **[Monitoring and Observability](./ops/monitoring-observability.md)**: Local logging and `run_id` correlation, failure surfacing, and why there is no telemetry.

---

## 7. Architecture Domain → Requirements Coverage

This matrix confirms every Must-priority requirement is addressed by at least one architecture domain. Update whenever ADRs or requirements change.

| Architecture Domain       | Must FR(s) Covered                                                   | Must NFR(s) Covered                                     | Key ADR(s)                |
| ------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------- |
| Core Architecture         | FR-001-01…06, FR-003-01…03, FR-004-01, FR-005-01…04                  | NFR-001-01, NFR-005-01, NFR-X03                         | ADR-001, ADR-002          |
| Interfaces and Contracts  | FR-003-01…05, FR-004-01…04, FR-005-01…04, FR-006-01…03, FR-007-01…04 | NFR-003-01, NFR-004-01, NFR-006-01, NFR-007-01, NFR-X06 | ADR-003, ADR-004          |
| Database                  | FR-002-01…04, FR-004-04, FR-001-05, FR-001-06                        | NFR-002-01, NFR-008-01, NFR-X02 (partial)               | ADR-005                   |
| Security                  | FR-001-04, FR-004-02, FR-004-03, FR-007-04, FR-008-01…04             | NFR-008-01, NFR-X01, NFR-X02 (partial)                  | ADR-004, ADR-006, ADR-008 |
| Deployment and Operations | FR-009-01…04                                                         | NFR-009-01, NFR-X01, NFR-X03, NFR-X06                   | ADR-002, ADR-007, ADR-008 |

> **Rule:** Any Must FR or NFR with no domain coverage is an architecture gap — create an ADR before phase sign-off.

### Open Gaps

| Item                                                                                                                                                                                                      | Status                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **All ten ADRs are `Proposed`, not `Accepted`.** They are written and linked, but nothing is implemented yet                                                                                              | Promote each to Accepted as its Phase 0 / MVP implementation confirms it — see the [Decision Log](../04-decisions/README.md) |
| **`NFR-X02` (privacy) is only partially covered.** The permanent index stores no content, but `preview.plan_json` holds issue content transiently under a TTL — a genuine tension with the NFR as written | Product Owner decision required — see [Database Design](./database/database-design.md#risks-and-open-questions) |
| **`NFR-X04` (performance) and `NFR-X05` (scalability) remain `Draft` with `TBD` targets**                                                                                                                 | Not an architecture gap — no deployment or design constraint depends on them. Revisit when targets are set      |
| **`NFR-X07` (delivery feasibility) remains `Draft`**                                                                                                                                                      | Planning concern, not architecture                                                                              |
| Live Jira verification is a manual pre-release step, not covered by CI                                                                                                                                    | Known coverage gap — see [CI/CD Pipeline](./ops/ci-cd-pipeline.md#9-environment-strategy)                       |

### Decision Records

Every decision recorded across this section is captured in
[04-decisions](../04-decisions/README.md). All ten are currently **Proposed**.

| ADR                                                                             | Decision                                                                                        | Primary source                                               |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [ADR-001](../04-decisions/adr-001-hexagonal-vertical-slices.md)                  | Hexagonal architecture with vertical feature slices, single distributable package               | [Architecture Styles](./core/architecture-styles.md)         |
| [ADR-002](../04-decisions/adr-002-python-runtime-cli-platforms.md)               | Python 3.11+ floor; Typer + InquirerPy CLI; Pydantic at the edges only; Linux + macOS support   | [Technology Stack](./core/technology-stack.md)               |
| [ADR-003](../04-decisions/adr-003-jira-rest-httpx.md)                            | Jira access via direct REST v3 over `httpx`                                                     | [Technology Stack](./core/technology-stack.md)               |
| [ADR-004](../04-decisions/adr-004-mcp-stdio-confirm-gate.md)                     | MCP server on stdio only; preview-handle binding, TTL, and idempotency                          | [Interface Design Standards](./interfaces/interface-standards.md)        |
| [ADR-005](../04-decisions/adr-005-local-sqlite-state-store.md)                   | Local SQLite state store as a rebuildable cache; schema and retention policy                    | [Database Design](./database/database-design.md)             |
| [ADR-006](../04-decisions/adr-006-config-and-secrets.md)                         | Per-project YAML config; environment-variable secret with no `.env` auto-loading                | [Security Architecture](./security/security-architecture.md) |
| [ADR-007](../04-decisions/adr-007-packaging-and-release.md)                      | Hatchling build backend; PyPI/pipx/Homebrew distribution; Trusted Publishing with attestations  | [Deployment Architecture](./ops/deployment-architecture.md)  |
| [ADR-008](../04-decisions/adr-008-quality-toolchain-github-actions.md)           | Quality and security toolchain on GitHub Actions: Ruff, mypy, pytest, `pip-audit`, CodeQL, architecture guard | [CI/CD Pipeline](./ops/ci-cd-pipeline.md)      |
| [ADR-009](../04-decisions/adr-009-no-telemetry.md)                               | No telemetry — local diagnosability only                                                        | [Monitoring and Observability](./ops/monitoring-observability.md) |
| [ADR-010](../04-decisions/adr-010-git-workflow-branch-strategy.md)               | Two-branch fork-based workflow with CI as the merge gate                                        | [CI/CD Pipeline](./ops/ci-cd-pipeline.md)                    |
