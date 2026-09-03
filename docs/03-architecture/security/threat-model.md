---
sidebar_position: 2
---

# Threat Model

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Scope and Method

**Method:** STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of
Service, Elevation of Privilege).

**Scope:** the DevWorkWire package as installed and run on a developer's machine — its CLI
and MCP surfaces, local config and state, the outbound Jira client, and the release
pipeline that delivers it.

**Explicitly excluded:**

- **The Jira instance itself.** Its access control, availability, and admin configuration
  are Atlassian's and the customer's concern.
- **The MCP harness and the LLM behind it.** DevWorkWire cannot verify what is calling it,
  authenticate it, or constrain its reasoning. This is an accepted limitation of stdio MCP
  and the reason the confirm gate — not caller identity — is the primary control.
- **The user's machine posture.** OS account security, disk encryption, malware, and shell
  history hygiene are outside what a CLI can enforce.
- **Denial of service in the conventional sense.** There is no service to deny: no
  listener, no shared resource, one local user. DoS threats below are limited to
  self-inflicted resource exhaustion.

**What makes this threat model unusual:** the highest-severity threats here are not
unauthorized access. DevWorkWire runs with the user's *legitimate* credentials and
*correct* authorization. The threats that matter are **actions taken with valid authority
but without the user's intent**, and **compromise of the distribution channel**.

## Trust Boundaries

| # | Boundary | Crossing | Why it matters |
| - | -------- | -------- | -------------- |
| TB-1 | Untrusted content → DevWorkWire | Source Markdown; Jira issue text read back | Content may be agent-authored or attacker-influenced, and is returned to an LLM |
| TB-2 | Plan → Write (**the confirm gate**) | `*.commit` with a live handle + explicit confirmation | The only irreversible transition in the system |
| TB-3 | DevWorkWire → Jira | HTTPS REST v3 with the user's token | Credential in use; network in path |
| TB-4 | Process → local disk | `.devworkwire.yaml`, `state.db` | Content and identifiers at rest |
| TB-5 | Release pipeline → user machine | PyPI / Homebrew install | Code executing with the user's tracker credentials |
| TB-6 | Harness → MCP server | stdio spawn | Any local process running as the user can invoke the tools |

## Assets to Protect

| Asset | Sensitivity | Owner | Notes |
| ----- | ----------- | ----- | ----- |
| Jira API token | **High** | User | Full user-level tracker access. Env-only, memory-only, never persisted |
| Integrity of the user's backlog | **High** | User / team | The asset the product exists to protect. Unintended writes are the core harm |
| Preview plans (`preview.plan_json`) | Medium | User | Issue content at rest for a TTL window |
| Import index (`state.db`) | Medium | User | Issue identifiers and content hashes. Corruption causes duplicates |
| Release artifacts (PyPI, tap) | **High** | Maintainer | Executed on machines holding live credentials |
| CI credentials (tap push) | **High** | Maintainer | Path to publishing malicious releases |
| Config (`.devworkwire.yaml`) | Low | User | Base URL and project key — identifies the organization, not a credential |

## Threats and Attack Vectors

