# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 2026-05-11

### Added

- **`UserPicker` component.** [packages/registry/registry/default/user-picker/user-picker.tsx](packages/registry/registry/default/user-picker/user-picker.tsx) — avatar-trigger picker for assigning one user (single mode) or many (multi mode), backed by discriminated-union props (`mode?: 'single'` with `value: string | null`, or `mode: 'multi'` with `value: string[]`). The trigger composes `Button` ghost + `Avatar` for single/empty states and `AvatarGroup` for multi selections, including built-in `+N` overflow for crowded assignee lists. The menu composes `Popover` + `Command` with name/email filtering, an automatic search input when `users.length > 8`, optional single-mode `Unassigned`, and checkbox-style multi selection that stays open between picks. Replaces the hand-rolled Select + Avatar pattern that keeps showing up for assignee, owner, collaborator, and watcher fields. Non-breaking.

## 2026-05-07

### Added

- **`Timeline` component.** [packages/registry/registry/default/timeline/timeline.tsx](packages/registry/registry/default/timeline/timeline.tsx) — vertical event-feed primitive with a connector line and tone-coded dots per item. Each `TimelineItem` exposes `id`, `tone` (`'default' | 'info' | 'success' | 'warning' | 'destructive' | 'muted'`), `title`, optional `subtitle`, optional `meta` (right-aligned trailing slot), and an optional `icon` override that replaces the dot. Top-level props: `items`, `defaultTone`, `hideConnector` (single-event compact mode), `emptyState`. The connector line uses `bg-border` (decorative); dots use semantic-tone backgrounds with a `ring-4 ring-background` so they read against any card surface. Use for activity streams, audit logs, changelog histories. Showcase ships mixed-tone, single-event-no-connector, and empty-state demos.

- **`IconBadge` component.** [packages/registry/registry/default/icon-badge/icon-badge.tsx](packages/registry/registry/default/icon-badge/icon-badge.tsx) — decorative icon container with semantic tone variants (`default` / `info` / `success` / `warning` / `destructive` / `muted` / `primary`) × size (`sm` 32px / `md` 48px / `lg` 64px) × shape (`rounded` xl / `circle` full / `square` md). Tones use 10–15% chroma tints so they pair with any surface. Children are rendered through a fixed-size aria-hidden inner span so Lucide icons inherit the right size. Not a button — for clickable surfaces use `Button`. Use for centered hero icons on auth pages, setup wizards, status flags, empty states. Replaces the hand-rolled `<div class="rounded-full bg-primary/10"><CheckCircle /></div>` pattern.

- **`CardGroup` component.** [packages/registry/registry/default/card-group/card-group.tsx](packages/registry/registry/default/card-group/card-group.tsx) — responsive grid container for groups of related `Card`s with consistent gutters. `columns: 1 | 2 | 3 | 4` (auto-collapses to 1 on mobile, 2 on `md`, target columns on `xl`). `gap: 'sm' | 'default' | 'lg'`. Optional `title` (rendered as a small `<h3>`) and `action` (right-aligned trailing slot) render a shared header above the grid. Replaces the ad-hoc `<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">` pattern that keeps re-appearing in consumer code. Showcase ships 3-col responsive demo + 2-col with title/action demo.

- **`InlineEditableField` component.** [packages/registry/registry/default/inline-editable-field/inline-editable-field.tsx](packages/registry/registry/default/inline-editable-field/inline-editable-field.tsx) — single field that toggles between a display value (with an Edit affordance) and an inline editor (with built-in Save / Cancel buttons). Manages the `editing` and `isSaving` state internally. The `editor` is a render prop receiving `{ save, cancel, isSaving }` so consumers can wire Enter/Escape and disable the editor while save is in-flight. Props: `label`, `display`, `emptyText` (rendered when `display` resolves to falsy), `editor`, `onSave` (sync or async — the component awaits the promise to drive `isSaving`), `onCancel`, `disabled` (hides the Edit button entirely), `editLabel` (override "Edit"). Replaces the hand-rolled "Card → CardHeader (label + Edit button) → CardContent (paragraph or Textarea + Save/Cancel)" pattern. Showcase ships single-line, multiline + empty-state, and disabled demos.

### Changed

- **`CardTitle` gains optional `icon` and `trailing` props.** [packages/registry/registry/default/card/card.tsx](packages/registry/registry/default/card/card.tsx) — when either prop is set, `CardTitle` becomes a flex row with consistent spacing. `icon` renders before children in `text-muted-foreground`; `trailing` renders right-aligned (typically a `Badge` or count). Replaces the `<CardTitle className="flex items-center gap-2"><Icon /> Title</CardTitle>` pattern that was duplicated across consumer code. Plain `<CardTitle>Text</CardTitle>` usage is unchanged. Non-breaking.

## 2026-05-04

### Added

- **Foundations showcase + llms.txt Foundations section (Colors / Typography / Tones).** [apps/demo/src/showcase/demos/colors-demo.tsx](apps/demo/src/showcase/demos/colors-demo.tsx), [apps/demo/src/showcase/demos/typography-demo.tsx](apps/demo/src/showcase/demos/typography-demo.tsx), [apps/demo/src/showcase/demos/tones-demo.tsx](apps/demo/src/showcase/demos/tones-demo.tsx), [apps/demo/src/showcase/showcase-app.tsx](apps/demo/src/showcase/showcase-app.tsx), [public/llms.txt](public/llms.txt). Adds a leading "Foundations" sidebar group in the demo with three pages: `/#/colors` (stone scale, panda-blue scale, semantic chroma, WCAG AA soft-fg + destructive-aa pairings, adaptive theme tokens, chart tokens — each swatch click-to-copy), `/#/typography` (the three font families, body/display/mono size scales with size/line-height/weight, and a Heading-font-policy callout with correct/incorrect examples), `/#/tones` (semantic-tone palette table cross-referenced to Badge / MeterRow / ProgressStatCard / StatCard deltaTone with live examples). `public/llms.txt` gains a matching "Foundations" section between the Tech Stack and the Component Catalog so AI agents can reason about the token system without scanning `styles.css`. No new tokens, components, or utilities introduced — the new pages document what already shipped. Existing `decision-guide.md` remains the canonical "which variant?" lookup; the new `tones-demo` references it for full per-component tone tables.

