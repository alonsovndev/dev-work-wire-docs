# Threat Model

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | [Project Name]              |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Scope and Method

**Method:** STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)

**Scope:** [Define what is modeled — the entire system, specific trust boundaries, or specific components. State what is intentionally excluded.]

## Assets to Protect

| Asset | Sensitivity | Owner | Notes |
| ----- | ----------- | ----- | ----- |
| [User credentials] | High | [User / Platform] | [Password hashing, token storage] |
| [Application data] | [Level] | [Owner] | [Classification] |
| [API keys / secrets] | High | [Platform] | [Managed via secrets strategy] |
| [Infrastructure config] | Medium | [Platform] | [IaC codebase] |

## Threats and Attack Vectors

| ID | Threat | Category | Vector | Impact | Mitigation |
| ---- | ------ | -------- | ------ | ------ | ---------- |
| T-001 | [e.g. Brute-force login] | Spoofing | [Direct API calls] | [Account compromise] | [Rate limiting, account lockout] |
| T-002 | [e.g. SQL injection] | Tampering | [Malformed input] | [Data breach] | [Parameterized queries, input validation] |
| T-003 | [e.g. Sensitive data in logs] | Info Disclosure | [Log aggregation] | [PII exposure] | [Field redaction rules] |
| T-004 | [e.g. Dependency vulnerability] | Tampering | [Supply chain] | [Code execution] | [Automated scanning, pin versions] |
| T-005 | [e.g. Excessive API requests] | Denial of Service | [Automated scripts] | [Service degradation] | [Rate limiting, WAF] |
| T-006 | [e.g. Privilege escalation] | Elevation of Privilege | [Role bypass] | [Unauthorized access] | [RBAC enforcement, least-privilege] |

## Risk Assessment Matrix

| Risk ID | Threat | Likelihood | Impact | Priority | Notes |
| ------- | ------ | ---------- | ------ | -------- | ----- |
| R-001 | T-001 | [Low/Med/High] | [Low/Med/High] | [P1/P2/P3] | [Notes] |
| R-002 | T-002 | [Low/Med/High] | [Low/Med/High] | [P1/P2/P3] | [Notes] |

## Mitigation Plan by Priority

### P1 — Critical (Must Fix Before MVP)

- [Mitigation 1, linked to risk R-xxx.]
- [Mitigation 2, linked to risk R-xxx.]

### P2 — Post-MVP (Fix in Phase 1)

- [Mitigation 3, linked to risk R-xxx.]

### P3 — Future (Monitor and Revisit)

- [Mitigation 4, linked to risk R-xxx.]

## Residual Risk and Review Cadence

### Accepted Risks

| Risk | Reason Accepted | Review Trigger |
| ---- | --------------- | ------------ |
| [Risk] | [Why it is accepted — cost vs. impact] | [When to revisit] |

### Review Triggers

- New threat category emerges (new integration, new user role).
- Incident occurs in a related system.
- Compliance or audit requirement changes.
- Major architecture change.

### Continuous Improvement

- Threat model is reviewed at least once per release cycle.
- New threats are added when new features or integrations ship.
- Mitigation status is tracked against the P1/P2/P3 plan.

## Source References

- [Security Architecture](./security-architecture.md)
- [Feature Requirements](../../01-requirements/README.md)
- [ADR Decision Log](../../04-decisions/README.md)

---

**Last Updated**: YYYY-MM-DD
