import { DemoSection } from '@/showcase/component-page';

export default function AppShellDemo() {
  return (
    <DemoSection
      title="App Shell Layout"
      code={`import { AppShell } from "@/components/ui/app-shell"
import { Users, LayoutDashboard } from "lucide-react"

<AppShell
  branding={{ name: "MyApp", href: "/" }}
  navigation={[
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Users", href: "/users", icon: Users, active: true },
  ]}
  user={{
    name: "John Doe",
    email: "john@example.com",
    actions: [
      { label: "Sign Out", onClick: () => {} },
    ],
  }}
  header={<span>Page Title</span>}
  maxWidth={1400}
  contentClassName="p-4"
>
  {/* Page content */}
</AppShell>`}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The App Shell provides a complete application layout with a collapsible sidebar, header bar, and user menu. It
          accepts data-driven configuration for navigation, branding, and user actions.
        </p>
        <div className="rounded-lg border bg-muted/50 p-8 dark:bg-muted/20">
          <pre className="text-xs text-muted-foreground">
            {`┌──────────┬──────────────────────────────────────┐
│          │  [=] | Breadcrumbs      [Search] [Bell]│  <- header + navbarActions
│ Sidebar  ├──────────────────────────────────────┤
│          │  Page Title           [Action] [Action]│  <- PageHeader component
│ Nav 1    │  Description text                     │
│ Nav 2    ├──────────────────────────────────────┤
│ Nav 3    │                                       │
│          │     Main Content Area                 │
│  [User]  │                                       │
└──────────┴──────────────────────────────────────┘`}
          </pre>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>The navbar supports two content slots:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <code className="text-xs">header</code> -- breadcrumbs or custom content next to the sidebar trigger
            </li>
            <li>
              <code className="text-xs">navbarActions</code> -- global actions (search, notifications) right-aligned
            </li>
            <li>
              <code className="text-xs">branding.logoWrapper</code> -- set to false if your logo already has its own
              background/container (default: true)
            </li>
            <li>
              <code className="text-xs">branding.subtitle</code> -- small muted line under the brand name (e.g. version
              string or environment label); hidden when the sidebar collapses to icon mode
            </li>
            <li>
              <code className="text-xs">linkComponent</code> -- custom link component for client-side navigation (e.g.
              TanStack Router Link, Next.js Link)
            </li>
            <li>
              <code className="text-xs">maxWidth</code> -- constrains the content area width (default: 1400px)
            </li>
            <li>
              <code className="text-xs">contentClassName</code> -- overrides default content padding
            </li>
          </ul>
          <p>
            For page-specific titles and actions, use the <strong>PageHeader</strong> component inside the content area.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          See the <strong>Full Demo</strong> page in the sidebar for a live example of the App Shell with a complete
          employee management interface.
        </p>
      </div>
    </DemoSection>
  );
}
