# Monorepo Merge Design: pandawork-ui

**Date:** 2026-04-04
**Status:** Approved

## Goal

Merge `pandahrms-ui-registry` and `pandahrms-ui-demo` into a single pnpm workspace monorepo named `pandawork-ui`.

## Approach

Fresh monorepo (Approach A). Create new repo structure, move files from both projects. Old repos remain as archives for history reference.

## Structure

```
pandawork-ui/
├── apps/
│   └── demo/                      # Vite showcase app
│       ├── src/
│       │   ├── main.tsx
│       │   ├── index.css
│       │   ├── components/
│       │   │   ├── theme-toggle.tsx
│       │   │   └── install-command.tsx
│       │   ├── showcase/
│       │   │   ├── showcase-app.tsx
│       │   │   ├── showcase-sidebar.tsx
│       │   │   ├── component-page.tsx
│       │   │   └── demos/         # 56 demo files
│       │   ├── hooks/
│       │   └── lib/
│       │       └── utils.ts
│       ├── public/
│       ├── index.html
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── components.json
│       └── package.json
│
├── packages/
│   └── registry/                  # Component source of truth
│       ├── registry/
│       │   └── default/           # 58 component dirs
│       ├── src/
│       │   ├── lib/utils.ts
│       │   └── hooks/
│       ├── registry.json
│       ├── components.json
│       ├── tsconfig.json
│       └── package.json
│
├── public/
│   ├── r/                         # Built registry JSON output
│   └── llms.txt
├── package.json                   # Workspace root
├── pnpm-workspace.yaml
├── CLAUDE.md
├── CHANGELOG.md
└── .github/
    └── workflows/
        └── deploy.yml
```

## Key Decisions

### 1. Direct workspace imports (no more shadcn copy)

Demo imports components directly from the registry package via workspace dependency. No `npx shadcn add` needed for the demo -- changes reflect instantly.

### 2. Registry build output stays at repo root

`public/r/` remains at repo root since GitHub raw URLs serve from there for external consumers.

### 3. Demo drops its own components/ui/

The 55 component copies in `apps/demo/src/components/ui/` are removed. Demo imports from the registry package. Only demo-specific files remain (theme-toggle, install-command).

### 4. GitHub Pages base path

Changes from `/pandahrms-ui-demo/` to `/pandawork-ui/`.

### 5. Package naming

- Root workspace: `pandawork-ui`
- Registry package: `@pandawork-ui/registry`
- Demo app: `@pandawork-ui/demo`

### 6. Dependency strategy

Registry package owns all component dependencies (React, Radix, etc.). Demo depends on the registry as a workspace package.

## Impact on External Consumers

Registry URL changes:
```
# Old
.../pandahrms-ui-registry/main/public/r/{name}.json

# New
.../pandawork-ui/main/public/r/{name}.json
```

Projects that need `components.json` updated:
- Pandahrms-Performance
- Pandahrms-Recruitment
- pandahrms-sso
- pandaworks-app (if applicable)
