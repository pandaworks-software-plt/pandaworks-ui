# pandahrms-ui-registry Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up a shared shadcn/ui component registry with button, card, and table components, distributed via GitHub raw URLs.

**Architecture:** Minimal Next.js project configured for shadcn registry builds. Components live in `registry/default/`, built to `public/r/` as static JSON. No app routes, no runtime -- purely a build-time registry.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (default style), pnpm

---

### Task 1: Initialize the Next.js project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.gitignore`

**Step 1: Clone the repo and initialize**

```bash
cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry
git clone https://github.com/pandaworks-software-plt/pandahrms-ui-registry.git .
```

Note: If the repo is already cloned or the directory has content, skip the clone.

**Step 2: Create the Next.js project**

```bash
cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry
pnpm init
pnpm add next@latest react@latest react-dom@latest typescript@latest @types/react@latest @types/node@latest tailwindcss@latest
pnpm add -D @tailwindcss/postcss@latest postcss@latest
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    },
    "baseUrl": "."
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 4: Create next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

**Step 5: Create minimal app entry (required by Next.js)**

Create `src/app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/page.tsx`:

```tsx
export default function Page() {
  return <div>pandahrms-ui-registry</div>;
}
```

**Step 6: Create .gitignore**

```
node_modules/
.next/
```

Note: Do NOT add `public/r/` to .gitignore -- the built registry output must be committed.

**Step 7: Create postcss.config.mjs**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

**Step 8: Verify the project starts**

```bash
pnpm dev
```

Expected: Next.js starts on localhost:3000 without errors. Stop the dev server after verifying.

**Step 9: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js project for registry"
```

---

### Task 2: Configure shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/globals.css`
- Create: `src/lib/utils.ts`

**Step 1: Install shadcn CLI and dependencies**

```bash
pnpm add shadcn@latest
pnpm add tailwind-merge clsx class-variance-authority @radix-ui/react-slot lucide-react
```

**Step 2: Create components.json**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

**Step 3: Create src/lib/utils.ts**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Step 4: Create src/globals.css**

This is the shared theme file. Copy the OKLCH color tokens from the Performance project, cleaned up (no project-specific animations like drag-lift, ProseMirror styles, etc.). Keep only the core design tokens.

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-gray-200, currentcolor);
  }
}

@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.3211 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.3211 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.3211 0 0);
    --primary: oklch(0.6231 0.188 259.8145);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.967 0.0029 264.5419);
    --secondary-foreground: oklch(0.4461 0.0263 256.8018);
    --muted: oklch(0.9846 0.0017 247.8389);
    --muted-foreground: oklch(0.551 0.0234 264.3637);
    --accent: oklch(0.9514 0.025 236.8242);
    --accent-foreground: oklch(0.3791 0.1378 265.5222);
    --destructive: oklch(0.6368 0.2078 25.3313);
    --destructive-foreground: oklch(1 0 0);
    --border: oklch(0.9276 0.0058 264.5313);
    --input: oklch(0.9276 0.0058 264.5313);
    --ring: oklch(0.6231 0.188 259.8145);
    --chart-1: oklch(0.6231 0.188 259.8145);
    --chart-2: oklch(0.5461 0.2152 262.8809);
    --chart-3: oklch(0.4882 0.2172 264.3763);
    --chart-4: oklch(0.4244 0.1809 265.6377);
    --chart-5: oklch(0.3791 0.1378 265.5222);
    --sidebar-background: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
    --font-sans: Inter, sans-serif;
    --font-mono: JetBrains Mono, monospace;
    --radius: 0.375rem;
  }

  .dark {
    --background: oklch(0.2046 0 0);
    --foreground: oklch(0.9219 0 0);
    --card: oklch(0.2046 0 0);
    --card-foreground: oklch(0.9219 0 0);
    --popover: oklch(0.2046 0 0);
    --popover-foreground: oklch(0.9219 0 0);
    --primary: oklch(0.6231 0.188 259.8145);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.2686 0 0);
    --secondary-foreground: oklch(0.9219 0 0);
    --muted: oklch(0.2686 0 0);
    --muted-foreground: oklch(0.7155 0 0);
    --accent: oklch(0.3791 0.1378 265.5222);
    --accent-foreground: oklch(0.8823 0.0571 254.1284);
    --destructive: oklch(0.6368 0.2078 25.3313);
    --destructive-foreground: oklch(1 0 0);
    --border: oklch(0.3715 0 0);
    --input: oklch(0.3715 0 0);
    --ring: oklch(0.6231 0.188 259.8145);
    --chart-1: oklch(0.7137 0.1434 254.624);
    --chart-2: oklch(0.6231 0.188 259.8145);
    --chart-3: oklch(0.5461 0.2152 262.8809);
    --chart-4: oklch(0.4882 0.2172 264.3763);
    --chart-5: oklch(0.4244 0.1809 265.6377);
    --sidebar-background: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.439 0 0);
    --font-sans: Inter, sans-serif;
    --font-mono: JetBrains Mono, monospace;
    --radius: 0.375rem;
  }

  @theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-destructive-foreground: var(--destructive-foreground);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-chart-1: var(--chart-1);
    --color-chart-2: var(--chart-2);
    --color-chart-3: var(--chart-3);
    --color-chart-4: var(--chart-4);
    --color-chart-5: var(--chart-5);
    --color-sidebar: var(--sidebar-background);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-ring: var(--sidebar-ring);

    --font-sans: var(--font-sans);
    --font-mono: var(--font-mono);

    --radius-sm: calc(var(--radius) - 4px);
    --radius-md: calc(var(--radius) - 2px);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) + 4px);
  }
}
```

**Step 5: Import globals.css in layout**

Update `src/app/layout.tsx`:

```tsx
import "@/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: configure shadcn/ui with default style and shared theme"
```

---

### Task 3: Add registry components (button, card, table)

**Files:**
- Create: `registry/default/button/button.tsx`
- Create: `registry/default/card/card.tsx`
- Create: `registry/default/table/table.tsx`

**Step 1: Install the components via shadcn CLI into the project first**

This gets us the canonical default-style components:

```bash
pnpm dlx shadcn@latest add button card table
```

This installs them to `src/components/ui/`. We will use these as the source to create our registry copies.

**Step 2: Create registry directory structure**

```bash
mkdir -p registry/default/button
mkdir -p registry/default/card
mkdir -p registry/default/table
```

**Step 3: Copy components to registry directory**

Copy each component from `src/components/ui/` to the corresponding `registry/default/` path. Update import paths from `@/lib/utils` to `@/registry/default/lib/utils` or keep them as `@/lib/utils` (the CLI will resolve these at install time).

- `src/components/ui/button.tsx` -> `registry/default/button/button.tsx`
- `src/components/ui/card.tsx` -> `registry/default/card/card.tsx`
- `src/components/ui/table.tsx` -> `registry/default/table/table.tsx`

Keep the import paths as `@/lib/utils` -- the shadcn CLI resolves these based on the consumer's `components.json` aliases.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add button, card, and table components to registry"
```

