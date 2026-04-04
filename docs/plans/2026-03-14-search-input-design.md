# Search Input Component Design

## Purpose

A reusable search input with a search icon, optional clear button, and built-in debounce. Replaces the duplicated `SearchInputField` implementations in Performance and Recruitment projects. Designed to pair with `FilterButton` in toolbar layouts.

## Approach

Wrapper around the existing `Input` component (Option A). Composes rather than duplicates, keeping styling in sync with the base input.

## API

```tsx
interface SearchInputProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  /** Debounce delay in ms. Default: 300 */
  debounce?: number
  /** Fires with debounced value */
  onSearch?: (value: string) => void
  /** Fires immediately on every keystroke */
  onChange?: (value: string) => void
  /** Clear handler -- shows X button when provided and value is non-empty */
  onClear?: () => void
}
```

### Usage

```tsx
// Simple debounced search
<SearchInput placeholder="Search employees..." onSearch={(q) => refetch(q)} />

// Controlled with debounce
<SearchInput
  value={query}
  onChange={setQuery}
  onSearch={(q) => refetch(q)}
  debounce={500}
/>
```

## Rendering

- `Search` icon (lucide) positioned absolute-left, `muted-foreground` color
- Input with `pl-8` to clear icon space
- `X` button on the right when value is non-empty and `onClear` is provided
- Component holds internal state so typing feels instant; `onSearch` fires after debounce settles

## Dependencies

- `input` (registry dependency)
- `lucide-react` (Search, X icons)

## File structure

```
registry/default/search-input/
  search-input.tsx
```
