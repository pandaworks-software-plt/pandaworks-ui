# AppShell Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 4 new capabilities to the registry AppShell component: scrollable content area, max-width constraint, custom link component support, and content padding override.

**Architecture:** Additive props on the existing AppShell component. Internal nav components receive `linkComponent` as a prop. Content wrapper gets an inner div for max-width constraint. All changes are non-breaking -- existing consumers without new props get identical behavior (except scrollable content, which is universally beneficial).

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, shadcn/ui sidebar primitives

**Design doc:** `docs/plans/2026-03-14-app-shell-upgrade-design.md`

---

### Task 1: Add new props to AppShellProps interface

**Files:**
- Modify: `registry/default/app-shell/app-shell-types.ts`

**Step 1: Add 3 new optional props to AppShellProps**

In `registry/default/app-shell/app-shell-types.ts`, add `maxWidth`, `linkComponent`, and `contentClassName` to `AppShellProps`:

```ts
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
  navbarActions?: React.ReactNode;
  children: React.ReactNode;
  /** Max-width for the content area. Number = pixels, string = CSS value. "none" to disable. Default: 1400 */
  maxWidth?: number | string;
  /** Custom link component to replace all <a> tags (e.g. TanStack Router's Link or Next.js Link). Default: "a" */
  linkComponent?: React.ComponentType<{ href: string; children: React.ReactNode; className?: string; [key: string]: any }>;
  /** Override the default content area padding classes. Replaces default "p-4". */
  contentClassName?: string;
}
```

