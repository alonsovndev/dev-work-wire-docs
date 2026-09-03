# Security

## Overview

Security architecture and threat modeling for DevWorkWire.

> **Scope note.** DevWorkWire is a locally installed CLI and stdio MCP server — no server,
> no listening port, no accounts, no sessions, no login. The conventional web-application
> controls (auth endpoints, JWTs, RBAC, CORS, security headers, WAF) do not apply and are
> marked Not Applicable rather than filled in. The controls that matter here are different
> in kind: **an unreviewed write to a real backlog, a leaked API token, and a compromised
> release.**

## Documents

| Document | Description |
| -------- | ----------- |
| [security-architecture.md](./security-architecture.md) | Trust boundaries, the confirm gate as a security control, outbound auth, data protection, OWASP mapping, secrets, supply chain, and security testing |
| [threat-model.md](./threat-model.md) | STRIDE enumeration (T-001…T-019), risk matrix, P1/P2/P3 mitigation plan, and accepted risks |

## The Three Threats That Shape This Design

1. **An unintended write.** DevWorkWire runs with the user's *legitimate* credentials and
   *correct* authorization. The risk is not unauthorized access — it is an action taken
   with valid authority but without the user's intent, most plausibly because an AI agent
   was manipulated or mistaken. **The confirm gate is the control**, which is why it lives
   in `WorkItemService` where no caller can route around it, and why no bypass flag exists.
2. **A leaked token.** The Jira API token grants full user-level tracker access. It is
   environment-only, memory-only, never written to any file, and redacted by a logging
   filter rather than by call-site discipline.
3. **A compromised release.** DevWorkWire executes on developer machines holding live
   credentials, and already-installed copies cannot be recalled. PyPI Trusted Publishing
   (no long-lived token to steal) plus PEP 740 attestations are proportionate to that.

## P1 Mitigations — Must Ship With MVP

From the [threat model's mitigation plan](./threat-model.md#p1--critical-must-fix-before-mvp):

- Confirm gate in the core, plus a CI architecture guard and gate regression tests (R-002)
- Token redaction as a logging filter, with a max-verbosity test (R-003)
- `yaml.safe_load` only, enforced by lint (R-007)
- Commit rejected when any drifted item lacks an explicit resolution (R-005)
- No blind retry of creates; idempotency keys with stored-result replay (R-006)
- Tracker content delimited and labeled as untrusted data to the agent (R-004)
- PyPI name registered and Trusted Publishing configured **before the first release** (R-001)

> **Rule:** every P1 mitigation needs a test that fails without it. A mitigation with no
> test is an intention, not a control.

## Related ADRs

- [ADR-004](../../04-decisions/adr-004-mcp-stdio-confirm-gate.md) — stdio-only transport and the confirm-gate contract
- [ADR-006](../../04-decisions/adr-006-config-and-secrets.md) — config and secrets handling
- [ADR-007](../../04-decisions/adr-007-packaging-and-release.md) — release integrity (Trusted Publishing, attestations)
- [ADR-008](../../04-decisions/adr-008-quality-toolchain-github-actions.md) — security toolchain and gate regression tests

## Requirements Coverage

| Requirement | Control |
| ----------- | ------- |
| [FR-001-04](../../01-requirements/f-001-validate-preview-commit.md) | Confirm gate in `WorkItemService`; deny by default on writes |
| [FR-002-03/04](../../01-requirements/f-002-dedup-on-rerun.md) | Drift detection with mandatory per-item resolution (T-011) |
| [FR-004-02/03](../../01-requirements/f-004-mcp-tool-surface.md) | Preview handle + explicit confirmation; no bypass path exists (T-004) |
| [FR-007-04](../../01-requirements/f-007-progress-reporting.md) | Progress writes share the same gate |
| [FR-008-02](../../01-requirements/f-008-provider-auth-configuration.md) | Token from process environment only; no `.env` auto-loading |
| [FR-008-03](../../01-requirements/f-008-provider-auth-configuration.md) | Config validated before any Jira call |
| [NFR-004-01](../../01-requirements/f-004-mcp-tool-surface.md) | Mandatory `result_type` (T-003) |
| [NFR-008-01](../../01-requirements/f-008-provider-auth-configuration.md) | Redaction filter; token never persisted (T-007) |
| [NFR-X01](../../01-requirements/README.md#cross-cutting-quality-baseline) | `pip-audit` gating CI; Dependabot; CodeQL; OWASP mapping |
| [NFR-X02](../../01-requirements/README.md#cross-cutting-quality-baseline) | **Partially covered** — no PII in the permanent index, but transient plan storage is an unresolved tension. See [Database Design](../database/database-design.md#risks-and-open-questions) |
