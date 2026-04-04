# Unified Button Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate 15 action-button files into an enhanced Button component with `action`, `icon`, `tooltip`, and `loading` props.

**Architecture:** Extend the existing `Button` component with an action preset config map that auto-resolves icons and default variants. Remove the entire `action-button` component. Update `alert-dialog` to use Button via `asChild`.

**Tech Stack:** React 19, CVA, Lucide icons, Radix UI (Tooltip, AlertDialog, Slot)

**Design doc:** `docs/plans/2026-03-31-unified-button-design.md`

---

### Task 1: Enhance Button with action, icon, tooltip, and loading props

**Files:**
- Modify: `registry/default/button/button.tsx`

**Step 1: Add the action preset config map and new types**

Add these imports and the config map above the `buttonVariants` declaration in `button.tsx`:

```tsx
import { forwardRef, type ButtonHTMLAttributes, type ElementType, type ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Archive,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Printer,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
```

Add the action config type and map after imports, before `buttonVariants`:

```tsx
type ButtonAction =
  | "create"
  | "edit"
  | "save"
  | "delete"
  | "cancel"
  | "view"
  | "export"
  | "import"
  | "archive"
  | "duplicate"
  | "print"
  | "link"

interface ActionPreset {
  icon: ElementType
  variant: NonNullable<VariantProps<typeof buttonVariants>["variant"]>
  label: string
}

const ACTION_PRESETS: Record<ButtonAction, ActionPreset> = {
  create: { icon: Plus, variant: "default", label: "Create" },
  edit: { icon: Pencil, variant: "outline", label: "Edit" },
  save: { icon: Save, variant: "default", label: "Save" },
  delete: { icon: Trash2, variant: "destructive", label: "Delete" },
  cancel: { icon: X, variant: "outline", label: "Cancel" },
  view: { icon: Eye, variant: "ghost", label: "View" },
  export: { icon: Download, variant: "outline", label: "Export" },
  import: { icon: Upload, variant: "outline", label: "Import" },
  archive: { icon: Archive, variant: "secondary", label: "Archive" },
  duplicate: { icon: Copy, variant: "outline", label: "Duplicate" },
  print: { icon: Printer, variant: "outline", label: "Print" },
  link: { icon: ExternalLink, variant: "ghost", label: "Link" },
}
```

Note: `ACTION_PRESETS` references `buttonVariants` for the variant type, so place it after `buttonVariants` in the file. The `ButtonAction` type and `ActionPreset` interface can go before `buttonVariants`.

**Step 2: Update the ButtonProps interface and Button component**

Replace the current `ButtonProps` and `Button` component with:

```tsx
const ICON_SIZES = new Set<ButtonProps["size"]>(["icon", "icon-sm", "icon-lg"])

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  action?: ButtonAction
  icon?: ElementType
  tooltip?: string
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant: variantProp,
      size,
      asChild = false,
      action,
      icon: iconProp,
      tooltip,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const preset = action ? ACTION_PRESETS[action] : undefined
    const resolvedVariant = variantProp ?? preset?.variant ?? "default"
    const ResolvedIcon = loading ? Loader2 : (iconProp ?? preset?.icon ?? null)
    const isIconOnly = ICON_SIZES.has(size)

    // Auto-label: if action set, no children, and not icon-only, use preset label
    const resolvedChildren =
      children ?? (!isIconOnly && preset ? preset.label : undefined)

    const Comp = asChild ? Slot : "button"

    const button = (
      <Comp
        className={cn(
          buttonVariants({ variant: resolvedVariant, size, className })
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {ResolvedIcon && (
          <ResolvedIcon
            className={cn(loading && "animate-spin")}
          />
        )}
        {resolvedChildren}
      </Comp>
    )

    // Auto-tooltip for icon-only sizes
    if (isIconOnly && ResolvedIcon) {
      const tooltipText = tooltip ?? preset?.label
      if (tooltipText) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{tooltipText}</TooltipContent>
          </Tooltip>
        )
      }
    }

    return button
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonAction }
```

**Step 3: Verify the build**

Run: `pnpm registry:build`
Expected: Build succeeds with no errors.

**Step 4: Commit**

```
feat(button): add action, icon, tooltip, and loading props

Enhance Button with action presets that auto-resolve icons and
default variants. Supports custom icons, auto-tooltips for
icon-only sizes, and loading spinner state.
```

---

### Task 2: Update AlertDialog to use Button via asChild

**Files:**
- Modify: `registry/default/alert-dialog/alert-dialog.tsx`

**Step 1: Update imports**

Replace:
```tsx
import { buttonVariants } from '@/components/ui/button';
```

With:
```tsx
import { Button } from '@/components/ui/button';
```

**Step 2: Update AlertDialogAction**

Replace:
```tsx
function AlertDialogAction({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} {...props} />;
}
```

