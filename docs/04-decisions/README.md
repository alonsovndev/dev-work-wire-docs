# Architectural Decisions

This folder contains the Architectural Decision Records (ADRs) for [Project Name]. An ADR captures a significant architectural decision, the context that led to it, and the consequences.

## Decision Log

> One row per ADR. Use sequential IDs (`ADR-001`, `ADR-002`, …) and file names
> `adr-XXX-short-slug.md`. Statuses follow the lifecycle:
> `Proposed → Accepted → (Superseded by ADR-xxx | Deprecated)`.

| ADR ID  | Title            | Status   |
| ------- | ---------------- | -------- |
| ADR-001 | [Decision title] | Proposed |
| ADR-002 | [Decision title] | Proposed |

## Recommended Decision Areas

Not every project needs all of these, but significant choices in these areas should each get an ADR. Use as a checklist during Phase 0 / early MVP:

- [ ] High-level architecture pattern (monolith, modular monolith, microservices)
- [ ] Backend framework and language
- [ ] Frontend framework and language
- [ ] Database choice
- [ ] Authentication and authorization strategy
- [ ] Deployment platform
- [ ] ORM / data access choice
- [ ] Build tooling
- [ ] Monitoring and observability
- [ ] Testing framework strategy
- [ ] Secrets management
- [ ] Containerization strategy
- [ ] Infrastructure as Code strategy
- [ ] Environment strategy (local / CI / dev / staging / prod)
- [ ] Code quality tooling (linters, formatters, type checkers)
- [ ] Git workflow and branch strategy
- [ ] Database migration strategy

## Creating a New ADR

Use the [ADR Template](./adr-template.md) for all new decisions.

## Related Documents

- [Architecture Overview](../03-architecture/README.md)
- [Technology Stack](../03-architecture/core/technology-stack.md)

---

**Last Updated**: YYYY-MM-DD
