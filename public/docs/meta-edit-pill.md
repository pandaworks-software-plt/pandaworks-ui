# MetaEditPill

Inline click-to-edit value pill. Renders as `<label> <value>` where the value
is a `DropdownMenu` trigger. Use for compact meta strips on detail pages where
each field has a fixed option set (Priority, Severity, Module, Platforms,
Tags, etc.).

The component is presentational — wire `onChange` to your own mutation hook.
When `canEdit` is false, it falls back to a static label / value pair so the
same JSX renders for read-only viewers.

## When to use

- Detail-page meta strips — a line of "Priority High · Severity Major · Module
  Payroll" with click-to-edit per value, like Jira / Linear inline fields.
- Compact field rows where opening a full edit modal is too heavy for picking
  one of a small set of choices.
- Mixed read / write surfaces — flip `canEdit` from a permission check to
  reuse the same JSX.

Do not use it for:

- Free-form text editing — reach for `InlineEditableField` instead.
- Searchable picklists or > ~15 options — `SelectPicker` is a better fit.
- Fields that need an explicit Save / Cancel step — the pill commits the
  change on every dropdown selection.

## Props

| Prop | Type | Description |
|------|------|------------|
| `label` | `ReactNode` | Field name shown in front of the value (e.g. "Priority"). |
| `mode` | `'single' \| 'multi'` | Discriminates the rest of the props. |
| `value` | `string \| null` (single) or `string[]` (multi) | Currently selected value(s). |
| `options` | `MetaEditPillOption[]` | `{ value, label }` pairs. |
| `onChange` | `(value) => void` | Fires on every selection. Receives `string \| null` (single) or `string[]` (multi). |
| `canEdit` | `boolean` | When false, renders plain label + value text without the dropdown trigger. |
| `disabled` | `boolean` | Greys the trigger and blocks interaction (use while a mutation is in flight). |
| `allowClear` | `boolean` | **single only.** Shows a "Clear" item at the top that fires `onChange(null)`. |
| `clearLabel` | `string` | **single only.** Override the default "Clear" label (e.g. "No module"). |
| `emptyText` | `string` | Text shown when no value is selected. Defaults to `"Nil"`. |
| `className` | `string` | className passthrough on the outer wrapper. |

## Examples

### Single-select with optional Clear

```tsx
import { MetaEditPill } from '@pandaworks-sw/lucid-ui';

const MODULE_OPTIONS = [
  { value: 'hr', label: 'HR Management' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'leave', label: 'Leave Management' },
];

<MetaEditPill
  label="Module"
  mode="single"
  value={ticket.module}
  options={MODULE_OPTIONS}
  allowClear
  clearLabel="No module"
  canEdit={canWrite}
  disabled={updateTicket.isPending}
  onChange={(next) => updateTicket.mutate({ module: next })}
/>
```

### Multi-select

```tsx
const PLATFORM_OPTIONS = [
  { value: 'web', label: 'Web' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
];

<MetaEditPill
  label="Platforms"
  mode="multi"
  value={ticket.platforms ?? []}
  options={PLATFORM_OPTIONS}
  canEdit={canWrite}
  onChange={(next) =>
    updateTicket.mutate({ platforms: next.length === 0 ? null : next })
  }
/>
```

### Meta strip composition

Use a flex wrapper to lay out multiple pills as a single meta line:

```tsx
<div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
  <MetaEditPill label="Module" mode="single" {...moduleProps} />
  <MetaEditPill label="Platforms" mode="multi" {...platformsProps} />
  <MetaEditPill label="Priority" mode="single" {...priorityProps} />
  <MetaEditPill label="Severity" mode="single" {...severityProps} />
</div>
```

## Behaviour notes

- The trigger reads `Change <label-lowercased>` to screen readers. Pass a
  `string` `label` for accurate announcements (a `ReactNode` label falls
  back to `"Change value"`).
- Single-select disables the option matching the current value so the same
  value cannot be re-selected as a no-op event.
- Multi-select calls `event.preventDefault()` on each `onSelect` so the menu
  stays open between toggles — users can flip multiple checkboxes before
  closing the dropdown.
- The component does not manage its own loading state. Set `disabled` while
  your mutation is pending; the dropdown stays usable until then.
