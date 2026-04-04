# AppShell

A data-driven application layout with collapsible sidebar, header bar, and user menu.

```tsx
import { AppShell } from "@/components/ui/app-shell"
import { Users, LayoutDashboard, LogOut } from "lucide-react"

<AppShell
  branding={{ name: "MyApp", logo: "/logo.png", href: "/" }}
  navigation={[
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Users", href: "/users", icon: Users, active: true },
    {
      label: "Settings",
      href: "#",
      icon: Settings,
      items: [
        { label: "General", href: "/settings/general" },
        { label: "Security", href: "/settings/security" },
      ],
    },
  ]}
  user={{
    name: "Ahmad Razif",
    email: "ahmad@company.com",
    avatar: "/avatar.jpg",
    actions: [
      { label: "Profile", href: "/profile", icon: User },
      { label: "Sign Out", onClick: handleSignOut, icon: LogOut, variant: "destructive" },
    ],
  }}
  header={<Breadcrumbs />}
  navbarActions={<NotificationBell />}
>
  {children}
</AppShell>
```

Props:
- `branding: { name: string; logo?: string; href?: string }` -- App branding in sidebar header
- `navigation: NavItem[]` -- Sidebar nav items. Each: `{ label, href, icon?, active?, items?: NavItem[] }`
- `user?: { name, email?, avatar?, actions?: UserAction[] }` -- User menu in sidebar footer
- `header?: ReactNode` -- Content next to sidebar trigger in the top bar
- `navbarActions?: ReactNode` -- Right-aligned actions in the top bar (search, notifications)
- `children: ReactNode` -- Main content area

Dependencies: sidebar, button, separator, sheet, tooltip, dropdown-menu, collapsible, avatar
