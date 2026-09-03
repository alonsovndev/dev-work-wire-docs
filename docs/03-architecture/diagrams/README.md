# Diagrams

Architecture diagrams for DevWorkWire. Diagrams are embedded as **Mermaid** blocks directly
in markdown so they stay versioned, reviewable, and diffable alongside the docs they
explain.

## Diagram Inventory

| Type | Location | Purpose |
| ---- | -------- | ------- |
| Sequence diagrams (10 flows) | [sequence-diagrams.md](./sequence-diagrams.md) | Key interaction flows: pre-flight, import, dedup and drift, MCP preview/commit, idempotent retry, fail-fast, rejected commits, query, progress, state rebuild |
| System context | [Architecture Solution Design](../core/architecture-solution-design.md#system-context) | System boundary, both front doors, and the external tracker |
| Component design | [Architecture Solution Design](../core/architecture-solution-design.md#component-design) | Modules, ports, adapters, and the composition root |
| Evolution triggers | [Architecture Styles](../core/architecture-styles.md#evolution-strategy) | What would change the architecture, and what would not |
| ERD | [Database Design](../database/database-design.md#entity-relationship-diagram-erd) | Local state store entities and relationships |
| Trust boundaries | [Security Architecture](../security/security-architecture.md#security-architecture-overview) | Untrusted input, the confirm gate, and the credential path |
| Release pipeline | [CI/CD Pipeline](../ops/ci-cd-pipeline.md#6-pipeline-stages) | PR checks, release candidate, and the publish flow |
| Distribution model | [Deployment Architecture](../ops/deployment-architecture.md#distribution-model) | Tag to PyPI to user machine |

## Conventions

- **Mermaid only.** Every diagram here renders natively in Docusaurus, so there are no
  exported images to regenerate and no binary files that drift from the text around them.
- **Diagrams follow the contracts, not the other way round.** Where a diagram disagrees
  with [Interface Contract](../interfaces/interface-contract.md) or
  [Database Design](../database/database-design.md), those documents win and the diagram is
  a bug.
- **Every sequence flow carries a "Key details" note** covering edge cases, error paths, and
  security checks — the parts a diagram cannot show.
- **Every flow appears in the [coverage table](./sequence-diagrams.md#diagram-coverage-by-feature)**
  mapped to the features and NFRs it demonstrates.
- Avoid parentheses and semicolons inside Mermaid message labels; they are the most common
  cause of a diagram that silently fails to render.

> For a diagram Mermaid genuinely cannot express, keep the source file (e.g. `.drawio`) in
> this folder and commit the exported image next to it. Nothing currently needs this.

## Related Documents

- [Architecture Overview](../README.md)
- [Architecture Solution Design](../core/architecture-solution-design.md)
- [Interface Contract](../interfaces/interface-contract.md)
- [Database Design](../database/database-design.md)
- [Security Architecture](../security/security-architecture.md)
- [CI/CD Pipeline](../ops/ci-cd-pipeline.md)
