# Deployment and Operations

## Overview

How DevWorkWire is built, verified, published, and diagnosed.

> **Scope note.** DevWorkWire is **distributed, not deployed** — a Python package installed
> by users onto their own machines. There is no cloud platform, no compute, no hosted
> database, no infrastructure to provision, and no runtime telemetry. The conventional ops
> concerns (platform selection, scaling, HA/failover, IaC, dashboards, alert routing,
> on-call) do not apply and are marked Not Applicable rather than filled with
> plausible-sounding fiction. The concerns that replace them are **channels, supported
> platforms, release irreversibility, and local diagnosability**.

## Documents

| Document | Description |
| -------- | ----------- |
| [deployment-architecture.md](./deployment-architecture.md) | Distribution model and channels, supported platforms, version adoption and rollback, data durability, environment strategy |
| [ci-cd-pipeline.md](./ci-cd-pipeline.md) | Branching and PR conventions, GitHub Actions pipeline stages, the test matrix, security-critical tests, the publish flow, hotfixes, state-store migration |
| [monitoring-observability.md](./monitoring-observability.md) | Local logging and `run_id` correlation, failure surfacing, why there is no telemetry, privacy in observability |

## The Constraint That Shapes This Domain

**A published release cannot be recalled.** Yanking a version blocks new installs; every
already-installed copy keeps running, on a machine holding a live Jira token. There is no
control plane, no rollout, no canary, and — by deliberate choice — no telemetry to detect a
bad release.

Three consequences run through all three documents:

1. **Verification is front-loaded.** The publish pipeline gates PyPI behind a TestPyPI
   clean-install smoke test, which is what actually enforces
   [NFR-009-01](../../01-requirements/f-009-packaging-distribution.md) rather than hoping
   for it.
2. **Supply-chain controls are weighted heavily.** Trusted Publishing (no long-lived token
   to steal) plus PEP 740 attestations — see
   [Security Architecture](../security/security-architecture.md#supply-chain-security).
3. **Detection depends on users reporting.** So `run_id` correlation, an accurate version
   string, redacted-by-default output, and easy-to-find issue reporting are the monitoring
   strategy, not a substitute for one.

## Key Decisions

| Decision | Value |
| -------- | ----- |
| CI/CD | GitHub Actions — required for the OIDC identity behind Trusted Publishing |
| Test matrix | Linux + macOS × Python 3.11 / 3.12 / 3.13 (6 jobs) |
| Windows | **Not supported**, stated explicitly rather than left ambiguous |
| Branch protection | PRs required, force pushes blocked, **CI must pass**; 0 approvals while single-maintainer, rising to 1/2 when a second joins |
| Release trigger | Tag `vX.Y.Z` on `main` → TestPyPI → clean-install smoke test → PyPI → Homebrew tap |
| Versioning | Manual SemVer bump and hand-written changelog, **verified by CI** ([FR-009-04](../../01-requirements/f-009-packaging-distribution.md)) |
| Telemetry | **None**, and none planned |

## Related ADRs

- [ADR-007](../../04-decisions/adr-007-packaging-and-release.md) — build backend, distribution, and release integrity
- [ADR-008](../../04-decisions/adr-008-quality-toolchain-github-actions.md) — CI platform, quality gates, and security tests
- [ADR-009](../../04-decisions/adr-009-no-telemetry.md) — no telemetry; local diagnosability only
- [ADR-010](../../04-decisions/adr-010-git-workflow-branch-strategy.md) — two-branch fork-based workflow, CI as the merge gate
- [ADR-002](../../04-decisions/adr-002-python-runtime-cli-platforms.md) — Python floor and supported platforms

## Requirements Coverage

| Requirement | Where addressed |
| ----------- | --------------- |
| [FR-009-01](../../01-requirements/f-009-packaging-distribution.md) | PyPI publish pipeline; `dwire` console script verified by the smoke test |
| [FR-009-02](../../01-requirements/f-009-packaging-distribution.md) | pipx documented as the recommended channel |
| [FR-009-03](../../01-requirements/f-009-packaging-distribution.md) | Homebrew tap updated from the publish pipeline with a pinned sdist hash |
| [FR-009-04](../../01-requirements/f-009-packaging-distribution.md) | SemVer rules tied to the tool/CLI surface; CI fails the release without a matching version and changelog entry |
| [NFR-009-01](../../01-requirements/f-009-packaging-distribution.md) | TestPyPI clean-install smoke test gates the PyPI publish |
| [NFR-X01](../../01-requirements/README.md#cross-cutting-quality-baseline) | `pip-audit` blocking on Critical/High; CodeQL; Dependabot; Trusted Publishing |
| [NFR-X03](../../01-requirements/README.md#cross-cutting-quality-baseline) | Coverage gate (≥80% on `WorkItemService` and provider adapters) enforced in CI |
| [NFR-X06](../../01-requirements/README.md#cross-cutting-quality-baseline) | Text-prefixed errors and warnings; verified by review and non-TTY output checks |
| [NFR-X04](../../01-requirements/README.md#cross-cutting-quality-baseline) / `NFR-X05` | **Still `TBD`.** No deployment-side constraint exists; targets remain unset in requirements |