With:
```tsx
function AlertDialogAction({ className, children, ...props }: ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action asChild {...props}>
      <Button className={className}>{children}</Button>
    </AlertDialogPrimitive.Action>
  );
}
```

**Step 3: Update AlertDialogCancel**

Replace:
```tsx
function AlertDialogCancel({ className, ...props }: ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return <AlertDialogPrimitive.Cancel className={cn(buttonVariants({ variant: 'outline' }), className)} {...props} />;
}
```

With:
```tsx
function AlertDialogCancel({ className, children, ...props }: ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel asChild {...props}>
      <Button variant="outline" className={className}>{children}</Button>
    </AlertDialogPrimitive.Cancel>
  );
}
```

**Step 4: Remove unused cn import if no longer needed**

Check if `cn` is still used elsewhere in the file. It is used in `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, and `AlertDialogDescription`, so keep the import.

**Step 5: Update alert-dialog registry entry dependencies**

In `registry.json`, add `button` as a `registryDependencies` for `alert-dialog`:

```json
{
  "name": "alert-dialog",
  ...
  "registryDependencies": [
    "button"
  ],
  ...
}
```

Note: Also add `"@radix-ui/react-tooltip"` to the `dependencies` array since `button` now depends on tooltip (and tooltip is a registryDependency of button -- check if this needs updating in registry.json for button).

**Step 6: Update button registry entry in registry.json**

Update the `button` entry to include its new dependencies:

```json
{
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "description": "A button component with action presets, icon support, auto-tooltips, and loading state.",
  "dependencies": [
    "@radix-ui/react-slot",
    "class-variance-authority",
    "lucide-react"
  ],
  "registryDependencies": [
    "tooltip"
  ],
  "files": [
    {
      "path": "registry/default/button/button.tsx",
      "type": "registry:ui"
    }
  ]
}
```

**Step 7: Verify the build**

Run: `pnpm registry:build`
Expected: Build succeeds with no errors.

**Step 8: Commit**

```
refactor(alert-dialog): use Button component via asChild instead of buttonVariants
```

---

### Task 3: Remove action-button component

**Files:**
- Delete: `registry/default/action-button/` (entire directory, 15 files)
- Delete: `public/r/action-button.json`
- Modify: `registry.json` (remove action-button entry)

**Step 1: Delete the action-button directory**

```bash
rm -rf registry/default/action-button/
```

**Step 2: Delete the built registry output**

```bash
rm -f public/r/action-button.json
```

**Step 3: Remove action-button from registry.json**

Remove the entire `action-button` item object from the `items` array in `registry.json` (the block from line ~943 to ~972).

**Step 4: Verify the build**

Run: `pnpm registry:build`
Expected: Build succeeds. `public/r/action-button.json` should NOT be regenerated.

**Step 5: Commit**

```
refactor: remove action-button component in favor of enhanced Button
```

---

### Task 4: Remove the old action-button docblock from button.tsx

**Files:**
- Modify: `registry/default/button/button.tsx`

**Step 1: Remove the legacy docblock**

The old `button.tsx` had a large JSDoc comment (lines 8-26) listing all the action-button components. This is now outdated. Remove it entirely -- the `action` prop is self-documenting via TypeScript.

**Step 2: Commit**

```
chore(button): remove outdated action-button reference docblock
```

---

### Task 5: Update CLAUDE.md documentation

**Files:**
- Modify: `CLAUDE.md` (project root)

**Step 1: Replace the "Action Buttons" section**

Replace the current "Action Buttons (preferred over raw Button)" section with updated documentation that reflects the new `action` prop on Button. The new section should document:

- The `action` prop and preset map table
- The `icon` prop for custom icons
- The `tooltip` and `loading` props
- Usage examples showing action preset, custom icon, icon-only with tooltip, and override scenarios
- Note that confirmation is handled via AlertDialog, not Button

Remove any references to the old action-button components (`CreateButton`, `DeleteButton`, etc.).

**Step 2: Commit**

```
docs: update CLAUDE.md for unified Button with action presets
```

---

### Task 6: Rebuild registry and verify output

**Files:**
- Verify: `public/r/button.json` (updated)
- Verify: `public/r/alert-dialog.json` (updated)
- Verify: `public/r/action-button.json` (should not exist)

**Step 1: Rebuild**

Run: `pnpm registry:build`

**Step 2: Verify outputs**

- `public/r/button.json` should exist and include lucide-react dependency and tooltip registryDependency
- `public/r/alert-dialog.json` should exist and include button registryDependency
- `public/r/action-button.json` should NOT exist

**Step 3: Verify registry.json has no action-button references**

Run: `grep -r "action-button" registry.json`
Expected: No output.

**Step 4: Commit built output**

```
chore: rebuild registry output after button consolidation
```
