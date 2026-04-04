# Filter Bar Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the existing single-component FilterBar with two independent components (FilterButton + ActiveFilters) featuring segmented chips with operator support.

**Architecture:** Two exported components sharing types but independently composable. FilterButton is a compact funnel-icon trigger that opens a field picker popover. ActiveFilters renders segmented, dashed-border chips with clickable operator/value segments. Consumer manages the shared `filters` state array.

**Tech Stack:** React 19, Radix Popover, cmdk Command, date-fns, Lucide icons, Tailwind CSS v4 (OKLCH), CVA

---

### Task 1: Rewrite types and helpers

**Files:**
- Modify: `registry/default/filter-bar/filter-bar.tsx`

**Step 1: Replace the types section**

Replace lines 35-83 (Types section) with the updated types that include operators and pending state:

```tsx
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FilterOption {
  label: string
  value: string
}

export interface OptionFilterField {
  type: "option"
  key: string
  label: string
  icon?: LucideIcon
  options: FilterOption[]
  multiple?: boolean
}

export interface DateFilterField {
  type: "date" | "date-range"
  key: string
  label: string
  icon?: LucideIcon
  minDate?: Date
  maxDate?: Date
}

export interface TextFilterField {
  type: "text"
  key: string
  label: string
  icon?: LucideIcon
  placeholder?: string
}

export type FilterField = OptionFilterField | DateFilterField | TextFilterField

export type DateOperator = "is" | "before" | "after"
export type TextOperator = "contains" | "equals" | "starts_with"

export type ActiveFilter =
  | { key: string; type: "option"; operator: "is"; values: string[] }
  | { key: string; type: "date"; operator: DateOperator; value: Date }
  | { key: string; type: "date-range"; operator: "between"; start: Date; end: Date }
  | { key: string; type: "text"; operator: TextOperator; value: string }
  | { key: string; type: "pending" }

export interface FilterButtonProps {
  fields: FilterField[]
  activeKeys: Set<string>
  onAdd: (key: string) => void
  className?: string
}

export interface ActiveFiltersProps {
  fields: FilterField[]
  filters: ActiveFilter[]
  onChange: (filters: ActiveFilter[]) => void
  className?: string
}
```

**Step 2: Update the helpers section**

Replace the `fieldIcon` and `formatFilterValue` helpers. `formatFilterValue` now needs to handle operators and pending state:

```tsx
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fieldIcon(field: FilterField): LucideIcon {
  if (field.icon) return field.icon
  switch (field.type) {
    case "option":
      return ListFilter
    case "date":
    case "date-range":
      return CalendarIcon
    case "text":
      return Type
  }
}

function formatFilterValue(filter: ActiveFilter, field: FilterField): string {
  switch (filter.type) {
    case "pending":
      return "Enter value"
    case "option": {
      const optField = field as OptionFilterField
      const labels = filter.values
        .map((v) => optField.options.find((o) => o.value === v)?.label ?? v)
      if (labels.length <= 2) return labels.join(", ")
      return `${labels[0]} +${labels.length - 1} more`
    }
    case "date":
      return format(filter.value, "d MMM yyyy")
    case "date-range":
      return `${format(filter.start, "d")}-${format(filter.end, "d MMMM yyyy")}`
    case "text":
      return filter.value
  }
}

function formatOperator(filter: ActiveFilter): string {
  if (filter.type === "pending") return ""
  switch (filter.operator) {
    case "is":
      return "is"
    case "before":
      return "before"
    case "after":
      return "after"
    case "between":
      return "between"
    case "contains":
      return "contains"
    case "equals":
      return "equals"
    case "starts_with":
      return "starts with"
  }
}

const DATE_OPERATORS: { label: string; value: DateOperator }[] = [
  { label: "is", value: "is" },
  { label: "before", value: "before" },
  { label: "after", value: "after" },
]

const TEXT_OPERATORS: { label: string; value: TextOperator }[] = [
  { label: "contains", value: "contains" },
  { label: "equals", value: "equals" },
  { label: "starts with", value: "starts_with" },
]
```

**Step 3: Verify the file compiles**

Run: `pnpm build`
Expected: Build succeeds (the rest of the component will break - that's fine, we're replacing it all in subsequent tasks)

**Step 4: Commit**

```bash
git add registry/default/filter-bar/filter-bar.tsx
git commit -m "refactor(filter-bar): update types with operators and pending state"
```

---

### Task 2: Rewrite FilterButton component

**Files:**
- Modify: `registry/default/filter-bar/filter-bar.tsx`

**Step 1: Replace the FieldPicker internal component**

