# pandawork-ui

Monorepo containing the shared shadcn/ui component registry and demo showcase for Pandahrms frontend projects. Components are plain React + shadcn/ui that can be consumed by any React frontend project.

## Project Structure

```
pandawork-ui/
  apps/
    demo/              # Vite showcase app (imports directly from registry)
  packages/
    registry/          # Component source files + shadcn build
      registry/
        default/       # Component source files (single source of truth)
      src/
        lib/utils.ts   # shadcn cn() utility
        hooks/         # Shared hooks
      registry.json    # shadcn registry config
      components.json  # shadcn component config
  public/
    r/                 # Built registry JSON output (committed to git)
    llms.txt           # Component index + decision guide + changelog (read this first)
    docs/              # Detailed API docs per component/category (read on demand)
      button.md        # Complex components get dedicated files
      forms.md         # Simple components grouped by category
      ...
```

## Commands

```bash
pnpm dev                     # Start demo dev server
pnpm build                   # Build registry + demo
pnpm registry:build          # Build registry JSON output to public/r/
pnpm lint                    # Lint demo app
```

## How It Works

The demo app imports components directly from the registry package via Vite aliases:
- `@/components/ui/*` resolves to `packages/registry/registry/default/*`
- `@/lib/utils` resolves to `packages/registry/src/lib/utils`
- `@/hooks/*` resolves to `packages/registry/src/hooks/*`

Changes to registry components are immediately reflected in the demo -- no `npx shadcn add` step needed.

## Changelogs

**Every change must be recorded in both changelogs before committing.**

- `CHANGELOG.md` -- human-readable, follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format
- `public/llms.txt` -- contains a "Changelog" section at the bottom with machine-readable per-component entries (`change`, `breaking`, `details`, `action` steps) for AI agents consuming this registry

When committing, update both files under the `[Unreleased]` section. When cutting a release, move unreleased entries under a dated heading (e.g., `## 2026-04-03`).

## Adding a Component

1. Create component in `packages/registry/registry/default/<component>/<component>.tsx`
2. Add barrel `index.ts` exporting from the component file
3. Add entry to `packages/registry/registry.json` items array
4. Run `pnpm registry:build`
5. Add a demo page in `apps/demo/src/showcase/demos/<component>-demo.tsx`
6. Add API docs to the appropriate file in `public/docs/` (dedicated file for complex components, category file for simple ones)
7. Add a catalog entry in `public/llms.txt`
8. Update changelogs (`CHANGELOG.md` and the Changelog section in `public/llms.txt`)
9. Commit everything including `public/r/` output

## Modifying a Component

1. Edit the source file in `packages/registry/registry/default/<component>/`
2. Run `pnpm registry:build`
3. Verify in demo (`pnpm dev`)
4. Update the component's doc file in `public/docs/` if API changed
5. Update changelogs
6. Commit both the source and the rebuilt `public/r/` output

## Consuming

```bash
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/pandaworks-software-plt/pandaworks-ui/main/public/r/<component>.json
```

## Button Action Presets

For standard user actions, use the `action` prop on `Button` instead of manually specifying icons and variants. The `action` prop auto-resolves the correct icon, variant, and label.

| Action | Icon | Default Variant | Auto-Label |
|--------|------|-----------------|------------|
| `create` | Plus | brand | Create |
| `edit` | Pencil | outline | Edit |
| `save` | Save | brand | Save |
| `delete` | Trash2 | destructive | Delete |
| `cancel` | X | outline | Cancel |
| `view` | Eye | ghost | View |
| `export` | Download | outline | Export |
| `import` | Upload | outline | Import |
| `archive` | Archive | secondary | Archive |
| `duplicate` | Copy | outline | Duplicate |
| `print` | Printer | outline | Print |
| `link` | ExternalLink | ghost | Link |

### Additional Button Props

- **`icon`** -- Custom icon override (any Lucide icon or ElementType)
- **`tooltip`** -- Tooltip text (auto-shown for icon-only sizes; uses preset label as fallback)
- **`loading`** -- Shows a spinner, disables the button

## Standards

- Style: default
- Tailwind: v4 (OKLCH color space)
- CSS variables: enabled
- Base color: zinc
- Icons: Lucide
- No `"use client"` directives -- this is not a Next.js project
- No `import * as React from "react"` -- use named imports only (e.g. `import { forwardRef, type MouseEventHandler } from "react"`). With React 19's JSX transform, the namespace import is unnecessary.
