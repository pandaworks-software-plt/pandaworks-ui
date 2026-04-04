import { useEffect, useState, type ChangeEvent, type ComponentProps } from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface SearchInputProps
  extends Omit<ComponentProps<"input">, "type" | "onChange"> {
  /** Debounce delay in ms. Default: 300 */
  debounce?: number
  /** Fires with the debounced value */
  onSearch?: (value: string) => void
  /** Fires immediately on every keystroke with the new value */
  onChange?: (value: string) => void
  /** Shows a clear (X) button when provided and value is non-empty */
  onClear?: () => void
}

function SearchInput({
  className,
  debounce = 300,
  value: controlledValue,
  onSearch,
  onChange,
  onClear,
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  const [internal, setInternal] = useState(
    () => (controlledValue as string) ?? ""
  )

  // Sync internal state when controlled value changes externally
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternal(controlledValue as string)
    }
  }, [controlledValue])

  // Debounced onSearch callback
  useEffect(() => {
    if (!onSearch) return

    const timer = setTimeout(() => {
      onSearch(internal)
    }, debounce)

    return () => clearTimeout(timer)
  }, [internal, debounce, onSearch])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setInternal(next)
    onChange?.(next)
  }

  const handleClear = () => {
    setInternal("")
    onChange?.("")
    onSearch?.("")
    onClear?.()
  }

  const showClear = onClear && internal.length > 0

  return (
    <div data-slot="search-input" className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...props}
        type="text"
        placeholder={placeholder}
        value={internal}
        onChange={handleChange}
        className={cn("pl-8", showClear && "pr-8")}
      />
      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

export { SearchInput, type SearchInputProps }
