# Action Button Component Design

## Overview

A set of individually exported action button components for standard CRUD and utility actions across Pandahrms. Each action button has a preset icon, styling, and behavior (e.g., confirmation dialogs for destructive actions), while sharing a common internal base for consistency.

## Requirements

- Standard action buttons: Create, Edit, Save, Delete, View, Link, Cancel, Export, Import, Archive, Duplicate, Print
- Each action has its own typed props, Lucide icon, and button variant
- Polymorphic: renders `<a>` when `href` is provided, `<button>` otherwise
- Three display modes: `icon` (table rows with tooltip), `label` (text-only), `icon-label` (default, page headers)
- Built-in AlertDialog confirmation for destructive/critical actions (Delete, Archive, Save)
- Confirmation only applies in button mode (not link mode)
- Dark mode support
- No Next.js dependency (plain `<a>` tags for links)

## Architecture

### File Structure

```
registry/default/action-button/
  action-button-base.tsx    # Shared internal base (not directly exported to consumers)
  delete-button.tsx
  save-button.tsx
  create-button.tsx
  edit-button.tsx
  view-button.tsx
  link-button.tsx
  cancel-button.tsx
  export-button.tsx
  import-button.tsx
  archive-button.tsx
  duplicate-button.tsx
  print-button.tsx
  action-button.tsx         # Barrel export
```

### Shared Base

```tsx
type ActionButtonMode = "icon" | "label" | "icon-label"

interface ActionButtonBaseProps {
  mode?: ActionButtonMode       // default: "icon-label"
  size?: "sm" | "default" | "lg"
  disabled?: boolean
  className?: string
}
```

- `mode="icon"` - compact icon-only, wrapped in Tooltip for accessibility
- `mode="label"` - text-only, no icon
- `mode="icon-label"` - icon + text label (default)

### Polymorphic Rendering

- `href` provided -> renders `<a>` tag
- `onClick`/`onConfirm` provided -> renders `<button>` tag
- Uses Radix Slot pattern internally for composition

### Confirmation Pattern

Buttons with confirmation (Delete, Archive, Save) wrap AlertDialog internally:

```tsx
<DeleteButton onConfirm={handleDelete} />

<DeleteButton
  onConfirm={handleDelete}
  confirmTitle="Delete employee?"
  confirmDescription="This action cannot be undone."
/>
```

Confirmation props:
- `confirmTitle` - AlertDialog title (has sensible default per action)
- `confirmDescription` - AlertDialog description (has sensible default per action)

## Action Definitions

| Component | Unique Props | Icon | Button Variant | Has Confirmation |
|-----------|-------------|------|---------------|-----------------|
| `CreateButton` | `href?`, `onClick?` | `Plus` | `default` | No |
| `EditButton` | `href?`, `onClick?` | `Pencil` | `outline` | No |
| `SaveButton` | `onClick`, `loading?`, `form?` | `Save` | `default` | Yes |
| `DeleteButton` | `onConfirm`, `confirmTitle?`, `confirmDescription?` | `Trash2` | `destructive` | Yes |
| `ViewButton` | `href`, `target?` | `Eye` | `ghost` | No |
| `LinkButton` | `href`, `target?`, `label` | `ExternalLink` | `ghost` | No |
| `CancelButton` | `href?`, `onClick?` | `X` | `outline` | No |
| `ExportButton` | `onClick`, `loading?` | `Download` | `outline` | No |
| `ImportButton` | `onClick?`, `href?` | `Upload` | `outline` | No |
| `ArchiveButton` | `onConfirm`, `confirmTitle?`, `confirmDescription?` | `Archive` | `secondary` | Yes |
| `DuplicateButton` | `onClick`, `loading?` | `Copy` | `outline` | No |
| `PrintButton` | `onClick?` | `Printer` | `outline` | No |

## Dependencies

- `button` (existing registry component)
- `alert-dialog` (existing registry component)
- `tooltip` (existing registry component)
- `lucide-react` (icons)

## Usage Examples

### Table row actions (icon mode)

```tsx
<div className="flex gap-1">
  <ViewButton href={`/employees/${id}`} mode="icon" />
  <EditButton href={`/employees/${id}/edit`} mode="icon" />
  <DeleteButton onConfirm={() => remove(id)} mode="icon" />
</div>
```

### Page header actions (icon-label mode, default)

```tsx
<div className="flex gap-2">
  <CancelButton href="/employees" />
  <SaveButton onClick={handleSave} loading={isPending} />
</div>
```

### Index page create button (as link)

```tsx
<CreateButton href="/employees/new" />
```

### Detail page with form submit

```tsx
<SaveButton onClick={handleSubmit} form="employee-form" loading={isSaving} />
```
