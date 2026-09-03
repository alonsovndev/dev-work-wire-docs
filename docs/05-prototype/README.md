# Prototype

Terminal-session prototype for DevWorkWire's guided CLI flow. DevWorkWire has no GUI —
it is the `dwire` CLI plus an MCP server with no visual surface of its own — so the
prototype is a set of illustrative terminal transcripts, not a visual mockup file.

## Files

| File               | Purpose                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `Prototype Brief`  | Authoritative source of truth: screens (terminal states), user flows, scope, requirements coverage matrix |
| `Design Direction` | Terminal rendering direction: color/text-prefix conventions, component inventory, accessibility           |

## Reading the Prototype

The transcripts live directly in [`prototype-brief.md`](./prototype-brief.md) as fenced
code blocks under each screen. They're illustrative — they show the state and content a
Rich-rendered terminal would produce, not a pixel-accurate render.

## Scope

Covers Maya's (primary persona) CLI flows only: the guided `dwire import` flow, search/
select, and insert-by-id. The MCP tool surface and progress-reporting flows have no
visual surface of their own and are out of scope for this pass — see
[Out of Scope](./prototype-brief.md#out-of-scope) in the brief.

## Source References

- [Prototype Brief](./prototype-brief.md)
- [Design Direction](./design-direction.md)
- [Project Overview](../00-context/overview.md)
- [Requirements by Feature](../01-requirements/README.md)
- [Architecture](../03-architecture/README.md)
