# CodeLabel Component Design

## Overview

A general-purpose inline-flex element with `font-mono` text and a copy-to-clipboard button. Works for short identifiers (IDs, ref codes) and longer commands (install commands, URLs).

## API

```tsx
<CodeLabel value="pnpm dlx shadcn@latest add button" />
<CodeLabel value="EMP-2024-001" size="sm" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Text to display and copy |
| `size` | `"sm" \| "default"` | `"default"` | Controls padding and text size |
| `className` | `string` | - | Standard class override |

## Visual Design

- Muted background (`bg-muted/50`), subtle border, rounded corners
- `font-mono` text
- Copy icon button on the right (lucide `Copy` / `Check`)
- On click: copies `value` to clipboard, shows checkmark for 2s
- Dark mode: `dark:bg-muted/20`

### Size variants

- `default`: `text-sm`, `px-3 py-1.5`
- `sm`: `text-xs`, `px-2 py-1`

## Technical

- Single file: `registry/default/code-label/code-label.tsx`
- Dependencies: `lucide-react`
- No registry dependencies
- Uses CVA for size variants

## Files

1. `registry/default/code-label/code-label.tsx` - component
2. `src/showcase/demos/code-label-demo.tsx` - showcase demo
3. `registry.json` - add entry
4. `src/showcase/showcase-app.tsx` - register in showcase
