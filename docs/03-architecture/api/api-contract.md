# API Contract

| Attribute        | Value                       |
| ---------------- | --------------------------- |
| **Project**      | [Project Name]              |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |

## Table of Contents

- [API Scope and Conventions](#api-scope-and-conventions)
- [Endpoint Catalog](#endpoint-catalog)
- [Shared JSON Schemas](#shared-json-schemas)
- [Detailed Endpoint Contracts](#detailed-endpoint-contracts)
- [Standard Error Examples by Status](#standard-error-examples-by-status)
- [Observability](#observability)
- [Deployment Impact](#deployment-impact)
- [Source References](#source-references)

## API Scope and Conventions

- Base path: `/api/v1`
- Conventions follow [API Design Standards](./api-design-standards.md) (naming, versioning, error format, pagination).
- Roles referenced below are defined in the [Glossary](../../00-context/glossary.md).

## Endpoint Catalog

> One row per endpoint. Group rows by domain with a subheading when the catalog grows.

| Method | Endpoint | Description | Roles |
| ------ | -------- | ----------- | ----- |
| POST   | `/api/v1/[resources]`        | [Create a resource]        | [Role] |
| GET    | `/api/v1/[resources]`        | [List resources, paginated] | [Role] |
| GET    | `/api/v1/[resources]/{id}`   | [Get one resource]         | [Role] |
| PATCH  | `/api/v1/[resources]/{id}`   | [Update a resource]        | [Role] |
| DELETE | `/api/v1/[resources]/{id}`   | [Delete/archive a resource] | [Role] |

## Shared JSON Schemas

### Error Response Schema

```json
{
  "error": {
    "code": "STRING_STABLE_CODE",
    "message": "Human-readable message",
    "details": [],
    "requestId": "req_12345"
  }
}
```

### Pagination Schema (Collection Responses)

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### Status Code Matrix

| Status | Meaning in this API |
| ------ | ------------------- |
| 200 | Success with response body |
| 201 | Resource created |
| 204 | Success without response body |
| 400 | Malformed request or failed validation |
| 401 | Missing/invalid credentials |
| 403 | Authenticated but not allowed |
| 404 | Resource not found |
| 409 | Conflict with current resource state |
| 422 | Semantically invalid request |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |

## Detailed Endpoint Contracts

> Use this format for every endpoint. Each contract specifies: method and URL, description,
> request schema + example, response schema + example, and the status codes it can return.

### 1) [Endpoint Name]

`POST /api/v1/[resources]`

[What this endpoint does, who can call it, and key business rules.]

**Request**

```json
{
  "name": "string"
}
```

**Response — 201**

```json
{
  "id": "uuid",
  "name": "string",
  "createdAt": "2026-01-15T14:30:00Z"
}
```

**Status codes:** `201`, `400`, `401`, `403`, `422`

## Standard Error Examples by Status

> Keep one canonical example per status code so clients can rely on the shape.

### 400 Bad Request

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": [{ "field": "name", "issue": "required" }],
    "requestId": "req_12345"
  }
}
```

### 401 Unauthorized

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required.",
    "details": [],
    "requestId": "req_12345"
  }
}
```

### 404 Not Found

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

### 409 Conflict

```json
{
  "error": {
    "code": "STATE_CONFLICT",
    "message": "The operation conflicts with the current resource state.",
    "details": [],
    "requestId": "req_12345"
  }
}
```

### 422 Unprocessable Entity

```json
{
  "error": {
    "code": "UNPROCESSABLE_REQUEST",
    "message": "The request is well-formed but semantically invalid.",
    "details": [],
    "requestId": "req_12345"
  }
}
```

### 429 Too Many Requests

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Retry after the indicated period.",
    "details": [],
    "requestId": "req_12345"
  }
}
```

### 500 Internal Server Error

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred.",
    "details": [],
    "requestId": "req_12345"
  }
}
```

## Observability

- Every error carries `requestId` for correlation with logs and error tracking.
- Domain-specific error codes should be registered here as they are introduced.

## Deployment Impact

- Contract changes follow the versioning and deprecation rules in [API Design Standards](./api-design-standards.md).
- Breaking changes require a new major version and a compatibility window.

## Source References

- [API Design Standards](./api-design-standards.md)
- [Feature Requirements](../../01-requirements/README.md)
- [Security Architecture](../security/security-architecture.md)

---

**Last Updated**: YYYY-MM-DD
