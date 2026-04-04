# Changelog

All notable changes to pandawork-ui will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `brand` button variant -- blue primary button with inset shadow styling for key actions (create, save)

### Changed

- Merged `pandahrms-ui-registry` and `pandahrms-ui-demo` into `pandawork-ui` monorepo
- Demo app imports components directly from registry package (no more shadcn copy workflow)
- GitHub Pages base path changed from `/pandahrms-ui-demo/` to `/pandawork-ui/`
- Registry URL changed from `pandahrms-ui-registry` to `pandawork-ui`
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
