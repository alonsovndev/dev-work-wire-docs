---
mode: agent
description: Generate real Jira-ready epics/stories into work-items/ from the completed docs, using examples/work-items/EPIC-0-foundational as the structural reference. Asks up to 10 open questions (fewer if that's enough).
---

# /docs-work-items

Guide the user through generating real epics and stories, ready to import into
Jira, once the documentation project is substantially finished. This is the last
repo-side step in `docs/intro.md`'s workflow, after `/docs-prototype`.

Follow this procedure:

1. **Prerequisite check.** Confirm the documentation project looks done: core
   fields in `docs/00-context/overview.md` are filled, at least one feature doc
   exists in `docs/01-requirements/`, `docs/02-planning/phased-roadmap.md` is
   filled, at least one ADR exists in `docs/04-decisions/`,
   `docs/03-architecture/core/` is filled, and `docs/05-prototype/prototype-brief.md`
   is filled. If any of these is still templated, tell the user and confirm
   whether to proceed anyway or finish the relevant `/docs-*` command first — work
   items generated from an unfinished plan will be incomplete.

2. **Read the reference format only.** Read `examples/work-items/README.md` and
   `examples/work-items/EPIC-0-foundational/epic.md` +
   `examples/work-items/EPIC-0-foundational/stories.md` to learn the exact field
   structure to reproduce (epic metadata, description sections, release checklist;
   per-story Story ID/Epic Link/Priority/Effort Estimate/Status/Labels, `As a/I
   want to/So that`, Given/When/Then acceptance criteria, Deliverables,
   Dependencies, Success Metrics, grouped by role). Treat everything under
   `examples/` as read-only reference — never edit, delete, or write into
   `examples/work-items/`.

3. **Read the real source docs.** Read every feature doc in
   `docs/01-requirements/` (excluding the template),
   `docs/02-planning/phased-roadmap.md` and `role-mapping.md`, every ADR in
   `docs/04-decisions/` (excluding the template), `docs/03-architecture/` (core,
   database, api, security, ops), and `docs/05-prototype/`.

4. **Scan for open items** a template can't infer on its own: how to group
   features into epics (one epic per roadmap phase vs. one per feature vs.
   something else), Jira project key/component naming conventions, the
   effort-estimate scale to use (story points vs. t-shirt sizes, etc.), and any
   role/story breakdown not already fully determined by `role-mapping.md`.

5. **Ask, capped at 10.** Use as few as actually needed — often the epic-grouping
   strategy and project key/components cover most of it. Ask directly in chat,
   batching questions into a short numbered list.

6. **Write.** Create a new `work-items/` folder at the repo root (sibling to
   `examples/`, not inside it) with one `work-items/EPIC-<N>-<slug>/epic.md` +
   `stories.md` pair per epic, following the exact structure read in step 2.
   Source content from the real docs: feature acceptance criteria become story
   acceptance criteria, ADRs become epic/story dependencies, architecture docs
   become deliverables/dependency links, and `role-mapping.md` determines how
   stories are grouped by role. Apply clear technical-writing/Markdown practice
   (use a technical-writer/markdown-author chat mode or extension if available).

7. **Summarize.** List the epics/stories created under `work-items/`. Note this is
   the last repo-side step before the external Jira-import step described in
   `docs/intro.md`, and mention (without deleting anything) that
   `examples/work-items/` can be deleted per its own README once the user no
   longer needs it as a reference.
