# SettingsRow

A pure-layout row for `/settings/*` pages. Stacks **title + description + control + helper text** in a consistent rhythm and exposes an optional trailing action slot. The save UI is opt-in — by default the row owns no save state at all, so the parent page can run a single batched save flow over multiple rows. Set `showSave` on the row when you want a per-row Save + Cancel pair instead.

Designed to live inside a `Card` with `divide-y` between rows.

## Usage

### Inline layout (default) — small controls like Switch / icon-trigger

```tsx
import { Card, CardContent } from "@pandaworks-sw/lucid-ui";
import { SettingsRow, Switch } from "@pandaworks-sw/lucid-ui";

<Card>
  <CardContent className="divide-y p-0">
    <div className="px-6">
      <SettingsRow
        title="Email me on mentions"
        description="Whenever someone @-mentions you in a comment."
      >
        <Switch checked={emailMentions} onCheckedChange={setEmailMentions} />
      </SettingsRow>
    </div>
    <div className="px-6">
      <SettingsRow title="Theme" description="Choose how the app looks on this device.">
        <ThemeToggle />
      </SettingsRow>
    </div>
  </CardContent>
</Card>
```

### Stacked layout — full-width text inputs

Use `layout="stacked"` when the control needs the full row width (`Input`, `Textarea`, `SelectPicker` with long options, etc.).

```tsx
<SettingsRow
  layout="stacked"
  title="Display name"
  description="The name shown to other people in your workspace."
  helperText="Visible to everyone in your organization."
>
  <Input value={name} onChange={e => setName(e.target.value)} />
</SettingsRow>
```

### Opt-in per-row Save / Cancel

When `showSave` is `true`, the row renders a right-aligned Save + Cancel pair under the control. The component owns nothing — your `onSave` / `onCancel` callbacks do the work, and `dirty` / `saving` drive the disabled / loading state on the Save button.

```tsx
<SettingsRow
  layout="stacked"
  title="Display name"
  description="Visible to everyone in your organization."
  showSave
  dirty={name !== savedName}
  saving={isSaving}
  onSave={() => save(name)}
  onCancel={() => setName(savedName)}
>
  <Input value={name} onChange={e => setName(e.target.value)} />
</SettingsRow>
```

Cancel button is only rendered when `onCancel` is provided. Cancel/Save use `Button action="cancel"` / `action="save"` so the icons and variants stay consistent across the app.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `ReactNode` | — | Required. Primary label. Renders as `text-sm font-medium`. |
| `description` | `ReactNode` | — | Secondary line under the title (`text-sm text-muted-foreground`). |
| `helperText` | `ReactNode` | — | Small hint at the bottom of the row (`text-xs text-muted-foreground`). Renders below the control. |
| `trailing` | `ReactNode` | — | Optional slot at the far right (badge, action button, copy link). |
| `layout` | `"inline" \| "stacked"` | `"inline"` | Inline = control sits to the right of the label block. Stacked = control sits on its own row below the label block. |
| `showSave` | `boolean` | `false` | Renders the per-row Save + Cancel pair at the bottom-right. |
| `saveLabel` | `string` | `"Save"` | Label for the Save button. |
| `cancelLabel` | `string` | `"Cancel"` | Label for the Cancel button. |
| `dirty` | `boolean` | `true` | When `false`, the Save button is disabled. Pair with your local form-state comparison. |
| `saving` | `boolean` | `false` | When `true`, the Save button shows a spinner and both buttons are disabled. |
| `onSave` | `() => void` | — | Fires when the user clicks Save. |
| `onCancel` | `() => void` | — | Fires when the user clicks Cancel. The Cancel button is only rendered when this prop is provided. |
| `children` | `ReactNode` | — | The control. Any element you want — `Input`, `Switch`, `Select`, `ThemeToggle`, etc. |

All other props are forwarded to the root `<div>`.

## Patterns

- **Notifications page**: a single `Card` with `divide-y` and one `SettingsRow` per channel. Inline layout. No `showSave` — the Switch fires immediately.
- **Profile page**: stacked layout for the avatar / display-name / bio inputs, all under one big Save button at the bottom of the form (`showSave={false}` on each row, one footer-level Save).
- **Security page**: mix — booleans (`2FA enforced`) inline, sensitive controls (`API token rotation`) stacked with per-row Save (`showSave`).
- **A single "dangerous" row** (delete account, leave workspace): wrap in `<SettingsRow trailing={<Button variant="destructive">Delete</Button>}>` so the action is clearly separated from the description.

## When to reach for something else

- Need a row to be **clickable** (e.g. opens a sub-page)? Use `ListRow` with `asButton` instead.
- Need a **dense scrollable list** (members, channels)? `ListRow` again — `SettingsRow` is for stable preference rows, not dynamic lists.
- Need a **two-pane settings layout** (sidebar nav + content)? Pair `AppShell` for the chrome and stack `SettingsRow`s inside the content `Card`.
