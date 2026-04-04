# Split Button Component Design

**Date:** 2026-02-21
**Status:** Approved

## Overview

A split button component that pairs a primary action with a dropdown of secondary actions. Common in HRMS forms and toolbars -- e.g., "Save" with options for "Save as Draft", "Save and Close".

## API

Compound component pattern following shadcn conventions. Composes existing `Button` and `DropdownMenu` primitives.

```tsx
<SplitButton variant="default" size="default" disabled={false}>
  <SplitButtonAction onClick={handleSave} loading={false}>
    <Save /> Save
  </SplitButtonAction>
  <SplitButtonMenu align="end" side="bottom">
    <DropdownMenuItem onClick={handleDraft}>
      <FileText /> Save as Draft
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleClose}>
      <DoorOpen /> Save and Close
    </DropdownMenuItem>
  </SplitButtonMenu>
</SplitButton>
```

### Exported Parts

| Component | Role |
|-----------|------|
| `SplitButton` | Root container + context provider (wraps `DropdownMenu`) |
| `SplitButtonAction` | Primary action button (left side) |
| `SplitButtonMenu` | Chevron trigger + dropdown content (right side) |

### Props

**SplitButton (root):**
- `variant`: `"default" | "destructive" | "outline" | "secondary" | "ghost"` -- inherited by both halves
- `size`: `"sm" | "default" | "lg"` -- inherited by both halves
- `disabled`: `boolean` -- disables both halves

**SplitButtonAction:**
- `onClick`: primary action handler
- `loading`: shows spinner and disables both halves
- `className`: override styling
- Standard button HTML attributes

**SplitButtonMenu:**
- `align`: dropdown alignment (default: `"end"`)
- `side`: dropdown side (default: `"bottom"`)
- `className`: override chevron trigger styling
- Children: `DropdownMenuItem`, `DropdownMenuSeparator`, etc.

## Visual Design

```
+-------------------+-------+
|  Save             |   v   |
+-------------------+-------+
 ^ rounded-l only    ^ rounded-r only
        ^ 1px divider
```

- Action: `rounded-r-none`
- Chevron: `rounded-l-none border-l`
- Divider color adapts per variant:
  - `default` / `destructive`: `border-white/20`
  - `outline` / `secondary` / `ghost`: `border-input`

### Chevron Trigger Sizes

| Size | Dimensions |
|------|-----------|
| sm | `h-9 w-9` |
| default | `h-10 w-10` |
| lg | `h-11 w-11` |

### Loading State

- Spinner replaces icon in action button
- Both halves disabled while loading
- Text remains visible

## Implementation

**File:** `registry/default/split-button/split-button.tsx`

**Dependencies:** `@radix-ui/react-dropdown-menu`, `class-variance-authority`

**Registry dependencies:** `button`, `dropdown-menu`

**Internal structure:**
- `SplitButtonContext` -- React context for `{ variant, size, disabled }`
- Reuses `buttonVariants` from the existing button component pattern
- Chevron uses `ChevronDown` from lucide-react
