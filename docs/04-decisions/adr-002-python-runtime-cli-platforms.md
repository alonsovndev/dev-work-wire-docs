# ADR-002: Python 3.11+ Runtime, Typer CLI, and Supported Platforms

- **Status**: Proposed
- **Date**: 2026-09-02

## Context

DevWorkWire ships as a pipx-installed CLI plus an MCP server
([F-009](../01-requirements/f-009-packaging-distribution.md)). Because the "production
environment" is whatever Python a user already has, the runtime floor is a distribution
decision as much as a technical one — too high narrows reach, too low costs stdlib features
and forces compatibility shims.

Two related choices ride along: what renders the terminal experience for
[F-003](../01-requirements/f-003-cli-dwire-flow.md), and where validation libraries are
allowed to reach. The second matters because
[FR-001-02](../01-requirements/f-001-validate-preview-commit.md) requires validation to
report **every** structural problem in one pass, each identifying its item — a
collect-then-report model that fights a schema library's fail-on-construction behavior.

Supported platforms are a support commitment, not a configuration detail: each added OS is
CI jobs plus a class of bugs owned by a single part-time maintainer.

## Decision

- **Python 3.11 minimum.** Gives stdlib `tomllib`, modern typing, and `ExceptionGroup`
  while remaining installable on every current OS and Homebrew Python.
- **`src/` layout**, single `devworkwire` package — prevents tests passing against the
  working tree while the installed package is broken.
- **Typer** for commands (type-hint-driven, gives the `dwire` console script), **InquirerPy**
  for the guided menu and yes/no confirm prompt, **Rich** for preview tables.
- **Frozen `dataclasses` in the domain — no third-party dependencies.** Invariants are
  explicit functions returning a *collected* list of item-identifying errors.
- **Pydantic v2 confined to the edges** — `infrastructure/` and any `presentation/` package,
  including each slice's own `features/*/presentation` — guarding untrusted input (YAML
  config, MCP tool arguments) and generating the MCP tool JSON schemas. It must not be
  imported by `core/` or by any `features/*/application`
  ([ADR-001](./adr-001-hexagonal-vertical-slices.md)).
- **Linux and macOS supported; Windows explicitly not supported.** CI runs a six-job matrix
  (both OSes × Python 3.11 / 3.12 / 3.13).

## Consequences

### Positive

- The domain layer has zero third-party dependencies, so business rules are testable without
  framework setup and cannot be reshaped by a library upgrade.
- Collected, item-identifying validation errors are achievable, satisfying
  [FR-001-02](../01-requirements/f-001-validate-preview-commit.md) directly.
- Pydantic still earns its place where it is genuinely good: untrusted-input shape checking
  and free JSON-schema generation for the MCP tool surface.
- Testing the 3.11 floor and the current release catches accidental use of a newer-only
  feature before it ships.
- Stating the Windows gap turns a stream of bug reports into a known limitation.

### Negative

- Users on Python 3.10 or older must upgrade — unavoidable for any floor above the oldest
  living version.
- Windows users are turned away. WSL is the practical answer and should be documented, but
  it is neither tested nor promised.
- Two model representations exist at the boundary, so edge DTOs must be mapped to domain
  types. This mapping is the cost of keeping the domain framework-free.
- The boundary is a convention, not a language guarantee. *Mitigation:* the CI architecture
  guard asserts `core/` and `features/` never import Pydantic.
- Six CI jobs per PR is real minutes of maintainer time on every change.

## Alternatives Considered

1. **Python 3.12+ floor**
   - Considered for the newest typing syntax and performance.
   - Rejected: narrows the install base on distros still shipping 3.11 for no MVP benefit.
2. **Python 3.10+ floor**
   - Considered for the widest reach, including older LTS distros.
   - Rejected: no stdlib `tomllib` and weaker typing ergonomics, for reach that pipx users
     largely do not need.
3. **Pydantic everywhere, domain included**
   - Considered for one model type across all layers and less mapping code.
   - Rejected: couples the domain to a framework, and its fail-on-construction error model
     makes the collected, item-identifying reporting in `FR-001-02` materially harder.
4. **Standard library only, no Pydantic at all**
   - Considered to keep the dependency set minimal.
   - Rejected: config error messages and the F-004 tool JSON schemas become hand-written
     code to own and keep in sync, for little gain.
5. **Add Windows support**
   - Considered because many developers using Copilot and Claude Code are on Windows.
   - Rejected for now: path handling, the absence of a `0600` equivalent for the config and
     state store, and terminal rendering all diverge — too much surface for one part-time
     maintainer. Revisit on real demand.
