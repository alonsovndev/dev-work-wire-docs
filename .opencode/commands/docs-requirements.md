---
description: Guided fill-in of docs/01-requirements — creates one feature doc per named feature from f-000-feature-template.md, asking up to 10 open questions per pass (fewer if that's enough).
---

# /docs-requirements

Guide the user through populating `docs/01-requirements/`. Prerequisite:
`docs/00-context/` (primarily `overview.md` and `user-personas.md`).

Follow this procedure:

1. **Prerequisite check.** Read `docs/00-context/overview.md` and
   `user-personas.md`. If they still contain unresolved `[bracket placeholders]` in
   their core fields (tagline, core concept, primary audience), tell the user and
   confirm whether to proceed anyway or run `/docs-context` first.

2. **Read the section.** Read `docs/01-requirements/README.md` and
   `f-000-feature-template.md` to understand the required structure and status
   lifecycle (Draft → Review Pending → Clarified → Ready for Implementation).

3. **Establish scope.** If no `f-0XX-*.md` files exist yet besides the template,
   ask the user (as one of your questions) which feature(s) to document in this
   pass. Don't try to enumerate every feature the project will ever need — a
   handful per invocation keeps the questions focused; the user can run this
   command again for more features later.

4. **Per feature, scan and rank.** For each feature the user named, treat the
   template's placeholders as the open-item list (problem/goal, user story,
   acceptance criteria, out-of-scope notes, dependencies). Rank by what most
   changes downstream planning/architecture — acceptance criteria and dependencies
   usually matter most.

5. **Ask, capped at 10 total per command run** (across all features requested this
   pass, not 10 per feature). Use as few as the pass needs — often one key question
   per feature is enough; go higher only for features with genuinely independent
   open items. Ask directly in chat, batching questions into a short numbered list.
   Prefer breadth (one key question per feature) over depth on a single feature if
   multiple features were requested.

6. **Write.** Copy `f-000-feature-template.md` to `f-001-<slug>.md`,
   `f-002-<slug>.md`, etc. (numbering continues from the highest existing `f-0XX`
   file). Apply clear technical-writing/Markdown practice (use a
   technical-writer/markdown-author skill or subagent if available) to fill in the
   sections covered by the answers, set status to `Draft` or `Review Pending` as
   appropriate, and set the date fields. Leave uncovered sections as placeholders.

7. **Note the ADR handoff.** If any answer describes an infrastructure/technical
   decision rather than a requirement (per this section's README: "should be
   documented as ADRs in 04-decisions, not in this requirements specification"),
   don't put it in the feature doc — mention it in your summary as something to
   capture with `/docs-decisions`.

8. **Summarize.** List the feature docs created/updated and what's still open.
   Tell the user to run `/docs-planning` next (or re-run `/docs-requirements` for
   more features).
