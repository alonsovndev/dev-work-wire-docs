# Copilot Instructions — template-docs

<!-- ai-repo-setup:generated:start -->
Workspace baseline instructions apply first (see `~/.copilot/.github/instructions/copilot-instructions.md`,
`INSTRUCTION-PRECEDENCE.md`, `PERFORMANCE-BUDGET.md`). This file adds only rules specific
to this repo.

## Repo Structure

Docs-only repository (Docusaurus site). No custom frontend app work, no backend.

- **Docs**: `docs/` — content lives here, organized as `00-context`, `01-requirements`,
  `02-planning`, `03-architecture`, `04-decisions`, `05-prototype`. Includes Mermaid
  diagrams (notably under `docs/03-architecture/`).
- **Frontend**: N/A — `src/` is Docusaurus scaffolding only, not an app to build features in.
- **Backend**: N/A.

## Skill Routing

- `technical-writer` — drafting/rewriting/reviewing docs content (ADRs, architecture,
  requirements, planning).
- `markdown-author` — Markdown structure, headings, lists, tables, links.
- `mermaid-author` — Mermaid diagram syntax/labels/placement (already used in this repo).

## Conventions

- Keep new pages inside the existing numbered top-level structure and respect each
  section's `_category_.json` / `README.md`.
<!-- ai-repo-setup:generated:end -->

<!-- ai-repo-setup:custom:start -->
<!-- Add project-specific rules below this line. Preserved across re-runs. -->
<!-- ai-repo-setup:custom:end -->