Replace the existing `FieldPicker` (lines ~124-158) with a simplified version that just lists fields without Command search (since the field list is typically short):

```tsx
// ---------------------------------------------------------------------------
// FieldPicker - dropdown list of available filter fields
// ---------------------------------------------------------------------------

function FieldPicker({
  fields,
  activeKeys,
  onSelect,
}: {
  fields: FilterField[]
  activeKeys: Set<string>
  onSelect: (key: string) => void
}) {
  const available = fields.filter((f) => !activeKeys.has(f.key))

  return (
    <div className="py-1">
      {available.map((field) => {
        const Icon = fieldIcon(field)
        return (
          <button
            key={field.key}
            type="button"
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-sm",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:bg-accent"
            )}
            onClick={() => onSelect(field.key)}
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            {field.label}
          </button>
        )
      })}
    </div>
  )
}
```

**Step 2: Write the FilterButton component**

Replace the existing `AddFilterButton` component (~lines 507-569) with the new `FilterButton`:

```tsx
// ---------------------------------------------------------------------------
// FilterButton - compact filter trigger with funnel icon
// ---------------------------------------------------------------------------

function FilterButton({
  fields,
  activeKeys,
  onAdd,
  className,
}: FilterButtonProps) {
  const [open, setOpen] = React.useState(false)
  const allUsed = fields.every((f) => activeKeys.has(f.key))

  const handleSelect = (key: string) => {
    onAdd(key)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={className}
          disabled={allUsed}
        >
          <ListFilter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <FieldPicker
          fields={fields}
          activeKeys={activeKeys}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
```

**Step 3: Commit**

```bash
git add registry/default/filter-bar/filter-bar.tsx
git commit -m "feat(filter-bar): add FilterButton component with funnel icon trigger"
```

---

### Task 3: Rewrite value editors

**Files:**
- Modify: `registry/default/filter-bar/filter-bar.tsx`

**Step 1: Keep existing value editors mostly as-is**

The `OptionValueEditor`, `DateValueEditor`, `DateRangeValueEditor`, and `TextValueEditor` remain largely the same. Update the `TextValueEditor` to include a title and Cancel button:

```tsx
function TextValueEditor({
  field,
  initial,
  onApply,
  onCancel,
}: {
  field: TextFilterField
  initial: string
  onApply: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = React.useState(initial)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed) onApply(trimmed)
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <p className="text-sm font-medium">
        Filter by {field.label}
      </p>
      <Input
        placeholder={field.placeholder ?? `Filter by ${field.label.toLowerCase()}...`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit()
        }}
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" disabled={!value.trim()} onClick={handleSubmit}>
          Apply
        </Button>
      </div>
    </div>
  )
}
```

**Step 2: Add OperatorSelector component**

Add a new internal component for the operator dropdown:

```tsx
// ---------------------------------------------------------------------------
// OperatorSelector - dropdown for choosing operator
// ---------------------------------------------------------------------------

function OperatorSelector({
  operators,
  value,
  onChange,
}: {
  operators: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="py-1">
      {operators.map((op) => (
        <button
          key={op.value}
          type="button"
          className={cn(
            "flex w-full items-center gap-2 px-3 py-1.5 text-sm",
            "hover:bg-accent hover:text-accent-foreground",
            op.value === value && "bg-accent text-accent-foreground"
          )}
          onClick={() => onChange(op.value)}
        >
          {op.label}
        </button>
      ))}
    </div>
  )
}
```

**Step 3: Update ValueEditor router**

The `ValueEditor` now handles the pending state and routes to correct editors. Replace existing `ValueEditor`:

```tsx
// ---------------------------------------------------------------------------
// ValueEditor - routes to the correct editor based on field type
// ---------------------------------------------------------------------------

function ValueEditor({
  field,
  filter,
  onApply,
  onCancel,
}: {
  field: FilterField
  filter: ActiveFilter | null
  onApply: (filter: ActiveFilter) => void
  onCancel: () => void
}) {
  switch (field.type) {
    case "option":
      return (
        <OptionValueEditor
          field={field}
          initial={filter?.type === "option" ? filter.values : []}
          onApply={(values) =>
            onApply({ key: field.key, type: "option", operator: "is", values })
          }
        />
      )
    case "date":
      return (
        <DateValueEditor
          field={field as DateFilterField}
          initial={filter?.type === "date" ? filter.value : undefined}
          onApply={(date) =>
            onApply({
              key: field.key,
              type: "date",
              operator: filter?.type === "date" ? filter.operator : "is",
              value: date,
            })
          }
        />
      )
    case "date-range":
      return (
        <DateRangeValueEditor
          field={field as DateFilterField}
          initialStart={
            filter?.type === "date-range" ? filter.start : undefined
          }
          initialEnd={
            filter?.type === "date-range" ? filter.end : undefined
          }
          onApply={(start, end) =>
            onApply({ key: field.key, type: "date-range", operator: "between", start, end })
          }
        />
      )
    case "text":
      return (
        <TextValueEditor
          field={field as TextFilterField}
          initial={filter?.type === "text" ? filter.value : ""}
          onApply={(value) =>
            onApply({
              key: field.key,
              type: "text",
              operator: filter?.type === "text" ? filter.operator : "contains",
              value,
            })
          }
          onCancel={onCancel}
        />
      )
  }
}
```

