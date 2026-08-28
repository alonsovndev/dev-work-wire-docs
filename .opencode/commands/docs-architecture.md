---
description: Guided fill-in of docs/03-architecture across core/database/api/security/ops/diagrams — asks up to 10 open questions per subfolder pass (fewer if that's enough), then writes the answers.
---

# /docs-architecture

Guide the user through populating `docs/03-architecture/`. Prerequisite:
`docs/01-requirements/` (at least one feature doc) and ideally `docs/04-decisions/`
(architecture docs should link to ADRs, not restate decisions inline).

This section is large (6 subfolders). Run it as **sequential internal passes**,
one subfolder at a time, each capped at its own ≤10 questions — do not try to
resolve every placeholder in this section in a single batch of questions.

Order of passes: **core → database → api → security → ops → diagrams**. Ask the
user at the start which passes to run this invocation (default: all six, in
order — offer to stop after any pass and resume later with `/docs-architecture`
again).

For **each** pass:

1. **Read** the subfolder's `README.md` and content file(s)
   (`core/architecture-solution-design.md`, `core/architecture-styles.md`,
   `core/technology-stack.md`; `database/database-design.md`;
   `api/api-contract.md`, `api/api-design-standards.md`;
   `security/security-architecture.md`, `security/threat-model.md`;
   `ops/deployment-architecture.md`, `ops/ci-cd-pipeline.md`,
   `ops/monitoring-observability.md`; `diagrams/sequence-diagrams.md`).

2. **Cross-reference** against `docs/01-requirements/` feature docs and
   `docs/04-decisions/` ADRs — architecture content should implement/reference
   those, not invent new scope. Note the coverage matrix in
   `docs/03-architecture/README.md` (§7, Domain → Requirements) as the
   authoritative link between FR/NFR IDs and ADR IDs; keep it updated if this
   pass adds or resolves items it references.

3. **Scan and rank** this subfolder's placeholders; prioritize whichever
   decisions most constrain the rest of the subfolder (e.g. in `core`:
   architecture style and tech stack before secondary design notes; in
   `security`: authn/authz model before secondary threat entries).

4. **Ask, capped at 10 for this pass.** Use as few as the subfolder needs — often
   5 or fewer covers a subfolder; go up to 10 only when it genuinely has that many
   independent open items. Ask directly in chat, batching questions into a short
   numbered list. If a prior pass already answered something relevant (e.g. tech
   stack chosen in `core` also answers a `database` question), reuse it instead of
   asking again.

5. **Write.** Apply clear technical-writing/Markdown practice for prose (use a
   technical-writer/markdown-author skill or subagent if available), and follow
   Mermaid best practices for any diagram edits (chiefly
   `diagrams/sequence-diagrams.md`; use a mermaid-author skill/subagent if
   available). Edit files directly, update status/date fields and the "Source
   References" section if it should now point to specific ADRs or feature docs.
   Leave uncovered sections as placeholders.

After all requested passes for this invocation:

6. **Summarize.** List what was written per subfolder, what's still open, which
   passes were skipped (if any), and remind the user they can re-run
   `/docs-architecture` to resume remaining passes. Once all six passes are done,
   tell the user to run `/docs-prototype` next.
