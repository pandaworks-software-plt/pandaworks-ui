# App Shell Component Design

## Overview

A data-driven app shell layout component for the Pandahrms UI registry. Provides a consistent sidebar + header + content area layout across all Pandahrms frontend projects.

## Registry Structure

Single registry item: `app-shell` with multiple files bundled together.

```
registry/default/
  app-shell/
    app-shell.tsx        # Main AppShell component + sidebar primitives
    app-shell-types.ts   # TypeScript config types
```

## Config API

```typescript
interface AppShellProps {
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

interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  active?: boolean;
  items?: NavItem[];
}

interface UserAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "default" | "destructive";
}
```

## Usage

```tsx
<AppShell
  branding={{ name: "Pandahrms Performance", href: "/", logo: "/logo.svg" }}
  navigation={[
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Appraisals", href: "/appraisals", icon: ClipboardList,
      items: [
        { label: "My Appraisals", href: "/appraisals/mine" },
        { label: "Team Appraisals", href: "/appraisals/team" },
      ]
    },
  ]}
  user={{
    name: "Ahmad Razif",
    email: "ahmad@pandaworks.com",
    actions: [
      { label: "Profile", href: "/profile", icon: User },
      { label: "Sign Out", onClick: handleSignOut, icon: LogOut, variant: "destructive" },
    ],
  }}
>
  <PageContent />
</AppShell>
```

## Behavior

### Sidebar
- Desktop: collapsible between expanded (18rem) and icon mode (3rem)
- Mobile: opens as sheet/drawer overlay
- Toggle: sidebar trigger button or Cmd/Ctrl + B
- Collapsed state: icons only with tooltips
- Nested nav items: collapsible groups, hidden when sidebar collapsed

### Header Bar
- Sticky top with border bottom
- Left side: sidebar trigger + separator + optional header content (breadcrumbs)
- Fixed height: h-16

### User Footer
- Avatar with initials fallback
- Name + email when expanded, avatar only when collapsed
- Click opens dropdown with configured actions

### Dark Mode
- Fully supported via existing CSS variables (sidebar-background, sidebar-foreground, etc.)

### Active State
- `active` prop on NavItem highlights current route
- Consuming app is responsible for setting this (framework-agnostic)

## Dependencies

- @radix-ui/react-slot
- @radix-ui/react-separator
- @radix-ui/react-tooltip
- @radix-ui/react-dropdown-menu
- @radix-ui/react-collapsible
- class-variance-authority
- lucide-react

## Visual Layout

```
+-------+--------------------------------------------+
| Logo  | [=] | Separator | Breadcrumbs / Header     |
|-------|--------------------------------------------+
| Nav   |                                            |
| Items |           Main Content Area                |
|       |           (children)                       |
|       |                                            |
|-------|                                            |
| User  |                                            |
+-------+--------------------------------------------+
```
