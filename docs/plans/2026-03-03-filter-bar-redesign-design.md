# Filter Bar Redesign - Design Document

**Date:** 2026-03-03
**Scope:** Replace existing FilterBar with two separate components: FilterButton + ActiveFilters

## Overview

Redesign the FilterBar component into two independently composable components that follow a 2-row UX pattern:
- **Row 1**: Consumer's search input + `FilterButton` (funnel icon trigger)
- **Row 2**: `ActiveFilters` (segmented filter chips with operators)

## Architecture Decision

**Approach: Two Separate Components** - Maximum flexibility, consumers control layout. Each component is focused (SRP). Shared state (filters array + fields config) is managed by the consumer.

## Component 1: FilterButton

A compact icon button that opens a dropdown list of available filter fields.

### Props

```tsx
interface FilterButtonProps {
  fields: FilterField[]
  activeKeys: Set<string>
  onAdd: (key: string) => void
  className?: string
}
```

### Behavior

- Renders as an icon button with `ListFilter` (funnel) icon
- Click opens a Popover with available fields (excluding already-active ones)
- Selecting a field calls `onAdd(key)` and closes the popover
- Disabled when all fields are active

## Component 2: ActiveFilters

Displays active filter chips in a horizontal wrapping layout with "Clear filters" link.

### Props

```tsx
interface ActiveFiltersProps {
  fields: FilterField[]
  filters: ActiveFilter[]
  onChange: (filters: ActiveFilter[]) => void
  className?: string
}
```

### Chip Anatomy

Each chip is a segmented pill with dashed border:

```
[X FieldName] | [operator v] | [value v]
```

Three interactive segments:
1. **Remove + Label**: Click X to remove the filter
2. **Operator dropdown**: Click to cycle/select operator
3. **Value dropdown**: Click to open value editor popover

For newly added filters (pending state): `[X FieldName] | [Enter value v]`

### Visual Style

- Dashed border with primary color tint
- Rounded pill shape (rounded-full)
- Segments divided by subtle internal borders
- Each segment independently clickable
- Dark mode support with primary-tinted borders and text

## Types

### FilterField Types (unchanged)

```tsx
interface FilterOption {
  label: string
  value: string
}

interface OptionFilterField {
  type: "option"
  key: string
  label: string
  icon?: LucideIcon
  options: FilterOption[]
  multiple?: boolean
}

interface DateFilterField {
  type: "date" | "date-range"
  key: string
  label: string
  icon?: LucideIcon
  minDate?: Date
  maxDate?: Date
}

interface TextFilterField {
  type: "text"
  key: string
  label: string
  icon?: LucideIcon
  placeholder?: string
}

type FilterField = OptionFilterField | DateFilterField | TextFilterField
```

### ActiveFilter Type (updated with operators)

```tsx
type ActiveFilter =
  | { key: string; type: "option"; operator: "is"; values: string[] }
  | { key: string; type: "date"; operator: "is" | "before" | "after"; value: Date }
  | { key: string; type: "date-range"; operator: "between"; start: Date; end: Date }
  | { key: string; type: "text"; operator: "contains" | "equals" | "starts_with"; value: string }
  | { key: string; type: "pending" }
```

## Operators by Field Type

| Field Type | Operators | Default | Value Editor |
|------------|-----------|---------|-------------|
| date | is, before, after | is | Calendar (single date) |
| date-range | between | between | Calendar (range picker) |
| text | contains, equals, starts_with | contains | Text input + Apply button |
| option | is | is | Dropdown/command list |

When operator changes affect the value type (e.g. date "between" needs a range), the value resets.

## Interaction Flow

1. User clicks FilterButton (funnel icon)
2. Dropdown shows available (unused) fields: Email, Name, Last signed in, etc.
3. User selects "Name"
4. `onAdd("name")` called; consumer adds `{ key: "name", type: "pending" }` to filters
5. ActiveFilters renders chip: `[X Name] [Enter value v]`
6. User clicks "Enter value" segment
7. Popover opens showing operator selector + value editor for "text" type
8. User selects operator "contains", types "John", clicks Apply
9. Filter updates to `{ key: "name", type: "text", operator: "contains", value: "John" }`
10. Chip shows: `[X Name] [contains v] [John v]`
11. Each segment is independently editable
12. X removes the filter; "Clear filters" removes all

## File Structure

```
registry/default/filter-bar/
  filter-bar.tsx          # Both components + types + helpers (replaces existing)
```

### Exports

- `FilterButton` - The filter trigger button
- `ActiveFilters` - The active filter chips display
- All type definitions (FilterField, ActiveFilter, FilterOption, etc.)

## Consumer Usage Example

```tsx
const [filters, setFilters] = useState<ActiveFilter[]>([])

const fields: FilterField[] = [
  { type: "text", key: "name", label: "Name" },
  { type: "text", key: "email", label: "Email" },
  { type: "option", key: "banned", label: "Banned", options: [
    { label: "True", value: "true" },
    { label: "False", value: "false" },
  ]},
  { type: "date-range", key: "created", label: "Created" },
  { type: "date", key: "lastSignedIn", label: "Last signed in" },
]

const activeKeys = new Set(filters.map(f => f.key))

const handleAdd = (key: string) => {
  setFilters(prev => [...prev, { key, type: "pending" }])
}

return (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <SearchInput value={search} onChange={setSearch} />
      <FilterButton fields={fields} activeKeys={activeKeys} onAdd={handleAdd} />
    </div>
    {filters.length > 0 && (
      <ActiveFilters fields={fields} filters={filters} onChange={setFilters} />
    )}
  </div>
)
```

## Internal Components (not exported)

- `FieldPicker` - Dropdown list of available fields
- `FilterChip` - Individual segmented chip with operator + value editing
- `OperatorSelector` - Dropdown for choosing operator
- `OptionValueEditor` - Checkbox/radio list for option fields
- `DateValueEditor` - Calendar picker for single date
- `DateRangeValueEditor` - Calendar picker for date range
- `TextValueEditor` - Text input with Apply/Cancel

## Breaking Changes

This replaces the existing FilterBar component. Consumers using the current `<FilterBar>` will need to migrate to the new two-component pattern. The `ActiveFilter` type adds an `operator` field and a new `"pending"` type variant.
