# CI/CD Pipeline Architecture

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | [Project Name]              |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Table of Contents

- [1. Branching Strategy](#1-branching-strategy)
- [2. Fork Setup & Sync](#2-fork-setup--sync)
- [3. Branch Naming Conventions](#3-branch-naming-conventions)
- [4. PR Conventions](#4-pr-conventions)
- [5. CI/CD Tool Selection](#5-cicd-tool-selection)
- [6. Pipeline Stages](#6-pipeline-stages)
- [7. Build and Verification Responsibilities](#7-build-and-verification-responsibilities)
- [8. Hotfix Process](#8-hotfix-process)
- [9. Deployment Environment Strategy](#9-deployment-environment-strategy)
- [10. Database Migration Strategy](#10-database-migration-strategy)
- [11. Rollback Strategy](#11-rollback-strategy)
- [12. Environment Variables and Secrets Management](#12-environment-variables-and-secrets-management)
- [13. Zero-Downtime Deployment Approach](#13-zero-downtime-deployment-approach)
- [14. Deployment Impact Summary](#14-deployment-impact-summary)
- [Source References](#source-references)

## 1. Branching Strategy

The project uses a **two-branch model** (`dev` + `main`) with fork-based contributions. All contributors — core team and external — work from forks and submit pull requests to the upstream repository.

```
feature/<desc>  fix/<desc>  docs/<desc>    ← created from dev in your fork
         │
         ▼
        dev  ───────────────────────────── integration branch (upstream)
         │                                 PR from fork to upstream dev
         │                                 1 approval + CI pass required
         │
         ▼  (PR dev → main)
        main ───────────────────────────── production branch (upstream)
         │                                 PR from upstream dev to main
         │                                 2 approvals + CI pass required
         │                                 merge builds candidate (no deploy)
         │
         ▼  (tag vX.Y.Z on main)
    Production ─────────────────────────── tag triggers deploy pipeline
```

**Permanent branches in the upstream org repo:** `dev`, `main`

- **`dev`**: Integration branch. All feature, fix, docs, refactor, test, and chore PRs target `dev`. This is where changes converge and are tested together before promotion to production.
- **`main`**: Production branch. Only receives merges from `dev` (via release PR) or `hotfix/*` branches. A merge to `main` builds and freezes a production candidate but does **not** deploy. Deployment is triggered by tagging a semantic version (`vX.Y.Z`) on `main`.

No direct commits to `dev` or `main`. All changes arrive via pull request from a contributor's fork.

### Branch Protection Rules

| Rule                    | `dev`                                       | `main`                                                      |
| ----------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| Direct pushes           | Blocked                                     | Blocked                                                     |
| PR required             | All changes via PR                          | All changes via PR from `dev` or hotfix                     |
| Required approvals      | 1 (when team > 1)                           | 2                                                           |
| Status checks           | Must pass (lint, test, type-check, docs)    | Must pass (lint, test, type-check, docs, infra plan)        |
| Up-to-date before merge | Required                                    | Required                                                    |
| Conversation resolution | Required                                    | Required                                                    |
| Stale reviews           | Dismissed on new commits                    | Dismissed on new commits                                    |
| Force pushes            | Blocked                                     | Blocked                                                     |

---

## 2. Fork Setup & Sync

### One-time Fork Setup

Fork the upstream repository on GitHub, then:

```bash
git clone git@github.com:<your-handle>/<project-slug>.git
cd <project-slug>
git remote add upstream git@github.com:<org>/<project-slug>.git
git remote -v
# origin    git@github.com:<your-handle>/<project-slug>.git (fetch/push)
# upstream  git@github.com:<org>/<project-slug>.git (fetch/push)
```

`origin` is your fork. `upstream` is the org repo. You push to `origin` and open PRs targeting `upstream`.

### Keeping Your Fork in Sync

Sync your fork's `dev` with upstream before starting any new branch:

```bash
git fetch upstream
git checkout dev
git rebase upstream/dev
git push origin dev
```

If your feature branch diverges from `dev` while in progress:

```bash
git checkout feature/<branch-name>
git rebase upstream/dev
git push origin feature/<branch-name> --force-with-lease
```

### Optional Git Aliases

These user-level aliases simplify fork workflow. Add them to `~/.gitconfig`:

```bash
git config --global --edit
```

```ini
[alias]
   sync = !git fetch upstream && git merge upstream/$(git branch --show-current) && git push origin HEAD
   resync = !git fetch upstream && git reset --hard upstream/$(git branch --show-current) && git push origin HEAD --force-with-lease
   feat = "!f() { test -n \"$1\" || { echo \"usage: git feature <branch-name>\"; return 1; }; git checkout dev && git resync && git checkout -b \"$1\"; }; f"
```

| Alias             | What it does                                                                                                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git sync`        | Fetches `upstream`, merges `upstream/<current-branch>` into your current branch, then pushes the result to the same branch on your fork (`origin`). Use to bring a local branch up to date without rewriting it. |
| `git resync`      | Fetches `upstream`, resets your current branch to exactly match `upstream/<current-branch>`, then force-pushes with `--force-with-lease`. Use to make your fork's `dev` or `main` match upstream exactly.        |
| `git feat <name>` | Checks out `dev`, runs `git resync` so local and fork `dev` match `upstream/dev`, then creates the named feature branch from the refreshed `dev`.                                                               |

**Important:** Use `git resync` only on disposable local copies of shared branches (`dev` or `main`). Do not run it on a feature branch that contains unmerged work.

---

## 3. Branch Naming Conventions

All work branches are created from `dev` (except hotfixes, which branch from `main`):

| Branch type   | Pattern                       | Example                      | Targets |
| ------------- | ----------------------------- | ---------------------------- | ------- |
| Feature       | `feature/<short-description>` | `feature/user-profile-page`  | `dev`   |
| Bug fix       | `fix/<issue-description>`     | `fix/login-redirect-loop`    | `dev`   |
| Documentation | `docs/<topic>`                | `docs/update-readme`         | `dev`   |
| Refactoring   | `refactor/<component>`        | `refactor/auth-service`      | `dev`   |
| Tests         | `test/<scope>`                | `test/auth-endpoints`        | `dev`   |
| Chores        | `chore/<task>`                | `chore/update-dependencies`  | `dev`   |
| Hotfix        | `hotfix/<description>`        | `hotfix/fix-login-regression`| `main`  |

---

## 4. PR Conventions

All pull requests follow these conventions:

| Field              | Rule                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| Title              | Short description in imperative mood (e.g., `add pipeline audit endpoint`)      |
| Target branch      | `dev` for features, fixes, docs, refactors, tests, chores; `main` for hotfixes  |
| Merge strategy     | Standard merge commit — preserves full feature branch history                    |
| Required approvals | 1 for PRs targeting `dev`; 2 for PRs targeting `main`                           |
| Self-approval      | Not allowed                                                                     |
| CI gate            | All status checks must pass (lint, test, type-check, docs)                      |
| Unresolved threads | Must be resolved before merge                                                   |
| Up-to-date         | Branch must be current with target before merge                                 |

### Feature PR Flow (target: `dev`)

```bash
# 1. Sync your fork
git fetch upstream
git checkout dev
git rebase upstream/dev
git push origin dev

# 2. Create feature branch
git checkout -b feature/<description>

# 3. Develop and commit using Conventional Commits
git commit -m "feat(scope): add feature description"

# 4. Push to your fork
git push -u origin feature/<description>

# 5. Open PR on GitHub:
#    From: <your-handle>/<project-slug>:feature/<description>
#    Into: <org>/<project-slug>:dev
```

CI runs checks on the PR. After 1 approval and all checks passing, merge via standard merge commit. Delete the fork branch after merge.

### Release PR Flow (dev → main)

```bash
# Open a PR from upstream dev into upstream main
# Requires 2 approvals and all CI checks passing
# Merge builds and freezes a production candidate — does NOT deploy
```

### Releasing to Production

Once the candidate is signed off, tag the release from upstream `main`:

```bash
git fetch upstream
git checkout main
git rebase upstream/main
git tag v1.0.0
git push upstream v1.0.0
```

The tag (`vX.Y.Z`) triggers the production deployment pipeline.

### Release Versioning

The project uses semantic versioning (`vMAJOR.MINOR.PATCH`):

| Segment | Increment when                                   |
| ------- | ------------------------------------------------ |
| `MAJOR` | Breaking change to a public API or data contract |
| `MINOR` | New feature, backwards-compatible                |
| `PATCH` | Bug fix, backwards-compatible                    |

Hotfixes increment `PATCH` (e.g., `v1.0.0` → `v1.0.1`). New features shipped via the normal `dev` → `main` cycle increment `MINOR` (e.g., `v1.0.1` → `v1.1.0`).

### Commit Conventions

All commits follow **Conventional Commits** (`<type>(<scope>): <description>`):

| Type       | When to use                                   |
| ---------- | --------------------------------------------- |
| `feat`     | New feature for users                         |
| `fix`      | Bug fix                                       |
| `docs`     | Documentation only                            |
| `style`    | Code formatting, whitespace (no logic change) |
| `refactor` | Code change with no functional change         |
| `test`     | Adding or updating tests                      |
| `chore`    | Build process, tooling, dependencies          |
| `perf`     | Performance improvements                      |
| `ci`       | CI/CD configuration changes                   |

Examples:

- `feat(auth): add JWT refresh token rotation`
- `fix(ui): resolve modal close button alignment`
- `docs(adr): add code quality tooling strategy`
- `refactor(api): extract validation logic to shared module`

**Enforcement:** PR titles are validated via CI. No local commit hooks are enforced — this reduces developer friction during rapid iteration. CONTRIBUTING.md documents the format with examples for new contributors.

---

## 5. CI/CD Tool Selection

**Selected:** [Tool — e.g. GitHub Actions, GitLab CI, CircleCI]
**Rationale:** [Why this tool fits the project — native integration, environment protection, Terraform support, etc.]

---

## 6. Pipeline Stages

> Describe the pipeline stages and their triggers. Replace the placeholder below with your actual pipeline diagram (Mermaid or exported image).

```
PR (fork → dev)          ─── lint + test + typecheck + build
Release PR (dev → main)  ─── lint + test + typecheck + build + infra plan
Tag (vX.Y.Z on main)     ─── migrate + deploy + smoke test + release tag
```

## 7. Build and Verification Responsibilities

- **Feature PR Pipeline (target: `dev`):** Triggered on every PR from a fork targeting upstream `dev`.
  - Runs all documentation checks, code quality scans, and unit/integration tests.
  - Builds the application artifacts to ensure validity.
  - Runs infrastructure plan to preview changes.
  - **No deployment occurs from this pipeline.**

- **Release PR Pipeline (target: `main`):** Triggered on a PR from upstream `dev` to upstream `main`.
  - This is a governance step. It re-runs critical tests and builds production artifacts.
  - Requires 2 approvals before merging.
  - **Merge builds and freezes a candidate — does NOT deploy.**

- **Production Deployment Pipeline (trigger: tag `vX.Y.Z` on `main`):**
  - Promotes the already-built candidate — no rebuild.
  - Applies any pending infrastructure changes.
  - Runs database migrations.
  - Deploys the candidate to production.
  - Runs automated smoke tests.
  - Tags the release in the observability platform.

---

## 8. Hotfix Process

Use hotfixes only for critical production bugs that cannot wait for the normal `dev` → `main` cycle. The 2-approval requirement still applies.

1. Sync your fork's `main` with upstream, then branch from it:

   ```bash
   git fetch upstream
   git checkout main
   git rebase upstream/main
   git checkout -b hotfix/<description>
   ```

2. Fix, test, push to your fork, and open a PR into upstream `main` (2 approvals).

3. After merge and approval, tag the hotfix release from upstream `main`:

   ```bash
   git tag v1.0.1
   git push upstream v1.0.1
   ```

   The tag triggers the production deployment pipeline.

4. Back-merge into upstream `dev` to keep branches in sync:

   ```bash
   git fetch upstream
   git checkout dev
   git rebase upstream/dev
   git merge upstream/main
   git push upstream dev
   ```

**Recovery:** The default is fix-forward — land another hotfix. Redeploying a prior good image is possible (images are sha-tagged), but fix-forward is the norm.

---

## 9. Deployment Environment Strategy

For the MVP, the strategy is streamlined to two environments:

- **Local:** Developer workstations running `docker compose`. This is where all development and initial testing occurs.
- **Production:** The live user-facing environment. It is deployed **only** from the `main` branch.

There is no persistent `staging` or `dev` environment. The `dev` branch provides code-level integration; deployed environments are local (per developer) and production only.

> Adjust this to your project's needs: add a staging environment when the team or release cadence requires it.

---

## 10. Database Migration Strategy

- Migrations are managed via [Alembic / Flyway / Prisma Migrate / —] and are versioned and backward-compatible.
- In the production pipeline (triggered by tag `vX.Y.Z` on `main`), migrations run as a pre-deploy step.
- A failed migration fails the deployment pipeline, preventing the application from deploying against an incorrect schema version.

---

## 11. Rollback Strategy

- **Application Rollback:** Redeploy the previously successful image. Fix-forward is preferred; redeploy is the emergency fallback.
- **Database Rollback:** Prefer forward-fix migrations. For emergencies, use point-in-time recovery (PITR) or a committed backup.
- **Infrastructure Rollback:** Revert the change in the IaC code in the `main` branch and trigger a new deployment.

---

## 12. Environment Variables and Secrets Management

- Secrets for the production environment are stored in [CI platform encrypted secrets] scoped to the production environment.
- These secrets are injected into the application configuration during the production deployment.
- No plaintext secrets are ever stored in the repository.

---

## 13. Zero-Downtime Deployment Approach

- The application is stateless, allowing the compute platform to perform rolling replacements. Health checks validate new instances before they receive traffic.
- Database migrations are backward-compatible to ensure the running application remains compatible while the new version is deploying.

---

## 14. Deployment Impact Summary

- The architecture supports a controlled release promotion: `dev` → `main` (candidate) → tag `vX.Y.Z` (deploy).
- Fork-based contributions ensure consistent workflow for all contributors and clean upstream history.
- Release tagging provides immediate visibility into the impact of a production deployment.
- The pipeline design separates development integration (`dev`) from production releases (`main`), ensuring stability.
- Hotfixes bypass `dev` and go directly to `main`, then back-merge to keep branches synchronized.

## Source References

- [Deployment Architecture](./deployment-architecture.md)
- [Feature Requirements](../../01-requirements/README.md)
- [ADR Decision Log](../../04-decisions/README.md)

---

**Last Updated**: YYYY-MM-DD
