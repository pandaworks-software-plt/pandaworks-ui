# Detail Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a `detail-page` compound component for resource/entity detail pages with a 2-column layout, header with back navigation, and metadata sidebar.

**Architecture:** Compound component pattern (like Card) with React.forwardRef on all sub-components. Single file, no external dependencies beyond lucide-react. Consumers compose it with the existing Tabs registry component for tabbed content.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, lucide-react, cn() utility

---

### Task 1: Create the detail-page component file

**Files:**
- Create: `registry/default/detail-page/detail-page.tsx`

**Step 1: Create the component file with all sub-components**

```tsx
"use client"

import * as React from "react"
import { ArrowLeft, Copy, Check } from "lucide-react"

import { cn } from "@/lib/utils"

/* ---------------------------------- Root ---------------------------------- */

const DetailPage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-6", className)}
    {...props}
  />
))
DetailPage.displayName = "DetailPage"

/* --------------------------------- Header --------------------------------- */

interface DetailPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  backHref?: string
  backLabel?: string
  icon?: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

const DetailPageHeader = React.forwardRef<HTMLDivElement, DetailPageHeaderProps>(
  ({ className, backHref, backLabel, icon, title, subtitle, actions, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-3", className)} {...props}>
      {backHref && (
        <a
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </a>
      )}
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground dark:bg-muted/20">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  )
)
DetailPageHeader.displayName = "DetailPageHeader"

/* ---------------------------------- Main ---------------------------------- */

const DetailPageMain = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]",
      className
    )}
    {...props}
  />
))
DetailPageMain.displayName = "DetailPageMain"

/* -------------------------------- Content --------------------------------- */

const DetailPageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-w-0 space-y-6", className)}
    {...props}
  />
))
DetailPageContent.displayName = "DetailPageContent"

/* -------------------------------- Sidebar --------------------------------- */

const DetailPageSidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      "space-y-0 lg:sticky lg:top-6 lg:self-start",
      className
    )}
    {...props}
  />
))
DetailPageSidebar.displayName = "DetailPageSidebar"

/* ------------------------------ Meta Item --------------------------------- */

interface DetailPageMetaItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: React.ReactNode
  copyable?: boolean
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [value])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}

const DetailPageMetaItem = React.forwardRef<
  HTMLDivElement,
  DetailPageMetaItemProps
>(({ className, label, value, copyable, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-b py-3 first:pt-0 last:border-b-0",
      className
    )}
    {...props}
  >
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="mt-0.5 flex items-center gap-1.5">
      <span className="min-w-0 truncate text-sm font-medium">{value}</span>
      {copyable && typeof value === "string" && <CopyButton value={value} />}
    </div>
  </div>
))
DetailPageMetaItem.displayName = "DetailPageMetaItem"

/* -------------------------------- Exports --------------------------------- */

export {
  DetailPage,
  DetailPageHeader,
  DetailPageMain,
  DetailPageContent,
  DetailPageSidebar,
  DetailPageMetaItem,
}
export type { DetailPageHeaderProps, DetailPageMetaItemProps }
```

**Step 2: Verify the file was created**

Run: `ls -la registry/default/detail-page/`
Expected: `detail-page.tsx` exists

**Step 3: Commit**

```bash
git add registry/default/detail-page/detail-page.tsx
git commit -m "feat(ui): add detail-page compound component"
```

---

### Task 2: Copy component to src/components/ui

**Files:**
- Create: `src/components/ui/detail-page.tsx` (identical copy of registry source)

**Step 1: Copy the registry file to src/components/ui**

```bash
cp registry/default/detail-page/detail-page.tsx src/components/ui/detail-page.tsx
```

**Step 2: Verify**

Run: `diff registry/default/detail-page/detail-page.tsx src/components/ui/detail-page.tsx`
Expected: No differences

---

### Task 3: Register the component in registry.json

**Files:**
- Modify: `registry.json` (add new item to `items` array)

**Step 1: Add the detail-page entry**

Add this entry to the `items` array in `registry.json`, after the `page-header` entry (to keep layout components grouped):

```json
{
  "name": "detail-page",
  "type": "registry:ui",
  "title": "Detail Page",
  "description": "A compound layout component for resource detail pages with header, 2-column content area, metadata sidebar, and copyable meta items.",
  "dependencies": [
    "lucide-react"
  ],
  "registryDependencies": [],
  "files": [
    {
      "path": "registry/default/detail-page/detail-page.tsx",
      "type": "registry:ui"
    }
  ]
}
```

**Step 2: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('registry.json','utf8')); console.log('valid')"`
Expected: `valid`

**Step 3: Commit**