**Step 2: Verify the types compile**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && npx tsc --noEmit`
Expected: No errors

---

### Task 2: Add linkComponent support to NavItemFlat

**Files:**
- Modify: `registry/default/app-shell/app-shell.tsx`

**Step 1: Update NavItemFlat to accept and use linkComponent**

Change the `NavItemFlat` function signature and replace `<a>` with the link component:

```tsx
function NavItemFlat({
  item,
  linkComponent: Link = "a" as any,
}: {
  item: NavItem;
  linkComponent?: AppShellProps["linkComponent"];
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={item.active}
        tooltip={item.label}
      >
        <Link href={item.href}>
          {item.icon && <item.icon />}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && npx tsc --noEmit`
Expected: No errors

---

### Task 3: Add linkComponent support to NavItemCollapsible

**Files:**
- Modify: `registry/default/app-shell/app-shell.tsx`

**Step 1: Update NavItemCollapsible to accept and use linkComponent**

Change the function signature and replace `<a>` in sub-items:

```tsx
function NavItemCollapsible({
  item,
  linkComponent: Link = "a" as any,
}: {
  item: NavItem;
  linkComponent?: AppShellProps["linkComponent"];
}) {
  const hasActiveChild = item.items?.some((sub) => sub.active);

  return (
    <Collapsible
      asChild
      defaultOpen={item.active || hasActiveChild}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={item.active}
            tooltip={item.label}
          >
            {item.icon && <item.icon />}
            <span>{item.label}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((sub) => (
              <SidebarMenuSubItem key={sub.href}>
                <SidebarMenuSubButton asChild isActive={sub.active}>
                  <Link href={sub.href}>
                    {sub.icon && <sub.icon />}
                    <span>{sub.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
```

**Step 2: Verify it compiles**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && npx tsc --noEmit`
Expected: No errors

---

### Task 4: Update AppShell component with all new props

**Files:**
- Modify: `registry/default/app-shell/app-shell.tsx`

**Step 1: Destructure new props and add linkComponent to branding, nav items, and user actions**

Update the AppShell function:

```tsx
function AppShell({
  branding,
  navigation,
  user,
  header,
  navbarActions,
  children,
  maxWidth = 1400,
  linkComponent: Link = "a" as any,
  contentClassName,
}: AppShellProps) {
  const resolvedMaxWidth: React.CSSProperties | undefined =
    maxWidth === "none"
      ? undefined
      : { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild tooltip={branding.name}>
                <Link href={branding.href ?? "/"}>
                  {branding.logo ? (
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <img
                        src={branding.logo}
                        alt={branding.name}
                        className="size-4"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold">
                      {branding.name.charAt(0)}
                    </div>
                  )}
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {branding.name}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) =>
                  item.items && item.items.length > 0 ? (
                    <NavItemCollapsible key={item.href} item={item} linkComponent={Link} />
                  ) : (
                    <NavItemFlat key={item.href} item={item} linkComponent={Link} />
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* ... user footer unchanged except user action links ... */}
```

For the user action links section (inside the `DropdownMenuGroup`), replace `<a href={action.href}>` with `<Link href={action.href}>`:

```tsx
{action.href ? (
  <Link href={action.href}>
    {action.icon && <action.icon />}
    {action.label}
  </Link>
) : (
  <>
    {action.icon && <action.icon />}
    {action.label}
  </>
)}
```

**Step 2: Update the content area wrapper**

Replace line 282:
```tsx
<div className="flex-1 p-4">{children}</div>
```

With:
```tsx
<div className={cn("flex-1 overflow-y-auto overflow-x-hidden min-w-0", contentClassName ?? "p-4")}>
  <div className="mx-auto" style={resolvedMaxWidth}>
    {children}
  </div>
</div>
```

**Step 3: Verify it compiles**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && npx tsc --noEmit`
Expected: No errors

---

### Task 5: Mirror changes to src/components/ui/ copies

**Files:**
- Modify: `src/components/ui/app-shell-types.ts` (copy from `registry/default/app-shell/app-shell-types.ts`)
- Modify: `src/components/ui/app-shell.tsx` (copy from `registry/default/app-shell/app-shell.tsx`)

**Step 1: Copy the updated registry files to their src/components/ui counterparts**

The `src/components/ui/` versions must be identical to the `registry/default/app-shell/` versions. Copy both files.

**Step 2: Verify the full project compiles**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && npx tsc --noEmit`
Expected: No errors

---

### Task 6: Update the showcase demo

**Files:**
- Modify: `src/showcase/demos/app-shell-demo.tsx`

**Step 1: Update the code snippet to show new props**

Update the inline code string in the `DemoSection` to include the new props:

```tsx
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
</AppShell>
```

**Step 2: Add a brief note about linkComponent in the description section**

Add a bullet to the list:
```tsx
<li><code className="text-xs">linkComponent</code> -- custom link component for client-side navigation (e.g. TanStack Router Link, Next.js Link)</li>
<li><code className="text-xs">maxWidth</code> -- constrains the content area width (default: 1400px)</li>
<li><code className="text-xs">contentClassName</code> -- overrides default content padding</li>
```

---

### Task 7: Lint and build the registry

**Files:** None (verification only)

**Step 1: Run linter**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm lint`
Expected: No errors (fix any that appear)

**Step 2: Build the registry output**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm registry:build`
Expected: Successful build, updated files in `public/r/`

**Step 3: Build the Vite project**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm build`
Expected: Successful build

---

### Task 8: Respond to the bridge spec

**Files:**
- Modify: `~/.claude/bridge/performance/spec-app-shell-registry-upgrade.md`

**Step 1: Append response to bridge file**

Append (do NOT overwrite) to the bottom of the bridge file:

```markdown
---

## Response

**From:** pandahrms-ui-registry
**Date:** 2026-03-14

### Actions Taken
- Added `maxWidth` prop (default: 1400) with `mx-auto` centering
- Added `linkComponent` prop replacing ALL `<a>` tags (branding, nav items, sub-items, user action links)
- Added `contentClassName` prop to override default `p-4` padding
- Made content area scrollable with `overflow-y-auto overflow-x-hidden min-w-0`
- Updated showcase demo
- Rebuilt registry output

### Other Side Needs To
- Pull latest registry and reinstall `app-shell` component
- Pass `linkComponent={Link}` from TanStack Router
- Pass `maxWidth={1400}` (or omit for default)
- Remove custom AppShell, ContentArea, ContentBase, PageContent components
- Remove PageContent wrapper from ~110 page files
```

**Step 2: Tell the user to switch sessions**

Output a copy-paste prompt for the Performance frontend session.
