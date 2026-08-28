# Architecture Overview

## How to Use

- Every section links to a document that contains the authoritative decision or design for that concern.
- Every significant decision must link to at least one ADR.
- Keep this README as the single navigation entry point for the architecture folder.
- Add new sections only when a domain concern is not yet covered.

---

## 1. Core Architecture

Files in `core/`:

- **[Architecture Solution Design](./core/architecture-solution-design.md)**: System context, selected pattern, component design, data flow, and high-level trade-offs.
- **[Architecture Styles](./core/architecture-styles.md)**: Architecture style evaluation, bounded context map, and evolution strategy.
- **[Technology Stack](./core/technology-stack.md)**: Component-level technology choices with rationale and trade-offs.

## 2. Database

Files in `database/`:

- **[Database Domain Overview](./database/README.md)**: Database architecture domain with schema design guidance and best-practice checklists.
- **[Database Design](./database/database-design.md)**: Entities, relationships, ERD, constraints, and access patterns.

## 3. API and Communication

Files in `api/`:

- **[API Design Standards](./api/api-design-standards.md)**: REST conventions, versioning, error handling, and naming rules.
- **[API Contract](./api/api-contract.md)**: Endpoint catalog and shared JSON schemas.

## 4. Deployment and Operations

Files in `ops/`:

- **[Deployment Architecture](./ops/deployment-architecture.md)**: Platform model, compute, networking, scaling, and disaster recovery.
- **[CI/CD Pipeline](./ops/ci-cd-pipeline.md)**: Branching strategy, pipeline stages, migration strategy, rollback, and secrets handling.
- **[Monitoring and Observability](./ops/monitoring-observability.md)**: SLIs, dashboards, alerting rules, and release health checks.

## 5. Security

Files in `security/`:

- **[Security Architecture](./security/security-architecture.md)**: Authentication, authorization, data protection, OWASP controls, and secrets management.
- **[Threat Model](./security/threat-model.md)**: STRIDE-based threat enumeration, risk matrix, and mitigation plan.

## 6. Diagrams and Decision Records

- **[Diagrams](./diagrams/)**: Architecture diagrams embedded as Mermaid in markdown — C4 models, flows, deployment, security.
  - [Sequence Diagrams](./diagrams/sequence-diagrams.md): Key interaction flows with detailed explanations.
  - For large or complex diagrams you may also keep source files (e.g. `.drawio`) next to the exported images.
- **[ADRs](../04-decisions/README.md)**: Architecture Decision Records with context, decision, and trade-offs.
  - Start with the [ADR Template](../04-decisions/adr-template.md) for all new decisions.

---

## 7. Architecture Domain → Requirements Coverage

This matrix confirms every Must-priority requirement is addressed by at least one architecture domain. Update whenever ADRs or requirements change.

| Architecture Domain       | Must FR(s) Covered | Must NFR(s) Covered | Key ADR(s) |
| ------------------------- | ------------------ | ------------------- | ---------- |
| Core Architecture         | [FR-xxx]           | [NFR-Xnn]           | [ADR-xxx]  |
| API and Communication     | [FR-xxx]           | [NFR-Xnn]           | [ADR-xxx]  |
| Deployment and Operations | [FR-xxx]           | [NFR-Xnn]           | [ADR-xxx]  |
| Security                  | [FR-xxx]           | [NFR-Xnn]           | [ADR-xxx]  |
| Database                  | [FR-xxx]           | [NFR-Xnn]           | [ADR-xxx]  |

> **Rule:** Any Must FR or NFR with no domain coverage is an architecture gap — create an ADR before phase sign-off.
