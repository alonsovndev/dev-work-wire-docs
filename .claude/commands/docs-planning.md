---
description: Guided fill-in of docs/02-planning (phased roadmap, role mapping) — asks up to 10 open questions (fewer if that's enough), then writes the answers into the docs.
---

# /docs-planning

Guide the user through completing `docs/02-planning/`. Prerequisite:
`docs/00-context/overview.md` and `docs/01-requirements/` (at least one feature
doc).

Follow this procedure:

1. **Prerequisite check.** Read `docs/00-context/overview.md` and list the feature
   docs in `docs/01-requirements/` (`f-0XX-*.md`, excluding the template). If no
   feature docs exist yet, tell the user and confirm whether to proceed anyway or
   run `/docs-requirements` first — the roadmap is meant to sequence real features.

2. **Read the section.** Read `docs/02-planning/README.md`, `phased-roadmap.md`,
   and `role-mapping.md`.

3. **Scan for open items.** Cross-reference the existing feature docs against
   `phased-roadmap.md`'s placeholder phases, and `role-mapping.md`'s placeholder
   roles/ownership. Prioritize: which phase each existing feature belongs to, MVP
   cut line, and who (roles, not names, unless the user wants names) owns each
   workstream.

4. **Ask, capped at 10.** Use as few as the section needs — often 5 or fewer is
   plenty; go higher only if there are genuinely that many independent phases,
   roles, or ownership gaps to resolve. Use `AskUserQuestion`, split across
   multiple calls of ≤4.

5. **Write.** Use `technical-writer` and `markdown-author` skills. Edit
   `phased-roadmap.md` and `role-mapping.md` directly, mapping the named features
   into phases and roles into the ownership table. Update status/date fields.
   Leave phases or roles not covered by the answers as placeholders.

6. **Summarize.** List what was written and what's still open. Tell the user to
   run `/docs-decisions` next.
