# Action Button Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a set of individually exported action button components (Create, Edit, Save, Delete, View, Link, Cancel, Export, Import, Archive, Duplicate, Print) with standardized icons, styling, polymorphic rendering (button/link), and built-in AlertDialog confirmation for destructive actions.

**Architecture:** A shared internal `ActionButtonBase` handles polymorphic rendering (`<a>` vs `<button>`), display modes (icon/label/icon-label), tooltip wrapping in icon mode, and loading states. Each action is an individually exported component that wraps the base with typed props, a preset Lucide icon, button variant, and optional AlertDialog confirmation. A `ConfirmableActionButton` internal wrapper composes AlertDialog around the base for destructive/critical actions.

**Tech Stack:** React 19, TypeScript, Tailwind v4 (OKLCH), Radix UI (AlertDialog, Tooltip), Lucide icons, class-variance-authority, `cn` utility.

**Design doc:** `docs/plans/2026-03-14-action-button-design.md`

---

### Task 1: Create ActionButtonBase (shared internal component)

**Files:**
- Create: `registry/default/action-button/action-button-base.tsx`

**Step 1: Create the base component file**

This is an internal building block, not directly exported to consumers. It handles:
- Polymorphic rendering: `href` -> `<a>`, otherwise -> `<button>`
- Three display modes via `mode` prop: `"icon"` (icon-only wrapped in Tooltip), `"label"` (text-only), `"icon-label"` (both, default)
- Size: `"sm" | "default" | "lg"`
- Loading state with Loader2 spinner
- Disabled state
- Forwards className for variant styling from parent

```tsx
// registry/default/action-button/action-button-base.tsx
"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ActionButtonMode = "icon" | "label" | "icon-label"
type ActionButtonSize = "sm" | "default" | "lg"

interface ActionButtonBaseProps {
  icon: React.ElementType
  label: string
  mode?: ActionButtonMode
  size?: ActionButtonSize
  variant?: ButtonProps["variant"]
  disabled?: boolean
  loading?: boolean
  className?: string
  href?: string
  target?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  form?: string
  type?: "button" | "submit" | "reset"
}

const sizeMap: Record<ActionButtonSize, ButtonProps["size"]> = {
  sm: "sm",
  default: "default",
  lg: "lg",
}

const iconSizeMap: Record<ActionButtonSize, ButtonProps["size"]> = {
  sm: "icon-sm",
  default: "icon",
  lg: "icon-lg",
}

function ActionButtonBase({
  icon: Icon,
  label,
  mode = "icon-label",
  size = "default",
  variant = "outline",
  disabled = false,
  loading = false,
  className,
  href,
  target,
  onClick,
  form,
  type = "button",
}: ActionButtonBaseProps) {
  const isIconOnly = mode === "icon"
  const showIcon = mode !== "label"
  const showLabel = mode !== "icon"
  const buttonSize = isIconOnly ? iconSizeMap[size] : sizeMap[size]

  const content = (
    <>
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : showIcon ? (
        <Icon />
      ) : null}
      {showLabel && <span>{label}</span>}
    </>
  )

  const sharedProps = {
    className: cn(className),
    disabled: disabled || loading,
    variant,
    size: buttonSize,
  }

  const button = href ? (
    <Button asChild {...sharedProps}>
      <a href={href} target={target}>
        {content}
      </a>
    </Button>
  ) : (
    <Button
      {...sharedProps}
      onClick={onClick}
      form={form}
      type={type}
    >
      {content}
    </Button>
  )

  if (isIconOnly) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    )
  }

  return button
}

export { ActionButtonBase }
export type { ActionButtonBaseProps, ActionButtonMode, ActionButtonSize }
```

**Step 2: Verify the file compiles**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm lint`
Expected: No errors related to action-button-base.tsx

**Step 3: Commit**

```bash
git add registry/default/action-button/action-button-base.tsx
git commit -m "feat(action-button): add ActionButtonBase internal component"
```

---

### Task 2: Create ConfirmableActionButton (internal AlertDialog wrapper)

**Files:**
- Create: `registry/default/action-button/confirmable-action-button.tsx`

**Step 1: Create the confirmable wrapper**

This wraps ActionButtonBase with AlertDialog for destructive/critical actions. The button becomes the AlertDialog trigger, and `onConfirm` fires when the user confirms.

```tsx
// registry/default/action-button/confirmable-action-button.tsx
"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ActionButtonBase,
  type ActionButtonBaseProps,
} from "./action-button-base"

