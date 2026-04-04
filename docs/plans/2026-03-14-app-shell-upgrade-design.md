# AppShell Registry Upgrade Design

**Date:** 2026-03-14
**Origin:** Bridge spec from Pandahrms-Performance frontend team

## Context

The Performance frontend uses 4 custom layout components (AppShell, ContentArea, ContentBase, PageContent) that should be consolidated into the registry AppShell. The registry component needs 4 enhancements first.

## Changes

### 1. Scrollable Content Area

Add overflow scrolling to the content wrapper so main content scrolls independently of sidebar/header.

```tsx
// Before
<div className="flex-1 p-4">{children}</div>

// After
<div className={cn("flex-1 overflow-y-auto overflow-x-hidden min-w-0", contentClassName ?? "p-4")}>
  <div className="mx-auto" style={resolvedMaxWidth}>
    {children}
  </div>
</div>
```

### 2. Max-Width Prop

New prop: `maxWidth?: number | string` (default: `1400`)

- Number values treated as pixels: `1400` -> `"1400px"`
- String values passed through: `"80rem"` -> `"80rem"`
- `"none"` disables the constraint
- Applied with `mx-auto` centering on an inner wrapper div

### 3. Link Component Prop

New prop: `linkComponent?: React.ComponentType<{ href: string; children: React.ReactNode; className?: string; [key: string]: any }>`

Replaces ALL `<a>` tags in the component:
- Branding logo link
- Flat nav item links
- Collapsible sub-item links
- User action links (only those with `href`)

Defaults to `"a"` when not provided. Threaded through internal NavItemFlat and NavItemCollapsible components as a prop.

### 4. Content Padding Prop

New prop: `contentClassName?: string` (default behavior: `"p-4"`)

When provided, replaces (not merges with) the default `p-4` on the content area. This avoids conflicting padding values.

## Props Summary

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `maxWidth` | `number \| string` | `1400` | Max-width on content area |
| `linkComponent` | `React.ComponentType<...>` | `"a"` | Custom link for all anchors |
| `contentClassName` | `string` | `"p-4"` | Override content padding |

## Non-Breaking

All changes are additive. Existing consumers without these props get identical behavior (scrollable content area is the only behavioral change, which is an improvement for all consumers).