- **`PasswordInput` component.** [packages/registry/registry/default/password-input/password-input.tsx](packages/registry/registry/default/password-input/password-input.tsx) — thin `Input` wrapper that renders an Eye / EyeOff toggle inside the field (right side, `pr-9` reserved on the input). Clicking the toggle flips `type` between `password` and `text`. Forwards refs to the underlying input via `forwardRef` so it composes cleanly with `react-hook-form` register and other ref-based form libs. Accepts every standard `<input>` prop except `type` (which is owned by the visibility toggle), plus `defaultVisible` for one-time / temporary-password fields and `toggleLabel={{ show, hide }}` for localized aria-labels. The toggle button is keyboard-accessible (in the natural tab order, with `focus-visible:ring`), uses `aria-pressed` semantics, has a stateful `aria-label` ("Show password" / "Hide password"), and disables in lockstep with the input's `disabled` prop. Reuses the existing `--input-bg` form surface and the standard `focus-visible:ring-ring` focus treatment — no new design tokens introduced. Showcase ships a dedicated demo with default, with-label, initially-visible, confirm-password pair, and disabled examples.

- **`NumberInput` component.** [packages/registry/registry/default/number-input/number-input.tsx](packages/registry/registry/default/number-input/number-input.tsx), [packages/registry/registry/default/number-input/number-input-validator.ts](packages/registry/registry/default/number-input/number-input-validator.ts) — controlled numeric input that wraps `Input` and `Label` with min/max clamping, step-derived decimal precision, optional `suffix` label rendered inside the field, persistent `error` state, transient inline validation messaging when blur clamps a value to bounds, and ↑/↓ keyboard stepping. Wheel scrolling on a focused input is blocked via a non-passive listener so values do not change accidentally when the page is scrolled. The empty state is modeled as `value: number | ""` (matching what `<input value>` accepts) so callers don't have to translate `undefined` ↔ `""`. The validation helper lives in a sibling `number-input-validator.ts` so it can be unit-tested in isolation; it is not re-exported from the package barrel. Imported from the Pandahrms-Performance project's local `src/components/ui/number-input.tsx` so multiple consumer apps can share the same constraint behavior. Visually it reuses the existing `--input-bg` form surface and the `aria-invalid` / `border-destructive` error treatment, so it inherits the same dark-mode tokens as the rest of the form-fields family — no new design tokens introduced. Showcase ships a dedicated demo page covering default, min/max with helper text, decimal `step` + suffix, required + empty, error state, and disabled.

### Changed

- **Form-field surfaces (`Input`, `Textarea`, `SelectTrigger`, outline `Button`, `AttachmentInput` compact trigger) now render on a new `--input-bg` token instead of `--background`.** [packages/registry/src/styles.css](packages/registry/src/styles.css), [packages/registry/registry/default/input/input.tsx](packages/registry/registry/default/input/input.tsx), [packages/registry/registry/default/textarea/textarea.tsx](packages/registry/registry/default/textarea/textarea.tsx), [packages/registry/registry/default/select/select.tsx](packages/registry/registry/default/select/select.tsx), [packages/registry/registry/default/button/button.tsx](packages/registry/registry/default/button/button.tsx), [packages/registry/registry/default/attachment-input/attachment-input.tsx](packages/registry/registry/default/attachment-input/attachment-input.tsx). Previously every form surface used `bg-background` (`stone-50` `#F7F9FB` light / `stone-800` dark). In light mode that sat at ~1.02:1 against the `#FFFFFF` `Card`/`Dialog` surface, so inputs and outline buttons inside panels effectively blended in and only the 1px border carried the boundary. Added `--input-bg`: `var(--stone-100)` (`#EFF3F6`) light, `var(--stone-800)` (`#1C2229`) dark. Light mode now reads as a tinted field against white cards; dark mode is intentionally unchanged in appearance because `stone-800` is the same value `bg-background` was already producing there. Pickers (`DatePicker`, `DateRangePicker`, `SelectPicker`) inherit the new surface automatically through `Button` outline; `SearchInput` inherits through `Input`. Contrast: `--foreground` (stone-800) on `--input-bg` (stone-100) ≈ 14.4:1 (AAA); placeholder `--muted-foreground` (stone-600) on `--input-bg` ≈ 7.0:1 (AAA). The `--input` token (border color, `stone-200` light / `stone-600` dark) is unchanged. Non-breaking — consumers that override `bg-background` on inputs locally keep their override; consumers relying on the default surface pick up the new tint automatically.

- **Comfortaa is now scoped to the `PageHeader` title and large hero/marketing text only; everything else renders in Inter.** [packages/registry/src/styles.css](packages/registry/src/styles.css), [packages/registry/registry/default/page-header/page-header.tsx](packages/registry/registry/default/page-header/page-header.tsx), [CLAUDE.md](CLAUDE.md), [public/llms.txt](public/llms.txt). Previously every `<h1>`–`<h6>` in a consumer page picked up Comfortaa via a global base-layer rule, which painted the brand display face onto card titles, sidebar section labels, dialog titles, and any heading in user-authored content — far broader than intended. Removed the global Comfortaa heading rule and replaced it with an explicit Inter reset (`h1, h2, h3, h4, h5, h6 { font-family: var(--font-sans) }`) inside `@layer base`, so clean consumer projects automatically get Inter on every heading. `PageHeader` now applies `font-display` to its title `<h1>` so the brand face stays on that one surface. The `text-display-sm/md/lg/xl` utilities continue to render in Comfortaa (still via `var(--font-display)`) — they are intended for marketing/hero text where the brand face is appropriate. The `--font-display` CSS variable and `font-display` Tailwind utility are unchanged. New "Heading Font Policy" sections were added to `CLAUDE.md` and `public/llms.txt` so AI agents and devs editing consumer projects know the policy and remove any stale `h1–h6 { font-family: var(--font-display) }` rules they encounter. Visual breakage may surface in consumer apps that relied on the old global rule for Comfortaa headings; those sites must add `font-display` (or `text-display-*`) explicitly where they want Comfortaa back.

### Fixed

