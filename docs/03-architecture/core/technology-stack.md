---
sidebar_position: 3
---

# Technology Stack

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Overview

Component-level technology choices with rationale. The `ADR` column links each choice to its
record in [04-decisions](../../04-decisions/README.md); all are currently **Proposed**.

## Technology Stack Matrix

| Component | Technology | Description / Rationale | ADR |
| --------- | ---------- | ----------------------- | --- |
| Language / runtime | Python 3.11+ | Floor chosen for stdlib `tomllib`, modern typing, and `ExceptionGroup`, while staying installable on every current OS and Homebrew Python. Below 3.11 costs stdlib features; above it narrows reach for no MVP benefit. | ADR-002 |
| Package layout | `src/` layout, one package `devworkwire` | Prevents accidentally testing against the working tree instead of the installed package — the failure mode that would let a broken `pip install` reach PyPI despite green tests ([NFR-009-01](../../01-requirements/f-009-packaging-distribution.md)). | ADR-002 |
| CLI framework | Typer | Type-hint-driven commands, generated `--help`, and a console-script entry point that gives `dwire` for free ([FR-009-01](../../01-requirements/f-009-packaging-distribution.md)). `presentation/cli` hosts the Typer app and the shared rendering conventions; each slice contributes its own commands from `features/*/presentation`, registered at the composition root. | ADR-002 |
| Interactive prompts | InquirerPy | Supplies the guided menu and the yes/no confirm prompt for [F-003](../../01-requirements/f-003-cli-dwire-flow.md). The prompt is presentation only — the gate it triggers lives in `WorkItemService`. | ADR-002 |
| Terminal rendering | Rich (via Typer) | Tables and wrapping for preview output readable at 80 columns ([NFR-003-01](../../01-requirements/f-003-cli-dwire-flow.md)). Must not signal state by color alone — [NFR-X06](../../01-requirements/README.md#cross-cutting-quality-baseline) requires text prefixes on errors and warnings. | ADR-002 |
| MCP server | Official `mcp` Python SDK, **stdio transport only** | The reference protocol implementation, so [F-004](../../01-requirements/f-004-mcp-tool-surface.md) works with any MCP-compatible harness with no per-harness work — the "own MCP server, any harness" differentiator. stdio means the harness spawns it as a subprocess: no listening port, no inbound auth surface. Phase 1. | ADR-004 |
| Tracker client | `httpx` against Jira Cloud REST API v3 | Direct REST keeps the adapter thin, fully mockable via `httpx`'s transport layer (supporting [NFR-X03](../../01-requirements/README.md#cross-cutting-quality-baseline)), and free of a wrapper library's model and release cadence. Leaves an async path open if a future MCP transport needs one. | ADR-003 |
| Domain modeling | Frozen `dataclasses` (stdlib) | The domain has **no third-party dependencies**. Invariants are explicit functions returning a *collected* list of item-identifying errors, which is what [FR-001-02](../../01-requirements/f-001-validate-preview-commit.md) requires — a schema library's fail-on-construction model would report the first bad field, not every problem in the document. | ADR-001 |
| Edge validation & schemas | Pydantic v2 — **edges only**: `infrastructure/` and any `presentation/` package, including a feature's own | Guards untrusted input at the boundary: YAML config shape ([FR-008-03](../../01-requirements/f-008-provider-auth-configuration.md)) and MCP tool arguments. Generates the [F-004](../../01-requirements/f-004-mcp-tool-surface.md) tool JSON schemas instead of hand-maintaining them — and since each slice owns its tool schemas, `features/*/presentation` is an edge and may import it. It must **not** appear in `core/domain`, `core/ports`, `core/service.py`, or any `features/*/application`, which stay dependency-free domain and use-case code. | ADR-002 |
| Configuration | YAML (`PyYAML`), per-project `.devworkwire.yaml` in the working directory | Non-secret settings only: Jira base URL and project key. Per-project placement makes one config = one Jira project ([FR-008-04](../../01-requirements/f-008-provider-auth-configuration.md)) the natural case, travels with the repo, and lets an agent working in a repo target the right project with no extra setup. | ADR-006 |
| Secrets | Environment variable, read at run time | The Jira API token is never written to the config file or any file DevWorkWire writes ([FR-008-02](../../01-requirements/f-008-provider-auth-configuration.md), [NFR-008-01](../../01-requirements/f-008-provider-auth-configuration.md)). It exists only in process memory and is redacted from all log output. | ADR-006 |
| Local state store | SQLite via stdlib `sqlite3` — `.devworkwire/state.db`, mode `0600`, gitignored | Persists the dedup index, drift baselines, preview handles, and idempotency records ([F-002](../../01-requirements/f-002-dedup-on-rerun.md), [FR-004-04](../../01-requirements/f-004-mcp-tool-surface.md)). Chosen for atomic transactions: a crash partway through a commit must not leave a half-written index, because the record of what was already written is what makes the [FR-001-06](../../01-requirements/f-001-validate-preview-commit.md) fail-fast retry resumable. Stdlib, so no dependency, no server, no daemon. **A rebuildable cache, not a source of truth** — the authoritative item↔issue link is the reference field on the Jira issue ([FR-002-01](../../01-requirements/f-002-dedup-on-rerun.md)), so deleting the file loses only drift history and can never cause duplicate issues. One store per configured project, beside `.devworkwire.yaml`. See [Database Design](../database/database-design.md). | ADR-005 |
| Build backend | Hatchling | PyPA-maintained, minimal configuration, first-class `src/` layout and version handling. Correct default for a pure-Python package with no compiled extensions, and unremarkable to downstream packagers including a Homebrew formula. | ADR-007 |
| Distribution | PyPI (`devworkwire`) → pipx recommended, pip supported; self-maintained Homebrew tap `alonsovndev/devworkwire` | Per [F-009](../../01-requirements/f-009-packaging-distribution.md). pipx is recommended because an isolated environment is the right default for a CLI. Homebrew core and standalone binaries stay deferred per [Out of Scope](../../00-context/out-of-scope.md). | ADR-007 |
| Versioning & changelog | Semantic Versioning + Keep a Changelog | [FR-009-04](../../01-requirements/f-009-packaging-distribution.md). SemVer is what makes `pipx upgrade` a safe habit for users; the changelog is the only release-notes channel a CLI has. | ADR-007 |
| Lint & format | Ruff | Single fast tool for both, replacing the flake8/isort/black stack. Matches the existing repository conventions. | ADR-008 |
| Type checking | mypy (strict on `core/` and `features/`) | Strictness where correctness matters most: the domain and use cases. Adapters may relax it where third-party stubs are weak. | ADR-008 |
| Testing | pytest + pytest-cov | Enforces the ≥80% line coverage on `WorkItemService` and provider adapters required by [NFR-X03](../../01-requirements/README.md#cross-cutting-quality-baseline). In-memory fakes for both ports keep core tests network-free. | ADR-008 |
| Logging | stdlib `logging`, **stderr only** | stdout is the MCP protocol channel — writing logs there would corrupt the JSON-RPC stream. Token and `Authorization` header values are redacted at every verbosity level. | ADR-008 |
| CI/CD | GitHub Actions | Required for the OIDC identity behind PyPI Trusted Publishing — switching runners would forfeit it and reintroduce a stored PyPI token. Dependabot, CodeQL, and secret scanning are native. Free for public repos. See [CI/CD Pipeline](../ops/ci-cd-pipeline.md). | ADR-008 |

There is no frontend, no backend service, no ORM, no object storage, no hosted
infrastructure, and no telemetry platform. The interfaces are a terminal CLI and an MCP
tool surface; the only persistence is the local SQLite store above, reached with raw SQL
behind the `StateStore` port.

## Key Integration Patterns

### Front Doors ↔ Core

Presentation comes in two parts. `presentation/cli` and `presentation/mcp` are **hosts**:
they own the Typer app, the MCP server, and the shared rendering and envelope conventions,
but define no commands or tools themselves. Each slice's actual commands and tool schemas
live in its own `features/*/presentation`, registered into both hosts by the composition
root.

Every part of presentation — host or slice — depends on `WorkItemService` and nothing else:
never on `infrastructure/`, never on another slice, never on a port. It renders, prompts,
and marshals; it holds no business rules, which is what keeps the CLI and MCP behavior
identical as required by
[FR-004-01](../../01-requirements/f-004-mcp-tool-surface.md).

The two differ only in how confirmation is expressed: the CLI blocks on an InquirerPy
yes/no prompt, while `import.commit` takes an explicit confirmation argument plus a
reference to the preview it is confirming. Both resolve to the same gate call. Ungated
write paths do not exist to be called
([FR-004-03](../../01-requirements/f-004-mcp-tool-surface.md)).

### Core ↔ Jira

`WorkItemService` and every feature slice depend only on the `WorkItemProvider` port.
`infrastructure/external/jira` is the sole module that imports `httpx` or knows Jira's
vocabulary; it maps Jira issue types, fields, and status categories to domain types at the
boundary, so no Jira concept crosses inward.

- **Authentication:** `Authorization: Basic` with the user's email and API token, the
  token sourced from the environment on each run.
- **Failure translation:** 401, 403, 404, and 429 become typed domain errors carrying an
  actionable message (which field, which issue, which permission) — not raw HTTP output.
- **Retry:** exponential backoff on 429 and 5xx only, honoring `Retry-After`. Writes are
  retried only where the provider call is idempotent; a retry must never turn one intended
  create into two issues.
- **Ordering:** commits write Epics before their Stories so parent links always resolve.

### Configuration and Secrets

Configuration is validated **before any Jira-touching command or tool call runs**
([FR-008-03](../../01-requirements/f-008-provider-auth-configuration.md)), so a missing
base URL, project key, or token fails immediately with a message naming the missing field
rather than surfacing as a confusing 401 several steps later. The token is read from the
environment at that point and never persisted. Documentation should steer users toward a
git-ignored `.env` file or a shell-profile export, per the risk noted in
[F-008](../../01-requirements/f-008-provider-auth-configuration.md).

### Observability

There is no hosted telemetry, no error-tracking SaaS, and no phone-home — inappropriate
for a local open-source tool holding a user's tracker credentials, and unnecessary when
the user is present for every operation. Diagnosability is local: structured logs to
stderr at a user-controlled verbosity, with mandatory redaction of the token and
`Authorization` header. See [Monitoring and Observability](../ops/monitoring-observability.md).

## Scalability & Performance Strategy

The shape of the load, and why `NFR-X04`/`NFR-X05` remain `TBD`, are described once in
[Scalability Considerations](./architecture-solution-design.md#scalability-considerations).
What follows is only what the **stack choices** contribute:

- **A single reused `httpx.Client` per run.** There is no pooling concern at this scale,
  but reusing one client avoids paying a TLS handshake on every call in a batch — the only
  local optimization that matters while Jira round-trips dominate wall-clock time.
- **Preview results are reused, not re-fetched.** Items already read for drift detection
  are carried into the commit step within the same run.
- **No stack change is held in reserve.** Neither of the two changes a much larger working
  set would force needs a different library or runtime — `httpx` already offers an async
  path, and a streaming parse is ordinary Python. That they also imply no *architectural*
  change is argued in
  [Scalability Alignment](./architecture-styles.md#scalability-alignment). Concurrency does
  conflict with the fail-fast guarantee in
  [FR-001-06](../../01-requirements/f-001-validate-preview-commit.md), so it must not be
  added without revisiting that requirement.

## Source References

- [Architecture Solution Design](./architecture-solution-design.md)
- [Architecture Styles](./architecture-styles.md)
- [ADR Decision Log](../../04-decisions/README.md)
- [Feature Requirements](../../01-requirements/README.md)
- [Database Design](../database/database-design.md)
- [CI/CD Pipeline](../ops/ci-cd-pipeline.md)

---

**Last Updated**: 2026-09-03
