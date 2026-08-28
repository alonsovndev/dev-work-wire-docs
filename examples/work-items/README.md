# Work Items — Reference Example

> **Not part of the documentation template.** This folder is a reference example only.

In projects that use this template, epics and user stories are managed in **Jira** (or your
tracker of choice) and are **not** committed to the documentation repository.

## What this folder shows

A generic, reusable foundational epic with filled-in examples:

- **EPIC-0-foundational/** — a foundational epic with:
  - `epic.md` — epic metadata, problem statement, scope, and release checklist
  - `stories.md` — spike stories (framework selection) and role-grouped user stories (backend, frontend, devops) with Jira-ready fields

This serves as a starting point for any new project using this template.

## Story structure

Each story follows this pattern:

- **Story ID** — unique identifier (e.g., `US-EP0-BE-001`)
- **Epic Link** — parent epic key
- **Priority** — Must Have / Should Have / Spike
- **Effort Estimate** — story points
- **User Story** — As a [role], I want to [action], So that [benefit]
- **Acceptance Criteria** — Given/When/Then format
- **Deliverables** — concrete outputs
- **Dependencies** — links to architecture docs or ADRs
- **Success Metrics** — measurable outcomes

## When starting a new project from the template

1. Copy or reference `EPIC-0-foundational/` as a starting point for your foundational epic.
2. Adapt the stories to your specific technology stack and architecture decisions.
3. Delete this entire `examples/` folder once your project's epics are in Jira.
