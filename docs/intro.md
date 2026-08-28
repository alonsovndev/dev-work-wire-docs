---
sidebar_position: 0
---

# Introduction

Welcome to the documentation for **[Project Name]**.

This site is built with [Docusaurus](https://docusaurus.io/) and contains all project documentation: context, requirements, planning, architecture, decisions, and prototype references.

## Documentation Structure

| Folder | Contents |
| ------ | -------- |
| [00-context](./00-context/README.md) | Project overview, user personas, glossary, and out-of-scope items |
| [01-requirements](./01-requirements/README.md) | Feature requirements organized by feature slice |
| [02-planning](./02-planning/README.md) | Phased roadmap and role mapping |
| [03-architecture](./03-architecture/README.md) | Core architecture, API, database, diagrams, ops, and security |
| [04-decisions](./04-decisions/README.md) | Architectural Decision Records (ADRs) and decision log |
| [05-prototype](./05-prototype/README.md) | Prototype brief, design direction, and Pencil files |

> Update the links above once you rename the category folders for your project.

## How to Use This Template

1. **Start with `00-context/`** — fill in the project overview, personas, and glossary before writing requirements.
2. **Write requirements in `01-requirements/`** — use `f-000-feature-template.md` as the starting point for each new feature.
3. **Plan phases in `02-planning/`** — map features to phases, define roles, and track risks.
4. **Record decisions in `04-decisions/`** — use the [ADR Template](./04-decisions/adr-template.md) for every significant architectural choice.
5. **Design the architecture in `03-architecture/`** — fill in the solution design, API standards, database schema, and security posture.
6. **Prototype key flows in `05-prototype/`** — place your `.pen` file in `pen/` and document it with the brief and design direction.
7. **Set up work items in your tracker** — configure Jira (or your tracker of choice) using the epic and story field patterns documented in your team's tracker setup.

> **Using an AI coding agent?** Steps 1–7 above each have a matching guided slash command
> (`/docs-context`, `/docs-requirements`, `/docs-planning`, `/docs-decisions`,
> `/docs-architecture`, `/docs-prototype`, `/docs-work-items`) available for Claude Code,
> opencode, and GitHub Copilot that interviews you and writes the answers into these docs
> for you. Run `/docs-next` anytime to check section-by-section completion and get the
> next recommended command. See the
> [README's command table](https://github.com/your-org/template-docs#-generating-docs-with-ai-agents)
> for where each agent's commands live.

## Template Setup Checklist

- [ ] Replace `[Project Name]` in every file (use search-and-replace across `docs/`).
- [ ] Update `docusaurus.config.ts` with your project name, URL, and org.
- [ ] Replace `static/img/logo.svg` and `static/img/favicon.ico` with your branding.
- [ ] Delete `examples/` when you no longer need the reference work items.
- [ ] Update all `YYYY-MM-DD` dates as documents are filled in.
