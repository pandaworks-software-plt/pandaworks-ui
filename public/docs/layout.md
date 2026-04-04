# Layout Components

Components for page structure and navigation layout.

## PageHeader

A page header with title, description, and action buttons.

```tsx
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

<PageHeader
  title="Employees"
  description="Manage your team members."
  actions={
    <Button><Plus /> Add Employee</Button>
  }
/>
```

Props:
- `title: string`
- `description?: string`
- `actions?: ReactNode`

## Stepper

A horizontal multi-step progress indicator with completed, current, and pending states. Steps can have optional descriptions and tooltip popovers.

```tsx
import { Stepper } from "@/components/ui/stepper"

<Stepper
  currentStep={1}
  steps={[
    { id: 1, title: "Details", description: "Basic info" },
    { id: 2, title: "Review", description: "Check entries" },
    { id: 3, title: "Submit" },
  ]}
/>
```

Props:
- `steps: Step[]` -- Array of steps. Each: `{ id: number; title: string; description?: string; tooltip?: ReactNode }`
- `currentStep: number` -- Zero-based index of the current step

Dependencies: popover

## Separator

```tsx
import { Separator } from "@/components/ui/separator"

<Separator />
<Separator orientation="vertical" />
```

## Breadcrumb

```tsx
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Employees</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```
