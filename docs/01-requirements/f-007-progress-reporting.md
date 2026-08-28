# F-007 Progress Reporting (Comments, Status Transitions, PR Reference)

| Attribute        | Value                       |
| ----------------- | --------------------------- |
| **Project**      | DevWorkWire                 |
| **Version**      | 0.1                         |
| **Status**       | Draft                       |
| **Readiness**    | Draft                       |
| **Owner**        | Product Owner               |

## Context

- **Problem**: Idris's agent needs to report progress — comments, status transitions, a link to the PR it produced — through the same trust gate as everything else, not a separate, looser path.
- **Primary Persona**: [Idris, Developer Directing an AI Agent](../00-context/user-personas.md#persona-2-developer-directing-an-ai-agent-secondary)
- **In Scope**: Adding a comment to a work item; transitioning a work item's status; recording/linking an existing PR URL against a work item (as a comment or dedicated reference field). All are externally-visible writes and go through the same confirm-before-execute gate as `import.commit`, per the [glossary's Trust Tier definition](../00-context/glossary.md#technical-terms).
- **Out of Scope**: DevWorkWire creating the pull request itself — explicitly excluded per [Out of Scope for MVP](../00-context/out-of-scope.md#git--source-control-automation). This feature only records a reference to a PR created elsewhere (e.g. by the agent's own git tooling). Idempotency mechanics reuse the client-supplied-key pattern established in [F-004](./f-004-mcp-tool-surface.md) rather than being redefined here.

## Open Questions

None currently blocking this feature.

## Functional Requirements

| ID        | Requirement                                                                                                    | Source                                                | Priority | Owner (DRI)   | Acceptance Criteria                                                                                                                        | Status |
| --------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| FR-007-01 | The system adds a comment to a work item, gated by explicit confirmation.                                       | [User Personas](../00-context/user-personas.md#needs--expectations-1) | Must     | Product Owner | Given comment text and a work item ID, the comment is posted to Jira only after explicit confirmation; declining results in zero writes.        | Draft  |
| FR-007-02 | The system transitions a work item's status, gated by explicit confirmation.                                    | [User Personas](../00-context/user-personas.md#needs--expectations-1) | Must     | Product Owner | Given a target status and a work item ID, the transition is applied in Jira only after explicit confirmation; declining results in zero writes. | Draft  |
| FR-007-03 | The system records a PR URL reference against a work item (as a comment or dedicated field), gated by the same confirmation, with no PR-creation logic in DevWorkWire. | User clarification (F-007 PR scope)                       | Must     | Product Owner | Given a PR URL and a work item ID, the reference is written to Jira only after explicit confirmation; DevWorkWire never calls a Git/GitHub API to create a PR. | Draft  |
| FR-007-04 | The system rejects any comment, transition, or PR-reference call that lacks explicit confirmation.               | User clarification (F-007 write-back gate)                 | Must     | Product Owner | Given a comment/transition/PR-reference call without a preceding confirmation, the call is rejected and no write reaches Jira.                   | Draft  |

## Feature-Scoped Non-Functional Requirements

| ID         | Requirement                                                                                                  | Metric / Target                                                                                                        | Priority | Owner (DRI) | Status |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- | ------ |
| NFR-007-01 | Comment, transition, and PR-reference writes accept a client-supplied idempotency key, consistent with F-004's `import.commit` pattern. | A retried call with the same idempotency key produces zero additional Jira writes, verified by test (mirrors NFR pattern in F-004). | Must     | Tech Lead   | Draft  |

## Dependencies and Risks

- **Dependencies**: [F-004](./f-004-mcp-tool-surface.md) (MCP tool surface, confirm gate, idempotency pattern); `WorkItemProvider`.
- **Risks**: An agent could mistakenly treat "the PR reference was recorded" as DevWorkWire having created the PR — mitigated by explicit feature-doc wording and the out-of-scope cross-reference above.

## Traceability

- **Related User Stories**: TBD
- **Related Architecture/ADR**: [Architecture Solution Design](../03-architecture/core/architecture-solution-design.md), [ADR-xxx](../04-decisions/README.md)
- **Related Prototype**: [Prototype Brief](../05-prototype/prototype-brief.md)

---

**Last Updated**: 2026-08-28
