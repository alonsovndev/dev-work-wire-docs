---
description: Guided fill-in of docs/00-context (overview, personas, glossary, out-of-scope) — asks up to 10 open questions (fewer if that's enough), then writes the answers into the docs.
---

# /docs-context

Guide the user through completing `docs/00-context/`. This is the root of the
documentation dependency graph — nothing downstream (`01-requirements`,
`02-planning`, `03-architecture`, `05-prototype`) has a prerequisite, so there is no
prerequisite check for this command.

Follow this procedure:

1. **Read the section.** Read `docs/00-context/README.md`, `overview.md`,
   `user-personas.md`, `glossary.md`, and `out-of-scope.md` in full.

2. **Scan for open items.** Identify every `[bracket placeholder]`, empty
   table row, and any inline "Open Questions" entry across these five files.
   Prioritize `overview.md` first (tagline, core concept, problem statement,
   primary audience) since almost everything else in the section — and in later
   sections — restates or links back to it.

3. **Rank and cap at 10.** Use as few questions as the section actually needs —
   often 5 or fewer is enough for a lightly-scoped section. Go up to 10 only when
   the section genuinely has that many independent open items worth asking about.
   Choose items that unlock the most content elsewhere in this section (e.g.
   tagline + core concept + problem statement + primary persona + key
   differentiators) over minor items from the same paragraph. Skip items a
   higher-priority answer already resolves.

4. **Ask.** Ask the user directly in chat, in plain language (not raw template
   field names), batching the questions together into a short numbered list rather
   than one message per question. If the user's answer to one question makes
   another moot, drop it rather than asking anyway.

5. **Write.** Apply clear technical-writing and Markdown formatting practice (use a
   technical-writer/markdown-author skill or subagent if your setup has one). Edit
   the target files directly, replacing the placeholders the questions covered.
   Update the `**Last Updated**` field to today's date in each file you touch.
   Leave every placeholder you did not ask about untouched — do not invent content
   for it.

6. **Keep the glossary and out-of-scope docs light-touch.** Only fill entries in
   `glossary.md` or `out-of-scope.md` if the user's answers directly surfaced a
   term or an explicit exclusion; otherwise leave them as templates for now — they
   are meant to accumulate over time as later sections are written.

7. **Summarize.** List what was written and what remains as `[placeholder]`/TBD in
   this section. Tell the user to run `/docs-requirements` next.
