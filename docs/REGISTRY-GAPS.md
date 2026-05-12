# Registry Gaps

Findings from rebuilding the SaaS demo (`apps/demo/src/saas/`) using only registry components in `apps/demo/src/pure/`.

**How to read this:** each gap describes a place where a real-world consumer is forced to leave the registry. The "Workaround in pure" column shows what the pure-showcase ended up with; the "Fix" column proposes the registry change that would close the gap.

Rebuilding rules and the audit grep commands live in `CLAUDE.md` under "Showcase Purity Rules."

## Status (2026-05-01)

| # | Gap | Status |
|---|---|---|
| G1 | Badge semantic-tone variants + dot | **Closed** — `success` / `warning` / `info` / `muted` variants and `dot` prop shipped |
| G2 | Avatar `shape="square"` | **Closed** — `shape` prop on Avatar, fallback inherits via `rounded-[inherit]` |
| G3 | AvatarGroup primitive | **Closed** — new `AvatarGroup` component with `max` overflow |
| G4 | EmptyState | **Closed** — new `EmptyState` component (sm/md/lg) |
| G5 | StatCard | **Closed** — new `StatCard` (Card + AnimatedNumber + Badge) with `formatter` for currency etc. |
| G6 | MeterRow / labeled bar | **Closed** — new `MeterRow` with per-row `tone` (default/success/warning/info/destructive/muted) and `size` (sm/default/lg) |
| G7 | ListRow primitive | **Closed** — new `ListRow` with `leading` / `title` / `subtitle` / `trailing` slots, `asButton` interactive mode, density and surface variants |
| G8 | CodeLabel `copyable={false}` | **Closed** — `copyable` boolean prop, default `true` |
| G9 | DropdownMenuItem destructive variant | **Closed** — `variant="destructive"` |
| G10 | Demo `×` glyph | **Closed** — `apps/demo/src/pure/settings.tsx` uses Lucide `X` icon |
| G11 | Badge default-class redundancy in docs | **Closed** — `public/docs/data-display.md` updated; default classes documented |
| G12 | DialogContent diagonal slide drift | **Closed (0.8.2)** — removed `slide-in-from-left-1/2` + `slide-in-from-top-[48%]` (and matching `slide-out-*`) from `DialogContent`. Open motion is now fade + zoom from center, matching the docs. Modal (`slide-in-from-bottom-8`) and Sheet are unchanged. |

**All gaps closed.** Pure-showcase ships without custom UI components, hand-rolled chips/spans, or hardcoded Tailwind palette colors. Every visual element on every route routes through the registry.

---

## P0 — Forces every consumer to write custom CSS

### G1. Badge has no semantic-tone variants
**Where it bites:** every status, priority, delta-trend, and tag chip in the SaaS demo.

`saas/shared.tsx` invents `StatusPill`, `TaskStatusPill`, and overrides `PriorityBadge` because the registry [`Badge`](../packages/registry/registry/default/badge/badge.tsx) only ships four variants — `default`, `secondary`, `destructive`, `outline` — and none of them map to "active/healthy", "warning/blocked", "informational", or a soft muted chip.

