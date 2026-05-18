# Data Display Components

Components for presenting data and content.

## Badge

Variants: `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `info`, `muted`.

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Rejected</Badge>
<Badge variant="outline">Draft</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">On Hold</Badge>
<Badge variant="info">Planning</Badge>
<Badge variant="muted">Archived</Badge>
```

Pass `dot` to render a leading status dot tinted to match the variant — useful for status pills:

```tsx
<Badge variant="success" dot>Active</Badge>
<Badge variant="warning" dot>On Hold</Badge>
<Badge variant="info" dot>Planning</Badge>
```

Sizes (`size` prop):

| size | height | padding | text | use case |
|------|--------|---------|------|----------|
| `default` | auto | `px-2.5 py-0.5` | `text-xs` | Default — page headers, status pills, list rows |
| `xs` | `h-5` | `px-1.5` | `text-[11px] leading-none` | Dense meta strips inside table-row sub-lines (pairs with `TableListCell`) |

```tsx
<Badge size="xs" variant="muted">Admin</Badge>
<Badge size="xs" variant="warning"><Clock className="size-3" />SLA Today</Badge>
```

Props:
- `variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "muted"`
- `size?: "default" | "xs"` — controls height, padding, and text size; defaults to `default`
- `dot?: boolean` — render a leading status dot tinted to match the variant
- `tooltipText?: string` — override the auto-tooltip text (defaults to the children text content when truncated)

When the children text is a string, Badge wraps the chip in a Tooltip automatically so long labels stay readable when truncated.

## Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>John Doe</AvatarFallback>
</Avatar>
```

`AvatarFallback` runs string children through `getInitialName` (exported from `@pandaworks-sw/lucid-ui` and from `@/lib`), so a full name is auto-converted to a 2-character monogram: `"John Doe" → "JD"`, `"Devi Marasinghe" → "DM"`, `"Eli" → "EL"`. Already-short strings (e.g. `"JD"`) pass through unchanged.

By default the fallback is colorized — the background color is derived from the first rendered character (A–Z map to 26 evenly spaced OKLCH hues, digits and other characters fall back to a deterministic hash). Foreground is white and works in both light and dark mode.

```tsx
// auto-initials + auto-color (default)
<Avatar><AvatarFallback>John Doe</AvatarFallback></Avatar>

// neutral muted background — opt out for system tiles, "+N" overflow, placeholders
<Avatar><AvatarFallback colorize={false}>+3</AvatarFallback></Avatar>
```

Pass `shape="square"` for an entity-style rounded-square tile (project icons, app logos, anything that isn't a person):

```tsx
<Avatar shape="square">
  <AvatarFallback>Pandaworks</AvatarFallback>
</Avatar>
```

Props (`Avatar`):
- `shape?: "circle" | "square"` — defaults to `"circle"`. Square uses `rounded-md`. The shape propagates into `AvatarFallback` via `rounded-[inherit]`.
- `size?: "xs" | "sm" | "md" | "lg" | "xl"` — pick a size from the shared `AvatarSize` scale (`xs` `size-5`, `sm` `size-7`, `md` `size-9`, `lg` `size-12`, `xl` `size-16`). Omit to keep the historical `h-10 w-10` default. The same scale is exported as `avatarSizeClass` and reused by `AvatarGroup` and `UserPicker`.
- `compact?: boolean` — shorthand for `size="xs"`. Wins over `size` when both are set.

The Avatar root carries a `bg-muted` base layer so transparent-PNG avatars never bleed the page background through the avatar shape. Opaque images and the colorized `AvatarFallback` cover this layer in normal use; you only see it for the brief window before an image loads, or for genuinely transparent image sources without a Fallback.

Props (`AvatarImage`):
- All `<img>` props (`src`, `alt`, `onLoad`, `onError`, …) and `className` pass through to Radix's `AvatarPrimitive.Image`.
- **Blurred backdrop layer**: when the parent `Avatar` size is `md`, `lg`, `xl`, or the legacy default (no `size` set), `AvatarImage` automatically renders a second copy of the same image behind the foreground as a scaled-up (`scale-[1.75]`), desaturated (`saturate-50`), blurred (`blur-md`), `opacity-60` backdrop. Opaque photos get a soft ambient color halo; transparent PNGs get a soft character halo over the muted base. `xs` and `sm` skip the backdrop — the blur is invisible at that scale and the extra decode would be wasted in dense lists. The browser cache deduplicates the second image so there's no extra network request. The backdrop is `aria-hidden`.

Props (`AvatarFallback`):
- `colorize?: boolean` -- derive background color from the first rendered character (default: `true`). Pass `colorize={false}` to fall back to `bg-muted`. Unchanged behavior: the colorized hue still wins when the Fallback renders, so the no-image path looks exactly as before.

If you need the initials helper outside the Avatar (e.g. for `aria-label`, sorting, or non-Avatar UI), import it directly:

```tsx
import { getInitialName } from "@pandaworks-sw/lucid-ui"; // or "@/lib" inside the registry

