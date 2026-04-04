# DetailPage

A compound layout for resource detail pages with header, 2-column grid, sidebar, and copyable meta items.

```tsx
import {
  DetailPage, DetailPageHeader, DetailPageMain,
  DetailPageContent, DetailPageSidebar, DetailPageMetaItem,
} from "@/components/ui/detail-page"

<DetailPage>
  <DetailPageHeader
    title="Ahmad Razif"
    subtitle="Software Engineer"
    icon={<Avatar />}
    backHref="/employees"
    backLabel="Employees"
    actions={<Button>Edit</Button>}
  />
  <DetailPageMain>
    <DetailPageContent>
      {/* Main content cards */}
    </DetailPageContent>
    <DetailPageSidebar>
      <DetailPageMetaItem label="Employee ID" value="EMP-001" copyable />
      <DetailPageMetaItem label="Department" value="Engineering" />
    </DetailPageSidebar>
  </DetailPageMain>
</DetailPage>
```
