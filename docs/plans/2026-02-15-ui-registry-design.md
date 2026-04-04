# pandahrms-ui-registry Design

## Purpose

A shared shadcn/ui component registry for all Pandahrms frontend projects (Performance, Recruitment, SSO). Single source of truth for UI components, replacing independently maintained duplicates across projects.

## Standards

- shadcn style: default
- Tailwind: v4 (OKLCH color space)
- CSS variables: enabled
- Base color: zinc
- Icons: Lucide
- Distribution: GitHub raw URLs (no hosting)

## Initial Components

- button
- card
- table

## Project Structure

```
pandahrms-ui-registry/
├── registry.json                    # Registry definition
├── registry/
│   └── default/
│       ├── button/
│       │   └── button.tsx
│       ├── card/
│       │   └── card.tsx
│       └── table/
│           └── table.tsx
├── src/
│   ├── globals.css                  # Shared theme (CSS variables, OKLCH)
│   └── lib/
│       └── utils.ts                 # cn() utility
├── public/
│   └── r/                           # Built output (auto-generated, committed)
├── package.json
├── tsconfig.json
├── next.config.ts                   # Minimal, just for shadcn build
└── components.json                  # shadcn config
```

## Theme

Shared globals.css defines design tokens:

- Light and dark mode variables (:root and .dark)
- OKLCH color space
- Shared tokens: primary, secondary, destructive, muted, accent, background, foreground, border, ring, sidebar, chart colors
- Radius: 0.375rem
- Font stack: Inter (sans), JetBrains Mono (mono)

Consuming projects must ensure their globals.css has matching CSS variable names. A reference globals.css is included in the repo.

## Workflow

1. Add/edit components in registry/default/
2. Build with pnpm registry:build
3. Commit and push (including public/r/ output)
4. Consuming projects install via raw GitHub URL

## Consuming

```bash
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/pandaworks-software-plt/pandahrms-ui-registry/main/public/r/button.json
```

## Future

- Add more components as needed
- Custom Pandahrms components (data-table, status-badge, approval-dialog)
- Shared hooks and utilities
