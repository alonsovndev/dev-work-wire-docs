# ADR-008: Quality and Security Toolchain on GitHub Actions

- **Status**: Proposed
- **Date**: 2026-09-02

## Context

Three requirements set hard verification targets:
[NFR-X03](../01-requirements/README.md#cross-cutting-quality-baseline) requires ≥80% line
coverage on `WorkItemService` and provider adapters;
[NFR-X01](../01-requirements/README.md#cross-cutting-quality-baseline) requires dependency
scanning in CI with no unresolved Critical/High findings;
[NFR-X06](../01-requirements/README.md#cross-cutting-quality-baseline) requires CLI errors
to be text-prefixed rather than signalled by colour alone.

Two project-specific pressures go further. First, the confirm gate is the product's core
safety property, and **the most likely way it is lost is a well-intentioned refactor, not an
attack** (R-002 in the [Threat Model](../03-architecture/security/threat-model.md)) — so it
needs mechanical protection, not review vigilance. Second, the architecture in
[ADR-001](./adr-001-hexagonal-vertical-slices.md) depends on boundaries (no slice performing
an ungated write, `presentation/` never importing `infrastructure/`, Pydantic never reaching
the domain) that are conventions unless something checks them.

The CI platform choice is not free either: [ADR-007](./adr-007-packaging-and-release.md)
depends on PyPI Trusted Publishing, which needs an OIDC identity provider.

## Decision

**CI/CD platform: GitHub Actions**, on GitHub-hosted `ubuntu-latest` and `macos-latest`
runners. No self-hosted runners — one executing PRs from forks is a well-known compromise
path, and nothing here needs one.

Toolchain, all blocking on PRs:

| Concern | Tool |
| --- | --- |
| Lint + format | `ruff check`, `ruff format --check` |
| Security lint | Ruff `S` (bandit-derived) ruleset |
| Type check | `mypy`, strict on `core/` and `features/` |
| Tests | `pytest` on a six-job matrix (Linux + macOS × Python 3.11/3.12/3.13) |
| Coverage | `pytest-cov`, ≥80% on `WorkItemService` and provider adapters |
| Dependency audit | `pip-audit`, failing on Critical/High |
| Dependency updates | Dependabot |
| SAST | CodeQL |
| Secrets | GitHub secret scanning with push protection |

Plus two checks specific to this design:

- **An architecture guard** asserting `presentation/` never imports `infrastructure/`, no
  feature slice performs an ungated provider write, and `core/`/`features/` never import
  Pydantic.
- **An MCP tool-schema snapshot**, diffed against a committed baseline — a breaking
  tool-contract change is invisible in a normal diff until an agent breaks against it.

**Security-critical tests are labelled as such** so a future contributor does not weaken one
while tidying the suite: commit without a handle is rejected; without `confirmed` is
rejected; with an expired handle is rejected; any `*.preview` issues zero provider writes;
a commit with an unresolved drifted item is rejected; the token never appears in log output
at maximum verbosity; the MCP server writes nothing but protocol frames to stdout; a source
document containing prompt-injection text yields a normal plan.

**Live Jira verification is a manual pre-release step.** Adapter tests run against mocked
HTTP so the suite stays deterministic and network-free.

## Consequences

### Positive

- Every P1 mitigation in the threat model has a test that fails without it — a mitigation
  with no test is an intention, not a control.
- The architecture guard turns `ADR-001`'s boundaries from convention into a build failure,
  which is the only thing that keeps them true over time.
- Ruff replaces the flake8/isort/black stack with one fast tool.
- Actions is free for public repos, so the CI budget constraint is maintainer attention
  rather than money.
- Trusted Publishing works natively, so no long-lived PyPI token is needed.
- Testing the Python floor and current release catches newer-only feature use before release.

### Negative

- **Mocked adapter tests cannot catch a Jira API contract change.** This is a genuine
  coverage gap, mitigated only by a manual pre-release pass — it should be a release
  checklist item, not assumed away.
- Six jobs per PR is real wall-clock time on every change for a part-time maintainer.
- Coupling to GitHub Actions is deliberate but real: moving CI would forfeit Trusted
  Publishing and reintroduce a stored PyPI credential.
- The tool-schema snapshot adds friction to legitimate contract changes — the point, but it
  will occasionally annoy.
- `pip-audit` failing on a transitive Critical/High can block unrelated work until an upgrade
  or documented exception lands.
- Strict `mypy` on `core/` and `features/` costs annotation effort where third-party stubs
  are weak.

## Alternatives Considered

1. **Fold CI platform into a separate ADR**
   - Considered because platform choice and toolchain are conceptually distinct.
   - Not selected: the tools all run *in* CI, and the platform's decisive constraint (OIDC
     for Trusted Publishing) is inseparable from the release story. One ADR keeps the
     reasoning together.
2. **GitLab CI, CircleCI, or another runner**
   - Considered for portability.
   - Rejected: the repository is on GitHub, and Trusted Publishing, Dependabot, CodeQL, and
     secret scanning are all native there. Switching would forfeit Trusted Publishing — a
     security regression no CI feature would justify.
3. **Dependabot alerts without `pip-audit` gating**
   - Considered as zero CI configuration with good notification coverage.
   - Rejected: alerts do not gate a merge, so `NFR-X01`'s "no unresolved Critical/High"
     becomes something someone remembers to check.
4. **`pip-audit` without Dependabot**
   - Considered as one tool, one gate, no bot PRs to triage.
   - Rejected: nothing proactively raises upgrades, so vulnerabilities surface as a broken
     build rather than when a fix ships.
5. **A Linux-only matrix with a macOS smoke test at release**
   - Considered for faster PR feedback and lower maintenance.
   - Rejected: the Homebrew tap targets macOS users, and finding breakage at release time is
     exactly when it is most expensive.
6. **`@mermaid-js/mermaid-cli` or similar for docs diagram validation**
   - Considered after enabling Mermaid rendering, since diagrams render client-side and a
     syntax error does not fail the Docusaurus build.
   - Deferred: a lightweight Node script using the already-installed `mermaid` parser covers
     it without adding a Puppeteer-based dependency.
