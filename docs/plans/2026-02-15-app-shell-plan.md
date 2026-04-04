# App Shell Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a data-driven App Shell layout component for the Pandahrms UI registry that provides a consistent sidebar + header + content area layout.

**Architecture:** Single `app-shell` registry item containing sidebar primitives and the config-driven AppShell component. Sub-dependencies (separator, sheet, tooltip, dropdown-menu, collapsible, avatar) are added as individual registry items since they are useful standalone. The app-shell declares `registryDependencies` on them.

**Tech Stack:** React 19, Tailwind CSS v4 (OKLCH), Radix UI primitives, Lucide icons, class-variance-authority

---

### Task 1: Install shadcn sub-dependencies

Install the shadcn components that the sidebar primitives need.

**Step 1: Install components via shadcn CLI**

Run:
```bash
pnpm dlx shadcn@latest add separator sheet tooltip dropdown-menu collapsible avatar
```

Expected: Components installed to `src/components/ui/`

**Step 2: Verify installation**

Run: `ls src/components/ui/`
Expected: New files for separator, sheet, tooltip, dropdown-menu, collapsible, avatar alongside existing button, card, table

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add shadcn sub-dependencies for app-shell"
```

---

### Task 2: Add sub-dependencies to registry

Copy each installed component to the registry directory and add entries to registry.json.

**Step 1: Create registry directories and copy files**

```bash
mkdir -p registry/default/{separator,sheet,tooltip,dropdown-menu,collapsible,avatar}
```

Copy each component from `src/components/ui/` to its registry directory.

**Step 2: Add registry.json entries**

Add entries for each component:
- `separator` - depends on `@radix-ui/react-separator`
- `sheet` - depends on `@radix-ui/react-dialog` (sheet uses dialog internally)
- `tooltip` - depends on `@radix-ui/react-tooltip`
- `dropdown-menu` - depends on `@radix-ui/react-dropdown-menu`
- `collapsible` - depends on `@radix-ui/react-collapsible`
- `avatar` - depends on `@radix-ui/react-avatar`

**Step 3: Build registry to verify**

Run: `pnpm registry:build`
Expected: JSON files generated in `public/r/` for each new component

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add separator, sheet, tooltip, dropdown-menu, collapsible, avatar to registry"
```

---

### Task 3: Create the use-mobile hook

The sidebar primitives need a `useIsMobile` hook for responsive behavior.

**Step 1: Create the hook file**

Create: `registry/default/app-shell/use-mobile.ts`

```typescript
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
```

Also copy to `src/hooks/use-mobile.ts` for local dev usage.

---

### Task 4: Create sidebar primitives

Port the shadcn sidebar primitives into the app-shell registry item.

**Step 1: Create sidebar primitives file**

Create: `registry/default/app-shell/sidebar.tsx`

Adapt from the Performance project's sidebar.tsx:
- Remove `'use client'` directive (this is a Vite/React project, not Next.js)
- Update imports to use local paths (`@/components/ui/button`, `@/components/ui/separator`, etc.)
- Include all sidebar primitives: SidebarProvider, Sidebar, SidebarTrigger, SidebarRail, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarSeparator
- Remove: SidebarInput, SidebarMenuSkeleton, SidebarMenuAction, SidebarMenuBadge, SidebarGroupAction (not needed for data-driven app shell)

Also copy to `src/components/ui/sidebar.tsx` for local dev.

---

### Task 5: Create app-shell types

**Step 1: Create types file**

Create: `registry/default/app-shell/app-shell-types.ts`

```typescript
import type { LucideIcon } from "lucide-react";

export interface AppShellProps {
  branding: {
    name: string;
    logo?: string;
    href?: string;
  };
  navigation: NavItem[];
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    actions?: UserAction[];
  };
  header?: React.ReactNode;
  children: React.ReactNode;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  active?: boolean;
  items?: NavItem[];
}

export interface UserAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "default" | "destructive";
}
```

---

### Task 6: Create the AppShell component

The main data-driven component that composes all primitives.

**Step 1: Create the AppShell component file**

Create: `registry/default/app-shell/app-shell.tsx`

This component:
1. Wraps children in `SidebarProvider`
2. Renders a `Sidebar` with `collapsible="icon"`
3. Sidebar header: renders branding (logo img + name) as a link
4. Sidebar content: iterates `navigation` array
   - Flat items: rendered as `SidebarMenuButton` with icon and label
   - Items with `items[]`: rendered as `Collapsible` group with sub-items
5. Sidebar footer: renders user avatar (with initials fallback), name, email, dropdown menu with actions
6. `SidebarInset` with sticky header (trigger + separator + header slot) and children content area
7. `SidebarRail` for drag-to-toggle

**Step 2: Copy to src/ for local dev**

Copy `app-shell.tsx` and `app-shell-types.ts` to `src/components/ui/`

---

### Task 7: Update registry.json

**Step 1: Add app-shell entry**

```json
{
  "name": "app-shell",
  "type": "registry:ui",
  "title": "App Shell",
  "description": "A data-driven layout component with collapsible sidebar, header bar, and user menu.",
  "dependencies": [
    "@radix-ui/react-slot",
    "@radix-ui/react-collapsible",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-tooltip",
    "@radix-ui/react-separator",
    "@radix-ui/react-dialog",
    "@radix-ui/react-avatar",
    "class-variance-authority"
  ],
  "registryDependencies": [
    "button",
    "separator",
    "sheet",
    "tooltip",
    "dropdown-menu",
    "collapsible",
    "avatar"
  ],
  "files": [
    { "path": "registry/default/app-shell/app-shell.tsx", "type": "registry:ui" },
    { "path": "registry/default/app-shell/app-shell-types.ts", "type": "registry:ui" },
    { "path": "registry/default/app-shell/sidebar.tsx", "type": "registry:ui" },
    { "path": "registry/default/app-shell/use-mobile.ts", "type": "registry:ui" }
  ]
}
```

**Step 2: Build registry**

Run: `pnpm registry:build`
Expected: `public/r/app-shell.json` generated with all files embedded

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add app-shell layout component to registry"
```

---

### Task 8: Update demo page

Update `src/App.tsx` to showcase the AppShell component with sample navigation.

**Step 1: Refactor App.tsx**

Wrap existing component demos inside the AppShell:
- Branding: "Pandahrms Registry" with link to "/"
- Navigation: sample items (Dashboard, Components > Button/Card/Table)
- User: sample user "Ahmad Razif" with profile and sign out actions
- Header: "Component Showcase" text
- Children: existing component demo sections

**Step 2: Verify with dev server**

Run: `pnpm dev`
Expected: Demo page renders with sidebar layout wrapping the existing component demos. Sidebar collapses, mobile sheet works, dark mode works.

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: update demo page with app-shell showcase"
```

---

### Task 9: Final verification

**Step 1: Full registry build**

Run: `pnpm registry:build`
Expected: All JSON files in `public/r/` are generated without errors

**Step 2: Production build**

Run: `pnpm build`
Expected: Vite build succeeds without TypeScript errors

**Step 3: Commit build output**

```bash
git add public/r/ && git commit -m "build: regenerate registry output"
```
