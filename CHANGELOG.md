# Changelog

All notable changes to pandaworks-ui will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 2026-04-23

### Added

- Demo -- SaaS-style integrated showcase at `/saas-showcase` (dashboard, projects, tasks, team, reports, settings, command palette, confirm flows) backed by an in-memory demo store
- `pnpm test:ui-audit` -- Playwright script (`scripts/ui-audit-playwright.mjs`) that serves the demo and writes baseline screenshots to `artifacts/playwright-ui-audit/`
- `public/docs/ui-visual-review-checklist.md` -- manual UI review checklist for registry and demo work

### Fixed

- `Tooltip` (`TooltipContent`) -- render through Radix `Portal` so labels escape scrollable or `overflow`/`transform` ancestors (matches `Popover` and avoids clipped or missing tooltips in the shell and demo layouts)

### Changed

- `Stepper` -- horizontal layout uses equal flex segments before, between, and after step indicators so circles and labels sit centered on the track (replacing per-step `flex-1` + trailing connector, which left-aligned markers within each segment)
- `Sheet` (`SheetContent`) -- floating panel styling: viewport inset (`0.75rem`), `rounded-2xl`, stronger shadow, subtle ring, and scroll containment for long content
- `Sheet` -- removed Tailwind `animate-in` / `animate-out` / slide / fade classes on overlay and content (instant show and hide)
- `Button` -- brand, destructive, outline, and secondary variants use lighter elevation (`shadow-xs` / `hover:shadow-sm`) instead of multi-layer custom box shadows
- `Dialog` -- overlay uses `bg-black/50` with a light backdrop blur; content uses `border-border` and `shadow-md`
- `Command` -- root panel adds `border`, `shadow-md`, and Tailwind v4 descendant variants for `cmdk` group headings
- `DropdownMenu`, `Select` -- `border-border`, `min-w-32`, normalized shadows; disabled and placeholder states use `data-disabled` / `data-placeholder` attribute selectors; Select popper sizing uses Tailwind v4 arbitrary `h-(--radix-…)` / `min-w-(--radix-…)` forms
- `Popover` -- explicit `border-border` on content
- Demo theme (`apps/demo/src/index.css`) -- slightly tinted card and popover surfaces; dark mode background and surface layering refined for depth
- Showcase -- richer `Form` demo examples; sidebar entry for the SaaS showcase; small copy and demo tweaks (`PageHeader`, `Sheet` demos)
- Root `package.json` -- dev dependency on Playwright for the UI audit script; demo ESLint config aligned with `typescript-eslint`
- Rebuilt `public/r/*.json` registry bundle outputs from sources (`pnpm registry:build`) and committed the updated JSON artifacts

## 2026-04-08

### Added

- `DetailPageSidebarSection` sub-component -- GitHub-style sidebar section with header (label + action slot) and free-form children
- `brand` button variant -- blue primary button with inset shadow styling for key actions (create, save)

### Changed

- Merged `pandahrms-ui-registry` and `pandahrms-ui-demo` into `pandaworks-ui` monorepo
- Demo app imports components directly from registry package (no more shadcn copy workflow)
- GitHub Pages base path changed from `/pandahrms-ui-demo/` to `/pandaworks-ui/`
- Registry URL changed from `pandahrms-ui-registry` to `pandaworks-ui`
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
