# API Design Standards

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | [Project Name]              |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Table of Contents

- [API Style](#api-style)
- [Versioning Strategy](#versioning-strategy)
- [Error Handling Standards](#error-handling-standards)
- [Response Format Conventions](#response-format-conventions)
- [Authentication and Authorization Patterns](#authentication-and-authorization-patterns)
- [Rate Limiting and Throttling](#rate-limiting-and-throttling)
- [Observability](#observability)
- [Deployment Impact](#deployment-impact)
- [Source References](#source-references)

## API Style

- **Primary style:** REST JSON APIs for all core business workflows.
- **GraphQL stance:** [Adopt / not adopted — state the reason, e.g. operational and governance complexity for MVP.]
- **Resource naming:** plural, kebab-case nouns in paths (e.g., `/api/v1/projects`, `/api/v1/orders`).
- **Relationship access:** nested routes only when ownership is explicit (e.g., `/api/v1/projects/{projectId}/tasks`).
- **Action endpoints:** avoid verbs in URLs; non-CRUD actions use sub-resources (e.g., `/approve`, `/archive`) only when domain-specific behavior is required.

## Versioning Strategy

- **Default:** URL-based semantic major versioning: `/api/v1/...`.
- **Change policy:**
  - non-breaking changes (optional fields, new endpoints) stay in the same major version,
  - breaking contract changes require a new major version (`v2`).
- **Deprecation window:** maintain previous major version for at least one release cycle with explicit deprecation notice in API documentation.

## Error Handling Standards

- **Transport semantics:** use standard HTTP status codes.
- **Minimum status code set:** `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`.
- **Canonical error payload:**

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found.",
    "details": [],
    "requestId": "req_12345"
  }
}
```

- **Rules:**
  - `code` is stable and machine-readable,
  - `message` is human-readable and safe for clients,
  - `details` is optional structured validation/context data,
  - `requestId` is required for traceability across logs and error-tracking events.

## Response Format Conventions

- **Format:** `application/json; charset=utf-8`.
- **Field naming:** `camelCase` for request and response payload fields.
- **Datetime format:** ISO 8601 UTC (`YYYY-MM-DDTHH:MM:SSZ`), for example `2026-01-15T14:30:00Z`.
- **Boolean fields:** use `is/has/can` prefixes where meaningful (e.g., `isArchived`).
- **Collection envelope and pagination (offset-based default):**

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 125,
    "totalPages": 7
  }
}
```

- **Pagination defaults:** `page=1`, `pageSize=20`, maximum `pageSize=100`.

## Authentication and Authorization Patterns

- **Authentication:** [Mechanism, e.g. JWT bearer tokens] — `Authorization: Bearer <token>` for protected routes. See the authentication ADR in [04-decisions](../../04-decisions/README.md).
- **Authorization model:** [e.g. hybrid RBAC + data-level policies].
  - API layer enforces role permissions ([list roles from the glossary](../../00-context/glossary.md)).
  - [Data-layer enforcement mechanism, if any.]
- **Token requirements:** [Lifetime, rotation, and revocation rules.]
- **Service trust boundary:** backend validates token signature, expiration, and required claims on every protected request.

## Rate Limiting and Throttling

- **Baseline policy (per authenticated user/IP):**
  - [N] `requests/minute` for standard read/write endpoints,
  - stricter limits for auth-sensitive endpoints ([limits for login, verification, password reset]).
- **Limit response:** return `429 Too Many Requests` with `Retry-After` header.
- **Response body for throttling:** same canonical error format with `code=RATE_LIMIT_EXCEEDED`.
- **Implementation approach:** [e.g. backend middleware with database-backed counters and endpoint-level guardrails.]

## Observability

- Attach `requestId`, endpoint, actor role, and API version as context for API errors.
- Track key API metrics: error rate, p95 latency, and 429 frequency by route.
- Infrastructure-level API metrics are monitored by the platform observability stack (see [Monitoring and Observability](../ops/monitoring-observability.md)).
- Alert on sustained spikes in `5xx` and `429` responses.
- Use release tagging from CI to correlate regressions with deployments.

## Deployment Impact

- Validate API design changes on every pull request.
- Enforce backward-compatibility checks before merging breaking API changes.
- Rollback strategy: revert to prior release and maintain previous major API version during deprecation window.
- Manage environment variables/secrets for auth, rate-limiting configuration, and observability per environment.

## Source References

- [Architecture Solution Design](../core/architecture-solution-design.md)
- [Technology Stack](../core/technology-stack.md)
- [API Contract](./api-contract.md)
- [Feature Requirements](../../01-requirements/README.md)
- [Security Architecture](../security/security-architecture.md)

---

**Last Updated**: YYYY-MM-DD
