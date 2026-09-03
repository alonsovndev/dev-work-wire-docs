# ADR-007: Hatchling Packaging with PyPI/pipx/Homebrew Distribution and Trusted Publishing

- **Status**: Proposed
- **Date**: 2026-09-02

## Context

[F-009](../01-requirements/f-009-packaging-distribution.md) requires a PyPI package
(`devworkwire`) with pipx as the recommended install path, a self-maintained Homebrew tap,
SemVer, and a Keep a Changelog changelog.
[NFR-009-01](../01-requirements/f-009-packaging-distribution.md) requires a clean install
on each channel with no manual dependency fixes.

Two facts make this more than routine packaging:

- **A published release cannot be recalled.** Yanking blocks *new* installs; every
  already-installed copy keeps running. There is no control plane and — by deliberate
  choice ([ADR-009](./adr-009-no-telemetry.md)) — no telemetry to detect a bad release.
- **DevWorkWire runs on developer machines holding live Jira tokens.** A hijacked release is
  the highest-impact attack available against its users (T-005 in the
  [Threat Model](../03-architecture/security/threat-model.md)), and the usual vector is a
  stolen long-lived PyPI API token in CI secrets.

Together these mean verification must be front-loaded, and the publishing credential should
ideally not exist.

## Decision

- **Build backend: Hatchling.** PyPA-maintained, minimal config, first-class `src/` layout.
- **Channels:** PyPI as the baseline, **pipx documented as recommended** (isolated
  environment per tool), pip supported; a self-maintained Homebrew tap
  `alonsovndev/devworkwire` whose formula points at the PyPI sdist with a **pinned hash**,
  so the tap adds no independent trust root.
- **Publishing: PyPI Trusted Publishing** via short-lived OIDC from GitHub Actions — **no
  long-lived PyPI API token exists to steal** — plus **PEP 740 attestations** so a release
  is verifiably built from this repository's tagged source.
- **Release flow:** tag `vX.Y.Z` on `main` → build → **verify the tag matches the
  `pyproject.toml` version and that `CHANGELOG.md` has an entry for it** → publish to
  **TestPyPI** → **install into a clean environment and smoke-test** → publish to PyPI only
  if that passes → update the tap → create a GitHub Release.
- **Versioning: SemVer, bumped by hand; changelog written by hand; both verified by CI.**
  The public API is the MCP tool surface and CLI command surface — renaming a tool or
  argument, or changing an error code's meaning, is **major**; adding or tightening a gate is
  never treated as breaking.
- **The `devworkwire` PyPI name must be registered before the first release.**
- **Recovery is fix-forward only.** Yank, patch, republish. A version number is never reused.
- Homebrew core and standalone binaries stay deferred per
  [Out of Scope](../00-context/out-of-scope.md).

## Consequences

### Positive

- The TestPyPI gate is what actually enforces `NFR-009-01` rather than hoping — a broken
  wheel cannot reach PyPI, and a failure caught here costs a re-tag instead of a yank.
- Trusted Publishing removes the credential most commonly stolen in package-hijacking
  incidents; attestations let users verify provenance.
- pipx isolation keeps DevWorkWire's dependencies away from users' other projects.
- A hand-written changelog stays useful to someone deciding whether to upgrade — which is
  the only rollout control that exists here.
- CI-verified version/changelog consistency makes the discipline non-optional for a solo
  maintainer shipping a patch at speed.
- Pinning the tap formula to the sdist hash means the tap cannot ship something PyPI did not.

### Negative

- Maintaining a Homebrew tap in parallel with PyPI is ongoing release overhead, partly
  automated but not free.
- The release pipeline has more steps than a direct publish, so releases take longer and have
  more places to fail — accepted, because the alternative fails at users instead.
- Hand-written versions and changelog entries are manual work on every release, and CI can
  only check that they *exist* and are consistent, not that the prose is good.
- **Already-installed copies can never be recalled.** No control this ADR provides changes
  that; it is why prevention is weighted so heavily.
- Trusted Publishing ties releases to GitHub Actions — see
  [ADR-008](./adr-008-quality-toolchain-github-actions.md).

## Alternatives Considered

1. **setuptools as the build backend**
   - Considered as the most universally understood, and safest for downstream packagers.
   - Rejected: noisier configuration for no benefit on a pure-Python package with no
     compiled extensions.
2. **Poetry or uv as the build backend**
   - Considered for integrated dependency resolution (Poetry) and speed (uv).
   - Rejected: Poetry imposes a non-standard workflow contributors must adopt; uv's build
     backend has a shorter track record for published packages.
3. **Publish straight to PyPI on tag, no TestPyPI stage**
   - Considered as a simpler, faster pipeline.
   - Rejected: a broken wheel or missing dependency would be discovered by users, and a PyPI
     version number can never be reused.
4. **A PyPI API token in GitHub Actions secrets**
   - Considered as the simplest, universally understood setup.
   - Rejected: a long-lived token in CI secrets is the standard way open-source packages get
     hijacked — indefensible for a tool that touches other people's trackers.
5. **`release-please` / Conventional-Commit-driven versioning**
   - Considered to remove per-release ceremony and version/changelog drift.
   - Rejected: the generated changelog reads like a commit log, which is what Keep a
     Changelog exists to avoid.
6. **Manual `workflow_dispatch` publishing**
   - Considered for maximum control over release timing.
   - Rejected: loses tag-to-release traceability and makes releasing a remembered ritual.
