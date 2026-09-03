---
sidebar_position: 1
---

# Architecture Solution Design

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Table of Contents

- [System Context](#system-context)
- [Architectural Approach](#architectural-approach)
- [Component Design](#component-design)
- [Data Flow](#data-flow)
- [Integration Points](#integration-points)
- [Observability](#observability)
- [Deployment Impact](#deployment-impact)
- [Security Considerations](#security-considerations)
- [Scalability Considerations](#scalability-considerations)
- [Trade-offs and Alternatives](#trade-offs-and-alternatives)
- [ADR Reference](#adr-reference)
- [Source References](#source-references)

## System Context

DevWorkWire is a **locally installed Python package**, not a hosted service. It runs
entirely on the user's machine and holds no server, no network listener, and no
multi-user state. Its boundary contains the parsing, validation, preview, dedup, and
confirm-gate logic; everything durable about the work items themselves lives in the
external tracker.

Two front doors reach that boundary, and both go through the same core service:

- **`dwire` CLI** — driven directly by the developer ([F-003](../../01-requirements/f-003-cli-dwire-flow.md)).
- **MCP server** — driven by the developer's AI agent through any MCP-compatible harness
  ([F-004](../../01-requirements/f-004-mcp-tool-surface.md)), launched as a local
  subprocess over stdio.

```mermaid
flowchart LR
  Maya["Maya<br/>solo/small-team developer"] --> CLI["dwire CLI"]
  Idris["Idris<br/>developer directing an agent"] --> Harness["MCP harness<br/>(Claude Code, OpenCode, Copilot)"]
  Harness -->|stdio| MCP["DevWorkWire MCP server"]

  CLI --> DWW["DevWorkWire<br/>validate, preview, dedup, confirm gate"]
  MCP --> DWW

  Doc[/"Source Markdown<br/>Epic / Story / AC"/] --> DWW
  DWW <--> Cfg[("Local config + state<br/>~/.devworkwire")]
  DWW -->|REST over HTTPS| Jira["Jira Cloud<br/>REST API v3"]
```

**Out of the boundary:** interpreting free-form text into structure, and creating pull
requests — both excluded per [Out of Scope for MVP](../../00-context/out-of-scope.md).
DevWorkWire only *records* a PR reference supplied to it
([FR-007-03](../../01-requirements/f-007-progress-reporting.md)).

## Architectural Approach

**Hexagonal (Ports & Adapters), organized as vertical feature slices over a shared
kernel, shipped as one distributable Python package.**

Hexagonal is not a stylistic preference here — it is what makes the stated Phase 2 goal
achievable: adding Linear and Azure DevOps adapters behind the existing
`WorkItemProvider` port with no change to the core service, the CLI, or the MCP tool
definitions ([Overview → Technical Goals](../../00-context/overview.md#technical-goals)).

The full style evaluation lives in [Architecture Styles](./architecture-styles.md).

### Key Design Principles

- **One core service, two front doors.** `WorkItemService` and the confirm gate live in
  the shared kernel, never inside a feature slice — even though each slice owns its own
  presentation layer. Every command and every tool reaches the service; none reaches a
  port. That is what [FR-004-01](../../01-requirements/f-004-mcp-tool-surface.md) means by
  "no divergent logic path".
- **The domain never imports an adapter.** Dependencies point inward: feature presentation
  → shared kernel service → feature application → ports. Jira types never cross the port
  boundary; the adapter maps them to domain types at the edge.
- **Slices are layered; the kernel is not sliced.** A feature owns its use cases and its
  front-door fragments. It does *not* own a domain model or a provider adapter — those stay
  shared, so there is one work-item model and one module that knows Jira exists. See
  [Where the conventional layers live](./architecture-styles.md#where-the-conventional-layers-live).
- **Externally-visible writes are gated, structurally.** The confirm gate is a property
  of the core service, not of a caller. There is no parameter, tool, or flag that skips
  it ([FR-004-03](../../01-requirements/f-004-mcp-tool-surface.md)).
- **Read is free, write is gated.** The Trust Tier split from the
  [Glossary](../../00-context/glossary.md#technical-terms) is enforced in one place:
  read-only operations (search, query, fetch) run autonomously; comment, transition, and
  commit do not.
- **Preview is a pure computation.** Generating a preview performs zero writes
  ([NFR-001-01](../../01-requirements/f-001-validate-preview-commit.md)), which is what
  makes it safe for an agent to call freely.

## Component Design

Feature slices own their own entities, use cases, DTOs, and provider mapping. What they
do **not** own is the confirm gate — that stays in the shared kernel so both front doors
and every slice inherit the same behavior.

```mermaid
flowchart TB
  subgraph hosts["presentation/ — front-door hosts"]
    CLI["cli — Typer app,<br/>Rich rendering, 80-col"]
    MCPS["mcp — MCP server<br/>(stdio, Phase 1)"]
  end

  subgraph features["features/ — internally layered slices"]
    subgraph imp["import_"]
      IMPP["presentation — commands,<br/>tool schemas"]
      IMPA["application — parse, validate,<br/>preview, dedup, commit"]
    end
    subgraph wi["workitem"]
      WIP["presentation"]
      WIA["application — read/create/<br/>update, query"]
    end
    subgraph prog["progress"]
      PROGP["presentation"]
      PROGA["application — comment,<br/>transition, PR reference"]
    end
  end

  subgraph kernel["core/ — shared kernel"]
    SVC["service.py — WorkItemService<br/>+ confirm gate + Trust Tier"]
    DOM["domain — WorkItem, Epic,<br/>Story, AC, value objects"]
    PORTS["ports — WorkItemProvider,<br/>StateStore"]
  end

  subgraph infra["infrastructure/"]
    JIRA["external/jira —<br/>JiraWorkItemProvider (httpx)"]
    LOCAL["local — state store,<br/>config loader"]
  end

  COMP["composition/container.py"]

  CLI -.hosts.-> IMPP
  CLI -.hosts.-> WIP
  CLI -.hosts.-> PROGP
  MCPS -.hosts.-> IMPP
  MCPS -.hosts.-> WIP
  MCPS -.hosts.-> PROGP

  IMPP --> SVC
  WIP --> SVC
  PROGP --> SVC
  SVC --> IMPA
  SVC --> WIA
  SVC --> PROGA
  IMPA --> DOM
  WIA --> DOM
  PROGA --> DOM
  IMPA --> PORTS
  WIA --> PORTS
  PROGA --> PORTS
  JIRA -.implements.-> PORTS
  LOCAL -.implements.-> PORTS
  COMP -.wires.-> JIRA
  COMP -.wires.-> LOCAL
  COMP -.wires.-> SVC
```

Every write path runs `feature presentation → WorkItemService → feature application →
port`. A feature's presentation layer holds its commands and tool schemas but reaches the
core service exactly as the hosts once did; it never touches a port or an adapter directly.

| Component | Responsibility | Key interfaces |
| --------- | -------------- | -------------- |
| `presentation/cli` | Hosts the Typer app and owns the shared rendering conventions: 80-column preview output ([NFR-003-01](../../01-requirements/f-003-cli-dwire-flow.md)) and text-prefixed errors ([NFR-X06](../../01-requirements/README.md#cross-cutting-quality-baseline)). Registers each feature's commands; defines none of its own. | Typer app object; InquirerPy confirm prompt |
| `presentation/mcp` | Hosts the stdio MCP server and owns the shared result envelope, including `result_type` on every result. Registers each feature's tools; defines none of its own. | MCP server object |
| `core/service.py` | `WorkItemService` — the single entry point both front doors use. Classifies each operation by Trust Tier and enforces the confirm gate before dispatching to a slice's use case. | Called by feature presentation; calls feature application |
| `core/domain` | Provider-neutral work-item model and invariants. One model shared by all three slices. No Jira vocabulary, no I/O. | Pure types |
| `core/ports` | `WorkItemProvider` (tracker read/write) and `StateStore` (local import references, drift baselines, idempotency keys). | Protocols implemented by `infrastructure/` |
| `features/import_/application` | Markdown parsing, structural validation, preview construction, dedup matching and drift detection, fail-fast batch commit. Covers [F-001](../../01-requirements/f-001-validate-preview-commit.md) and [F-002](../../01-requirements/f-002-dedup-on-rerun.md). | Use cases invoked by `WorkItemService` |
| `features/import_/presentation` | This slice's `dwire import` command and its `import.preview` / `import.commit` tool schemas. Holds no business rules. | Registered into both hosts |
| `features/workitem/application` | Single-item create/read/update without a full re-import, plus status/assignee-filtered queries. Covers [F-005](../../01-requirements/f-005-work-item-crud.md) and [F-006](../../01-requirements/f-006-mcp-work-context-query.md). | Use cases invoked by `WorkItemService` |
| `features/workitem/presentation` | This slice's `dwire search` / `dwire insert` commands and its `workitem.*` tool schemas. | Registered into both hosts |
| `features/progress/application` | Comments, status transitions, and PR-reference writes. Covers [F-007](../../01-requirements/f-007-progress-reporting.md). | Use cases invoked by `WorkItemService` |
| `features/progress/presentation` | This slice's progress commands and its `progress.*` tool schemas. | Registered into both hosts |
| `infrastructure/external/jira` | The only module that knows Jira exists: REST v3 calls over `httpx`, field mapping, retry/backoff, error translation. | Implements `WorkItemProvider` |
| `infrastructure/local` | Config loading and validation ([F-008](../../01-requirements/f-008-provider-auth-configuration.md)), and the local state store. | Implements `StateStore` |
| `composition/container.py` | The composition root. The only place concrete adapters are constructed and injected. | Wires everything for both entry points |

## Data Flow

The primary flow is the validate → preview → confirm → commit import
([F-001](../../01-requirements/f-001-validate-preview-commit.md)). It is identical from
either front door; only the confirmation mechanism differs (a terminal yes/no prompt vs.
an explicit confirmation argument on `import.commit`).

1. **Load and parse.** The source Markdown is read from disk and parsed into the domain
   structure — H1 Epic, H2 Story, bullet-list Acceptance Criteria.
2. **Validate.** Structural checks run on the parsed tree: required fields, parent/child
   resolution, orphan detection, declared-count matching. Failure halts here with
   item-identifying errors and no preview.
3. **Match and classify.** For each item, the state store is consulted for a stored
   import-source reference. Matched items are read back from Jira and compared against
   the baseline recorded at last import to detect drift
   ([FR-002-03](../../01-requirements/f-002-dedup-on-rerun.md)). Each item is classified
   `create`, `update`, or `update (drifted)`.
4. **Preview.** The classification is rendered. **Zero writes have occurred** — reads
   only.
5. **Confirm.** The gate. Drifted items each carry an explicit overwrite-or-skip choice
   ([FR-002-04](../../01-requirements/f-002-dedup-on-rerun.md)). Declining produces zero
   writes.
6. **Commit.** Approved items are written through `WorkItemProvider` in order, Epics
   before their Stories. On a write failure the batch stops immediately (fail-fast): items
   already written stay written, and the result separates committed, failed, and untried
   items ([FR-001-06](../../01-requirements/f-001-validate-preview-commit.md)).
7. **Record.** For each successful write, the import-source reference and the new drift
   baseline are persisted, so the next run matches instead of duplicating.

Because step 7 runs per item rather than per batch, a fail-fast stop in step 6 leaves a
consistent, resumable state: re-running the same document matches the already-committed
items and retries only the remainder.

Detailed step-by-step interactions are drawn in
[Sequence Diagrams](../diagrams/sequence-diagrams.md).

## Integration Points

| Integration | Type | Direction | Notes |
| ----------- | ---- | --------- | ----- |
| Jira Cloud REST API v3 | REST/HTTPS | Outbound | Authenticated with the user's own API token via `Authorization: Basic` (email + token), read from an environment variable ([FR-008-02](../../01-requirements/f-008-provider-auth-configuration.md)). Expect 401 (bad token), 403 (project permissions), 404 (issue/project), and 429 (rate limit) as normal failures needing actionable messages, not stack traces. |
| MCP harness | JSON-RPC over stdio | Inbound | The harness spawns the server as a local subprocess. No network listener, no port, no inbound auth surface. Phase 1. |
| Local filesystem — source document | File read | Inbound | User-supplied Markdown path. Read-only; DevWorkWire never rewrites the source. |
| Local filesystem — config and state | File read/write | Bidirectional | YAML config (non-secret) plus the local state store. Never contains the API token. |

## Observability

DevWorkWire runs on a user's machine, so observability means **local diagnosability**,
not a hosted telemetry pipeline. There is no metrics backend, no error-tracking SaaS, and
no phone-home — anything else would be inappropriate for a local open-source developer
tool handling a user's tracker credentials.

- **Error surfacing:** failures are reported to the user at the point of use with the
  offending item identified. Jira API errors are translated into actionable messages
  (which field, which issue, which permission) rather than raw HTTP dumps.
- **Structured logging:** logs go to stderr so they never corrupt MCP's stdio protocol
  channel on stdout. A verbosity flag raises detail for troubleshooting.
- **Redaction is mandatory:** the API token and `Authorization` header value are never
  logged at any verbosity ([NFR-008-01](../../01-requirements/f-008-provider-auth-configuration.md),
  [NFR-X01](../../01-requirements/README.md#cross-cutting-quality-baseline)).
- **Key signals:** validation failure counts by reason, commit outcome per item, drift
  detections, and Jira 429/5xx retry counts — all surfaced to the user, not exported.

Details and the release-health approach are in
[Monitoring and Observability](../ops/monitoring-observability.md).

## Deployment Impact

- **One deployable unit.** A single `devworkwire` package installed with pipx/pip or a
  Homebrew tap ([F-009](../../01-requirements/f-009-packaging-distribution.md)). No
  containers, no servers, no infrastructure to provision, no environments to keep in sync.
- **The user's machine is the deployment target.** "Rollback" means installing a previous
  version; "the production environment" is whatever Python the user has, which is why the
  3.11 floor and a clean-install check per release
  ([NFR-009-01](../../01-requirements/f-009-packaging-distribution.md)) matter more than
  they would for a hosted service.
- **The MCP server is not separately deployed.** It ships in the same package and is
  spawned by the harness, so it has no independent release cadence.
- **Local state has no migration infrastructure.** Any schema evolution in the state store
  must be handled in-process on startup — there is no operator to run a migration tool.
  See [Database Design](../database/database-design.md).

## Security Considerations

The security properties this design must preserve, in full detail in
[Security Architecture](../security/security-architecture.md) and
[Threat Model](../security/threat-model.md):

- **The confirm gate is a security control, not a UX affordance.** It is the single
  mechanism preventing an AI agent from making unreviewed, externally-visible changes to a
  real backlog. It belongs in the core service precisely so no front door can route around
  it.
- **The token never touches disk.** It is read from the environment at run time and lives
  only in process memory ([NFR-008-01](../../01-requirements/f-008-provider-auth-configuration.md)).
- **DevWorkWire has exactly the permissions the user's own token has.** There is no
  service account and no privilege of its own, which bounds the blast radius of any
  compromise to what that user could already do in Jira.
- **The source document is untrusted input.** It may come from an agent. Parsing and
  validation must fail safely on malformed or hostile input rather than producing partial
  writes.
- **No inbound network surface.** stdio-only MCP means no listening port to attack.

## Scalability Considerations

The scalability and performance NFRs
([NFR-X04](../../01-requirements/README.md#cross-cutting-quality-baseline),
`NFR-X05`) are still **Draft** with `TBD` targets, so this section states the shape of the
load rather than committing to numbers.

- **Load is single-user and interactive.** One person or one agent, one document at a
  time. There is no concurrency model to design and no shared-resource contention.
- **The real bound is Jira's API, not DevWorkWire.** A commit is N sequential REST calls
  for N items; a 5-epic / 20-story document is ~25 calls. Wall-clock time is dominated by
  Jira round-trips and its rate limits, which is where retry-with-backoff matters and
  where any future optimization (batching, concurrency) would have to go.
- **Bounded by design scope.** One configuration targets exactly one Jira project
  ([FR-008-04](../../01-requirements/f-008-provider-auth-configuration.md)), which caps
  the working set at what a single project holds.
- **What would need to change at much larger scale:** streaming the parse rather than
  holding the whole document in memory, and bounded-concurrency commits with per-item
  rather than fail-fast error handling. Neither is warranted until `NFR-X04`/`NFR-X05` have
  real targets.

## Trade-offs and Alternatives

**Selected:** hexagonal + vertical feature slices in one package. Four alternatives were
weighed and rejected — strict layering without slices, direct Jira calls with no port,
separate CLI and MCP codebases, and a local daemon with a thin client.

- The criterion-by-criterion comparison is in
  [Architecture Style Evaluation](./architecture-styles.md#architecture-style-evaluation).
- The reason each alternative was rejected is recorded in
  [ADR-001 § Alternatives Considered](../../04-decisions/adr-001-hexagonal-vertical-slices.md#alternatives-considered).

**The accepted risk this design must actively contain:** vertical slicing makes it
structurally *possible* for a future slice to call `WorkItemProvider` directly and skip the
gate, which would break [FR-004-01](../../01-requirements/f-004-mcp-tool-surface.md). The
mitigation is why `WorkItemService` and the confirm gate sit in the shared kernel above,
and why the CI architecture guard asserts that nothing under `presentation/` imports
`infrastructure/` and that no slice calls a write method on `WorkItemProvider` outside a
gated use case. See [Quality Gates](../ops/ci-cd-pipeline.md).

## ADR Reference

The design on this page rests directly on
**[ADR-001](../../04-decisions/adr-001-hexagonal-vertical-slices.md)** (hexagonal with
vertical feature slices, single package), which is the authoritative record of the decision,
its consequences, and the alternatives rejected. Two further decisions shape structures
described above: **[ADR-004](../../04-decisions/adr-004-mcp-stdio-confirm-gate.md)** for the
stdio MCP transport and preview-handle gate, and
**[ADR-005](../../04-decisions/adr-005-local-sqlite-state-store.md)** for the `StateStore`
implementation behind step 7 of the data flow.

The full index of all ten ADRs — with the primary source document for each — is the
[Decision Records table](../README.md#decision-records) in the architecture README. All ten
are currently **Proposed**; promote each to Accepted as its Phase 0 / MVP implementation
confirms it.

## Source References

- [Architecture Styles](./architecture-styles.md)
- [Technology Stack](./technology-stack.md)
- [Feature Requirements](../../01-requirements/README.md)
- [Project Overview](../../00-context/overview.md)
- [Glossary](../../00-context/glossary.md)
- [Phased Roadmap](../../02-planning/phased-roadmap.md)

---

**Last Updated**: 2026-09-03
