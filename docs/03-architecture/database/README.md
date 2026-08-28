# Database

## Overview

Database architecture domain: schema design, integrity rules, access patterns, and migration guidance.

## Documents

| Document | Description |
| -------- | ----------- |
| [database-design.md](./database-design.md) | Entities, relationships, ERD, constraints, and access patterns |

## Related ADRs

Record database decisions in [04-decisions](../../04-decisions/README.md) and link them here as they are accepted (database engine, ORM, migration strategy).

- [ADR Decision Log](../../04-decisions/README.md)

## Scope

This domain covers:

- Logical and physical schema design
- Constraints and integrity rules
- Indexing and access patterns
- Data access control
- Migration and evolution strategy

## Requirements Coverage

| Requirement | Schema Element(s) | Notes |
| ----------- | ----------------- | ----- |
| [FR-xxx-xx] | [table/column]    | [How the schema satisfies it] |
| [NFR-Xnn]   | [table/column/index] | [How the schema satisfies it] |

## Database Best Practices Applied

> Adapt this checklist to your engine (PostgreSQL shown as a common default).

### Schema Design

- Every table has a primary key and `created_at` / `updated_at` timestamps.
- Enums are stored as constrained values (check constraints or lookup tables).
- Soft deletion is explicit (status column or `deleted_at`) where retention rules require it.

### Indexing Strategy

- Index foreign keys and columns used in list filters.
- Composite indexes follow query access patterns (most selective column first).
- Review index usage after real query load appears.

### Security & Access Control

- Application connects with least-privilege credentials.
- Row-level access rules are enforced [at the database layer / in application queries].
- Sensitive columns are identified and protected (see [Security Architecture](../security/security-architecture.md)).

### Data Integrity

- Foreign keys and NOT NULL constraints enforced at the database level.
- Business invariants that span tables are enforced in the domain layer with transactional boundaries.

### Connection Management

- Pooling configured per environment; pool sizes documented.
- Connection limits aligned with the deployment platform constraints.

## Source References

- [Database Design](./database-design.md)
- [ADR Decision Log](../../04-decisions/README.md)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