---

### Task 4: Create registry.json and configure build

**Files:**
- Create: `registry.json`
- Modify: `package.json` (add registry:build script)

**Step 1: Create registry.json**

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "pandahrms-ui",
  "homepage": "https://github.com/pandaworks-software-plt/pandahrms-ui-registry",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "description": "A button component with multiple variants and sizes.",
      "dependencies": [
        "@radix-ui/react-slot",
        "class-variance-authority"
      ],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/default/button/button.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "card",
      "type": "registry:ui",
      "title": "Card",
      "description": "A card container component with header, content, and footer sections.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/default/card/card.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "table",
      "type": "registry:ui",
      "title": "Table",
      "description": "A table component with header, body, row, and cell sub-components.",
      "dependencies": [],
      "registryDependencies": [],
      "files": [
        {
          "path": "registry/default/table/table.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

**Step 2: Add build script to package.json**

Add to the `scripts` section:

```json
{
  "scripts": {
    "registry:build": "shadcn build"
  }
}
```

**Step 3: Build the registry**

```bash
pnpm registry:build
```

Expected: JSON files generated at `public/r/button.json`, `public/r/card.json`, `public/r/table.json`.

**Step 4: Verify the build output**

Check that each JSON file in `public/r/` contains valid JSON with the component source code embedded. Example check:

```bash
cat public/r/button.json | head -20
```

Expected: JSON with `name`, `type`, `files` array containing embedded source code.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: configure registry build and generate initial output"
```

---

### Task 5: Push to GitHub and verify consumption

**Step 1: Push to remote**

```bash
git push -u origin main
```

**Step 2: Test consuming from a fresh location**

Create a temporary test directory to verify the registry works:

```bash
cd /tmp
mkdir test-registry-consumer && cd test-registry-consumer
pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

Then try installing from the registry:

```bash
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/pandaworks-software-plt/pandahrms-ui-registry/main/public/r/button.json
```

Expected: Button component installed to `src/components/ui/button.tsx` in the test project.

**Step 3: Clean up test directory**

```bash
rm -rf /tmp/test-registry-consumer
```

**Step 4: Final commit with any fixes**

If any issues were found during testing, fix and commit.

---

### Task 6: Add CLAUDE.md for the registry project

**Files:**
- Create: `CLAUDE.md`

**Step 1: Create CLAUDE.md**

```markdown
# pandahrms-ui-registry

Shared shadcn/ui component registry for Pandahrms frontend projects.

## Commands

```bash
pnpm registry:build          # Build registry JSON output to public/r/
pnpm dev                     # Start dev server (for local testing)
```

## Adding a Component

1. Install via shadcn CLI: `pnpm dlx shadcn@latest add <component>`
2. Copy from `src/components/ui/` to `registry/default/<component>/`
3. Add entry to `registry.json` items array
4. Run `pnpm registry:build`
5. Commit everything including `public/r/` output

## Consuming

```bash
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/pandaworks-software-plt/pandahrms-ui-registry/main/public/r/<component>.json
```

## Standards

- Style: default
- Tailwind: v4 (OKLCH color space)
- CSS variables: enabled
- Base color: zinc
- Icons: Lucide
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md for registry project"
```

---

## Summary of Commits

1. `chore: initialize Next.js project for registry`
2. `chore: configure shadcn/ui with default style and shared theme`
3. `feat: add button, card, and table components to registry`
4. `feat: configure registry build and generate initial output`
5. `docs: add CLAUDE.md for registry project`
6. Final push to GitHub
