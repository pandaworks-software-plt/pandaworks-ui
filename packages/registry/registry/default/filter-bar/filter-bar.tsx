import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react"
import { format } from "date-fns"
import {
  CalendarIcon,
  Check,
  ChevronDown,
  ListFilter,
  Type,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

const OPERATOR_LABELS: Record<string, string> = Object.fromEntries(
  [...DATE_OPERATORS, ...TEXT_OPERATORS, { label: "between", value: "between" }]
    .map((o) => [o.value, o.label])
)

function formatOperator(filter: ActiveFilter): string {
  if (filter.type === "pending") return ""
  return OPERATOR_LABELS[filter.operator] ?? filter.operator
}

function isDateOutOfRange(date: Date, field: DateFilterField): boolean {
  if (field.minDate && date < field.minDate) return true
  if (field.maxDate && date > field.maxDate) return true
  return false
}

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
            aria-label={`Add ${field.label} filter`}
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

// ---------------------------------------------------------------------------
// OptionValueEditor – step 2 for "option" fields
// ---------------------------------------------------------------------------

function OptionValueEditor({
  field,
  initial,
  onApply,
}: {
  field: OptionFilterField
  initial: string[]
  onApply: (values: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>(initial)
  const isMulti = field.multiple !== false

  const toggle = (value: string) => {
    if (isMulti) {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      )
    } else {
      onApply([value])
    }
  }

  return (
    <div className="flex flex-col">
      <Command>
        <CommandInput placeholder={`Search ${field.label.toLowerCase()}...`} />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup>
            {field.options.map((opt) => {
              const active = selected.includes(opt.value)
              return (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => toggle(opt.value)}
                >
                  {isMulti ? (
                    <Checkbox
                      checked={active}
                      className="mr-2 pointer-events-none"
                      tabIndex={-1}
                    />
                  ) : (
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}
                  {opt.label}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </Command>
      {isMulti && (
        <div className="border-t p-2">
          <Button
            size="sm"
            className="w-full"
            disabled={selected.length === 0}
            onClick={() => onApply(selected)}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DateValueEditor – step 2 for "date" fields
// ---------------------------------------------------------------------------

function DateValueEditor({
  field,
  initial,
  onApply,
}: {
  field: DateFilterField
  initial: Date | undefined
  onApply: (date: Date) => void
}) {
  return (
    <Calendar
      mode="single"
      selected={initial}
      onSelect={(date: Date | undefined) => date && onApply(date)}
      disabled={(date: Date) => isDateOutOfRange(date, field)}
      initialFocus
    />
  )
}

// ---------------------------------------------------------------------------
// DateRangeValueEditor – step 2 for "date-range" fields
// ---------------------------------------------------------------------------

function DateRangeValueEditor({
  field,
  initialStart,
  initialEnd,
  onApply,
}: {
  field: DateFilterField
  initialStart: Date | undefined
  initialEnd: Date | undefined
  onApply: (start: Date, end: Date) => void
}) {
  const [start, setStart] = useState<Date | undefined>(initialStart)
  const [end, setEnd] = useState<Date | undefined>(initialEnd)
  const [selectingEnd, setSelectingEnd] = useState(false)

  const disabled = (date: Date) =>
    isDateOutOfRange(date, field) || (selectingEnd && !!start && date < start)

  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    if (!selectingEnd) {
      setStart(date)
      setEnd(undefined)
      setSelectingEnd(true)
    } else {
      setEnd(date)
      setSelectingEnd(false)
      if (start) onApply(start, date)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="px-3 py-2 text-xs text-muted-foreground font-medium">
        {!selectingEnd ? "Select start date" : "Select end date"}
      </div>
      <Calendar
        mode="single"
        selected={selectingEnd ? end : start}
        onSelect={handleSelect}
        disabled={disabled}
        initialFocus
      />
      {start && end && (
        <div className="border-t px-3 py-2 text-xs text-muted-foreground">
          {format(start, "MMM d, yyyy")} - {format(end, "MMM d, yyyy")}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// TextValueEditor – step 2 for "text" fields
// ---------------------------------------------------------------------------

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
  const [value, setValue] = useState(initial)

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
        onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
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
  const isPending = filter.type === "pending"
  const isEmpty =
    isPending ||
    (filter.type === "option" && filter.values.length === 0) ||
    (filter.type === "text" && !filter.value.trim())
  const [valueOpen, setValueOpen] = useState(false)
  const [operatorOpen, setOperatorOpen] = useState(false)

  // Auto-open value editor after chip mounts if pending.
  // Delay lets FilterButton's popover finish its focus cleanup first.
  useEffect(() => {
    if (isPending) {
      const timer = setTimeout(() => setValueOpen(true), 50)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleValueApply = (newFilter: ActiveFilter) => {
    onUpdate(newFilter)
    setValueOpen(false)
  }

  const handleOperatorChange = (op: string) => {
    if (filter.type === "pending") return
    if (filter.type === "date") {
      if (op === "is" || op === "before" || op === "after") {
        onUpdate({ ...filter, operator: op as DateOperator })
      }
    } else if (filter.type === "text") {
      onUpdate({ ...filter, operator: op as TextOperator })
    }
    setOperatorOpen(false)
  }

  const borderColor = isEmpty
    ? "border-orange-400/60 dark:border-orange-400/70"
    : "border-primary/40 dark:border-primary/50"

  const chipBase = cn(
    "inline-flex items-center rounded-full border border-dashed text-sm",
    borderColor
  )

  const textColor = isEmpty
    ? "text-orange-600 dark:text-orange-400"
    : "text-primary dark:text-primary"

  const segmentBase = cn(
    "inline-flex items-center gap-1 px-2 py-0.5 transition-colors",
    textColor
  )

  const segmentInteractive = cn(
    segmentBase,
    isEmpty
      ? "cursor-pointer hover:bg-orange-500/10 dark:hover:bg-orange-400/20"
      : "cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20"
  )

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
                "border-l border-dashed", borderColor
              )}
            >
              {formatOperator(filter)}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-0" align="start">
            <OperatorSelector
              operators={operators}
              value={filter.operator}
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
                "border-l border-dashed", borderColor
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

// ---------------------------------------------------------------------------
// FilterButton - compact filter trigger with funnel icon
// ---------------------------------------------------------------------------

function FilterButton({
  fields,
  activeKeys,
  onAdd,
  className,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false)
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
    <div data-slot="active-filters" className={cn("flex flex-wrap items-center gap-2", className)}>
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

export { FilterButton, ActiveFilters }