- **`Accordion` content now actually animates open/close.** [packages/registry/src/styles.css](packages/registry/src/styles.css) — `AccordionContent` already wired `data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down` (Radix-driven) onto its trigger, but the package never shipped the matching `accordion-down`/`accordion-up` keyframes or `--animate-accordion-down`/`--animate-accordion-up` theme tokens. Result: every consumer hit a silent no-op transition unless they hand-copied the keyframes into their own `globals.css` (which Pandahrms-Performance had been doing). Added the two keyframes (driven by Radix's `--radix-accordion-content-height`) plus the two `@theme inline` animation tokens that resolve them. Existing consumers that already defined the keyframes locally are unaffected (their copy still works); they can now safely delete the local copy and rely on the package.

### Added

- **Token-driven scrollbar styling shipped in `@layer base`.** [packages/registry/src/styles.css](packages/registry/src/styles.css) — Firefox (`scrollbar-width: thin`, `scrollbar-color: var(--stone-300) transparent`, dark-mode `var(--stone-600)`) and WebKit (10×10 thumb on `--stone-300`/`--stone-400` light, `--stone-600`/`--stone-500` dark, transparent track, 6px radius). Previously every consumer that wanted consistent scrollbar chrome rebuilt these rules locally against the same `--stone-*` tokens; consolidating upstream removes that duplication and prevents drift if the stone scale ever shifts. Non-breaking: consumers without their own scrollbar overrides pick this up automatically; consumers with project-specific scrollbar styles continue to win via cascade order. Recommend deleting any local copy that uses the same `--stone-*` tokens.

- **`ProgressStatCard` component.** [packages/registry/registry/default/progress-stat-card/progress-stat-card.tsx](packages/registry/registry/default/progress-stat-card/progress-stat-card.tsx) — composes `Card`, `Progress`, and a tone-aware row of stat cells into a single tile. Header lays out a left-side `title` with an optional right-side trailing slot — `value` (bold `text-2xl`) for a single percent/number headline, OR `valueHint` (small `text-sm text-muted-foreground`) for ratio-style subtitles like `"5 of 12"`. The `Progress` bar sits below the header. The `items` prop renders 2+ stat cells underneath in a responsive grid (2-column on mobile, `auto-cols-fr grid-flow-col` row on `sm:` and above), each cell styled as `text-xl font-semibold tabular-nums` value over a `text-xs text-muted-foreground` label. Each item accepts an optional `tone` (`default | success | destructive | warning | info | muted`) that swaps the value color via the chroma tokens (`text-success`, `text-destructive`, etc.) — the same pattern hand-rolled across multiple project dashboards. Cell tone colors are graphical-emphasis under WCAG SC 1.4.11 (3:1) rather than 1.4.3 (4.5:1); the doc page calls this out and recommends `tone="default"` plus a `Badge` or icon when AA-strict text is required. Closes the gap surfaced by the Pandahrms-Performance dashboard's `CycleStatusAdmin` / `CycleStatusManager` widgets, which previously hand-rolled a `<div>` card around `Progress` plus a `<dl>` grid of stat cells. The shape is general enough to cover any "one progress reading + a breakdown of counts" surface (cycle progress, onboarding pipeline, KPI completion band). Showcase ships a dedicated demo page with admin (percent), manager (ratio hint), bare-progress, and all-tones examples.

## 2026-05-02

### Fixed

- **`Button` crashed at render whenever `asChild` was set.** [packages/registry/registry/default/button/button.tsx](packages/registry/registry/default/button/button.tsx) — the previous implementation always rendered `<Comp>{ResolvedIcon && <Icon/>}{resolvedChildren}</Comp>`, so when `Comp` was Radix `Slot` (`asChild=true`), JSX collapsed the two children into a 2-item array and `Slot.SlotClone` threw `React.Children.only expected to receive a single React element child`. Every `<Button asChild><Link>...</Link></Button>` consumer hit this on first render. Fix: split the render path — when `asChild` is true, render `<Slot>` with only `resolvedChildren` (the consumer's element); auto-icon, the tooltip wrapper, and `disabled || loading` only apply to the native-button path. `icon`, `action`, and `loading` are now documented as ignored under `asChild` (the consumer's child element owns its own internals). Non-breaking: every previously working call site keeps working; previously broken `asChild` call sites now work. Added an "As Child (link styled as button)" demo section so the regression can't return silently.

### Changed

- **WCAG 2.1/2.2 contrast pass on `Badge` and `Button` destructive.** [packages/registry/src/styles.css](packages/registry/src/styles.css), [packages/registry/registry/default/badge/badge.tsx](packages/registry/registry/default/badge/badge.tsx), [packages/registry/registry/default/button/button.tsx](packages/registry/registry/default/button/button.tsx). Audit measured each variant × theme pair against SC 1.4.3 (Contrast Minimum, 4.5:1 for normal text — Badge text is `text-xs` 11px, semibold, classified as normal). Failures and fixes:
  - Badge `success` / `info` / `warning` reused the chroma color for both `bg-X/10` tint and `text-X` — those pairings can never reach 4.5:1 (light: 3.50–2.53:1; dark: 3.24–4.33:1). Added theme-specific `--success-soft-fg` / `--info-soft-fg` / `--warning-soft-fg` / `--destructive-soft-fg` tokens in `:root` (darker) and `.dark` (lighter); badge variants now read `text-success-soft-fg` etc. Resulting contrast: 6.6–7.7:1 light, 7.7–8.4:1 dark.
  - Badge + Button `destructive` shipped white text on `#c8543f` at 4.38:1 — under 4.5:1 in both themes. Added `--destructive-aa: #a8392a` (white-on-it = 6.3:1, same value in both modes); badge and button destructive now use `bg-destructive-aa`. The chroma `--danger` and `--destructive` tokens are unchanged so `MeterRow`/`Alert`/etc. that use `bg-danger` for non-text fills are unaffected.
  - Badge `muted` in dark mode (`stone-400` on `stone-700`) measured 4.24:1; the muted variant now bumps to `dark:text-stone-300` (~7.3:1).
  - Card boundary contrast (currently `border-border/70` ≈ 1.18:1 light / `dark:border-border` ≈ 1.47:1 dark) is a known gap against SC 1.4.11's 3:1 but was intentionally **not** changed in this pass — the card boundary is decorative and the visual treatment was preferred over strict compliance. Revisit if/when stricter accessibility is required.
  - Non-breaking: variant names, props, and component APIs are unchanged. Visual change is intentional (slightly darker destructive red, slightly different soft-badge text color). The chroma tokens themselves (`--success`, `--info`, `--warning`, `--danger`, `--destructive`, `--border`) are untouched, so any consumer using `text-success`, `bg-warning`, etc. directly is unaffected.
- **`MeterRow.label` is now optional; the label-row container is skipped when both `label` and `valueLabel` are absent.** [packages/registry/registry/default/meter-row/meter-row.tsx](packages/registry/registry/default/meter-row/meter-row.tsx) — `label?: ReactNode`. Previously `label` was required, and even when callers passed `label={null}` the component still rendered the `flex items-center justify-between gap-2 text-sm` wrapper plus the outer `space-y-1` gap, producing ~24px of phantom blank space above the bar. The container now renders only when `label != null || valueLabel !== undefined`, and the outer wrapper drops `space-y-1` in the labelless case so the bar sits flush against its parent. Existing callers with a label keep working unchanged. Closes the consumer gap that forced labelless tone-aware progress bars to stay hand-rolled (e.g. compact list-row indicators next to a separately-rendered count, KPI metric tiles where the label is shown above by the wrapper). Non-breaking.
- **npm package renamed: `@pandaworks-sw/ui` → `@pandaworks-sw/lucid-ui` (BREAKING).** [packages/registry/package.json](packages/registry/package.json) — the package name now matches the `lucid-ui` repo it ships from, so the brand and the npm name no longer drift. The previous `@pandaworks-sw/ui` package on GitHub Packages stops receiving updates at v0.1.4; v0.2.0 is the first release under the new name. No source code, exports, or styling tokens change — only the package name and subpath import paths.
  - **Migration:**
    1. `package.json`: replace `"@pandaworks-sw/ui": "<old>"` with `"@pandaworks-sw/lucid-ui": "^0.2.0"`.
    2. Imports: rewrite every `from '@pandaworks-sw/ui'` → `from '@pandaworks-sw/lucid-ui'`. Stylesheet too: `@import "@pandaworks-sw/ui/styles.css"` → `@import "@pandaworks-sw/lucid-ui/styles.css"`.
    3. Tailwind v4 `@source`: `@source "../node_modules/@pandaworks-sw/ui"` → `@source "../node_modules/@pandaworks-sw/lucid-ui"`.
    4. `.npmrc` is unchanged (the scope `@pandaworks-sw` is the same; only the package within the scope changed).
    5. `pnpm install` to refresh the lockfile.

### Added

- **`MultiStatCard` component.** [packages/registry/registry/default/multi-stat-card/multi-stat-card.tsx](packages/registry/registry/default/multi-stat-card/multi-stat-card.tsx) — renders 2+ related stat metrics inside a single card with dividers between cells (vertical dividers when `orientation="horizontal"`, the default; horizontal dividers when `orientation="vertical"`). Each cell mirrors `StatCard` (icon + label, animated headline value, optional hint and delta chip) and shares its design tokens, headline auto-shrink heuristic, and delta-chip rendering via a new sibling [packages/registry/registry/default/stat-card/stat-card-shared.ts](packages/registry/registry/default/stat-card/stat-card-shared.ts) module. Per-cell shape is `MultiStatCardItem` — a subset of `StatCardProps` minus `className`: `icon`, `label`, `value`, `prefix`, `suffix`, `decimals`, `formatter`, `hint`, `delta`, `deltaTone`. Cells use `flex-1 min-w-0` so widths split evenly and long values still shrink. Use it for funnel metrics (Total / In Progress / Completed), date pairs (Form Start / Submission Due), or any "metrics that belong together" cluster you don't want broken across separate tiles. When mixing into a grid of single `StatCard`s, give the `MultiStatCard` a `col-span` equal to its cell count so the row stays balanced. The showcase ships a dedicated demo page with funnel, deltas, two-cell, vertical-orientation, and mixed-grid examples.

### Changed

- **Extracted `StatCard` helpers into a shared module.** [packages/registry/registry/default/stat-card/stat-card.tsx](packages/registry/registry/default/stat-card/stat-card.tsx) now imports `DeltaTone`, `DELTA_VARIANT`, `DELTA_ICON`, `getHeadlineSizeClass`, and `getRenderedLength` from the new sibling [packages/registry/registry/default/stat-card/stat-card-shared.ts](packages/registry/registry/default/stat-card/stat-card-shared.ts) so `MultiStatCard` (added today) can share the exact same heuristics. No public API change and no behavior change for existing `StatCard` usage; the helpers themselves are not exported from the package barrel.

- **`StatCard` `value` accepts strings.** [packages/registry/registry/default/stat-card/stat-card.tsx](packages/registry/registry/default/stat-card/stat-card.tsx) — `value` is widened from `number` to `number | string`. Numeric values keep the existing `AnimatedNumber` path with `prefix` / `suffix` / `decimals` / `formatter` adornments; string values render as-is, so tiles can show `"N/A"`, `"—"`, `"Active"`, `"Enterprise"`, `"8 / 10"`, or pre-formatted currency without dropping back to a custom `Card`. `prefix`, `suffix`, `decimals`, and `formatter` are ignored when `value` is a string (strings are assumed already-formatted). `hint`, `delta`, and `deltaTone` continue to work for both forms. Non-breaking: existing numeric call sites are unchanged. The showcase page picks up a new "String values" demo.
- **`StatCard` headline auto-shrinks for long values.** [packages/registry/registry/default/stat-card/stat-card.tsx](packages/registry/registry/default/stat-card/stat-card.tsx) — the headline class steps down by rendered length: `≤10 chars → text-xl`, `≤16 → text-lg`, `≤24 → text-base`, `>24 → text-sm`. Length is computed from the string for string values, from `formatter(value)` when a formatter is provided, and from `prefix + integer digits + decimals + suffix` for plain numbers. Pure CSS, no measurement or `ResizeObserver`, so zero runtime cost. The wrapper now also gets `min-w-0` so it can shrink inside narrower grid columns. Short numeric values (the common case) are unchanged. The showcase page picks up a new "Auto-shrink for long values" demo.

## 2026-05-01

### Added

- **`useIsCompactDesktop` hook.** New export from `@/hooks/use-mobile` (also re-exported via the app-shell barrel). Returns `true` when the viewport is in the 768–1023px range. AppShell uses it internally for responsive sidebar auto-collapse; consumers can use it for parallel responsive logic.
- **`getInitialName` utility + `AvatarFallback` auto-converts full names.** New helper [packages/registry/src/lib/get-initial-name.ts](packages/registry/src/lib/get-initial-name.ts) exported from `@pandaworks-sw/ui` (and from the registry's internal `@/lib` alias). Pass any string — including a full name — to `<AvatarFallback>` and it now renders a 2-character monogram automatically: `"John Doe" → "JD"`, `"Devi Marasinghe" → "DM"` (first + last), `"Eli" → "EL"` (first 2 chars of single-word names). Already-short strings like `"JD"` or `"+3"` pass through unchanged. Callers that previously hand-wrote a `getInitials` helper (e.g. `app-shell.tsx`) can drop it and pass `user.name` directly.
- **Demo registry alias `@/lib` is now a folder alias.** [apps/demo/vite.config.ts](apps/demo/vite.config.ts) replaces the file-specific `@/lib/utils` alias with a folder-level `@/lib` alias pointing at `packages/registry/src/lib/`. Existing `import { cn } from '@/lib/utils'` still resolves; new `import { cn, getInitialName } from '@/lib'` is the preferred form for registry source files.

### Changed

- **`AvatarFallback` colorize default flipped to `true` (BREAKING for consumers relying on the previous gray default).** The `colorize` prop on [packages/registry/registry/default/avatar/avatar.tsx](packages/registry/registry/default/avatar/avatar.tsx) now defaults to `true`, so `<AvatarFallback>John Doe</AvatarFallback>` renders a deterministically colored monogram out of the box. Pass `colorize={false}` to opt back into the muted (`bg-muted`) look — useful for `+N` overflow tiles, system placeholders, and other non-name fallbacks. The `+N` overflow tile inside [packages/registry/registry/default/avatar-group/avatar-group.tsx](packages/registry/registry/default/avatar-group/avatar-group.tsx) is updated to set `colorize={false}` so it keeps its neutral background.
  - **Migration:** if you previously relied on the default gray fallback for arbitrary text content, add `colorize={false}` to those `AvatarFallback` instances. Name-based avatars need no change.

### Fixed

- **AppShell: handle small screens (mobile view).** Three mobile/compact-viewport UX bugs in [packages/registry/registry/default/app-shell/app-shell.tsx](packages/registry/registry/default/app-shell/app-shell.tsx):
  1. **Mobile Sheet sidebar didn't auto-close on navigation.** When a user opened the sidebar Sheet on mobile and tapped a nav link, branding link, or a user-action link, the Sheet stayed open and the route changed underneath it — forcing the user to dismiss it manually. Each link now calls `setOpenMobile(false)` on click via a small `useMobileAutoClose` hook (no-op on desktop).
  2. **Header content could overflow on narrow viewports.** The flex children inside the navbar lacked `min-w-0` / `shrink-0`, so a wide consumer `header` (e.g. a search input with long placeholder text) wrapped or pushed `navbarActions` off-screen instead of shrinking. The header wrapper, the header content slot, the sidebar trigger, the separator, and the navbar-actions slot now have explicit `min-w-0` / `shrink-0` so consumer content shrinks gracefully.
  3. **Sidebar didn't auto-collapse at compact desktop widths (768–1023px).** The full 18rem sidebar squeezed the navbar at tablet sizes (e.g. search input was truncated to "Searc…" at 768px). AppShell now controls `SidebarProvider`'s `open` state via the new `useIsCompactDesktop` hook — the sidebar collapses to icon mode automatically inside the compact range and expands again past 1024px. Mobile (<768px) keeps using the Sheet variant.
- **Saas demo TopBar truncates instead of wraps.** [apps/demo/src/saas/saas-app.tsx](apps/demo/src/saas/saas-app.tsx) — added `min-w-0` + `truncate` to the search-palette label and `shrink-0` to the icon and right-side action cluster so the topbar fits cleanly at 390px without text wrapping.

### Added

- **Package now ships its own design-token stylesheet at `@pandaworks-sw/ui/styles.css`.** New file [packages/registry/src/styles.css](packages/registry/src/styles.css) is the single source of truth for the `:root` / `.dark` token blocks, the `@theme inline` mapping (Tailwind v4 utility generation), the base layer, the `text-display-*` / `text-mono-*` typography utilities, and the `bg-pattern-*` background utilities. [packages/registry/tsup.config.ts](packages/registry/tsup.config.ts) copies it into `dist/styles.css` via an `onSuccess` hook, and [packages/registry/package.json](packages/registry/package.json) adds an `"./styles.css": "./dist/styles.css"` subpath export. Consumers now wire up Tailwind v4 + tokens with one import — no more copying `apps/demo/src/index.css` by hand:
  ```css
  @import "tailwindcss";
  @import "@pandaworks-sw/ui/styles.css";
  @source "../node_modules/@pandaworks-sw/ui";
  ```
  The demo's [apps/demo/src/index.css](apps/demo/src/index.css) was slimmed to import from the package source so demo and package can never drift. [README.md](README.md), [CLAUDE.md](CLAUDE.md), and [public/llms.txt](public/llms.txt) updated with the new wiring instructions

### Removed

- **Unused build output, scripts, and configs.** With the npm package on GitHub Packages now the only distribution channel, the project drops the legacy build artefacts that produced a separate JSON-based component output. Existing apps still vendoring `src/components/lucid/` should migrate by adding `@pandaworks-sw/ui`, running a codemod to rewrite `from '@/components/lucid/<name>'` → `from '@pandaworks-sw/ui'`, and deleting `src/components/lucid/`. Files removed:
  - `public/r/` — entire directory of 61 generated component JSONs
  - `packages/registry/registry.json` and the per-workspace `components.json` files
  - `packages/registry/scripts/rewrite-lucid-namespace.mjs` and `packages/registry/scripts/sync-all-meta.mjs`
  - `packages/registry/registry/default/_all/` — `_all` meta-component (no runtime export)
  - `apps/demo/src/components/install-command.tsx` — demo widget that emitted a copy-paste install command
- Configs updated:
  - root `package.json` — drop `registry:build` script; `build` now runs `@pandaworks-sw/ui build:lib && @pandaworks-sw/demo build`
  - `packages/registry/package.json` — drop `registry:build` script and the `shadcn` devDep; `build` now just runs `tsup`
  - `biome.json` — drop the `!public/r` and `!packages/registry/public/r` ignore entries
  - `.github/workflows/deploy.yml` — drop `public/r` from the Pages-artifact `cp -R`
  - `apps/demo/src/showcase/component-page.tsx` — drop `<InstallCommand />` and the `installName` prop
  - `apps/demo/src/showcase/showcase-app.tsx` — drop the `installName=` arg passed to `<ComponentPage>`
  - `CLAUDE.md` and `README.md` — strip the legacy distribution-channel framing and the `pnpm registry:build` command

### Changed

- **npm package scope: `@lucid/ui` → `@pandaworks-sw/ui`; distribution moved to GitHub Packages.** GitHub Packages requires the npm scope to match the GitHub org owning the repo, so the package was renamed and the repo is moving from `pandaworks-software-plt/lucid-ui` to `pandaworks-sw/lucid-ui`. The demo workspace was renamed from `@lucid/demo` to `@pandaworks-sw/demo` for consistency. `packages/registry/package.json` adds `publishConfig.registry: "https://npm.pkg.github.com"`. New release workflow at [.github/workflows/publish.yml](.github/workflows/publish.yml) publishes the package on every GitHub Release. Consumers must add an `.npmrc` with `@pandaworks-sw:registry=https://npm.pkg.github.com` and a `GITHUB_TOKEN` (PAT with `read:packages`) before `pnpm install`; full setup in [README.md](README.md#installation)
- **Rebrand: Pandaworks UI → Lucid UI.** The npm package was renamed from `@pandaworks-ui/components` to `@lucid/ui` and the demo workspace from `@pandaworks-ui/demo` to `@lucid/demo`. The GitHub repo was renamed from `pandaworks-software-plt/pandaworks-ui` to `pandaworks-software-plt/lucid-ui` (GitHub auto-redirects old URLs). Brand text in the demo (saas-app banner, AI integration prompt, llms.txt header, README) updated accordingly. Internal-only library — no external consumers affected. Older entries in this changelog reference the previous `pandaworks-ui` / `@pandaworks-ui` names; those are kept as historical record

### Added

- npm-package distribution -- the registry now publishes as `@pandaworks-ui/components` (renamed from the previous private `@pandaworks-ui/registry` workspace package). Consumers can `pnpm add @pandaworks-ui/components` and `import { Button, Badge, … } from "@pandaworks-ui/components"`. Build pipeline: new [packages/registry/src/index.ts](packages/registry/src/index.ts) barrel re-exports all 59 component folders + hooks + `cn`; [packages/registry/tsup.config.ts](packages/registry/tsup.config.ts) emits ESM + `.d.ts` to `packages/registry/dist/` (185 KB ESM, 56 KB types, tree-shakeable, `sideEffects: false`); peer deps `react >=19`, `react-dom >=19`, `lucide-react >=0.500`, `react-hook-form >=7`, `tailwindcss >=4`

### Fixed

- Tooling -- removed deprecated `baseUrl` from [packages/registry/tsconfig.json](packages/registry/tsconfig.json) and [apps/demo/tsconfig.app.json](apps/demo/tsconfig.app.json). TypeScript 6.0 flags `baseUrl` as deprecated and 7.0 will drop it entirely; the `paths` entries in both files use relative paths that already resolve against the `tsconfig.json` location, so `baseUrl` was redundant. No build or import behavior changes -- `pnpm -F demo exec tsc --noEmit` still passes clean

### Added

- Demo showcase -- new "Use with AI" view ([apps/demo/src/showcase/ai-integration-view.tsx](apps/demo/src/showcase/ai-integration-view.tsx)) with a one-click copyable prompt that points AI coding agents (Claude Code, Cursor, Copilot, etc.) at `https://pandaworks-software-plt.github.io/pandaworks-ui/llms.txt` as the catalog and tells them how to install and use the npm package. Surfaced as a prominent "Use with AI" card at the top of the showcase sidebar, above the existing SaaS-showcase link

### Fixed

- `EmptyState` -- `EmptyStateProps` now uses `Omit<HTMLAttributes<HTMLDivElement>, "title">` to drop the conflicting HTML `title` attribute. Without this, TypeScript flagged that `title: ReactNode` (the component's prop) was incompatible with the inherited `title?: string`. Demo builds (and the GitHub Pages deploy job) failed with `TS2430` until this was fixed
- `ListRow` -- same `title` collision via the spread on lines 84 and 104. The `rest as ButtonProps` / `rest as DivProps` casts were widening the rest object back to include `title: ReactNode` from `SharedListRowProps`, which then conflicted with the HTML `title?: string` on the underlying `<button>` / `<div>`. The casts now use `Omit<…, keyof SharedListRowProps>` so the spread no longer carries `title`. Same `TS2322` deploy-time failure as above
- `SplitButton` -- new `brand` variant (mirrors `Button`'s `brand`: `bg-brand text-brand-foreground shadow-xs hover:shadow-sm`) plus matching `dividerClasses` entry (`border-l border-brand-foreground/20`). The pure-showcase Projects page already used `<SplitButton variant="brand">` for the "New project" CTA but the variant didn't exist yet, causing `TS2322` in CI

### Changed

- `StatCard` -- now ships at a single SaaS-density size (no `size` prop). Tight `px-4` padding, `text-xs` label, `size-3.5` icon, and a `text-xl` headline number replace the previous `text-3xl` headline, which ate too much screen estate inside real dashboards. **Visual breaking change** — existing `<StatCard … />` usage continues to compile but renders smaller. Audit pages that use it; very sparse grids may need tighter gaps (`gap-4` → `gap-3`) or more tiles to compensate

### Added

- `AvatarFallback` -- new optional `colorize` boolean prop. When set, the background color is derived from the first character of the fallback text (A–Z mapped to 26 evenly spaced OKLCH hues; digits and other characters fall back to a deterministic hash). Foreground is set to white and is readable in both light and dark mode. Default behavior (without `colorize`) is unchanged: `bg-muted` with the inherited foreground
- Demo -- new `/pure-showcase` route alongside `/saas-showcase`. Pure-showcase is a strict-purity rebuild of the SaaS demo using only registry components (no custom UI, no hardcoded palette colors, no inline color overrides). v1 covers Workspace and Projects; remaining tabs link to `/saas-showcase` until the P0 registry gaps are closed
- `docs/REGISTRY-GAPS.md` -- diagnostic report of registry gaps surfaced by pure-showcase: Badge missing semantic-tone variants (P0), Avatar missing square shape and AvatarGroup primitive (P0), recurring patterns to promote (`EmptyState`, `StatCard`, `MeterRow`, `ListRow`), plus `DropdownMenuItem` destructive variant and `CodeLabel` non-copyable mode
- CLAUDE.md -- "Showcase Purity Rules" section codifying the rebuild constraints and the audit grep commands for `apps/demo/src/pure/`
- `Button` sizing guidance (docs only) -- `public/docs/button.md` and CLAUDE.md gain a "Sizing guidance (SaaS consistency)" section that maps scenarios to sizes: `default` for page headers / modal footers / form actions / card-header actions, `sm` for table-row inline actions / list items / filter bars, `lg` reserved for marketing-style hero CTAs, empty states, and onboarding (not used inside CRUD screens). Icon-only sizes track the text variants. No code changes
- `Badge` -- four new semantic-tone variants (`success`, `warning`, `info`, `muted`) keyed off existing `--success` / `--info` / `--warning` / `--muted` tokens, plus an optional `dot` prop that renders a leading status dot tinted to match the variant. Closes G1 in `docs/REGISTRY-GAPS.md`
- `Avatar` -- new `shape` prop (`"circle"` (default) or `"square"`) for entity tiles like project keys; the rounded class propagates into `AvatarFallback` via `rounded-[inherit]` so square avatars stay square while images load. Closes G2
- `AvatarGroup` -- new component that horizontally stacks `Avatar` children with negative spacing, ring against the page background, and a `+N` overflow tile when `max` is exceeded. Inherits per-Avatar `shape`. Sizes: `xs` / `sm` / `md` / `lg`. Closes G3
- `EmptyState` -- new component for filtered tables/lists and "no results" panels with `icon`, `title`, `description`, and `action` slots. Three sizes (`sm` / `md` / `lg`). Closes G4
- `StatCard` -- new component composing `Card` + `AnimatedNumber` + `Badge` for dashboard stat tiles. Props: `icon`, `label`, `value`, `suffix`, `hint`, `delta`, `deltaTone` (`"up"` / `"down"` / `"flat"`). Closes G5
- `DropdownMenuItem` -- new `variant` prop (`"default"` / `"destructive"`); destructive items get red text, red icon, and a tinted destructive focus background. Replaces the `className="text-destructive focus:text-destructive"` workaround. Closes G9
- `CodeLabel` -- new `copyable` boolean prop (default `true`); pass `copyable={false}` for a static inline code chip with no copy affordance. Closes G8
- `MeterRow` -- new component for labeled horizontal bars: label slot (string or Badge node), optional `valueLabel` trailing meta, per-row `tone` (`default` / `success` / `warning` / `info` / `destructive` / `muted`), and three sizes (`sm` / `default` / `lg`). Closes G6
- `ListRow` -- new layout primitive for `leading + title + subtitle + trailing` rows. Renders as a div by default; pass `asButton` for keyboard-accessible interactive rows with focus ring. Density (`sm` / `default` / `lg`) and surface (`plain` / `bordered` / `muted`) variants. Closes G7
- Pure-showcase is now feature-complete -- all six top-level routes (Workspace, Projects, Project detail, Team, Reports, Settings) rebuilt without custom UI components or hardcoded palette colors
- Per-component sizing tables (docs only) -- "Sizing" / "Density" / "Surface" sections added to `Toggle` and `ToggleGroup` ([navigation.md](public/docs/navigation.md)), `EmptyState` ([layout.md](public/docs/layout.md)), `CodeLabel`, `AvatarGroup`, `MeterRow`, `ListRow` ([data-display.md](public/docs/data-display.md)), and `SelectableCard` ([forms.md](public/docs/forms.md)). Each maps real scenarios (table row, filter bar, dashboard card, hero, onboarding) to the right size/density/surface key
- `public/docs/decision-guide.md` -- new top-level decision guide for **variant / tone / surface choices**: Avatar shape (human → `circle`, non-human entity → `square`), Badge tones with `dot` rule, Alert variants, MeterRow tones, ListRow surface, Tabs variant (line vs pill), StatCard `deltaTone`, Modal vs Dialog vs Sheet, text-input choice (Input / Textarea / SearchInput / CodeLabel), dropdown choice (Select vs SelectPicker), date-control choice, boolean / multi-choice rules (Switch vs Checkbox vs RadioGroup vs SelectableCard), AttachmentInput dropzone vs compact, dashboard tile choice (StatCard vs MeterRow vs ListRow vs Card), **the registry's fixed elevation ladder** with a note that `Card` has no `elevation` prop (fixed at `shadow-xs` by design), DropdownMenuItem variant, and labelled vs icon-only Buttons. Linked from the Decision Guide section in `public/llms.txt`

### Fixed

- `Table` -- when nested inside `CardContent`, the table's wrapper drops its own border, rounded corners, `bg-card`, and shadow so the surrounding card frame is the only visual boundary (no more "card within a card"). Standalone `Table` usage is unchanged. `CardContent` now exposes `data-slot="card-content"` to make the nesting detectable
- `AttachmentInput`, `Button`, `SplitButton`, `PaginationEllipsis`, `BreadcrumbEllipsis` -- each now sets `position: relative` on its root so any nested `sr-only` element (which Tailwind renders as `position: absolute`) is contained within the component. Without this, those `sr-only` spans/inputs fell through every ancestor and anchored to the initial containing block (the viewport), stretching the document height and letting pages scroll past the bottom into empty space. `Button` gets the fix at the base (`buttonVariants` / `splitButtonVariants`) so consumers that nest their own `<span className="sr-only">` inside a button (e.g. `FilterButton`, `SidebarTrigger`) inherit the containment automatically

## 2026-04-23

### Added

- Demo -- SaaS-style integrated showcase at `/saas-showcase` (dashboard, projects, tasks, team, reports, settings, command palette, confirm flows) backed by an in-memory demo store
- `pnpm test:ui-audit` -- Playwright script (`scripts/ui-audit-playwright.mjs`) that serves the demo and writes baseline screenshots to `artifacts/playwright-ui-audit/`
- `public/docs/ui-visual-review-checklist.md` -- manual UI review checklist for registry and demo work

### Fixed

- `Tooltip` (`TooltipContent`) -- render through Radix `Portal` so labels escape scrollable or `overflow`/`transform` ancestors (matches `Popover` and avoids clipped or missing tooltips in the shell and demo layouts)

### Changed

- `Stepper` -- compact `size-7` markers and smaller typography; completed steps and completed track segments use emerald instead of primary; current step uses primary border with a subtle ring; optional `orientation="vertical"` for a top-down layout with a left spine; horizontal layout keeps equal `flex-1` segments before, between, and after step indicators; step `description` and `tooltip` popover only show while that step is current; track segments animate a left-to-right (horizontal) or top-to-bottom (vertical) “fill” via `transform`, respecting `prefers-reduced-motion`
- `CodeLabel` -- visual style shifted from outlined to a softer filled background; copy control is hidden by default and smoothly expands/reveals on hover/focus, appears on touch/press for mobile, and remains visible briefly after copy feedback
- `Sheet` (`SheetContent`) -- floating panel styling: viewport inset (`0.75rem`), `rounded-2xl`, stronger shadow, subtle ring, and scroll containment for long content
- `Sheet` -- removed Tailwind `animate-in` / `animate-out` / slide / fade classes on overlay and content (instant show and hide)
- `Button` -- brand, destructive, outline, and secondary variants use lighter elevation (`shadow-xs` / `hover:shadow-sm`) instead of multi-layer custom box shadows
- `Dialog` -- overlay uses `bg-black/50` with a light backdrop blur; content uses `border-border` and `shadow-md`
- `Command` -- root panel adds `border`, `shadow-md`, and Tailwind v4 descendant variants for `cmdk` group headings
- `DropdownMenu`, `Select` -- `border-border`, `min-w-32`, normalized shadows; disabled and placeholder states use `data-disabled` / `data-placeholder` attribute selectors; Select popper sizing uses Tailwind v4 arbitrary `h-(--radix-…)` / `min-w-(--radix-…)` forms
- `Popover` -- explicit `border-border` on content
- `AppShell` -- switched to inset sidebar variant for blended shell styling; inset content container now uses `rounded-3xl` with subtle border layering for a softer frame
- SaaS demo shell (`/saas-showcase`) -- dark radial background depth refined so the page backdrop is darkest, with content surfaces layered above
- Demo theme (`apps/demo/src/index.css`) -- slightly tinted card and popover surfaces; dark mode background and surface layering refined for depth
- Demo theme radius token (`apps/demo/src/index.css`) -- increased global `--radius` from `0.375rem` to `0.75rem` to make default component corners rounder
- Showcase -- richer `Form` demo examples; sidebar entry for the SaaS showcase; small copy and demo tweaks (`PageHeader`, `Sheet` demos)
- Root `package.json` -- dev dependency on Playwright for the UI audit script; demo ESLint config aligned with `typescript-eslint`

## 2026-04-08

### Added

- `DetailPageSidebarSection` sub-component -- GitHub-style sidebar section with header (label + action slot) and free-form children
- `brand` button variant -- blue primary button with inset shadow styling for key actions (create, save)

### Changed

- Merged `pandahrms-ui-registry` and `pandahrms-ui-demo` into `pandaworks-ui` monorepo
- Demo app imports components directly from the registry package (no copy-paste step required)
- GitHub Pages base path changed from `/pandahrms-ui-demo/` to `/pandaworks-ui/`
- `default` button variant reverted to standard shadcn/ui style (`bg-primary shadow-xs hover:bg-primary/90`)
- `create` and `save` action presets now use `brand` variant instead of `default`

## 2026-04-03

### Added

- Barrel `index.ts` exports for 19 components (avatar, badge, button, calendar, card, checkbox, collapsible, command, dialog, dropdown-menu, input, label, popover, separator, sheet, sidebar, toggle, tooltip, app-shell-types)
- `useCopyToClipboard` hook in `src/hooks/`
- `data-slot` attributes across 24 components for better DOM identification

### Changed

- Sonner decoupled from `next-themes` -- no longer requires ThemeProvider, improved type safety and accessibility
- Standardized all component string literals to double quotes
- Improved type safety, reuse, and accessibility across animated-number, app-shell, attachment-input, code-label, date-range-picker, detail-page, filter-bar, pagination, select-picker
- `useMobile` hook updated to use named imports

### Removed

- `pnpm-lock.yaml` from tracking (added to `.gitignore`)
- Unused dev dependencies cleaned up

## 2026-03-31

### Added

- Button `action` prop with 12 presets: create, edit, save, delete, cancel, view, export, import, archive, duplicate, print, link
- Button `icon` prop for custom icon override (any Lucide icon or ElementType)
- Button `tooltip` prop with auto-tooltip for icon-only sizes
- Button `loading` prop with spinner and auto-disable

### Changed

- AlertDialog buttons now use `Button` via `asChild` instead of raw `buttonVariants`

### Removed

- **`action-button` component** -- all 15 files removed (action-button-base, confirmable-action-button, create-button, edit-button, save-button, delete-button, cancel-button, view-button, export-button, import-button, archive-button, duplicate-button, print-button, link-button, and barrel export). Replaced by Button `action` prop.