The result: 9 hardcoded palette references in `shared.tsx` alone (`bg-emerald-500`, `text-rose-700`, `border-amber-300`, …) and three lookalike `<span>` components ([`StatusPill` shared.tsx:101](../apps/demo/src/saas/shared.tsx#L101), [`TaskStatusPill` shared.tsx:116](../apps/demo/src/saas/shared.tsx#L116)) that are not Badges at all.

**Workaround in pure:** map domain values onto the four existing variants — collisions are unavoidable (active and completed both end up using `default`). Tagged `// REGISTRY-GAP: G1` everywhere it lands.

**Fix:** add `success`, `warning`, `info`, and `muted` to the `badgeVariants` cva, plus a boolean `dot` prop that renders a leading status dot. With those six variants and the dot, every pill in the demo collapses to plain `<Badge variant tone dot>`.

```tsx
// proposed
<Badge variant="success" dot>Active</Badge>
<Badge variant="warning" dot>On hold</Badge>
<Badge variant="info" dot>Planning</Badge>
<Badge variant="muted">Tag</Badge>
```

---

### G2. No deterministic-color icon tile
**Where it bites:** [`projects-list.tsx:514`](../apps/demo/src/saas/projects-list.tsx#L514) — the project tile (`DSGN`, `MIG`, …) next to each row.

The registry [`Avatar`](../packages/registry/registry/default/avatar/avatar.tsx) is permanently round (`rounded-full`). For a project icon — a square tile with a hashed background based on the project key — there is no primitive, so the demo hand-rolls a `<div>` with inline `color-mix()`.

**Workaround in pure:** use `<Avatar className="rounded-md">` with `<AvatarFallback colorize>`. The `rounded-md` override is a className tweak (allowed) but it feels load-bearing — the component is implicitly "round" everywhere else.

**Fix:** add `shape?: "circle" | "square"` to `Avatar`. Default to `circle`; `square` swaps to `rounded-md`. Document that `colorize` works for project keys, not just person initials.

---

### G3. AvatarGroup / overflow chip
**Where it bites:** [`shared.tsx:179` `MemberStack`](../apps/demo/src/saas/shared.tsx#L179) — the "+N" overflow indicator after a stack of avatars.

There is no registry `AvatarGroup`, so every consumer rebuilds the negative-margin layout (`-space-x-2`, ring-background) and the "+N" chip as a hand-rolled `<span>`.

**Workaround in pure:** keep the `flex -space-x-2` layout (it's allowed — it's just flex), but render the overflow as `<Avatar><AvatarFallback className="bg-muted">+{n}</AvatarFallback></Avatar>` so at least the visual element is registry-sourced. Tagged `// REGISTRY-GAP: G3`.

**Fix:** ship `AvatarGroup` as a registry component:

```tsx
<AvatarGroup max={4} size="xs">
  {members.map(m => <Avatar><AvatarFallback colorize>{initials(m.name)}</AvatarFallback></Avatar>)}
</AvatarGroup>
```

---

## P1 — Recurring patterns the demo reinvents

### G4. EmptyState
**Where it bites:** four near-identical empty-state blocks across `projects-list`, `project-detail`, `team`, and one near-instance in `dashboard`.

```tsx
<div className="flex flex-col items-center gap-3 py-16 text-center">
  <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
    <Icon className="size-5" />
  </div>
  <p className="text-sm font-medium">No projects match these filters.</p>
  <Button size="sm" variant="outline" onClick={…}>Clear filters</Button>
</div>
```

**Workaround in pure:** ship a local `<EmptyState>` inside `pure-shared.tsx` that uses only registry primitives (Card-less, Button, Icon, muted backgrounds via tokens). This is allowed under the rules because every primitive inside it comes from the registry — it's a layout, not a styled component. Tagged `// REGISTRY-GAP: G4 — promote to registry`.

**Fix:** promote `EmptyState` to the registry. Props: `icon`, `title`, `description?`, `action?`. It composes Card/Button/Icon — no new tokens needed.

---

### G5. StatCard
**Where it bites:** `dashboard.tsx` × 4, `project-detail.tsx` × 3, `reports.tsx` × 3 — every stat tile is a hand-rolled Card with the same flex header, AnimatedNumber body, and trailing hint.

**Workaround in pure:** local component `<StatCard>` that wires `Card + CardHeader + CardContent + AnimatedNumber + Badge` together. Tagged `// REGISTRY-GAP: G5 — promote to registry`.

**Fix:** ship a registry `StatCard`. Props: `icon`, `label`, `value`, `suffix?`, `hint?`, `delta?`, `deltaTone?: "up" | "down" | "flat"`. The delta chip uses Badge variants (G1) — so G1 should land first.

---

### G6. MeterRow / labeled bar
**Where it bites:** `dashboard.tsx:DepartmentChart` and `reports.tsx` × 2 charts — all hand-roll `<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted"><div style={{ width: \`${pct}%\` }}>` rows.

The existing [`Progress`](../packages/registry/registry/default/progress/progress.tsx) component does this for a single value but isn't designed for a labeled list of bars.

**Workaround in pure:** use `Progress` with a label row above and a `Separator` between rows. The visual is acceptable but Progress is more visually heavy than a thin meter.

**Fix:** either expose a `<MeterRow label value max />` primitive, or document that `Progress` covers this (and ship a `density="thin"` variant if needed).

---

### G7. ListRow / repeating Avatar+text+meta layout
**Where it bites:** [`dashboard.tsx:280` upcoming deadlines](../apps/demo/src/saas/dashboard.tsx#L280), [`dashboard.tsx:310` activity feed](../apps/demo/src/saas/dashboard.tsx#L310), [`project-detail.tsx:417` team list](../apps/demo/src/saas/project-detail.tsx#L417), [`project-detail.tsx:452` activity feed](../apps/demo/src/saas/project-detail.tsx#L452), [`settings.tsx:361` API key list](../apps/demo/src/saas/settings.tsx#L361).

All five are the same shape: leading visual (Avatar/Icon), title + subtitle, trailing meta and/or action.

**Workaround in pure:** keep the manual flex layout but require all internals to be registry primitives. No abstraction.

**Fix:** consider a `<ListRow leading title subtitle trailing action />` primitive. This is lower priority because it's pure layout — the styling is already token-only — but it's the most-repeated pattern in the demo.

---

### G8. Inline code chip vs CodeLabel
**Where it bites:** project keys (`DSGN`, `MIG`, …) appear five times as `<code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">` because `CodeLabel` always renders a copy button.

**Workaround in pure:** use `<CodeLabel value={key} size="sm" />` with `copyable={false}` if the prop exists; otherwise local muted code chip and log a gap. Verify props.

**Fix:** add `copyable?: boolean` (default `true`) to `CodeLabel` so the inline version is the same component without the button.

---

## P2 — Smaller, document-then-fix

### G9. DropdownMenuItem destructive tone
Five sites repeat `className="text-destructive focus:text-destructive"` on a "delete" item ([project-detail.tsx:187](../apps/demo/src/saas/project-detail.tsx#L187), [project-detail.tsx:391](../apps/demo/src/saas/project-detail.tsx#L391), [projects-list.tsx:730](../apps/demo/src/saas/projects-list.tsx#L730), `App.tsx`, etc.).

**Fix:** add `variant?: "default" | "destructive"` to `DropdownMenuItem`. Tiny change; high payoff.

---

### G10. ApiKey "×" close button uses literal `×` glyph
[`settings.tsx:384`](../apps/demo/src/saas/settings.tsx#L384) — the demo writes `×` as text inside a Button. Easy fix: use the `cancel` action preset (which auto-resolves to the `X` Lucide icon). Not a registry gap, just demo cleanup.

---

### G11. "rounded-full text-xs" on Badge is redundant
Multiple sites add `className="rounded-full text-xs"` to Badge. Both classes are already in the base styles ([`badge.tsx:11-12`](../packages/registry/registry/default/badge/badge.tsx#L11-L12)). Doc fix in `public/docs/data-display.md`: explicitly note the defaults.

---

## Summary table

| # | Gap | Severity | Forces a workaround? | Fix size |
|---|---|---|---|---|
| G1 | Badge needs success/warning/info/muted + dot | P0 | Yes (every status/priority/delta/tag chip) | Small (cva + boolean prop) |
| G2 | Avatar shape="square" for icon tiles | P0 | Yes (project tiles) | Tiny (one className branch) |
| G3 | AvatarGroup with overflow | P0 | Yes (every team stack) | Medium (new component) |
| G4 | EmptyState | P1 | Yes (4× repeated) | Small |
| G5 | StatCard | P1 | Yes (10× repeated) | Small (depends on G1) |
| G6 | MeterRow / thin Progress | P1 | Yes (3× hand-rolled bars) | Small |
| G7 | ListRow primitive | P1 | Repeats | Small (or just docs) |
| G8 | CodeLabel non-copyable variant | P1 | Yes (5×) | Tiny |
| G9 | DropdownMenuItem variant="destructive" | P2 | Repeats | Tiny |
| G10 | Demo `×` glyph | P2 | No (demo cleanup) | Tiny |
| G11 | Badge default-class docs | P2 | No (docs only) | Tiny |

**Recommended order to close:** G1 → G2 → G8 → G4 → G5 → G3 → G6 → G7 → G9. G1 alone closes ~50% of the customization surface; G1+G2+G3 closes the visual mismatches that prompted this audit.
