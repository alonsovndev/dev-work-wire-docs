# F-007 Progress Reporting

| Attribute | Value |
|---|---|
| **Project** | DevWorkWire |
| **Version** | 0.2 |
| **Status** | Planned |
| **Owner** | Product Owner |

## Context

A developer or their terminal-capable agent may later report progress on a
Jira work item. None of these write commands exists in the current CLI. Their
implementation will follow the user's task approval model in
[ADR-011](../04-decisions/adr-011-cli-first-agent-integration.md).

## Functional requirements

| ID | Planned requirement | Acceptance criteria |
|---|---|---|
| FR-007-01 | Add a CLI command to post a comment. | The command posts the requested text once and reports the result in JSON mode. |
| FR-007-02 | Add a CLI command to transition an item. | The command applies the requested Jira transition and reports its outcome. |
| FR-007-03 | Add a CLI command to record a PR URL. | The URL is recorded against the work item; DevWorkWire does not create a PR. |
| FR-007-04 | Make retries safe where Jira supports no natural idempotency key. | A repeated or uncertain write is handled without silently duplicating a comment or reference. |

The command names and retry mechanism are `TBD` until this feature is designed.
The first AI skill must not describe these actions as available.

## References

- [CLI-first decision](../04-decisions/adr-011-cli-first-agent-integration.md)
- [Interface contract](../03-architecture/interfaces/interface-contract.md)
