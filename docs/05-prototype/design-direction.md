# Terminal Rendering Direction

| Attribute   | Value       |
| ----------- | ----------- |
| **Project** | DevWorkWire |
| **Version** | 0.1         |
| **Status**  | Draft       |

## Design Intent

Every screen should read as trustworthy and transparent: Maya can always tell, at a
glance, what DevWorkWire is about to write to Jira before she confirms it. There is no
visual design system here — DevWorkWire has no GUI — so this document covers terminal
rendering conventions instead of color palettes and typography.

## Product Language and Scope Rules

- Tone: plain, precise, no marketing language. Error and status messages name the exact
  item and field involved, never a generic "something went wrong."
- Scope: covers the CLI screens in [Prototype Brief](./prototype-brief.md#screens) only —
  Maya's guided import, search/select, and insert-by-id flows.

## Terminal Output Direction

### Overall Direction

- Rendering stack: [Rich](https://github.com/Textualize/rich) (via Typer) for tables and
  wrapping, [InquirerPy](https://github.com/kazhala/InquirerPy) for interactive prompts
  and select lists — per [technology-stack.md](../03-architecture/core/technology-stack.md).
- Monospace only; no images, icons, or graphics beyond simple text/Unicode markers
  (e.g. `>` for the selected row in an InquirerPy list).

### Layout Guidance

- Target width: 80 columns, per [NFR-003-01](../01-requirements/f-003-cli-dwire-flow.md).
- Below 80 columns: Rich wraps table cells rather than truncating silently; essential
  fields (action, item name, reference) stay visible.
- Above 80 columns: tables use the extra width for the item-name column; layout doesn't
  otherwise change.

## Color Strategy

Terminal color is a secondary signal only — NFR-X06 (cross-cutting quality baseline)
requires every state to also carry a text prefix, since color can be unavailable
(piped output, some terminals, colorblind users).

| State                       | Color                | Required text prefix | Example                                                                 |
| --------------------------- | -------------------- | -------------------- | ----------------------------------------------------------------------- |
| Success                     | Green                | `OK`                 | `OK  DWW-201  Payments  created`                                        |
| Warning                     | Yellow               | `WARNING`            | `WARNING  Item DWW-140 changed in Jira since last import`               |
| Error                       | Red                  | `ERROR`              | `ERROR  Story "Add OAuth login" (line 42) has no parent Epic reference` |
| Neutral / info              | Default              | none required        | `Validating data/EPIC-3-payments/ ...`                                  |
| Selected (interactive list) | Reverse video / bold | `>` marker           | `> DWW-140  Epic  Onboarding  In Progress`                              |

## Typography Strategy

Terminal text has no font or size choices; conventions replace them:

| Element                                            | Weight   | Notes                                                 |
| -------------------------------------------------- | -------- | ----------------------------------------------------- |
| Section headers (e.g. `Preview`, `Committing ...`) | Bold     | Marks the start of a new screen state                 |
| Prompts (`Proceed? [y/N]:`)                        | Bold     | Draws the eye to the point requiring input            |
| Body / table rows                                  | Normal   | Default Rich rendering                                |
| Secondary / help text (`[Use arrow keys ...]`)     | Dim      | De-emphasized, never the only source of required info |
| Italics                                            | Not used | Poor and inconsistent terminal support                |

## Component Inventory

| Component                        | Purpose                                            | Required states                                             |
| -------------------------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| Validation error list            | Lists item-identifying validation failures         | Error only (no empty/loading — the command exits)           |
| Preview table                    | Lists creates/updates/drift for the resolved batch | Populated (create/update/drift rows), empty (no changes)    |
| Drift overwrite/skip prompt      | Per-item choice for a drifted match                | Default (no selection), overwrite selected, skip selected   |
| Yes/no confirm prompt            | Single gate before any write                       | Default (no input), confirmed, declined                     |
| Search/select list               | Filterable list of existing Jira items             | Loading, empty (no matches), populated, selected            |
| Commit result / fail-fast report | Per-item commit outcome                            | All succeeded, partial failure (committed/failed/not-tried) |

## Interaction Expectations

- Confirm prompts are a bare `[y/N]:` — no color-only affirmative/negative cue, default
  is always "no" (declining is the safe default).
- Select lists (search, drift choice) use InquirerPy's default arrow-key navigation plus
  type-ahead filtering; `Enter` selects, `Ctrl+C` cancels with zero writes at any point
  before the confirm prompt is answered "yes."
- No animated spinners for MVP: `dwire import` calls are synchronous, so a static
  `Committing N items ...` line is sufficient; a future async path could revisit this.

## Responsive Behavior

| Terminal width | Behavior                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ≥ 80 columns   | Full table rendering; extra width goes to the item-name column.                                                                              |
| < 80 columns   | Rich wraps cell content rather than truncating; action/ref columns stay intact per [NFR-003-01](../01-requirements/f-003-cli-dwire-flow.md). |

## Accessibility Notes

- No state is signaled by color alone — every color pairs with a text prefix (`OK`,
  `WARNING`, `ERROR`), per NFR-X06.
- Output written to stdout/stderr only, so it works with screen readers reading terminal
  text; no meaning depends on rendering (e.g. box-drawing characters are decorative,
  never load-bearing).
- All interaction is keyboard-only, which is inherent to a CLI.
- No meaning is conveyed by a Unicode glyph alone (e.g. `>` for "selected" is paired with
  the row's own text, not a symbol requiring a legend).

## Prototype Constraints

- Placeholder data only (`DWW-*` issue keys, sample Epic/Story titles); no real Jira
  integration.
- Transcripts in [Prototype Brief](./prototype-brief.md#screens) are illustrative text,
  not a literal Rich-rendering diff — exact spacing/box-drawing is an implementation
  detail.

## Traceability

| Screen/Component                 | Covers FR(s)         | Covers NFR(s)                            |
| -------------------------------- | -------------------- | ---------------------------------------- |
| Validation error list            | FR-003-02, FR-001-02 | —                                        |
| Preview table                    | FR-001-03, FR-002-03 | NFR-003-01                               |
| Drift overwrite/skip prompt      | FR-002-04            | —                                        |
| Yes/no confirm prompt            | FR-001-04, FR-003-03 | —                                        |
| Search/select list               | FR-003-04            | —                                        |
| Commit result / fail-fast report | FR-001-05, FR-001-06 | —                                        |
| Color + text-prefix convention   | —                    | NFR-X06 (cross-cutting quality baseline) |

---

**Last Updated**: 2026-09-03
