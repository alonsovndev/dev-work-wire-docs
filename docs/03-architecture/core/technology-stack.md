# Technology Stack

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | [Project Name]              |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Overview

Component-level technology choices with rationale. Every significant choice here should trace to an ADR in [04-decisions](../../04-decisions/README.md).

## Technology Stack Matrix

| Component        | Technology   | Description / Rationale                          | ADR       |
| ---------------- | ------------ | ------------------------------------------------ | --------- |
| Frontend         | [Framework]  | [Why this framework fits the project.]           | [ADR-xxx] |
| UI Library       | [Library]    | [Rationale.]                                     | [ADR-xxx] |
| Client State     | [Library]    | [Rationale.]                                     | [ADR-xxx] |
| Backend          | [Framework]  | [Rationale.]                                     | [ADR-xxx] |
| ORM / Data Access| [Library]    | [Rationale.]                                     | [ADR-xxx] |
| Auth             | [Approach]   | [Rationale.]                                     | [ADR-xxx] |
| Database         | [Engine]     | [Rationale.]                                     | [ADR-xxx] |
| Object Storage   | [Service]    | [Rationale, if needed.]                          | [ADR-xxx] |
| Hosting / Compute| [Platform]   | [Rationale.]                                     | [ADR-xxx] |
| IaC              | [Tool]       | [Rationale.]                                     | [ADR-xxx] |
| Observability    | [Tools]      | [Rationale.]                                     | [ADR-xxx] |
| CI/CD            | [Tool]       | [Rationale.]                                     | [ADR-xxx] |

## Key Integration Patterns

### Frontend ↔ Backend

[Protocol, contract conventions (see [API Design Standards](../api/api-design-standards.md)), error handling expectations.]

### Backend ↔ Database

[Connection strategy, pooling, migration approach — link the migration ADR.]

### Auth Flow

[High-level token/session flow — link the auth ADR and [Security Architecture](../security/security-architecture.md).]

### Observability

[How frontend and backend report errors and metrics — link the monitoring ADR.]

## Scalability & Performance Strategy

[How the stack supports the performance and scalability NFRs: caching, connection pooling, CDN, background jobs.]

## Source References

- [Architecture Solution Design](./architecture-solution-design.md)
- [Architecture Styles](./architecture-styles.md)
- [ADR Decision Log](../../04-decisions/README.md)

---

**Last Updated**: YYYY-MM-DD
