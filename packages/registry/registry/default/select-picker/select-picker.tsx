import { useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent, type ReactNode, type WheelEvent, type TouchEvent } from "react"
import { Check, ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface SelectPickerOption {
  value: string
  label: string
  icon?: ReactNode
  subtitle?: ReactNode
}

interface SelectPickerBaseProps {
  options: SelectPickerOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

interface SingleSelectPickerProps extends SelectPickerBaseProps {
  mode: "single"
  value: string
  onChange: (value: string) => void
}

interface MultipleSelectPickerProps extends SelectPickerBaseProps {
  mode: "multiple"
  value: string[]
  onChange: (value: string[]) => void
}

export type SelectPickerProps = SingleSelectPickerProps | MultipleSelectPickerProps

function SelectPicker(props: SelectPickerProps) {
  const {
    options,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    disabled = false,
    className,
    mode,
  } = props

  const [open, setOpen] = useState(false)

  if (mode === "single") {
    return (
      <SinglePicker
        options={options}
        value={props.value}
        onChange={props.onChange}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        disabled={disabled}
        className={className}
        open={open}
        onOpenChange={setOpen}
      />
    )
  }

  return (
    <MultiplePicker
      options={options}
      value={props.value}
      onChange={props.onChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      disabled={disabled}
      className={className}
      open={open}
      onOpenChange={setOpen}
    />
  )
}

function SinglePicker({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  className,
  open,
  onOpenChange,
}: {
  options: SelectPickerOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const selectedOption = options.find((opt) => opt.value === localValue)

  const handleSelect = (optionValue: string) => {
    setLocalValue(optionValue)
    onChange(optionValue)
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !selectedOption && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          disabled={disabled}
        >
          <span className="flex items-center gap-2 truncate">
            {selectedOption?.icon && (
              <span className="shrink-0">{selectedOption.icon}</span>
            )}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
        onWheel={(e: WheelEvent<HTMLDivElement>) => e.stopPropagation()}
        onTouchMove={(e: TouchEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="overscroll-contain">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      localValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.icon && (
                    <span className="mr-2 shrink-0">{option.icon}</span>
                  )}
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    {option.subtitle && (
                      <span className="text-xs text-muted-foreground">
                        {option.subtitle}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function MultiplePicker({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  className,
  open,
  onOpenChange,
}: {
  options: SelectPickerOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const selectedOptions = useMemo(
    () => options.filter((opt) => localValue.includes(opt.value)),
    [options, localValue]
  )

  const handleToggle = (optionValue: string) => {
    const next = localValue.includes(optionValue)
      ? localValue.filter((v) => v !== optionValue)
      : [...localValue, optionValue]
    setLocalValue(next)
    onChange(next)
  }

  const handleRemove = (
    e: MouseEvent | KeyboardEvent,
    optionValue: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    const next = localValue.filter((v) => v !== optionValue)
    setLocalValue(next)
    onChange(next)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-auto min-h-9 w-full justify-between font-normal",
            selectedOptions.length === 0 && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="rounded-sm px-1.5 py-0 text-xs font-normal"
                >
                  {option.icon && (
                    <span className="mr-1 shrink-0">{option.icon}</span>
                  )}
                  {option.label}
                  <button
                    type="button"
                    aria-label={`Remove ${option.label}`}
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onMouseDown={(e) => handleRemove(e, option.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRemove(e, option.value)
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
        onWheel={(e: WheelEvent<HTMLDivElement>) => e.stopPropagation()}
        onTouchMove={(e: TouchEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="overscroll-contain">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = localValue.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleToggle(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    {option.icon && (
                      <span className="mr-2 shrink-0">{option.icon}</span>
                    )}
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {option.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { SelectPicker }
