# Unified Button with Action Presets

**Date:** 2026-03-31
**Status:** Approved

## Problem

The registry has 15 action-button files + a base Button + split-button. Frontend devs face confusion about which component to use. The action-button layer duplicates Button's job with extra indirection.

## Solution

Enhance `Button` with two new optional props: `action` and `icon`. Remove the `action-button` component entirely. Confirmation stays external via `AlertDialog`.

## New Button Props

| Prop | Type | Description |
|------|------|-------------|
| `action` | `"create" \| "edit" \| "save" \| "delete" \| "cancel" \| "view" \| "export" \| "import" \| "archive" \| "duplicate" \| "print" \| "link"` | Auto-resolves icon + default variant |
| `icon` | `ElementType` (Lucide component) | Custom icon, or overrides action's icon |
| `tooltip` | `string` | Override auto-tooltip text |
| `loading` | `boolean` | Shows spinner, disables button |
| `asChild` | `boolean` | Existing -- polymorphic rendering |

Existing `variant` and `size` props stay unchanged. If `action` is set and `variant` is not, the action's default variant applies.

## Action Preset Map

| Action | Icon | Default Variant |
|--------|------|-----------------|
| `create` | Plus | default (primary) |
| `edit` | Pencil | outline |
| `save` | Save | default (primary) |
| `delete` | Trash2 | destructive |
| `cancel` | X | outline |
| `view` | Eye | ghost |
| `export` | Download | outline |
| `import` | Upload | outline |
| `archive` | Archive | secondary |
| `duplicate` | Copy | outline |
| `print` | Printer | outline |
| `link` | ExternalLink | ghost |

## Behavior Rules

1. **Icon resolution**: `icon` prop > action preset icon > no icon
2. **Variant resolution**: explicit `variant` prop > action preset variant > `"default"`
3. **Auto-tooltip**: When `size` is `"icon"` / `"icon-sm"` / `"icon-lg"` and an icon is present, auto-wrap with `Tooltip`. Text comes from `tooltip` prop > action name (capitalized) > none
4. **Loading**: When `loading=true`, replace icon with `Loader2` spinner and disable the button
5. **No children + action**: If action is set but no children provided and size is not icon, render the action name as label (e.g. "Create")

## Confirmation Dialogs

Button does NOT handle confirmation. Devs use `AlertDialog` directly:

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button action="delete">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete item?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel asChild>
        <Button variant="outline">Cancel</Button>
      </AlertDialogCancel>
      <AlertDialogAction asChild>
        <Button action="delete">Delete</Button>
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

`AlertDialogAction` and `AlertDialogCancel` are updated to render as actual `Button` components (via `asChild`).

## What Gets Removed

- Entire `action-button/` directory (15 files)
- `action-button` entry from `registry.json`

## What Gets Modified

- `button/button.tsx` -- add `action`, `icon`, `tooltip`, `loading` props + action preset config
- `alert-dialog/alert-dialog.tsx` -- update Action/Cancel to use `Button` via `asChild`
- `split-button/split-button.tsx` -- verify it still works with enhanced Button
- `CLAUDE.md` -- update action buttons documentation

## Usage Examples

```tsx
// Action preset (most common)
<Button action="create">Create</Button>
<Button action="delete">Delete</Button>
<Button action="edit" variant="ghost">Edit</Button>

// Custom icon, no action
<Button icon={RefreshCw} variant="outline">Refresh</Button>

// Icon-only with auto tooltip
<Button action="edit" size="icon" />

// Override action icon
<Button action="create" icon={UserPlus}>Add Member</Button>

// Loading state
<Button action="save" loading>Saving...</Button>

// In confirmation dialog
<AlertDialogAction asChild>
  <Button action="delete">Confirm Delete</Button>
</AlertDialogAction>
```
