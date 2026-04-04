# Data Display Components

Components for presenting data and content.

## Badge

Variants: `default`, `secondary`, `destructive`, `outline`

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Rejected</Badge>
<Badge variant="outline">Draft</Badge>
```

## Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>AR</AvatarFallback>
</Avatar>
```

## Card

```tsx
import {
  Card, CardHeader, CardTitle,
  CardDescription, CardContent, CardFooter,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

## Table

```tsx
import {
  Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell,
} from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ahmad</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Calendar

```tsx
import { Calendar } from "@/components/ui/calendar"

<Calendar mode="single" selected={date} onSelect={setDate} />
```

## Skeleton

```tsx
import { Skeleton } from "@/components/ui/skeleton"

<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-12 w-12 rounded-full" />
```

## Progress

```tsx
import { Progress } from "@/components/ui/progress"

<Progress value={60} />
```

## CodeLabel

Inline monospace label with copy-to-clipboard button.

```tsx
import { CodeLabel } from "@/components/ui/code-label"

<CodeLabel value="EMP-2024-001" />
<CodeLabel value="npm install" size="sm" />
```

Sizes: `default`, `sm`

## AnimatedNumber

A number display that animates smoothly between values using requestAnimationFrame with easeOutQuad easing.

```tsx
import { AnimatedNumber } from "@/components/ui/animated-number"

<AnimatedNumber value={85} suffix="%" />
<AnimatedNumber value={1234.56} prefix="RM " decimals={2} duration={800} />
<AnimatedNumber value={count} formatter={(v) => v.toLocaleString()} />
```

Props:
- `value: number` -- Target value to animate to
- `duration?: number` -- Animation duration in ms (default: 500)
- `suffix?: string` -- Text appended after the number (e.g., "%", "pts")
- `prefix?: string` -- Text prepended before the number (e.g., "$", "RM")
- `decimals?: number` -- Number of decimal places (default: 0)
- `formatter?: (value: number) => string` -- Custom formatter (overrides decimals)

## ExpandableText

A text component that collapses long content with configurable visible lines. Uses `<pre>` internally for newline support.

```tsx
import { ExpandableText } from "@/components/ui/expandable-text"

<ExpandableText visibleLines={3}>
  {longDescription}
</ExpandableText>

<ExpandableText
  visibleLines={2}
  showMoreLabel="Read more"
  showLessLabel="Read less"
>
  {multiLineText}
</ExpandableText>
```

Props:
- `visibleLines?: number` -- Lines shown before collapsing (default: 3)
- `showMoreLabel?: string` -- Expand trigger label (default: "Show more")
- `showLessLabel?: string` -- Collapse trigger label (default: "Show less")