| ID | Threat | Category | Vector | Impact | Mitigation |
| -- | ------ | -------- | ------ | ------ | ---------- |
| **T-001** | Prompt injection in a source document steers the agent into committing changes the user did not intend | Tampering / EoP | TB-1 — Markdown containing text aimed at the calling LLM | Unintended backlog writes under the user's credentials | The confirm gate: an injected instruction still faces explicit confirmation on a human-readable preview. Returned content delimited and labeled as untrusted data. Accurate, non-inflating tool descriptions |
| **T-002** | Prompt injection in Jira content (issue text, comments) returned by `workitem.query` manipulates the agent | Tampering / EoP | TB-1 — attacker-controlled text inside the tracker | Agent takes attacker-chosen actions | Same as T-001. Query results are read-only and gated on any resulting write. Content is delimited as data |
| **T-003** | Agent presents a preview as a completed write, or a commit as a preview | Repudiation | TB-2 — ambiguous tool results | User believes work is done that is not, or vice versa; erodes trust in the gate | Mandatory `result_type` on every result ([NFR-004-01](../../01-requirements/f-004-mcp-tool-surface.md)); distinct `committed`/`failed`/`untried` reporting |
| **T-004** | A code change introduces a write path that skips the confirm gate | EoP | Refactor, new feature slice, or a "convenience" flag | Silent loss of the product's core safety property | Gate lives in `WorkItemService`, not callers; CI architecture guard forbids ungated provider writes from slices; explicit gate regression tests; no bypass flag exists to be widened |
| **T-005** | Malicious or hijacked release published under the `devworkwire` name | Tampering | TB-5 — stolen PyPI token, name-squatting, compromised CI | Arbitrary code on machines holding live Jira tokens. **Highest-impact threat in this model** | Trusted Publishing (no long-lived token to steal); PEP 740 attestations; tag-triggered releases from a protected branch; early name registration; pinned tap hash |
| **T-006** | Malicious dependency introduced via a compromised or typosquatted package | Tampering | TB-5 — transitive dependency | Code execution with user credentials | `pip-audit` failing CI on Critical/High; Dependabot; minimal pinned dependency set; every new dependency justified in review |
| **T-007** | Token leaked through logs, error output, or a crash traceback | Info Disclosure | TB-3/TB-4 — verbose logging, exception text, bug reports | Full tracker access for anyone reading the output | Redaction enforced by a logging filter, not call-site discipline; never persisted; never a CLI argument; regression test at maximum verbosity |
| **T-008** | Token exposed via process listing, environment inspection, or shell history | Info Disclosure | TB-3 — same-user processes; `ps`; shell history | Full tracker access | **Accepted, inherent to env-var secrets.** Never accepted as a CLI argument (which would be world-readable); documentation recommends git-ignored `.env` or profile export; OS keychain deferred. Recorded as a known risk in [F-008](../../01-requirements/f-008-provider-auth-configuration.md) |
| **T-009** | `state.db` or `.devworkwire.yaml` committed to a shared repository | Info Disclosure | TB-4 — missing gitignore | Tracker content and org identifiers in shared history | `.devworkwire/` gitignored by setup docs and any `dwire init`; config holds no secret by design, which bounds the damage |
| **T-010** | Man-in-the-middle on the Jira connection captures the token | Spoofing / Info Disclosure | TB-3 — hostile network, TLS interception | Credential theft | TLS 1.2+ with **mandatory** certificate verification and no disable option; `http://` base URLs rejected at config validation |
| **T-011** | Drift overwrite silently destroys a teammate's tracker edit | Tampering | TB-2 — re-import over a changed issue | Lost work, and loss of confidence in re-running imports | Drift detected against a recorded baseline ([FR-002-03](../../01-requirements/f-002-dedup-on-rerun.md)); **per-item overwrite-or-skip required, never defaulted** ([FR-002-04](../../01-requirements/f-002-dedup-on-rerun.md)); commit rejected if any drifted item lacks a resolution |
| **T-012** | Duplicate issues created by a blind retry of a timed-out create | Tampering | TB-3 — network timeout during commit | Backlog pollution — the exact harm the product exists to prevent | Creates are never blind-retried; state re-established by searching the reference field; idempotency keys with stored-result replay ([FR-004-04](../../01-requirements/f-004-mcp-tool-surface.md)); per-item index writes make fail-fast resumable |
| **T-013** | Terminal escape sequences in Jira content corrupt the rendered preview | Tampering | TB-1 → terminal | User confirms a change different from what was displayed — consent obtained under false pretenses | Control characters and ANSI escapes stripped from all rendered tracker content; fields length-capped so the real change cannot be pushed off screen |
| **T-014** | SSRF via the PR-reference URL | SSRF / Info Disclosure | TB-1 — user- or agent-supplied URL ([FR-007-03](../../01-requirements/f-007-progress-reporting.md)) | Requests to internal endpoints from the user's machine | **The URL is validated as a URL and stored as text. DevWorkWire never fetches it.** No PR-creation or PR-reading logic exists ([Out of Scope](../../00-context/out-of-scope.md#git--source-control-automation)) |
| **T-015** | Malicious YAML config achieves code execution | Tampering / EoP | TB-4 — attacker-supplied or committed config | Arbitrary code execution | `yaml.safe_load` only, enforced by a lint rule; Pydantic validation of the resulting structure |
| **T-016** | Path traversal via a source-document path | Tampering / Info Disclosure | TB-1 — crafted path from an agent | Reading files outside the intended tree | Paths resolved to absolute and confined; symlink escape refused |
| **T-017** | Pathological document exhausts memory or hangs the process | DoS (self-inflicted) | TB-1 — enormous or deeply nested document | Local hang; a partially-committed batch if it happens mid-commit | Size and item-count limits; explicit connect/read timeouts on every Jira call |
| **T-018** | A hostile local process invokes the MCP server and drives writes | Spoofing / EoP | TB-6 — any process running as the user can spawn it | Unintended writes | **Accepted.** A process running as the user could use the token directly and does not need DevWorkWire. The gate still requires explicit confirmation; stdio has no remote surface |
| **T-019** | Interrupted commit leaves an unclear tracker state | Repudiation | TB-2 — crash or kill mid-batch | User cannot tell what was written | Fail-fast with per-item index writes; `commit_run` marked `in_progress` **before** the first write; `COMMIT_INTERRUPTED` on replay rather than a fabricated result; re-preview matches what already exists |

