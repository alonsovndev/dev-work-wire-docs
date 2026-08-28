# Design Direction Snapshot

| Attribute   | Value          |
| ----------- | -------------- |
| **Project** | [Project Name] |
| **Version** | 0.1            |
| **Status**  | Draft          |

## Design Intent

[State the design intent in 1–3 sentences: what feeling or impression the prototype should create for the target users.]

## Product Language and Scope Rules

- [Tone: e.g. professional, friendly, minimal, playful.]
- [Scope: e.g. MVP prototype covers Discovery and Planning only; not delivery or maintenance.]

## Visual Direction Rules

### Overall Direction

- [Style: e.g. clean, modern, spacious; or dense, data-driven, technical.]
- [Reference sites or products that inform the direction.]

### Layout Guidance

- [Grid system, max content width, whitespace approach.]

## Color Strategy

| Token           | Purpose                | Light Mode | Dark Mode |
| --------------- | ---------------------- | ---------- | --------- |
| `$primary`      | Primary actions        | [Hex]      | [Hex]     |
| `$surface`      | Page / card background | [Hex]      | [Hex]     |
| `$text-primary` | Body text              | [Hex]      | [Hex]     |
| `$success`      | Positive feedback      | [Hex]      | [Hex]     |
| `$warning`      | Caution states         | [Hex]      | [Hex]     |
| `$error`        | Error states           | [Hex]      | [Hex]     |

## Typography Strategy

| Element | Font   | Size   | Weight   |
| ------- | ------ | ------ | -------- |
| H1      | [Font] | [Size] | [Weight] |
| H2      | [Font] | [Size] | [Weight] |
| Body    | [Font] | [Size] | [Weight] |
| Caption | [Font] | [Size] | [Weight] |

## Component Inventory

| Component          | Purpose                | Required States                   |
| ------------------ | ---------------------- | --------------------------------- |
| Button/Primary     | Filled action button   | Default, hover, disabled, loading |
| Button/Secondary   | Outlined action button | Default, hover, disabled          |
| Tag/[Type]         | Status/category pill   | [States]                          |
| FormField          | Label + input          | Empty, filled, error, disabled    |
| Card/[Type]        | Content container      | Default, hover, selected          |
| Sidebar/Navigation | Primary navigation     | Collapsed, expanded               |

## Interaction Expectations

- [Transition timing: e.g. 200ms ease-in-out for most state changes.]
- [Loading states: skeleton screens vs. spinners.]
- [Error states: inline validation vs. toast notifications.]

## Responsive Behavior

| Breakpoint  | Layout Behavior                        |
| ----------- | -------------------------------------- |
| ≥ 1200 px   | Full sidebar + content                 |
| 768–1199 px | Collapsed sidebar or top bar           |
| < 768 px    | Single column, bottom nav or hamburger |

## Accessibility Notes

- Target WCAG 2.1 AA contrast ratios.
- All interactive elements must be keyboard navigable.
- Form fields require visible labels (no placeholder-only).
- Color is never the sole indicator of state.

## Prototype Constraints

- [e.g. placeholder data only, no real API integration.]
- [e.g. mobile layouts are approximate; exact breakpoints defined during implementation.]

## Traceability

| Screen/Component | Covers FR(s) | Covers NFR(s) |
| ---------------- | ------------ | ------------- |
| [Page/Component] | [FR-xxx]     | [NFR-Xnn]     |

---

**Last Updated**: YYYY-MM-DD