getInitialName("John Doe");        // → "JD"
getInitialName("Devi Marasinghe"); // → "DM"
getInitialName("Eli");             // → "EL"
getInitialName("");                // → ""
```

Custom `style` and `className` still take precedence — pass your own `backgroundColor`/`color` to override the computed values.

## AvatarGroup

A horizontal stack of overlapping Avatars with a `+N` overflow tile.

```tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AvatarGroup } from "@/components/ui/avatar-group"

<AvatarGroup max={3} size="md">
  {team.map(m => (
    <Avatar key={m.id}>
      <AvatarFallback colorize>{m.initials}</AvatarFallback>
    </Avatar>
  ))}
</AvatarGroup>
```

Props:
- `max?: number` — show this many avatars then collapse the rest into a `+N` tile. Omit to show all.
- `size?: "xs" | "sm" | "md" | "lg" | "xl"` — tile size. Default `sm`.
- `shape?: "circle" | "square"` — group-level shape; per-`Avatar` `shape` wins if set.

Each child `Avatar`'s `size` and `className` are overridden with the group's size and stack-separation classes. Stacked avatars now carry both a 2px page-background ring (`ring-2 ring-background`) and a 1px hairline border (`border border-border/60`). The ring punches each circle out of its neighbour; the hairline keeps the edge readable when the avatar content is close in tone to the page background — e.g. dark transparent-PNG avatars on a dark surface. The blurred-backdrop layer from `AvatarImage` (`md`+ sizes) carries through to grouped avatars automatically.

Sizing:

| Scenario | Size |
|----------|------|
| Inline assignee stack inside a `Table` row, `ListRow`, or activity feed | `xs` |
| Card-tile member preview, project tile assignees, dense filter bar | `sm` (default) |
| Detail page sidebar / dashboard card "team" widget | `md` |
| Hero member showcase, marketing or onboarding surface | `lg` |
| Profile header, settings page member identity, oversized assignment trigger | `xl` |

Shape rule: `circle` for people, `square` for non-human entities (project teams stay circle even though the host card is for a project — the avatars themselves represent humans). See the Avatar shape rule.

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

`CardTitle` accepts a `size` prop to scale the title text. Defaults to `lg` (the historical 24px hero title) — existing call sites are unchanged.

```tsx
<CardTitle size="sm">Dense tile</CardTitle>     {/* 16px — tile-sized cards in dense grids */}
<CardTitle size="md">Standard card</CardTitle>  {/* 18px — dashboard / detail page cards */}
<CardTitle size="lg">Prominent surface</CardTitle> {/* 24px — default; hero / single-card surfaces */}
```

Sizing:

| Scenario | Size |
|----------|------|
| Hero card on a detail page, single-card surface, marketing tile | `lg` (default) |
| Standard product card inside a dashboard, settings group, or detail page | `md` |
| Tile inside a dense 3-up or 4-up `CardGroup`, color-tinted summary tile | `sm` |

Pick by surrounding density, the same way you pick `Button` size — don't shrink the title for visual variety, only when the card itself is dense. Combine `size` with `icon` / `trailing` freely; the row layout is preserved at every size.

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

Standalone, the table renders inside its own bordered, rounded, shadowed wrapper. When nested inside `CardContent`, the wrapper auto-drops its border, rounding, background, and shadow so the surrounding card frame is the only visual boundary -- pair `<CardContent className="p-0">` with `<Table>` for a flush card-table layout.

## Calendar

```tsx
import { Calendar } from "@/components/ui/calendar"

<Calendar mode="single" selected={date} onSelect={setDate} />
```

## Skeleton

```tsx
import { Skeleton } from "@/components/ui/skeleton"

<Skeleton className="h-4 w-50" />
<Skeleton className="h-12 w-12 rounded-full" />
```

## Progress

```tsx
import { Progress } from "@/components/ui/progress"

<Progress value={60} />
```

## CodeLabel

Inline monospace label with optional copy-to-clipboard button.

```tsx
import { CodeLabel } from "@/components/ui/code-label"

