# Detail Page Layout Component Design

## Overview

A compound component for resource/entity detail pages with a 2-column layout: main content area (left) and metadata sidebar (right). Header includes back navigation, icon, title, subtitle, and action buttons. Content area supports tabs via the existing Tabs registry component.

## Component API

### Sub-components

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `DetailPage` | Root container | `className` |
| `DetailPageHeader` | Back link + icon + title + subtitle + actions row | `backHref`, `backLabel`, `icon`, `title`, `subtitle`, `actions` (ReactNode) |
| `DetailPageMain` | 2-column grid wrapper | `className` |
| `DetailPageContent` | Left/main column | `className` |
| `DetailPageSidebar` | Right metadata column | `className` |
| `DetailPageMetaItem` | Individual metadata row in sidebar | `label`, `value` (ReactNode), `copyable` |

### Usage Example

```tsx
<DetailPage>
  <DetailPageHeader
    backHref="/organizations"
    backLabel="Organizations"
    icon={<Building2 className="size-10" />}
    title="Pandaworks"
    subtitle="0 members"
    actions={
      <>
        <Button variant="secondary">Show JSON</Button>
        <SplitButton label="Actions" items={[...]} />
      </>
    }
  />

  <Tabs defaultValue="settings">
    <TabsList>
      <TabsTrigger value="profile">Profile</TabsTrigger>
      <TabsTrigger value="members">Members</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>

    <DetailPageMain>
      <DetailPageContent>
        <TabsContent value="profile">...</TabsContent>
        <TabsContent value="settings">...</TabsContent>
      </DetailPageContent>

      <DetailPageSidebar>
        <DetailPageMetaItem label="Org ID" value="org_3APXw...9IHNe0EhU" copyable />
        <DetailPageMetaItem label="Slug" value="pandaworks" copyable />
        <DetailPageMetaItem label="Created by" value={<span className="text-destructive">Not assigned</span>} />
        <DetailPageMetaItem label="Created" value="Mar 3, 2026" />
      </DetailPageSidebar>
    </DetailPageMain>
  </Tabs>
</DetailPage>
```

## Layout

- **Header**: Back link (ArrowLeft + text) above title row. Title row: flex with optional icon, title (h1), subtitle (muted text), right-aligned actions.
- **Main area**: CSS Grid `grid-cols-1 lg:grid-cols-[1fr_280px]` with gap. Sidebar stacks below content on mobile.
- **Sidebar**: Sticky (`sticky top-6`), vertical list of meta items with border separators.
- **MetaItem**: Label (small muted text) above value. Optional copy button when `copyable` is true.

## Patterns

- React.forwardRef on all sub-components
- `cn()` for class merging
- CSS variables for theming (automatic dark mode)
- No external dependencies beyond lucide-react (ArrowLeft, Copy icons)

## File Structure

```
registry/default/detail-page/
└── detail-page.tsx
```

Single file, all sub-components exported. Follows existing patterns (card, page-header).