interface ConfirmableActionButtonProps
  extends Omit<ActionButtonBaseProps, "onClick" | "href" | "target"> {
  onConfirm: () => void
  confirmTitle?: string
  confirmDescription?: string
  confirmActionLabel?: string
  confirmCancelLabel?: string
}

function ConfirmableActionButton({
  onConfirm,
  confirmTitle = "Are you sure?",
  confirmDescription = "This action cannot be undone.",
  confirmActionLabel = "Continue",
  confirmCancelLabel = "Cancel",
  variant = "outline",
  ...baseProps
}: ConfirmableActionButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span>
          <ActionButtonBase {...baseProps} variant={variant} />
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{confirmCancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmActionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmableActionButton }
export type { ConfirmableActionButtonProps }
```

**Step 2: Verify lint**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm lint`
Expected: No errors

**Step 3: Commit**

```bash
git add registry/default/action-button/confirmable-action-button.tsx
git commit -m "feat(action-button): add ConfirmableActionButton internal wrapper"
```

---

### Task 3: Create all 12 action button components

**Files:**
- Create: `registry/default/action-button/create-button.tsx`
- Create: `registry/default/action-button/edit-button.tsx`
- Create: `registry/default/action-button/save-button.tsx`
- Create: `registry/default/action-button/delete-button.tsx`
- Create: `registry/default/action-button/view-button.tsx`
- Create: `registry/default/action-button/link-button.tsx`
- Create: `registry/default/action-button/cancel-button.tsx`
- Create: `registry/default/action-button/export-button.tsx`
- Create: `registry/default/action-button/import-button.tsx`
- Create: `registry/default/action-button/archive-button.tsx`
- Create: `registry/default/action-button/duplicate-button.tsx`
- Create: `registry/default/action-button/print-button.tsx`

Each action button follows the same pattern. Here are the key differences:

**Non-confirmable buttons** (Create, Edit, View, Link, Cancel, Export, Import, Duplicate, Print):

```tsx
// Example: registry/default/action-button/create-button.tsx
"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import {
  ActionButtonBase,
  type ActionButtonMode,
  type ActionButtonSize,
} from "./action-button-base"

interface CreateButtonProps {
  href?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  mode?: ActionButtonMode
  size?: ActionButtonSize
  disabled?: boolean
  className?: string
}

function CreateButton({
  mode,
  size,
  disabled,
  className,
  ...props
}: CreateButtonProps) {
  return (
    <ActionButtonBase
      icon={Plus}
      label="Create"
      variant="default"
      mode={mode}
      size={size}
      disabled={disabled}
      className={className}
      {...props}
    />
  )
}

export { CreateButton }
export type { CreateButtonProps }
```

**Confirmable buttons** (Delete, Archive, Save):

```tsx
// Example: registry/default/action-button/delete-button.tsx
"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"
import {
  ConfirmableActionButton,
} from "./confirmable-action-button"
import type { ActionButtonMode, ActionButtonSize } from "./action-button-base"

interface DeleteButtonProps {
  onConfirm: () => void
  confirmTitle?: string
  confirmDescription?: string
  mode?: ActionButtonMode
  size?: ActionButtonSize
  disabled?: boolean
  loading?: boolean
  className?: string
}

function DeleteButton({
  onConfirm,
  confirmTitle = "Delete this item?",
  confirmDescription = "This action cannot be undone. This will permanently delete this item.",
  mode,
  size,
  disabled,
  loading,
  className,
}: DeleteButtonProps) {
  return (
    <ConfirmableActionButton
      icon={Trash2}
      label="Delete"
      variant="destructive"
      onConfirm={onConfirm}
      confirmTitle={confirmTitle}
      confirmDescription={confirmDescription}
      confirmActionLabel="Delete"
      mode={mode}
      size={size}
      disabled={disabled}
      loading={loading}
      className={className}
    />
  )
}

export { DeleteButton }
export type { DeleteButtonProps }
```

Full action mapping for implementation:

| Component | Icon import | Label | Variant | Confirmable | Default confirmTitle | confirmActionLabel | Extra props |
|-----------|-----------|-------|---------|-------------|---------------------|-------------------|-------------|
| CreateButton | `Plus` | "Create" | `default` | No | - | - | `href?`, `onClick?` |
| EditButton | `Pencil` | "Edit" | `outline` | No | - | - | `href?`, `onClick?` |
| SaveButton | `Save` | "Save" | `default` | Yes | "Save changes?" | "Save" | `form?`, `loading?` |
| DeleteButton | `Trash2` | "Delete" | `destructive` | Yes | "Delete this item?" | "Delete" | `loading?` |
| ViewButton | `Eye` | "View" | `ghost` | No | - | - | `href`, `target?` |
| LinkButton | `ExternalLink` | (prop: `label`) | `ghost` | No | - | - | `href`, `target?`, `label` |
| CancelButton | `X` | "Cancel" | `outline` | No | - | - | `href?`, `onClick?` |
| ExportButton | `Download` | "Export" | `outline` | No | - | - | `onClick`, `loading?` |
| ImportButton | `Upload` | "Import" | `outline` | No | - | - | `onClick?`, `href?` |
| ArchiveButton | `Archive` | "Archive" | `secondary` | Yes | "Archive this item?" | "Archive" | `loading?` |
| DuplicateButton | `Copy` | "Duplicate" | `outline` | No | - | - | `onClick`, `loading?` |
| PrintButton | `Printer` | "Print" | `outline` | No | - | - | `onClick?` |

**Step 1: Create all 12 files** following the patterns above.

**Step 2: Verify lint**

Run: `pnpm lint`
Expected: No errors

**Step 3: Commit**

```bash
git add registry/default/action-button/
git commit -m "feat(action-button): add all 12 individual action button components"
```

---

### Task 4: Create barrel export

**Files:**
- Create: `registry/default/action-button/action-button.tsx`

**Step 1: Create barrel export file**

```tsx
// registry/default/action-button/action-button.tsx
export { CreateButton, type CreateButtonProps } from "./create-button"
export { EditButton, type EditButtonProps } from "./edit-button"
export { SaveButton, type SaveButtonProps } from "./save-button"
export { DeleteButton, type DeleteButtonProps } from "./delete-button"
export { ViewButton, type ViewButtonProps } from "./view-button"
export { LinkButton, type LinkButtonProps } from "./link-button"
export { CancelButton, type CancelButtonProps } from "./cancel-button"
export { ExportButton, type ExportButtonProps } from "./export-button"
export { ImportButton, type ImportButtonProps } from "./import-button"
export { ArchiveButton, type ArchiveButtonProps } from "./archive-button"
export { DuplicateButton, type DuplicateButtonProps } from "./duplicate-button"
export { PrintButton, type PrintButtonProps } from "./print-button"
export type { ActionButtonMode, ActionButtonSize } from "./action-button-base"
```

**Step 2: Commit**

```bash
git add registry/default/action-button/action-button.tsx
git commit -m "feat(action-button): add barrel export"
```

---

### Task 5: Add to registry.json

**Files:**
- Modify: `registry.json`

**Step 1: Add the action-button entry to the items array**

Add this entry to the `items` array in `registry.json`:

```json
{
  "name": "action-button",
  "type": "registry:ui",
  "title": "Action Button",
  "description": "A set of preset action buttons (Create, Edit, Save, Delete, View, Link, Cancel, Export, Import, Archive, Duplicate, Print) with standardized icons, polymorphic rendering, and built-in confirmation dialogs for destructive actions.",
  "dependencies": [
    "lucide-react"
  ],
  "registryDependencies": [
    "button",
    "alert-dialog",
    "tooltip"
  ],
  "files": [
    { "path": "registry/default/action-button/action-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/action-button-base.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/confirmable-action-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/create-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/edit-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/save-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/delete-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/view-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/link-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/cancel-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/export-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/import-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/archive-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/duplicate-button.tsx", "type": "registry:ui" },
    { "path": "registry/default/action-button/print-button.tsx", "type": "registry:ui" }
  ]
}
```

**Step 2: Commit**

```bash
git add registry.json
git commit -m "feat(action-button): add action-button to registry.json"
```

---

### Task 6: Build registry output

**Step 1: Run registry build**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm registry:build`
Expected: `public/r/action-button.json` is generated

**Step 2: Commit**

```bash
git add public/r/action-button.json
git commit -m "feat(action-button): build registry output"
```

---

### Task 7: Create showcase demo

**Files:**
- Create: `src/showcase/demos/action-button-demo.tsx`
- Modify: `src/showcase/showcase-app.tsx`

**Step 1: Create the demo file**

The demo should showcase:
1. All actions in icon-label mode (default)
2. All actions in icon mode (table row simulation)
3. Destructive actions with confirmation dialogs
4. Link vs action mode
5. Loading states
6. Sizes
7. HRMS example: table row actions and page header actions

Follow the pattern from `split-button-demo.tsx`: use `DemoSection` with `title` and `code` props. Include live previews as children.

```tsx
// src/showcase/demos/action-button-demo.tsx
import { useState } from "react"
import { DemoSection } from "@/showcase/component-page"
import {
  CreateButton,
  EditButton,
  SaveButton,
  DeleteButton,
  ViewButton,
  LinkButton,
  CancelButton,
  ExportButton,
  ImportButton,
  ArchiveButton,
  DuplicateButton,
  PrintButton,
} from "@/components/ui/action-button"

export default function ActionButtonDemo() {
  const [saveLoading, setSaveLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  return (
    <div className="space-y-8">
      <DemoSection title="All Actions (icon-label)" code={`<CreateButton href="/new" />
<EditButton href="/edit" />
<SaveButton onClick={handleSave} />
<DeleteButton onConfirm={handleDelete} />
<ViewButton href="/view" />
<LinkButton href="https://example.com" label="Docs" target="_blank" />
<CancelButton onClick={handleCancel} />
<ExportButton onClick={handleExport} />
<ImportButton onClick={handleImport} />
<ArchiveButton onConfirm={handleArchive} />
<DuplicateButton onClick={handleDuplicate} />
<PrintButton onClick={() => window.print()} />`}>
        <div className="flex flex-wrap items-center gap-3">
          <CreateButton onClick={() => {}} />
          <EditButton onClick={() => {}} />
          <SaveButton onClick={() => {}} />
          <DeleteButton onConfirm={() => {}} />
          <ViewButton href="#" />
          <LinkButton href="#" label="Docs" />
          <CancelButton onClick={() => {}} />
          <ExportButton onClick={() => {}} />
          <ImportButton onClick={() => {}} />
          <ArchiveButton onConfirm={() => {}} />
          <DuplicateButton onClick={() => {}} />
          <PrintButton onClick={() => window.print()} />
        </div>
      </DemoSection>

      <DemoSection title="Icon Mode (for table rows)" code={`<ViewButton href="/employees/1" mode="icon" />
<EditButton href="/employees/1/edit" mode="icon" />
<DuplicateButton onClick={handleDuplicate} mode="icon" />
<DeleteButton onConfirm={handleDelete} mode="icon" />`}>
        <div className="flex items-center gap-1">
          <ViewButton href="#" mode="icon" />
          <EditButton onClick={() => {}} mode="icon" />
          <DuplicateButton onClick={() => {}} mode="icon" />
          <DeleteButton onConfirm={() => {}} mode="icon" />
        </div>
      </DemoSection>

      <DemoSection title="Label Mode" code={`<CreateButton href="/new" mode="label" />
<SaveButton onClick={handleSave} mode="label" />`}>
        <div className="flex items-center gap-3">
          <CreateButton onClick={() => {}} mode="label" />
          <EditButton onClick={() => {}} mode="label" />
          <SaveButton onClick={() => {}} mode="label" />
          <DeleteButton onConfirm={() => {}} mode="label" />
          <CancelButton onClick={() => {}} mode="label" />
        </div>
      </DemoSection>

      <DemoSection title="Confirmation Dialogs" code={`// Delete - click to see confirmation
<DeleteButton onConfirm={() => alert("Deleted!")} />

// Archive - click to see confirmation
<ArchiveButton onConfirm={() => alert("Archived!")} />

// Save - click to see confirmation
<SaveButton onClick={() => alert("Saved!")} />

// Custom confirmation messages
<DeleteButton
  onConfirm={() => alert("Employee deleted!")}
  confirmTitle="Delete John Doe?"
  confirmDescription="All associated records will also be removed."
/>`}>
        <div className="flex flex-wrap items-center gap-3">
          <DeleteButton onConfirm={() => alert("Deleted!")} />
          <ArchiveButton onConfirm={() => alert("Archived!")} />
          <SaveButton onClick={() => alert("Saved!")} />
        </div>
      </DemoSection>

      <DemoSection title="Loading States" code={`<SaveButton onClick={handleSave} loading={isSaving} />
<ExportButton onClick={handleExport} loading={isExporting} />`}>
        <div className="flex flex-wrap items-center gap-3">
          <SaveButton
            onClick={() => { setSaveLoading(true); setTimeout(() => setSaveLoading(false), 2000) }}
            loading={saveLoading}
          />
          <ExportButton
            onClick={() => { setExportLoading(true); setTimeout(() => setExportLoading(false), 2000) }}
            loading={exportLoading}
          />
          <span className="text-sm text-muted-foreground">Click to simulate 2s loading</span>
        </div>
      </DemoSection>

      <DemoSection title="Sizes" code={`<CreateButton size="sm" onClick={fn} />
<CreateButton size="default" onClick={fn} />
<CreateButton size="lg" onClick={fn} />`}>
        <div className="flex flex-wrap items-end gap-3">
          <CreateButton size="sm" onClick={() => {}} />
          <CreateButton size="default" onClick={() => {}} />
          <CreateButton size="lg" onClick={() => {}} />
        </div>
      </DemoSection>

      <DemoSection title="As Links" code={`// Navigates to href (no confirmation)
<CreateButton href="/employees/new" />
<EditButton href="/employees/1/edit" />
<ViewButton href="/employees/1" />`}>
        <div className="flex flex-wrap items-center gap-3">
          <CreateButton href="#" />
          <EditButton href="#" />
          <ViewButton href="#" />
          <LinkButton href="#" label="External Docs" target="_blank" />
        </div>
      </DemoSection>

      <DemoSection title="HRMS Example: Table Row Actions">
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">Name</th>
                <th className="p-3 text-left font-medium">Department</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "John Doe", dept: "Engineering", status: "Active" },
                { name: "Jane Smith", dept: "Marketing", status: "Active" },
                { name: "Bob Wilson", dept: "Sales", status: "Inactive" },
              ].map((emp) => (
                <tr key={emp.name} className="border-b">
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.dept}</td>
                  <td className="p-3">{emp.status}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <ViewButton href="#" mode="icon" size="sm" />
                      <EditButton href="#" mode="icon" size="sm" />
                      <DuplicateButton onClick={() => {}} mode="icon" size="sm" />
                      <DeleteButton onConfirm={() => {}} mode="icon" size="sm" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoSection>

      <DemoSection title="HRMS Example: Page Header Actions">
        <div className="flex items-center justify-between rounded-md border p-4">
          <div>
            <h3 className="text-lg font-semibold">Edit Employee</h3>
            <p className="text-sm text-muted-foreground">Update employee information</p>
          </div>
          <div className="flex items-center gap-2">
            <CancelButton href="#" />
            <DeleteButton onConfirm={() => {}} />
            <SaveButton onClick={() => {}} />
          </div>
        </div>
      </DemoSection>
    </div>
  )
}
```

**Step 2: Register the demo in showcase-app.tsx**

Add to imports at the top:
```tsx
import ActionButtonDemo from "./demos/action-button-demo";
```

Add to COMPONENTS array (after the split-button entry):
```tsx
{
  name: "action-button",
  title: "Action Button",
  description: "A set of preset action buttons with standardized icons, polymorphic rendering, and built-in confirmation dialogs.",
  demo: ActionButtonDemo,
},
```

Add `"action-button"` to the Forms category items filter array (alongside `"button"`, `"split-button"`, etc.).

**Step 3: Verify dev server**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm dev`
Expected: Navigate to `#/action-button` and see all demo sections rendering correctly

**Step 4: Run lint**

Run: `pnpm lint`
Expected: No errors

**Step 5: Commit**

```bash
git add src/showcase/demos/action-button-demo.tsx src/showcase/showcase-app.tsx
git commit -m "feat(showcase): add action-button demo"
```

---

### Task 8: Final verification and registry rebuild

**Step 1: Run full lint**

Run: `pnpm lint`
Expected: Clean output

**Step 2: Rebuild registry**

Run: `pnpm registry:build`
Expected: `public/r/action-button.json` updated with all files

**Step 3: Build production**

Run: `pnpm build`
Expected: Build succeeds with no errors

**Step 4: Commit any changes**

```bash
git add -A
git commit -m "feat(action-button): final build and registry output"
```
