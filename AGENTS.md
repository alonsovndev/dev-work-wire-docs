# AGENTS.md — template-docs

<!-- ai-repo-setup:generated:start -->
## Repo Structure

This is a **docs-only** repository: a Docusaurus site whose purpose is the documentation
content itself, not a custom application.

- **Docs**: `docs/` — Docusaurus content (context, requirements, planning, architecture,
  decisions, prototype). Includes Mermaid diagrams (e.g.
  `docs/03-architecture/diagrams/sequence-diagrams.md`, and diagrams embedded in
  architecture/security/database docs).
- **Frontend**: not applicable. `src/` is Docusaurus site scaffolding (homepage, CSS) —
  not a custom app; no Vite, no Ant Design, no app-level React work is expected here.
- **Backend**: not applicable — this repo has no backend/API code.

## Global Baseline

Machine-global baseline instructions load automatically from this machine's
`ai-engineer-setup` install (`~/.claude/AGENTS.md`, opencode's configured `instructions`,
and the Copilot workspace instructions under `~/.copilot/.github/instructions`). This file
only adds rules specific to **this** repository — it does not restate global ones.

## Area-Specific Guidance

### Docs (`docs/`)

- Use the `technical-writer` skill for drafting/rewriting/reviewing documentation content
  (ADRs, architecture docs, requirements, planning artifacts, glossaries).
- Use the `markdown-author` skill for Markdown formatting, structure, and consistency.
- Use the `mermaid-author` skill when creating or editing Mermaid diagrams — this repo
  already relies on them under `docs/03-architecture/`.
- Follow the existing numbered top-level structure (`00-context`, `01-requirements`,
  `02-planning`, `03-architecture`, `04-decisions`, `05-prototype`) and each section's
  `_category_.json` / `README.md` conventions when adding new pages.
<!-- ai-repo-setup:generated:end -->

<!-- ai-repo-setup:custom:start -->
<!-- Add project-specific rules below this line. Preserved across re-runs. -->
<!-- ai-repo-setup:custom:end -->