```bash
git add registry.json src/components/ui/detail-page.tsx
git commit -m "feat(ui): register detail-page component"
```

---

### Task 4: Create the showcase demo

**Files:**
- Create: `src/showcase/demos/detail-page-demo.tsx`

**Step 1: Create the demo file**

```tsx
import { Building2 } from "lucide-react"
import { DemoSection } from "@/showcase/component-page"
import {
  DetailPage,
  DetailPageHeader,
  DetailPageMain,
  DetailPageContent,
  DetailPageSidebar,
  DetailPageMetaItem,
} from "@/components/ui/detail-page"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DetailPageDemo() {
  return (
    <>
      <DemoSection title="Organization detail page">
        <DetailPage>
          <DetailPageHeader
            backHref="#"
            backLabel="Organizations"
            icon={<Building2 className="size-6" />}
            title="Pandaworks"
            subtitle="0 members"
            actions={
              <>
                <Button variant="outline" size="sm">
                  Show JSON
                </Button>
                <Button size="sm">Actions</Button>
              </>
            }
          />

          <Tabs defaultValue="settings">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <DetailPageMain className="mt-6">
              <DetailPageContent>
                <TabsContent value="profile" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>
                        Organization profile information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Profile content goes here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="settings" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Membership limit</CardTitle>
                      <CardDescription>
                        Edit Organization membership limit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Settings content goes here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </DetailPageContent>

              <DetailPageSidebar>
                <DetailPageMetaItem
                  label="Org ID"
                  value="org_3APXw...9IHNe0EhU"
                  copyable
                />
                <DetailPageMetaItem
                  label="Slug"
                  value="pandaworks"
                  copyable
                />
                <DetailPageMetaItem
                  label="Created by"
                  value={
                    <span className="text-destructive">Not assigned</span>
                  }
                />
                <DetailPageMetaItem
                  label="Max allowed memberships"
                  value="Unlimited"
                />
                <DetailPageMetaItem label="Created" value="Mar 3, 2026" />
                <DetailPageMetaItem
                  label="Organization updated"
                  value="4m ago"
                />
              </DetailPageSidebar>
            </DetailPageMain>
          </Tabs>
        </DetailPage>
      </DemoSection>

      <DemoSection title="Minimal (no sidebar)">
        <DetailPage>
          <DetailPageHeader
            backHref="#"
            backLabel="Back"
            title="Simple Detail"
            subtitle="A detail page without the metadata sidebar"
          />
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The sub-components are composable -- use only what you need.
              </p>
            </CardContent>
          </Card>
        </DetailPage>
      </DemoSection>
    </>
  )
}
```

**Step 2: Verify file was created**

Run: `ls src/showcase/demos/detail-page-demo.tsx`
Expected: File exists

---

### Task 5: Register the demo in showcase-app

**Files:**
- Modify: `src/showcase/showcase-app.tsx`

**Step 1: Add the import**

Add after the existing `PageHeaderDemo` import (around line 47):

```tsx
import DetailPageDemo from "./demos/detail-page-demo";
```

**Step 2: Add the component entry to COMPONENTS array**

Add after the `page-header` entry (around line 77):

```tsx
{
  name: "detail-page",
  title: "Detail Page",
  description:
    "A compound layout for resource detail pages with header, 2-column grid, metadata sidebar, and copyable meta items.",
  demo: DetailPageDemo,
},
```

**Step 3: Add "detail-page" to the Layout category**

Update the Layout category filter (around line 372) from:

```tsx
items: COMPONENTS.filter((c) => ["app-shell", "page-header"].includes(c.name))
```

to:

```tsx
items: COMPONENTS.filter((c) => ["app-shell", "detail-page", "page-header"].includes(c.name))
```

**Step 4: Verify the dev server starts**

Run: `pnpm dev`
Expected: Vite dev server starts without errors

**Step 5: Commit**

```bash
git add src/showcase/demos/detail-page-demo.tsx src/showcase/showcase-app.tsx
git commit -m "feat(showcase): add detail-page demo"
```

---

### Task 6: Build registry output and verify

**Files:**
- Generated: `public/r/detail-page.json`

**Step 1: Run registry build**

Run: `pnpm registry:build`
Expected: Build succeeds, `public/r/detail-page.json` is created

**Step 2: Verify the output file exists and is valid JSON**

Run: `node -e "const j = JSON.parse(require('fs').readFileSync('public/r/detail-page.json','utf8')); console.log(j.name, j.files.length + ' file(s)')"`
Expected: `detail-page 1 file(s)`

**Step 3: Lint check**

Run: `pnpm lint`
Expected: No errors

**Step 4: Commit everything**

```bash
git add public/r/detail-page.json
git commit -m "docs: build detail-page registry output"
```
