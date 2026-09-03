# ADR-001: Hexagonal Architecture with Vertical Feature Slices

- **Status**: Proposed
- **Date**: 2026-09-02

## Context

DevWorkWire is a locally installed Python package with two front doors — the `dwire` CLI
([F-003](../01-requirements/f-003-cli-dwire-flow.md)) and an MCP server
([F-004](../01-requirements/f-004-mcp-tool-surface.md)) — writing to Jira through a single
core service.

Three constraints shape the choice:

1. **Phase 2 requires provider portability.** Linear and Azure DevOps adapters must be
   addable "with no changes to the core service, CLI, or MCP tool definitions"
   ([Overview → Technical Goals](../00-context/overview.md#technical-goals)).
2. **The two front doors must not diverge.**
   [FR-004-01](../01-requirements/f-004-mcp-tool-surface.md) requires `import.preview` and
   the CLI's preview step to produce equivalent results with "no divergent logic path" —
   the product's central claim is that agents get no looser path than humans.
3. **One part-time developer.** The single-developer bandwidth risk is the top entry in the
   [Phased Roadmap](../02-planning/phased-roadmap.md) risk table. Structure that costs
   navigation effort on every change is not affordable.

The conventional monolith / modular-monolith / microservices axis does not apply: there is
no hosted runtime, no network listener, and one user per process. The real question is how
the single deployable is internally structured — specifically, how strongly the tracker
integration is isolated.

## Decision

Adopt **Hexagonal (Ports & Adapters), organized as vertical feature slices over a shared
kernel, shipped as one distributable Python package.**

Two rules carry the design:

- **`WorkItemService` and the confirm gate live in the shared kernel — never in a slice.**
  Presentation adapters render prompts or marshal a `confirmed` argument; neither decides
  whether the gate applies.
- **Only `infrastructure/external/jira` knows Jira exists.** Two ports are defined:
  `WorkItemProvider` (tracker read/write) and `StateStore` (local index, drift baselines,
  idempotency). Jira types never cross inward.

**Slices are internally layered.** Each of `features/import_`, `features/workitem`, and
`features/progress` owns an `application/` (its use cases) and a `presentation/` (its Typer
commands and MCP tool schemas). `presentation/cli` and `presentation/mcp` remain as hosts,
owning the Typer app, the MCP server, and the shared rendering and envelope conventions that
[NFR-003-01](../01-requirements/f-003-cli-dwire-flow.md) and
[NFR-X06](../01-requirements/README.md#cross-cutting-quality-baseline) require; the
composition root registers each slice's fragments into them.

**What deliberately does not get sliced** — the domain model, the ports, the confirm gate,
and the provider adapter — for three reasons:

- There is **one work-item model**, not three: `import_` creates it, `workitem` updates it,
  `progress` comments on it. A per-slice `domain/` would duplicate it or sit hollow.
- There is **one tracker integration**, not three. Keeping Jira knowledge in
  `infrastructure/external/jira` is what makes the Phase 2 goal one new file per provider
  rather than three.
- There is **one confirm gate**. Putting a provider adapter inside a slice would move the
  ungated-write risk below closer to hand, not further away.

No slice's `application/` imports another slice; no `presentation/` package — host or
slice-owned — imports `infrastructure/`. A composition root wires concrete adapters.

Full evaluation: [Architecture Styles](../03-architecture/core/architecture-styles.md).

## Consequences

### Positive

- Phase 2 provider adapters become additive: implement `WorkItemProvider`, register it in
  the composition root, change nothing else.
- The confirm gate exists exactly once, so CLI and MCP cannot drift apart — the product's
  central claim is structurally protected rather than maintained by discipline.
- Core logic is testable with in-memory fakes for both ports, making the ≥80% coverage
  target in [NFR-X03](../01-requirements/README.md#cross-cutting-quality-baseline)
  reachable without network mocking.
- Feature slices line up with the feature docs, so a requirement change has an obvious home.
  With slices layered, a change to one feature's behavior *and* its command and tool surface
  stays inside that one directory.
- Zero operational footprint: one package, one process, no listener.

### Negative

- **Slicing makes an ungated write structurally possible.** A slice sits next to the
  provider port and could call it directly. *Mitigation:* the gate lives in the kernel,
  slice use cases are reachable only through `WorkItemService`, and a CI architecture guard
  asserts no slice performs an ungated provider write.
- **Shared-kernel gravity.** Anything "shared" drifts into `core/`. *Mitigation:* the kernel
  is limited to the domain model, the two ports, and the service/gate; anything else needs
  its own ADR.
- More indirection than a tool this size strictly needs — accepted as the price of the
  Phase 2 goal, paid once in the Phase 0 skeleton.
- **Presentation is split between hosts and slices**, so the CLI's command set is assembled
  at the composition root rather than read off one file. *Mitigation:* the hosts own the
  shared conventions, so "how output looks" and "what errors are prefixed with" still have
  exactly one home; only "which commands exist" is distributed.
- Cross-slice features have no natural home. *Mitigation:* promote genuinely shared behavior
  to the kernel rather than letting slices import each other.

## Alternatives Considered

1. **Layered hexagonal, no vertical slices**
   - Considered because layering makes a gate bypass more conspicuous and is immediately
     legible to a new contributor.
   - Rejected: feature code scatters across four layer directories, so a single change
     touches four distant folders — a real cost for a solo developer, against a guard we
     already get from centralizing the gate.
2. **Flat single-module CLI**
   - Considered as the fastest path to a working MVP with no structure to maintain.
   - Rejected: Jira calls scatter everywhere, making Phase 2 a rewrite; logic becomes
     inseparable from I/O, defeating the coverage NFR.
3. **Direct Jira calls with no provider port**
   - Considered as the least code for a Jira-only MVP.
   - Rejected: contradicts a stated technical goal, and makes the core untestable without
     network mocking.
4. **Separate CLI and MCP codebases**
   - Considered so each front door could be optimized independently.
   - Rejected: two confirm gates to keep honest is exactly the "looser agent path" the
     product exists to prevent.
5. **Local daemon with a thin client**
   - Considered for shared session state and a future remote MCP endpoint.
   - Rejected: a background process holding tracker credentials, plus a network surface, is
     large security and support cost for no MVP benefit.
