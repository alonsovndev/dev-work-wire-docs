# ADR-010: Two-Branch Fork-Based Workflow with CI as the Merge Gate

- **Status**: Proposed
- **Date**: 2026-09-02

## Context

DevWorkWire is open source and expects outside contributions, but is maintained by **one
part-time developer** — the top risk in the
[Phased Roadmap](../02-planning/phased-roadmap.md). The workflow has to serve both without
pretending to be a staffed team.

The generic template this repo started from specified 1 approval into `dev` and 2 into
`main`. With a single maintainer that rule has only two outcomes: it blocks all work, or it
is bypassed by admin override on every merge. **A protection rule that is routinely
overridden teaches the habit of overriding it**, which is worse than not having it — the
override becomes reflex by the time a second maintainer arrives.

Publication is also irreversible ([ADR-007](./adr-007-packaging-and-release.md)), so the
point where changes become releasable deserves a real checkpoint even when no second
reviewer exists.

## Decision

**Two permanent branches, fork-based contributions, CI as the enforcing gate.**

- **`dev`** — integration. All feature, fix, docs, refactor, test, and chore PRs target it.
- **`main`** — release. Receives merges only from `dev` (release PR) or `hotfix/*`. A merge
  freezes a release candidate and **publishes nothing**; publication is triggered by tagging
  `vX.Y.Z` on `main`.
- **No direct commits to either branch.** All changes arrive via pull request; force pushes
  blocked; `v*` tags restricted to maintainers.

**Branch protection: 0 required approvals, all status checks required.** The gate is
automated, not social — PRs are still mandatory and CI must pass to merge. **When a second
maintainer joins, raise this to 1 approval into `dev` and 2 into `main`, and disallow
self-approval.** That is the target state, recorded here so it is not forgotten.

Even solo, **read the full `dev` → `main` diff before merging** — it is the last checkpoint
before a version can be tagged.

Supporting conventions: branch names `feature/`, `fix/`, `docs/`, `refactor/`, `test/`,
`chore/`, `hotfix/`; **Conventional Commits**, with PR titles validated in CI and no local
hooks enforced; standard merge commits to preserve branch history. Hotfixes branch from
`main`, **must add a regression test that fails without the fix**, and are back-merged into
`dev`.

The maintainer may branch directly in the upstream repo rather than through a fork; the PR
requirement and CI gate apply identically either way.

## Consequences

### Positive

- The rules are **honest about the current team size**, so nothing needs routine overriding
  and the protections retain their meaning.
- CI enforcement is stronger than nominal approval anyway: a rubber-stamp approval catches
  less than the architecture guard, coverage gate, and security-critical tests from
  [ADR-008](./adr-008-quality-toolchain-github-actions.md).
- Separating `dev` from `main` means merging never publishes — releasing is always a
  deliberate, separate act.
- Fork-based contribution is the convention outside contributors already expect.
- Conventional Commits give a consistent history without local hooks slowing iteration.
- The upgrade path to peer review is written down rather than left as an intention.

### Negative

- **No second pair of eyes on any change today.** No process fixes this; it is a
  consequence of team size, partially offset by automated gates and the release-PR diff read.
- Self-merging is possible, so discipline still matters at the release boundary.
- Two branches are more ceremony than a single-branch flow for a solo developer.
- Fork-based flow adds friction for the maintainer (though direct branching is permitted).
- Branch protection settings live in GitHub, not in the repo — they can drift from this ADR
  silently, and the "raise approvals when a second maintainer joins" step depends on someone
  remembering.

## Alternatives Considered

1. **Keep 1 approval into `dev` and 2 into `main` as written in the template**
   - Considered as an aspirational target documented now.
   - Rejected: with one maintainer it either blocks all work or is bypassed by override on
     every merge, training exactly the wrong habit.
2. **0 approvals on `dev`, 1 self-review checkpoint on `main`**
   - Considered to force a deliberate pause before anything becomes releasable.
   - Not selected as a *rule* because GitHub cannot require a self-review meaningfully; kept
     as the documented practice of reading the full release diff.
3. **Trunk-based development on `main` alone**
   - Considered as the simplest possible flow for one developer.
   - Rejected: loses the separation between "integrated" and "releasable", which matters
     precisely because publication cannot be undone.
4. **Git Flow with release and develop branches**
   - Considered as a well-known model.
   - Rejected: far more ceremony than a single-maintainer project with no parallel release
     lines can justify.
5. **Enforcing Conventional Commits with local hooks**
   - Considered for earlier feedback than CI.
   - Rejected: local hooks add friction during rapid iteration; CI validation of PR titles
     achieves the goal at the point that matters.
