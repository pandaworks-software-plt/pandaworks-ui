# UI Visual Review Checklist (SaaS)

Use this checklist in design/dev PR reviews to keep registry components visually consistent and production-ready.

## How to use

- Review in both light and dark themes.
- Check desktop first, then a narrow viewport (~375-430px).
- Mark each section `pass`, `needs fix`, or `not applicable`.
- Include screenshots for any failed checks.

## Global Visual System

- [ ] Spacing follows a consistent rhythm (8/12/16/24) with no random gaps.
- [ ] Border radius usage is consistent by layer type (control/chip/card/overlay).
- [ ] Typography hierarchy is clear (page title > section title > body > meta text).
- [ ] Contrast is sufficient for text, icon-only controls, and disabled states.
- [ ] Hover, focus, active, and disabled states feel like one shared system.
- [ ] Light and dark themes have parity in emphasis and readability.

## Depth and Surface Model (Fix flat UI)

When cards blend into the background, use explicit surface tiers:

- **Surface-0 (page background):** app canvas.
- **Surface-1 (cards/sections):** elevated from page with subtle border + shadow.
- **Surface-2 (overlays like popovers/modals):** stronger separation from Surface-1.
- **Surface-3 (critical overlays):** highest separation, rare use.

### Shadow ladder (standardize everywhere)

Use this exact mapping to prevent style drift:

- **Surface-1 (card/table/container):** `shadow-xs`
- **Surface-1 hover lift (interactive card):** `hover:shadow-sm`
- **Surface-2 (popover/dropdown/command):** `shadow-sm` or `shadow-md`
- **Surface-3 (dialog/modal/sheet):** `shadow-md`

### Depth checklist

- [ ] Every `Card` has clear separation from page background via border and/or shadow.
- [ ] Adjacent surfaces have visible contrast delta (background, border, or elevation).
- [ ] Hover state on cards/rows increases depth slightly, not color noise.
- [ ] Popovers/sheets/modals are visually above cards and not at the same depth.
- [ ] Shadows are consistent across components (single depth scale, no ad hoc values).
- [ ] Dark mode keeps depth cues (do not rely on shadow only; use border/tonal lift too).

### Suggested Tailwind recipes

Use these as starting standards and tune centrally:

```tsx
// Surface-1 card (default content container)
"bg-card border border-border/70 shadow-xs"

// Surface-1 interactive hover
"transition-shadow hover:shadow-sm"

// Surface-2 popover/sheet
"bg-popover border border-border shadow-md"

// Surface-3 modal
"bg-background border border-border shadow-md"
```

If a screen is still flat, increase separation in this order:
1) border contrast, 2) tonal difference, 3) shadow strength.

## Component Scorecard

Rate each area from 1-10.

### Button

- [ ] Variant styling is coherent (`default`, `brand`, `outline`, `ghost`, etc.).
- [ ] Text/icon alignment and padding are consistent by size.
- [ ] Toolbar icon buttons keep consistent visual weight and hit area.
- [ ] Loading/disabled states remain visually clear and calm.
- [ ] Action hierarchy is obvious (primary vs secondary vs destructive).

### AppShell

- [ ] Sidebar, top bar, and content area have clear visual hierarchy.
- [ ] Active navigation state is obvious but not overpowering.
- [ ] Sidebar collapsed/expanded modes keep consistent spacing and icon centering.
- [ ] Header action region does not visually compete with page title.
- [ ] Main content container width and padding support readability.

### Modal

- [ ] Overlay dim level clearly separates modal from background content.
- [ ] Modal header/body/footer spacing is balanced and not cramped.
- [ ] Footer actions maintain clear primary/secondary priority.
- [ ] Scrollable body areas keep clear edge boundaries.
- [ ] Modal elevation is stronger than cards and popovers.

### SelectPicker

- [ ] Trigger and selected state are readable at a glance.
- [ ] Multi-select chips do not overwhelm the input area.
- [ ] Long labels are truncated gracefully without layout break.
- [ ] Search input and option list spacing feel balanced.
- [ ] Selected option indicators are visually clear in both themes.

### FilterBar (FilterButton + ActiveFilters)

- [ ] Filter chips are scannable and not visually noisy.
- [ ] Operator/value segments are understandable without heavy decoration.
- [ ] Empty/pending states are visible but subtle.
- [ ] "Clear filters" affordance is visible without stealing focus.
- [ ] Dense filter sets wrap cleanly and keep a stable rhythm.

## Anti-patterns to avoid

- Avoid mixing too many shadow styles across components.
- Avoid using color alone to indicate state changes.
- Avoid heavy outlines + heavy shadows + strong backgrounds on the same layer.
- Avoid chip styles that dominate the page hierarchy.
- Avoid inconsistent corner radius between related controls.

## PR Review Template

Copy into PR description:

```md
## UI Visual QA
- Theme check: Light [ ] Dark [ ]
- Responsive check: Desktop [ ] Mobile [ ]
- Depth model:
  - Surface-1 separation pass [ ]
  - Surface-2 overlays pass [ ]
- Component checks:
  - Button [ ]
  - AppShell [ ]
  - Modal [ ]
  - SelectPicker [ ]
  - FilterBar [ ]
- Screenshot evidence attached [ ]
- Follow-up tasks created for any "needs fix" [ ]
```