<CodeLabel value="EMP-2024-001" />
<CodeLabel value="npm install" size="sm" />
<CodeLabel value="PW-ATLAS" copyable={false} />
```

Props:
- `value: string` — text to display (and copy when `copyable`).
- `size?: "default" | "sm"` — chip size.
- `copyable?: boolean` — show the hover-revealed copy button. Default `true`. Pass `false` for a static inline code chip with no interactive affordance (e.g. when listing many keys in a summary table).

Sizing:

| Scenario | Size |
|----------|------|
| Standalone inline ID or command on a detail page, in a `PageHeader`, or in a Card header | `default` |
| Inline ID inside a `Table` row, a list, or a dense filter bar | `sm` |

## MeterRow

Labeled horizontal bar with optional trailing value and per-row tone. Replaces the hand-rolled `<div className="h-1.5 w-full bg-muted"><div style={{ width: \`${pct}%\` }} />` pattern.

```tsx
import { MeterRow } from "@/components/ui/meter-row"
import { Badge } from "@/components/ui/badge"

<MeterRow label="Engineering" value={13} max={13} valueLabel={13} />

<MeterRow
  label={<Badge variant="success" dot>Active</Badge>}
  value={5}
  max={statusMax}
  valueLabel={5}
  tone="success"
/>

// Bare bar — label rendered separately above/around by the caller
<MeterRow value={progress} tone="info" />
```

Props:
- `label?: ReactNode` — leading label. Plain string or any node (typically a Badge for status/priority charts). Optional: when omitted (and `valueLabel` is also omitted) the label-row container is not rendered, leaving a bare progress bar useful for compact list rows or inline tone-aware bars where the label is shown separately.
- `value: number` — numeric value used for the fill width.
- `max?: number` — maximum value used to compute width. Defaults to `100`.
- `valueLabel?: ReactNode` — trailing value text/node. Omit to hide.
- `tone?: "default" | "success" | "warning" | "info" | "destructive" | "muted"` — bar fill color. Default `default` (primary).
- `size?: "sm" | "default" | "lg"` — track height (`h-1` / `h-1.5` / `h-2`). Default `default`.

The bar exposes `role="progressbar"` with `aria-valuenow` clamped to `0–100`.

Sizing:

| Scenario | Size |
|----------|------|
| Compact list row indicator (next to many rows of data, dense `Table` cell) | `sm` |
| Dashboard breakdown chart, filter bar, standard `Card` content | `default` |
| Hero KPI breakdown or a single highlighted metric | `lg` |

## ListRow

`leading + title + subtitle + trailing` layout primitive. Use for activity feeds, deadline lists, team lists, and any "icon + text + meta" row.

```tsx
import { ListRow } from "@/components/ui/list-row"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

<ListRow
  leading={<Avatar><AvatarFallback colorize>AR</AvatarFallback></Avatar>}
  title="Ahmad Razif"
  subtitle="Engineering Lead · ahmad@…"
  trailing={<Badge variant="success" dot>Active</Badge>}
/>
```

For clickable rows, pass `asButton` — the row renders as a `<button>` with a focus ring and a hover background:

```tsx
<ListRow
  asButton
  onClick={() => navigate(...)}
  leading={<MemberAvatar member={assignee} />}
  title="Notification service extraction"
  subtitle="PW-ATLAS · Atlas Platform Migration"
  trailing={<PriorityBadge priority="high" />}
/>
```

Props:
- `leading?: ReactNode` — icon/avatar slot.
- `title: ReactNode` — primary line (required). Truncated.
- `subtitle?: ReactNode` — secondary line (subdued, smaller, truncated).
- `trailing?: ReactNode` — meta/action slot.
- `asButton?: boolean` — render as `<button>` with keyboard interactivity. Pairs with `onClick`.
- `density?: "sm" | "default" | "lg"` — vertical padding.
- `surface?: "plain" | "bordered" | "muted"` — `bordered` adds a card frame and inset padding (use for standalone rows like API keys); `muted` adds a soft fill.
- `interactive?: boolean` — explicitly opt into the hover/focus styles. Inferred from `asButton` or `onClick`; rarely needs to be set manually.

Density:

| Scenario | Density |
|----------|---------|
| Activity feed, comment stream, long scrolling list (12+ rows) | `sm` |
| Member list, deadline list, dashboard "Recent X" card | `default` |
| Settings list (one row per setting), API-key list, "1-of-few" rows on a detail page | `lg` |

Surface:

| Scenario | Surface |
|----------|---------|
| Inside a `Card` with `divide-y` (the Card frame is the boundary) | `plain` (default) |
| Standalone row not wrapped in a Card — needs its own frame (e.g. an API-key entry on a settings page) | `bordered` |
| Group of rows that should read as a soft inline list (no card needed, but distinct from page bg) | `muted` |

For wrapped lists, place `ListRow`s inside a Card with `divide-y` and an inset class on each row (e.g. `className="px-4"`):

```tsx
<Card>
  <CardContent className="divide-y p-0">
    {items.map(item => <ListRow key={item.id} className="px-4" … />)}
  </CardContent>
</Card>
```

## TableListCell

Two-line primary cell for `Table` rows. Use it when each row needs a title plus a flex-wrap strip of meta (badges, dividers, customer chips). Built on `TableCell` + `TruncatedLabel`. Pair with `Badge size="xs"` for the dense meta strip and the sibling `MetaDivider` helper for the vertical pipe.

Use this — not `ListRow` — when you are inside a real `<Table>` shell (so the cell sits in a `<tr>` alongside other `<td>` cells like status, owners, actions). Use `ListRow` when the list is a div/button stack inside a `Card`.

```tsx
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MetaDivider, TableListCell } from "@/components/ui/table-list-cell"
import { AlertTriangle, Bug } from "lucide-react"

<Table>
  <TableHeader className="bg-muted/50">
    <TableRow>
      <TableHead className="px-6 py-3">Ticket</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {tickets.map((t) => (
      <TableRow key={t.id} className="group cursor-pointer hover:bg-accent" onClick={() => open(t.id)}>
        <TableListCell
          leadingIcon={<Bug className="size-4 shrink-0 text-destructive" />}
          eyebrow={`#${t.id}`}
          title={t.title}
          meta={
            <>
              <Badge variant="destructive" size="xs"><AlertTriangle className="size-3" />SLA breached</Badge>
              <Badge variant="warning" size="xs">High</Badge>
              <MetaDivider />
              <Badge variant="outline" size="xs">{t.customer}</Badge>
            </>
          }
        />
        <TableCell className="px-6 py-4">{t.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

Props:
- `leadingIcon?: ReactNode` — small status/type icon placed before the eyebrow
- `eyebrow?: ReactNode` — small monospaced muted label (e.g. `#TICKET-123`)
- `title: string` — primary line; rendered with `TruncatedLabel` for auto-tooltip on overflow
- `meta?: ReactNode` — flex-wrap sub-line content; auto-wrapped in `mt-1 flex flex-wrap items-center gap-2`
- Plus pass-through `TableCell` props (`className`, `onClick`, …)

The cell defaults to `w-full max-w-0 px-6 py-4` so it expands to fill remaining horizontal space and clips long titles via `TruncatedLabel`. The wrapping `<TableRow className="group cursor-pointer hover:bg-accent">` stays in caller code so each list can decide its own click + hover semantics.

`MetaDivider` is a thin vertical pipe (`h-3 w-px bg-border`) — use between meta groups to separate badge clusters from secondary text. It is decorative (`aria-hidden`).

## StatCard

Dashboard stat tile composed from `Card`, `AnimatedNumber`, and `Badge`.

```tsx
import { StatCard } from "@/components/ui/stat-card"
import { FolderKanban } from "lucide-react"

<StatCard
  icon={FolderKanban}
  label="Active projects"
  value={5}
  hint="of 9 total"
  delta="+2 QoQ"
  deltaTone="up"
/>
```

Props:
- `icon?: ComponentType<{ className?: string }>` — leading icon shown in the header.
- `label: ReactNode` — short caption above the value.
- `value: number | string` — numbers animate via `AnimatedNumber`; strings render as-is (assumed already-formatted, e.g. `"N/A"`, `"8 / 10"`, `"Active"`). `prefix`, `suffix`, `decimals`, and `formatter` are ignored when `value` is a string.
- `prefix?: string` — text prepended to the value (e.g. `"$"`, `"RM"`). Numeric values only.
- `suffix?: string` — appended to the value (e.g. `"%"`). Numeric values only.
- `decimals?: number` — number of decimal places. Numeric values only; ignored when `formatter` is provided.
- `formatter?: (value: number) => string` — custom number formatter. Numeric values only; overrides `decimals` / `prefix` / `suffix`.
- `hint?: ReactNode` — text below the value.
- `delta?: string` — trend chip text (e.g. `"+12%"`).
- `deltaTone?: "up" | "down" | "flat"` — controls the trend chip's tone. `"up"` → success, `"down"` → destructive, `"flat"` → muted. Defaults to `"up"`.

`StatCard` ships at a single SaaS-density size — tight padding (`px-4`), `text-xs` label, `size-3.5` icon, and a `text-xl` headline number — so multiple tiles fit comfortably on a dashboard without dominating the page. Don't override these via `className` to "go bigger"; if you need a hero number, use a plain `Card` with custom typography.

The headline class auto-shrinks based on the rendered value length so long values still fit inside the tile: `≤10 chars → text-xl`, `≤16 → text-lg`, `≤24 → text-base`, `>24 → text-sm`. Length is computed from the string for string values, from `formatter(value)` when a formatter is provided, and from `prefix + integer digits + decimals + suffix` otherwise. The shrink is purely length-based (no measurement) — it's predictable and adds zero runtime cost, but it's a heuristic, so a wide character at a boundary may still clip in extreme cases.

## MultiStatCard

Two or more related stat metrics rendered inside a **single** card with dividers between cells. Use when metrics belong together conceptually (a funnel: Total → In Progress → Completed; a pair: Form Start / Submission Due) and you want fewer visible cards in the row without losing the StatCard look-and-feel.

```tsx
import { MultiStatCard } from "@/components/ui/multi-stat-card"
import { CheckCircle, TrendingUp, Users } from "lucide-react"

<MultiStatCard
  items={[
    { icon: Users, label: "Total", value: 124, hint: "Appraisals in stage" },
    { icon: TrendingUp, label: "In Progress", value: 47, hint: "Being processed" },
    { icon: CheckCircle, label: "Completed", value: 77, hint: "Finished reviews" },
  ]}
/>
```

Props:
- `items: MultiStatCardItem[]` — two or more cells. Each item shape mirrors `StatCard` minus `className`: `icon`, `label`, `value`, `prefix`, `suffix`, `decimals`, `formatter`, `hint`, `delta`, `deltaTone`. Same string-vs-number rules and same headline auto-shrink behavior as `StatCard`.
- `orientation?: "horizontal" | "vertical"` — default `"horizontal"`. Horizontal lays cells in a row separated by vertical dividers (`divide-x`); vertical stacks them with horizontal dividers (`divide-y`). Each cell uses `flex-1 min-w-0` so widths split evenly and long values still shrink.
- `className?: string` — applied to the outer `Card`. Use for grid spans (e.g. `xl:col-span-3`) or sizing constraints.

A `MultiStatCard` is one card visually, so when mixing it into a grid of single `StatCard` tiles, give it a `col-span` equal to the number of cells so the row stays balanced:

```tsx
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-6">
  <StatCard label="Review Period" value="01 Sep – 30 Apr" hint="Period being evaluated" />
  <StatCard label="Form Start Date" value="01 Sep 2025" hint="When form opens" />
  <StatCard label="Submission Due Date" value="30 Apr 2026" hint="When form is due" />
  <MultiStatCard
    className="sm:col-span-2 xl:col-span-3"
    items={[
      { icon: Users, label: "Total", value: 124, hint: "Appraisals in stage" },
      { icon: TrendingUp, label: "In Progress", value: 47, hint: "Being processed" },
      { icon: CheckCircle, label: "Completed", value: 77, hint: "Finished reviews" },
    ]}
  />
</div>
```

Pick `MultiStatCard` over a row of `StatCard`s when:
- The metrics together form a single concept (funnel, ratio, before/after) — separating them into individual tiles dilutes that.
- You want to free up grid columns for other content.

Stick with separate `StatCard`s when each metric stands on its own (different units, unrelated business meaning) — separating them into individual tiles helps scannability.

`MultiStatCard` shares its design tokens, headline-shrink heuristic, and delta-chip rendering with `StatCard` via a small shared module (`stat-card-shared.ts`), so the two stay visually consistent.

## ProgressStatCard

A single card that combines a titled headline, a `Progress` bar, and a row of tone-aware stat cells underneath. Use it for "one cycle, here's the breakdown"-style summaries where the progress and its component counts belong together — performance review cycles, onboarding pipelines, content publishing funnels, KPI completion bands.

```tsx
import { ProgressStatCard } from "@/components/ui/progress-stat-card"

<ProgressStatCard
  title="Annual Performance Review 2026"
  value="28.6%"
  progress={28.6}
  items={[
    { label: "Published", value: 2, tone: "success" },
    { label: "In progress", value: 3 },
    { label: "Overdue", value: 0, tone: "destructive" },
    { label: "Not started", value: 2 },
  ]}
/>
```

For a ratio-style headline (e.g. manager dashboards showing `5 of 12`), use `valueHint` instead of `value` — it renders smaller and muted, alongside the title:

```tsx
<ProgressStatCard
  title="Team completion"
  valueHint="5 of 12"
  progress={42}
  items={[
    { label: "In progress", value: 4 },
    { label: "Completed", value: 5, tone: "success" },
    { label: "Overdue", value: 3, tone: "destructive" },
  ]}
/>
```

Props:
- `title: ReactNode` — top-left heading.
- `value?: ReactNode` — bold trailing headline (top-right). Use for a single number/percent.
- `valueHint?: ReactNode` — muted trailing hint (top-right). Use for a ratio or short subtitle. `value` wins when both are passed; supply only one.
- `progress: number` — Progress bar fill, 0–100.
- `items: ProgressStatCardItem[]` — stat cells below the bar. Each item has `label`, `value: number | string`, and an optional `tone` (`"default" | "success" | "destructive" | "warning" | "info" | "muted"`). The cell value uses the tone color; the label is always muted.
- `className?: string` — applied to the outer `Card`. Use for grid spans (e.g. `xl:col-span-2`) or sizing constraints.

The cells lay out as a 2-column grid on mobile and an evenly-spaced row (`auto-cols-fr`) on `sm:` and above, so a 3-cell or 4-cell card spreads across the row instead of wrapping. Item count is not capped — keep it under ~6 for readability.

Pick `ProgressStatCard` over composing `Card + Progress + MultiStatCard` by hand when:
- You want one progress reading with its breakdown, in one card.
- The breakdown cells are short numeric counts (no delta chips, no large icons) — those want `MultiStatCard` or individual `StatCard`s instead.

If the breakdown cells need delta chips, hint text, or per-cell icons, use `MultiStatCard` separately and surface the progress somewhere else (e.g. a `MeterRow` above it).

The cell tone tokens (`text-success`, `text-destructive`, etc.) come from the chroma layer and are intended for graphical emphasis on the stat value, not body text — under WCAG these qualify as graphical objects (SC 1.4.11, 3:1) rather than normal text. If you need AA-strict text, use `tone="default"` (or `"muted"`) and lean on icons or badges to convey the trend instead.

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

## TruncatedLabel

A single- or multi-line label that truncates with ellipsis when it overflows its container, and shows the full text in a tooltip on hover or focus. The tooltip is only mounted when truncation is actually happening (detected via `ResizeObserver` + `scrollWidth` / `scrollHeight`), so short text never gets a redundant tooltip.

Use for table cells, list rows, breadcrumbs, file paths, long employee/contact names, and any cramped surface where you want to preserve the full value without wrapping. Requires a `<TooltipProvider>` somewhere in the tree (already present at the `AppShell` root).

```tsx
import { TruncatedLabel } from "@/components/ui/truncated-label"

// Single line — truncates with ellipsis when it overflows the parent's width
<div className="max-w-[200px]">
  <TruncatedLabel text="Alexandria Montgomery-Wellington, Senior Principal Strategist" />
</div>

// Multi-line clamp
<div className="max-w-[260px]">
  <TruncatedLabel text={longDescription} lines={3} />
</div>

// Force-disable the tooltip (e.g. on a touch-only surface)
<TruncatedLabel text={longText} disableTooltip />
```

The component renders a `<span class="block truncate">` (or a `-webkit-box` line-clamp box when `lines > 1`), so it inherits its width from the parent. Wrap it in a width-constrained container (table cell, flex child with `min-w-0`, fixed-width div) for the truncation to engage.

When the tooltip is enabled and truncation is detected, the span receives `tabIndex={0}` so keyboard users can focus it and trigger the tooltip. Pass an explicit `tabIndex` to override.

Props:
- `text: string` -- The full text to display
- `lines?: number` -- Lines before truncation (default: 1 — single-line ellipsis; >1 uses `-webkit-line-clamp`)
- `side?: 'top' | 'right' | 'bottom' | 'left'` -- Tooltip side (default: `'top'`)
- `align?: 'start' | 'center' | 'end'` -- Tooltip alignment (default: `'center'`)
- `delayDuration?: number` -- Tooltip open delay in ms (default: 200)
- `disableTooltip?: boolean` -- Skip the tooltip even when truncated (default: false)
- Forwards all other `HTMLAttributes<HTMLSpanElement>` to the inner `<span>`
