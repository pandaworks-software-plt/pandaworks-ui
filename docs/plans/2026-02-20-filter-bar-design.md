# Filter Bar Component Design

## Overview

A reusable filter chips/tags component for the pandahrms-ui-registry. Users add filters via a Command-based popover, and active filters display as removable chips.

## API

### Types

```tsx
type OptionFilterField = {
  type: "option"
  key: string
  label: string
  icon?: LucideIcon
  options: { label: string; value: string }[]
  multiple?: boolean // default true
}

type DateFilterField = {
  type: "date" | "date-range"
  key: string
  label: string
  icon?: LucideIcon
  minDate?: Date
  maxDate?: Date
}

type TextFilterField = {
  type: "text"
  key: string
  label: string
  icon?: LucideIcon
  placeholder?: string
}

type FilterField = OptionFilterField | DateFilterField | TextFilterField

type ActiveFilter =
  | { key: string; type: "option"; values: string[] }
  | { key: string; type: "date"; value: Date }
  | { key: string; type: "date-range"; start: Date; end: Date }
  | { key: string; type: "text"; value: string }

type FilterBarProps = {
  fields: FilterField[]
  filters: ActiveFilter[]
  onChange: (filters: ActiveFilter[]) => void
  className?: string
}
```

### Usage

```tsx
<FilterBar
  fields={[
    { type: "option", key: "status", label: "Status", options: statusOptions },
    { type: "date-range", key: "joined", label: "Joined" },
    { type: "text", key: "name", label: "Name" },
  ]}
  filters={filters}
  onChange={setFilters}
/>
```

## UI Flow

1. **Add filter** -- Click "+ Add filter" -> Command popover with searchable field list (already-active fields hidden)
2. **Select field** -- Pick field -> popover transitions to value editor based on type:
   - Option: Searchable checkbox/radio list + "Apply" button
   - Date/Date-range: Inline calendar picker, applies on select
   - Text: Input field + "Apply" button (Enter key support)
3. **Active chip** -- Chip shows `{label}: {formatted value(s)}`. Click to re-edit.
4. **Remove** -- X button on each chip. "Clear all" link when 2+ filters active.

## Chip Value Formatting

- Option (single): `Status: Active`
- Option (multi, <=2): `Status: Active, Inactive`
- Option (multi, >2): `Status: Active +2 more`
- Date: `Joined: Feb 20, 2026`
- Date range: `Joined: Feb 1 - Feb 20, 2026`
- Text: `Name: John`

## File Structure

Single file: `registry/default/filter-bar/filter-bar.tsx`

Internal sub-components (not exported):
- `FilterChip` -- Badge with popover for re-editing
- `FieldPicker` -- Command-based field list
- `OptionValueEditor` -- Checkbox/radio list
- `DateValueEditor` -- Calendar picker
- `TextValueEditor` -- Input field

## Registry Entry

```json
{
  "name": "filter-bar",
  "dependencies": ["date-fns"],
  "registryDependencies": [
    "badge", "button", "command", "popover",
    "input", "checkbox", "date-picker", "date-range-picker"
  ]
}
```

## Edge Cases

- Empty filters: Only "+ Add filter" shown, no "Clear all"
- All fields used: "+ Add filter" button disabled
- Re-editing: Click chip to reopen value editor, pre-populated
- Empty option selection on Apply: Filter removed
- Dark mode: Standard dark: Tailwind variants, secondary badge variant
- Responsive: Flex-wrap chips, existing popover mobile handling
