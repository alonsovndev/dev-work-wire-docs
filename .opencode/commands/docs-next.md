---
description: Read-only status check across all numbered docs/ sections — reports completion and tells you which /docs-* command to run next.
---

# /docs-next

Read-only. Do not edit any files.

1. **Scan** every file under `docs/00-context/`, `docs/01-requirements/`,
   `docs/02-planning/`, `docs/04-decisions/`, `docs/03-architecture/` (all six
   subfolders), and `docs/05-prototype/` for remaining `[bracket placeholder]`
   markers. Treat `f-000-feature-template.md` and `adr-template.md` themselves as
   templates, not progress signals — judge those sections by whether any
   `f-0XX-*.md` / `adr-0XX-*.md` files exist beyond the template.

2. **Report**, per section, one line: section name, rough completion (e.g.
   "not started" / "in progress" / "looks complete"), and a one-line note of what's
   most obviously missing.

3. **Recommend** the single next command to run, following this order:
   `/docs-context` → `/docs-requirements` → `/docs-planning` → `/docs-decisions` →
   `/docs-architecture` → `/docs-prototype`. Pick the earliest section in that
   order that isn't "looks complete" — sections must be worked in this order since
   each depends on the ones before it (per the "Source References" sections in
   each README and the explicit step list in `docs/intro.md`).

4. If every section looks complete, check whether `work-items/` exists at the repo
   root with any `EPIC-*` folders in it. If not, recommend `/docs-work-items` next
   — it generates real Jira-ready epics/stories from the finished docs. If
   `work-items/` already has content, say every section looks complete and point
   to the final external step in `docs/intro.md` (importing those work items into
   Jira), which is outside this repo and not covered by these commands.