## Risk Assessment Matrix

| Risk ID | Threat | Likelihood | Impact | Priority | Notes |
| ------- | ------ | ---------- | ------ | -------- | ----- |
| R-001 | T-005 Malicious release | Low | **High** | **P1** | Low likelihood only *if* Trusted Publishing is in place from the first release |
| R-002 | T-004 Gate bypass introduced in code | Medium | **High** | **P1** | The most likely way the core property is lost is a well-intentioned refactor, not an attack |
| R-003 | T-007 Token in logs | Medium | **High** | **P1** | Easy mistake, severe consequence; must be structurally prevented |
| R-004 | T-001 / T-002 Prompt injection | Medium | Medium | **P1** | Likelihood rises as agent use grows. Gate caps impact; it does not eliminate it |
| R-005 | T-011 Silent drift overwrite | Medium | Medium | **P1** | Directly undermines confidence in safe re-runs — the product's second promise |
| R-006 | T-012 Duplicate on retry | Medium | Medium | **P1** | The exact harm the product exists to prevent |
| R-007 | T-015 Unsafe YAML load | Low | **High** | **P1** | Trivially prevented; catastrophic if missed |
| R-008 | T-006 Malicious dependency | Low | **High** | **P2** | Mitigated by CI, but a real ecosystem risk |
| R-009 | T-013 Terminal escapes in preview | Low | Medium | **P2** | Subtle, and it attacks consent itself |
| R-010 | T-003 Preview/commit confusion | Medium | Medium | **P2** | Schema-level fix already specified |
| R-011 | T-009 State/config committed to git | Medium | Low | **P2** | Bounded — no secrets in either file |
| R-012 | T-019 Interrupted commit ambiguity | Medium | Low | **P2** | Recoverable via re-preview |
| R-013 | T-016 Path traversal | Low | Medium | **P2** | |
| R-014 | T-014 SSRF via PR URL | Low | Medium | **P2** | Currently N/A by design; becomes real the moment anything fetches that URL |
| R-015 | T-010 MITM on Jira | Low | **High** | **P2** | Standard TLS handling suffices; the risk is adding a `--insecure` escape hatch later |
| R-016 | T-008 Token via env/process/history | **High** | **High** | **P3 (accepted)** | Inherent to the chosen mechanism; see [Accepted Risks](#accepted-risks) |
| R-017 | T-017 Resource exhaustion | Low | Low | **P3** | Self-inflicted, locally visible |
| R-018 | T-018 Hostile local process | Low | Medium | **P3 (accepted)** | Attacker with local user access has better options |

## Mitigation Plan by Priority

### P1 — Critical (Must Fix Before MVP)

- **R-002** — Place the confirm gate in `WorkItemService`; add the CI architecture guard
  forbidding ungated provider writes from slices; write gate regression tests (no handle →
  rejected, no `confirmed` → rejected, expired handle → rejected, preview issues zero
  writes). *These are security tests and should be labeled as such.*
- **R-003** — Implement redaction as a logging filter, not call-site discipline. Add a test
  asserting the token never appears in captured output at maximum verbosity.
- **R-007** — `yaml.safe_load` only, with a lint rule enforcing it.
- **R-005** — Reject any commit where a drifted item lacks an explicit resolution. Never
  default to overwrite.
- **R-006** — Never blind-retry a create; re-establish state via the reference field.
  Implement idempotency keys with stored-result replay and per-item index writes.
- **R-004** — Delimit and label returned tracker content as untrusted data; keep tool
  descriptions accurate about what writes. Add the injection-resistance test.
- **R-001** — Register the `devworkwire` PyPI name and configure Trusted Publishing
  **before the first release**. Retrofitting after a token has existed is strictly worse.

### P2 — Post-MVP (Fix in Phase 1)

- **R-008** — `pip-audit` gating CI on Critical/High; enable Dependabot and CodeQL.
- **R-009** — Strip control characters and ANSI escapes from all rendered tracker content;
  length-cap preview fields.
- **R-010** — Enforce `result_type` in the tool result schemas, with a test.
- **R-011** — Ship `.devworkwire/` gitignore guidance in setup docs and `dwire init`.
- **R-012** — Mark `commit_run` `in_progress` before the first write; return
  `COMMIT_INTERRUPTED` rather than a fabricated replay.
- **R-013** — Resolve and confine source paths; refuse symlink escape.
- **R-015** — Reject `http://` base URLs at config validation; never add a
  certificate-verification bypass.
- Publish `SECURITY.md` with a private disclosure channel and realistic response
  expectations for a single part-time maintainer.

### P3 — Future (Monitor and Revisit)

- **R-016** — Evaluate OS keychain integration, already noted as deferred in
  [F-008](../../01-requirements/f-008-provider-auth-configuration.md).
- **R-017** — Add document size/item-count limits and explicit Jira call timeouts.
- **R-014** — Revisit immediately if any feature ever fetches a user-supplied URL.
- **R-018** — Revisit only if a non-stdio transport is introduced.

## Residual Risk and Review Cadence

### Accepted Risks

| Risk | Reason Accepted | Review Trigger |
| ---- | --------------- | -------------- |
| **R-016** — Token visible via environment, process listing, or shell history | Inherent to environment-variable secrets, which [F-008](../../01-requirements/f-008-provider-auth-configuration.md) selected deliberately over a keychain wizard for MVP. Mitigated by documentation, and by never accepting the token as a CLI argument | Keychain support is implemented, or a credible report of real-world leakage |
| **R-018** — Any local process running as the user can invoke the MCP server | An attacker with local user access can read the environment and call Jira directly; DevWorkWire adds no privilege. Caller verification is not possible over stdio | A network transport is added, or multi-user execution is considered |
| Prompt injection cannot be *eliminated*, only bounded by the gate | No control at this layer can make an LLM immune to manipulation. The design ensures manipulation cannot produce an unconfirmed write | An unattended/auto-confirm mode is ever proposed — which would remove the bound entirely |
| No runtime security monitoring | Telemetry would mean exfiltrating users' tracker activity from their machines. Wrong trade for this product | A hosted component is ever introduced |
| Already-installed copies cannot be recalled | Inherent to distributed CLI software; there is no control plane | Never resolvable — it is why prevention is weighted so heavily |
| `preview.plan_json` stores issue content at rest for a TTL window | Required for a commit to execute the plan that was actually reviewed. **Tension with [NFR-X02](../../01-requirements/README.md#cross-cutting-quality-baseline) is unresolved** | Product Owner decision on amending NFR-X02 — see [Database Design](../database/database-design.md#risks-and-open-questions) |

### Review Triggers

- **A new provider adapter is added** (Linear, Azure DevOps — Phase 2): new outbound
  boundary, new credential handling, new field-mapping surface.
- **A network transport is added to the MCP server**: introduces inbound authentication,
  remote attack surface, and multi-tenancy — a different threat model, not an increment.
- **Any bypass of the confirm gate is proposed**, in any form, for any reason.
- **Anything begins fetching a user-supplied URL** (re-opens T-014).
- **The policy/governance layer deferred in
  [Out of Scope](../../00-context/out-of-scope.md#governance-phase-4-only-if-demand-emerges)
  is picked up.**
- A security incident occurs in a comparable tool (MCP server, Jira integration, Python CLI
  ecosystem).

### Continuous Improvement

- Reviewed at least once per release cycle, and whenever a trigger above fires.
- New features add their threats here **before** merge, not after.
- Mitigation status is tracked against the P1/P2/P3 plan; P1 items block MVP sign-off per
  the rule in [Architecture Overview](../README.md).
- Every P1 mitigation should have a test that fails without it. A mitigation with no test is
  an intention, not a control.

## Source References

- [Security Architecture](./security-architecture.md)
- [Interface Design Standards](../interfaces/interface-standards.md)
- [Database Design](../database/database-design.md)
- [Architecture Solution Design](../core/architecture-solution-design.md)
- [F-002 Dedup on Re-Run](../../01-requirements/f-002-dedup-on-rerun.md)
- [F-008 Provider Authentication & Configuration](../../01-requirements/f-008-provider-auth-configuration.md)
- [Out of Scope for MVP](../../00-context/out-of-scope.md)
- [ADR Decision Log](../../04-decisions/README.md)

---

**Last Updated**: 2026-09-01
