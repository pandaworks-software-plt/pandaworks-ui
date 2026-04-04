# Page Header + Navbar Actions Design

**Date:** 2026-02-21

## Problem

The app shell has a header bar (navbar) and a content area, but there's no structured pattern for page-level action buttons (e.g., "Add Employee", "Export", "Save"). We need a clear separation between global navbar actions and page-specific actions.

## Design: Hybrid Layout

```
+----------+----------------------------------------------+
|          |  [=] | Home > Employees      [Search] [Bell] |  <- Navbar
| Sidebar  +----------------------------------------------+
|          |  Employees                  [Export] [+ Add]  |  <- PageHeader
|          |  Manage your team members                     |
|          +----------------------------------------------+
|          |                                               |
|          |     Page Content                              |
+----------+-----------------------------------------------+
```

- **Navbar**: sidebar trigger + breadcrumbs (existing `header` prop) + global actions (new `navbarActions` prop)
- **PageHeader**: page title + description on left, page-specific actions on right

## Changes

### 1. AppShell: Add `navbarActions` prop

Update `AppShellProps` in `app-shell-types.ts`:

```ts
export interface AppShellProps {
  branding: { name: string; logo?: string; href?: string };
  navigation: NavItem[];
  user?: { name: string; email?: string; avatar?: string; actions?: UserAction[] };
  header?: React.ReactNode;        // breadcrumbs (existing)
  navbarActions?: React.ReactNode;  // NEW: global actions (search, notifications)
  children: React.ReactNode;
}
```

Update `app-shell.tsx` to render `navbarActions` right-aligned in the header bar:

```tsx
<header className="flex h-16 shrink-0 items-center gap-2 border-b ...">
  <div className="flex w-full items-center gap-2 px-4">
    <SidebarTrigger className="-ml-1" />
    {header && (
      <>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 items-center">{header}</div>
      </>
    )}
    {navbarActions && (
      <div className="ml-auto flex items-center gap-1">{navbarActions}</div>
    )}
  </div>
</header>
```

### 2. New PageHeader Component

File: `registry/default/page-header/page-header.tsx`

```tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}
```

Layout:
- Title: `h1` with `text-2xl font-semibold tracking-tight`
- Description: `p` with `text-sm text-muted-foreground`
- Actions: right-aligned with `flex items-center gap-2`
- Mobile: actions stack below title in a full-width row at `sm:` breakpoint
- No padding (inherits from page container)
- No bottom border (spacing separates it from content)

### 3. Registry Entry

Add `page-header` to `registry.json` and run `pnpm registry:build`.

## Usage Example

```tsx
<AppShell
  branding={branding}
  navigation={nav}
  header={<Breadcrumb>...</Breadcrumb>}
  navbarActions={
    <>
      <Button variant="ghost" size="icon"><Search /></Button>
      <Button variant="ghost" size="icon"><Bell /></Button>
    </>
  }
>
  <PageHeader
    title="Employees"
    description="Manage your team members"
    actions={
      <>
        <Button variant="outline" size="sm"><Download /> Export</Button>
        <Button size="sm"><Plus /> Add Employee</Button>
      </>
    }
  />
  {/* page content */}
</AppShell>
```

## Scope

- Update `app-shell-types.ts`: add `navbarActions` prop
- Update `app-shell.tsx`: render `navbarActions` in header bar
- Create `page-header.tsx` component
- Add registry entry for `page-header`
- Update app-shell demo to show navbar actions
- Create page-header demo
- Rebuild registry (`pnpm registry:build`)