**Step 4: Commit**

```bash
git add registry/default/filter-bar/filter-bar.tsx
git commit -m "feat(filter-bar): add operator selector and update value editors"
```

---

### Task 4: Rewrite FilterChip with segmented design

**Files:**
- Modify: `registry/default/filter-bar/filter-bar.tsx`

**Step 1: Replace FilterChip**

Replace the existing `FilterChip` component with a segmented chip design using dashed borders. The chip has 3 segments: [X Label] | [operator v] | [value v].

```tsx
// ---------------------------------------------------------------------------
// FilterChip - segmented chip with dashed border
// ---------------------------------------------------------------------------

function FilterChip({
  field,
  filter,
  onUpdate,
  onRemove,
}: {
  field: FilterField
  filter: ActiveFilter
  onUpdate: (filter: ActiveFilter) => void
  onRemove: () => void
}) {
  const [valueOpen, setValueOpen] = React.useState(filter.type === "pending")
  const [operatorOpen, setOperatorOpen] = React.useState(false)

  const isPending = filter.type === "pending"

  const handleValueApply = (newFilter: ActiveFilter) => {
    onUpdate(newFilter)
    setValueOpen(false)
  }

  const handleOperatorChange = (op: string) => {
    if (filter.type === "pending") return
    // When operator changes, we need to handle value reset for type changes
    if (filter.type === "date") {
      if (op === "is" || op === "before" || op === "after") {
        onUpdate({ ...filter, operator: op as DateOperator })
      }
    } else if (filter.type === "text") {
      onUpdate({ ...filter, operator: op as TextOperator })
    }
    setOperatorOpen(false)
  }

  const chipBase = cn(
    "inline-flex items-center rounded-full border border-dashed text-sm",
    "border-primary/40 dark:border-primary/50"
  )

  const segmentBase = cn(
    "inline-flex items-center gap-1 px-2 py-0.5 transition-colors",
    "text-primary dark:text-primary"
  )

  const segmentInteractive = cn(
    segmentBase,
    "cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20"
  )

  // Determine which operators are available for this field type
  const operators =
    field.type === "date"
      ? DATE_OPERATORS
      : field.type === "text"
        ? TEXT_OPERATORS
        : null

  return (
    <div className={chipBase}>
      {/* Segment 1: Remove + Label */}
      <button
        type="button"
        className={cn(segmentInteractive, "rounded-l-full pl-2")}
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
        <span className="font-medium">{field.label}</span>
      </button>

      {/* Segment 2: Operator (only for date/text) */}
      {operators && !isPending && (
        <Popover open={operatorOpen} onOpenChange={setOperatorOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                segmentInteractive,
                "border-l border-dashed border-primary/40 dark:border-primary/50"
              )}
            >
              {formatOperator(filter)}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-0" align="start">
            <OperatorSelector
              operators={operators}
              value={filter.type !== "pending" ? filter.operator : ""}
              onChange={handleOperatorChange}
            />
          </PopoverContent>
        </Popover>
      )}

      {/* Segment 3: Value */}
      <Popover open={valueOpen} onOpenChange={setValueOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              segmentInteractive,
              "rounded-r-full pr-2",
              (operators || !isPending) &&
                "border-l border-dashed border-primary/40 dark:border-primary/50"
            )}
          >
            <span className={isPending ? "text-muted-foreground" : ""}>
              {formatFilterValue(filter, field)}
            </span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <ValueEditor
            field={field}
            filter={isPending ? null : filter}
            onApply={handleValueApply}
            onCancel={() => {
              setValueOpen(false)
              if (isPending) onRemove()
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add registry/default/filter-bar/filter-bar.tsx
git commit -m "feat(filter-bar): add segmented FilterChip with dashed border design"
```

---

### Task 5: Rewrite main exports (ActiveFilters + update FilterBar export)

