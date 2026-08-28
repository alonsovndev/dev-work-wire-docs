---
sidebar_position: 2
---

# User Personas

**Purpose:** Define core user personas aligned to the DevWorkWire overview to ensure requirements and workflows serve the target audiences.

> **Note:** the names, experience levels, and quotes below are illustrative — DevWorkWire has not yet run persona research or interviews. Treat the roles and goals as grounded in the product plan, and the rest as assumptions to validate later.

---

## Persona 1: Solo/Small-Team Developer (Primary)

**Name:** Maya
**Role:** Developer/tech lead who plans work in Markdown and runs `dwire` from the terminal
**Experience:** 5+ years professional development, comfortable with CLI tools, moderate familiarity with project management platforms like Jira

### Primary Goals

- Turn an already-refined Epic/Story/AC document into tickets in their project management platform without hand-creating each one in its UI.
- Re-run the same load after editing the source document and trust it updates in place instead of creating duplicates.

### Pain Points

- Manual copy-paste into their project management platform is slow and error-prone — easy to miss a parent/child link or an Acceptance Criterion.
- No safe way today to re-import an updated plan without risking duplicate Epics and Stories.

### Needs & Expectations

- A clear preview of exactly what will be created/updated before anything is written to the tracker.
- A guided CLI flow (validate → preview → confirm) plus search/select and insert-by-id for everyday backlog work.

### Success Indicators

- A refined plan document becomes a correct hierarchy in the project management platform in one confirmed pass, with zero duplicate tickets on re-run.

### Quote

> "I already did the thinking in my planning doc — I just want it in my tracker exactly as I wrote it, without babysitting the import."

---

## Persona 2: Developer Directing an AI Agent (Secondary)

**Name:** Idris
**Role:** Developer who has an AI coding agent (Claude Code, OpenCode, Copilot, etc.) load and progress work on their behalf via DevWorkWire's MCP server
**Experience:** 3+ years professional development, regularly delegates coding and backlog tasks to an AI agent

### Primary Goals

- Let the AI agent load a refined work structure and report progress (comments, status transitions) without writing custom integration code for their tracker.
- Stay in control of anything externally visible the agent does, even when it's operating autonomously.

### Pain Points

- Ad-hoc scripts or a generic project-management MCP integration give an agent no validation, preview, or confirm step before it writes to the tracker.
- Risk of an agent creating duplicate comments or tickets on retry, with no idempotency safety net.

### Needs & Expectations

- The same `import.preview` → `import.commit` confirm gate the CLI uses, applied to the agent's MCP calls — no separate, looser path.
- Idempotency hints on write-back actions (comments, transitions) so agent retries don't create duplicate noise.

### Success Indicators

- The agent can load and report progress end-to-end, but every externally-visible write still passes through a confirm step the developer trusts.

### Quote

> "I want my agent to move the backlog forward, not to have silent write access to our tracker."

---

## Source References

- [Project Overview](./overview.md)

---

**Last Updated**: 2026-08-28
