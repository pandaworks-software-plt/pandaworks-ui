# Search Input Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `search-input` component to the registry -- a search icon input with optional clear button and built-in debounce.

**Architecture:** Wrapper around the existing `Input` component. Internal state for instant typing, debounced `onSearch` callback. No external debounce library -- uses a simple `useEffect` + `setTimeout`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, lucide-react icons, shadcn/ui Input

---

### Task 1: Create the search-input component

**Files:**
- Create: `registry/default/search-input/search-input.tsx`

**Step 1: Create the component file**

```tsx
"use client"

import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
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
  const [internal, setInternal] = React.useState(
    () => (controlledValue as string) ?? ""
  )

  // Sync internal state when controlled value changes externally
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setInternal(controlledValue as string)
    }
  }, [controlledValue])

  // Debounced onSearch callback
  React.useEffect(() => {
    if (!onSearch) return

    const timer = setTimeout(() => {
      onSearch(internal)
    }, debounce)

    return () => clearTimeout(timer)
  }, [internal, debounce, onSearch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...props}
        type="search"
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
```

---

### Task 2: Register the component

**Files:**
- Modify: `registry.json`

**Step 1: Add the search-input entry to the `items` array**

Add this entry after the existing `input` entry in `registry.json`:

```json
{
  "name": "search-input",
  "type": "registry:ui",
  "title": "Search Input",
  "description": "A search input with icon, optional clear button, and built-in debounce for filtering lists.",
  "dependencies": [
    "lucide-react"
  ],
  "registryDependencies": [
    "input"
  ],
  "files": [
    {
      "path": "registry/default/search-input/search-input.tsx",
      "type": "registry:ui"
    }
  ]
}
```

---

### Task 3: Build and verify

**Step 1: Run registry build**

Run: `pnpm registry:build`
Expected: Build succeeds, `public/r/search-input.json` is generated.

**Step 2: Verify the output**

Run: `cat public/r/search-input.json | head -20`
Expected: JSON with the component source embedded.

**Step 3: Run lint**

Run: `pnpm lint`
Expected: No errors.