**Files:**
- Modify: `registry/default/filter-bar/filter-bar.tsx`

**Step 1: Write ActiveFilters component**

Replace the existing `FilterBar` main component (~lines 575-627) with `ActiveFilters`:

```tsx
// ---------------------------------------------------------------------------
// ActiveFilters - displays active filter chips with clear all
// ---------------------------------------------------------------------------

function ActiveFilters({
  fields,
  filters,
  onChange,
  className,
}: ActiveFiltersProps) {
  const handleUpdate = (index: number, updated: ActiveFilter) => {
    const next = [...filters]
    next[index] = updated
    onChange(next)
  }

  const handleRemove = (index: number) => {
    onChange(filters.filter((_, i) => i !== index))
  }

  const handleClearAll = () => {
    onChange([])
  }

  if (filters.length === 0) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {filters.map((filter, index) => {
        const field = fields.find((f) => f.key === filter.key)
        if (!field) return null
        return (
          <FilterChip
            key={filter.key}
            field={field}
            filter={filter}
            onUpdate={(updated) => handleUpdate(index, updated)}
            onRemove={() => handleRemove(index)}
          />
        )
      })}
      <button
        type="button"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={handleClearAll}
      >
        Clear filters
      </button>
    </div>
  )
}
```

**Step 2: Update exports**

Replace the final export line. Remove the old `FilterBar` export and add new exports:

```tsx
export { FilterButton, ActiveFilters }
```

**Step 3: Update imports at the top of the file**

Make sure `ChevronDown` is added to the lucide-react imports:

```tsx
import {
  CalendarIcon,
  Check,
  ChevronDown,
  ListFilter,
  Search,
  Type,
  X,
} from "lucide-react"
```

Remove the `Plus` import since we no longer use the "+ Add filter" button text.

**Step 4: Commit**

```bash
git add registry/default/filter-bar/filter-bar.tsx
git commit -m "feat(filter-bar): add ActiveFilters component and update exports"
```

---

### Task 6: Update the showcase demo

**Files:**
- Modify: `src/showcase/demos/filter-bar-demo.tsx`

**Step 1: Rewrite the demo to use the new 2-component API**

```tsx
import { useState } from "react";
import { Briefcase, MapPin, Search, Users } from "lucide-react";
import { DemoSection } from "@/showcase/component-page";
import {
  FilterButton,
  ActiveFilters,
  type ActiveFilter,
  type FilterField,
} from "@/components/ui/filter-bar";
import { Input } from "@/components/ui/input";

const fields: FilterField[] = [
  {
    type: "option",
    key: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "on-leave", label: "On Leave" },
      { value: "probation", label: "Probation" },
    ],
  },
  {
    type: "option",
    key: "department",
    label: "Department",
    icon: Users,
    options: [
      { value: "engineering", label: "Engineering" },
      { value: "design", label: "Design" },
      { value: "marketing", label: "Marketing" },
      { value: "hr", label: "Human Resources" },
      { value: "finance", label: "Finance" },
      { value: "operations", label: "Operations" },
    ],
  },
  {
    type: "option",
    key: "banned",
    label: "Banned",
    multiple: false,
    options: [
      { value: "true", label: "True" },
      { value: "false", label: "False" },
    ],
  },
  {
    type: "option",
    key: "role",
    label: "Role",
    icon: Briefcase,
    multiple: false,
    options: [
      { value: "manager", label: "Manager" },
      { value: "senior", label: "Senior" },
      { value: "mid", label: "Mid-Level" },
      { value: "junior", label: "Junior" },
      { value: "intern", label: "Intern" },
    ],
  },
  {
    type: "option",
    key: "location",
    label: "Location",
    icon: MapPin,
    options: [
      { value: "kl", label: "Kuala Lumpur" },
      { value: "penang", label: "Penang" },
      { value: "jb", label: "Johor Bahru" },
      { value: "remote", label: "Remote" },
    ],
  },
  {
    type: "date-range",
    key: "created",
    label: "Created",
  },
  {
    type: "date",
    key: "lastSignedIn",
    label: "Last signed in",
  },
  {
    type: "text",
    key: "name",
    label: "Name",
    placeholder: "Search by name...",
  },
  {
    type: "text",
    key: "email",
    label: "Email",
    placeholder: "Search by email...",
  },
];

export default function FilterBarDemo() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const activeKeys = new Set(filters.map((f) => f.key));

  const handleAdd = (key: string) => {
    setFilters((prev) => [...prev, { key, type: "pending" }]);
  };

  const [presetFilters, setPresetFilters] = useState<ActiveFilter[]>([
    { key: "created", type: "date-range", operator: "between", start: new Date(2026, 2, 4), end: new Date(2026, 2, 13) },
    { key: "banned", type: "option", operator: "is", values: ["true"] },
  ]);
  const presetActiveKeys = new Set(presetFilters.map((f) => f.key));

  const handlePresetAdd = (key: string) => {
    setPresetFilters((prev) => [...prev, { key, type: "pending" }]);
  };

  return (
    <>
      <DemoSection title="Default">
        <div className="w-full space-y-3">
          <p className="text-sm text-muted-foreground">
            Click the filter icon to select a field. Active filters appear as
            segmented chips below with operator and value controls.
          </p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <FilterButton
              fields={fields}
              activeKeys={activeKeys}
              onAdd={handleAdd}
            />
          </div>
          <ActiveFilters
            fields={fields}
            filters={filters}
            onChange={setFilters}
          />
          {filters.length > 0 && (
            <pre className="mt-3 rounded-md bg-muted p-3 text-xs">
              {JSON.stringify(filters, null, 2)}
            </pre>
          )}
        </div>
      </DemoSection>

      <DemoSection title="With Pre-set Filters">
        <div className="w-full space-y-3">
          <p className="text-sm text-muted-foreground">
            Filters can be initialized with values including operators.
            Matches the reference design with date range and boolean filters.
          </p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9"
                readOnly
              />
            </div>
            <FilterButton
              fields={fields}
              activeKeys={presetActiveKeys}
              onAdd={handlePresetAdd}
            />
          </div>
          <ActiveFilters
            fields={fields}
            filters={presetFilters}
            onChange={setPresetFilters}
          />
          <pre className="mt-3 rounded-md bg-muted p-3 text-xs">
            {JSON.stringify(presetFilters, null, 2)}
          </pre>
        </div>
      </DemoSection>
    </>
  );
}
```

