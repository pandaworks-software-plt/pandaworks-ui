# llms.txt Split Design

## Goal

Refactor the monolithic `public/llms.txt` (1,302 lines / 35 KB) into a lightweight index + per-topic doc files so LLM consumers can scan the catalog first and only read detailed docs for the components they need.

## Current Problem

Claude Code sessions in downstream Pandahrms projects read the full 35 KB llms.txt even when they only need info on 2-3 components. This wastes context window and slows comprehension.

## Architecture

```
public/
  llms.txt                    # Index (~200 lines): install, catalog table, decision guide, styling, changelog
  docs/
    button.md                 # Complex component -- dedicated file
    app-shell.md
    filter-bar.md
    select-picker.md
    attachment-input.md
    modal.md
    detail-page.md
    form.md
    split-button.md
    error-fallback.md
    layout.md                 # Category group: page-header, separator, stepper, breadcrumb, etc.
    forms.md                  # Category group: input, textarea, label, checkbox, radio-group, switch, select, slider, search-input, date-picker, date-range-picker, selectable-card
    data-display.md           # Category group: card, table, badge, avatar, calendar, skeleton, progress, code-label, animated-number, expandable-text
    feedback.md               # Category group: alert, alert-dialog, sonner, loading-page, connection-banner
    overlay.md                # Category group: dialog, sheet, dropdown-menu, tooltip, popover, command
    navigation.md             # Category group: tabs, accordion, collapsible, pagination, scroll-area, toggle, toggle-group
```

~16 doc files total.

## llms.txt (Index) Contents

1. **Installation** -- registry URL and shadcn add command
2. **Tech Stack** -- React 19, Tailwind v4, Radix, etc.
3. **Component Catalog** -- table with: name | file | one-line description
4. **Pointer** -- "For full API, props, and examples, read `public/docs/<file>.md`"
5. **Decision Guide** -- which component to use for which scenario (kept in index since it's cross-cutting)
6. **Styling Conventions** -- dark mode, OKLCH, zinc base, etc.
7. **Changelog** -- machine-readable changelog (kept in index since it's cross-cutting)

## Per-Component/Category Doc Contents

- Component description
- Import path
- Code examples
- Props (where applicable)
- Variants/sizes
- Dependencies on other components

## Complex Components (Dedicated Files)

Threshold: components with >40 lines of docs in current llms.txt, or components with substantial props/variants/presets.

- `button.md` -- action presets, icon, tooltip, loading, 7 variants
- `app-shell.md` -- navigation config, user menu, branding, sidebar
- `filter-bar.md` -- field types, operators, composable FilterButton + ActiveFilters
- `select-picker.md` -- single/multi mode, search, async, grouped options
- `attachment-input.md` -- single/multi mode, dropzone/compact variants
- `modal.md` -- form modal with sticky header/footer
- `detail-page.md` -- resource detail layout
- `form.md` -- react-hook-form integration
- `split-button.md` -- primary + dropdown secondary actions
- `error-fallback.md` -- root/route variants, dev details

## Consumer Workflow

1. CLAUDE.md in downstream project points to `llms.txt`
2. Claude reads index -- sees catalog, decision guide
3. When building a feature, reads only the relevant `public/docs/<file>.md`

## Maintenance

- Adding/modifying a component: update its doc file + catalog line in `llms.txt`
- Changelog stays in `llms.txt` under the existing format
