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

Multi-step progress with completed (emerald), current (primary ring), and pending states. Horizontal (default) or vertical (`orientation="vertical"`, top-down). Optional `description` and `tooltip` render only for the **current** step (active index). Connector lines use a short fill animation (`scale` transform, ~500ms); reduced motion disables the transition.

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

<Stepper
  orientation="vertical"
  currentStep={0}
  steps={[...]}
/>
```

Props:
- `steps: Step[]` -- Array of steps. Each: `{ id: number; title: string; description?: string; tooltip?: ReactNode }`
- `currentStep: number` -- Zero-based index of the current step
- `orientation?: "horizontal" | "vertical"` -- Default `horizontal`

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
