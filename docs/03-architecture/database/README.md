# Local import state

The current CLI uses `.devworkwire-import.json` beside the Markdown folder to
record Jira keys, source hashes, and pending attempts. It has no SQLite
preview database. See the
[current architecture](../core/architecture-solution-design.md) and
[CLI contract](../interfaces/interface-contract.md).

The [database design](./database-design.md) is the earlier, deferred SQLite
proposal associated with [ADR-005](../../04-decisions/adr-005-local-sqlite-state-store.md).
It does not describe a shipped schema.