**Step 2: Update the component description in showcase-app.tsx**

In `src/showcase/showcase-app.tsx`, find the filter-bar entry in `COMPONENTS` array and update its description:

```tsx
  {
    name: "filter-bar",
    title: "Filter Bar",
    description:
      "Two composable filter components: a compact FilterButton trigger and ActiveFilters chips display with operators, supporting option lists, dates, and text search.",
    demo: FilterBarDemo,
  },
```

**Step 3: Commit**

```bash
git add src/showcase/demos/filter-bar-demo.tsx src/showcase/showcase-app.tsx
git commit -m "feat(showcase): update filter-bar demo for new 2-component API"
```

---

### Task 7: Copy registry file to src/components/ui and update registry.json description

**Files:**
- Copy: `registry/default/filter-bar/filter-bar.tsx` -> `src/components/ui/filter-bar.tsx`
- Modify: `registry.json`

**Step 1: Copy the registry component to src/components/ui**

```bash
cp registry/default/filter-bar/filter-bar.tsx src/components/ui/filter-bar.tsx
```

**Step 2: Update the registry.json description**

In `registry.json`, find the `filter-bar` entry and update its description:

```json
{
  "name": "filter-bar",
  "type": "registry:ui",
  "title": "Filter Bar",
  "description": "Two composable filter components: FilterButton trigger and ActiveFilters chips display with operators, supporting option lists, dates, and text search.",
  "dependencies": [
    "date-fns"
  ],
  "registryDependencies": [
    "button",
    "calendar",
    "checkbox",
    "command",
    "input",
    "popover"
  ],
  "files": [
    {
      "path": "registry/default/filter-bar/filter-bar.tsx",
      "type": "registry:ui"
    }
  ]
}
```

**Step 3: Commit**

```bash
git add src/components/ui/filter-bar.tsx registry.json
git commit -m "chore(filter-bar): sync registry component to src and update description"
```

---

### Task 8: Build registry and verify

**Step 1: Build the registry**

Run: `pnpm registry:build`
Expected: Builds successfully, generates `public/r/filter-bar.json`

**Step 2: Start dev server and verify**

Run: `pnpm dev`
Navigate to `http://localhost:5173#/filter-bar`

Verify:
- FilterButton renders as a funnel icon button
- Clicking it shows a dropdown of available fields
- Selecting a field adds a pending chip
- Chips display with dashed border and segmented segments
- Operator dropdowns work for date and text fields
- Value editors open correctly
- X removes individual filters
- "Clear filters" removes all
- Pre-set filters demo shows correct chips
- Dark mode looks correct

**Step 3: Commit the registry build output**

```bash
git add public/r/
git commit -m "chore: rebuild registry output"
```
