# pandawork-ui Monorepo Merge Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Merge pandahrms-ui-registry and pandahrms-ui-demo into a single pnpm workspace monorepo named `pandawork-ui`.

**Architecture:** Fresh monorepo with `apps/demo` (Vite showcase) and `packages/registry` (component source + shadcn build). Demo imports components directly from the registry package via Vite alias, eliminating the copy-based workflow.

**Tech Stack:** pnpm workspaces, Vite 8, React 19, Tailwind CSS 4, shadcn CLI, TypeScript 5.9

**Source repos:**
- Registry: `/Users/kyson/Developer/pandaworks/_pandahrms/pandahrms-ui-registry`
- Demo: `/Users/kyson/Developer/pandaworks/_pandahrms/pandahrms-ui-demo`

**Target:** `/Users/kyson/Developer/pandaworks/_pandahrms/pandawork-ui`

---

### Task 1: Create monorepo root

**Files:**
- Create: `pandawork-ui/package.json`
- Create: `pandawork-ui/pnpm-workspace.yaml`
- Create: `pandawork-ui/.gitignore`

**Step 1: Create directory and init git**

```bash
cd /Users/kyson/Developer/pandaworks/_pandahrms
mkdir pandawork-ui
cd pandawork-ui
git init
```

**Step 2: Create root package.json**

```json
{
  "name": "pandawork-ui",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@10.11.0",
  "scripts": {
    "dev": "pnpm --filter @pandawork-ui/demo dev",
    "build": "pnpm registry:build && pnpm --filter @pandawork-ui/demo build",
    "registry:build": "pnpm --filter @pandawork-ui/registry registry:build",
    "lint": "pnpm --filter @pandawork-ui/demo lint"
  }
}
```

**Step 3: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"

approveBuilds: esbuild
onlyBuiltDependencies: esbuild
```

**Step 4: Create .gitignore**

Copy from registry's .gitignore, keeping the same entries.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: init pandawork-ui monorepo"
```

---

### Task 2: Move registry into packages/registry

**Files:**
- Create: `packages/registry/package.json`
- Copy: `packages/registry/registry/` (from source `registry/`)
- Copy: `packages/registry/src/` (from source `src/`)
- Copy: `packages/registry/registry.json`
- Copy: `packages/registry/components.json`
- Copy: `packages/registry/tsconfig.json`
- Copy: `public/r/` (from source `public/r/`)
- Copy: `public/llms.txt` (from source `public/llms.txt`)

**Step 1: Create packages/registry directory and copy source files**

```bash
mkdir -p packages/registry
# Copy component sources
cp -r ../pandahrms-ui-registry/registry packages/registry/
cp -r ../pandahrms-ui-registry/src packages/registry/
cp ../pandahrms-ui-registry/registry.json packages/registry/
cp ../pandahrms-ui-registry/components.json packages/registry/
cp ../pandahrms-ui-registry/tsconfig.json packages/registry/

# Copy built output to root public/
cp -r ../pandahrms-ui-registry/public .
```

**Step 2: Create packages/registry/package.json**

```json
{
  "name": "@pandawork-ui/registry",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "registry:build": "shadcn build"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.577.0",
    "react": "^19.2.4",
    "react-day-picker": "^9.14.0",
    "react-dom": "^19.2.4",
    "react-hook-form": "^7.71.2",
    "shadcn": "^3.8.4",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.1.18"
  },
  "devDependencies": {
    "@types/node": "^25.2.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "typescript": "^5.9.3"
  }
}
```

Note: Use the higher version of each dep where registry and demo differ (e.g., lucide-react 0.577.0, tailwind-merge 3.5.0, react-day-picker 9.14.0).

**Step 3: Update packages/registry/components.json**

The `shadcn build` command needs to output to the root `public/r/` directory. Update the components.json or check if shadcn build supports an output dir flag. If not, we may need a wrapper script that moves output. For now keep as-is and handle output path in Task 6.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add registry package with component sources"
```

---

### Task 3: Move demo into apps/demo

**Files:**
- Create: `apps/demo/package.json`
- Copy: `apps/demo/src/` (from demo, excluding `src/components/ui/`)
- Copy: `apps/demo/public/`
- Copy: `apps/demo/index.html`
- Copy: `apps/demo/vite.config.ts`
- Copy: `apps/demo/tsconfig.json`
- Copy: `apps/demo/tsconfig.app.json`
- Copy: `apps/demo/tsconfig.node.json`
- Copy: `apps/demo/eslint.config.js`
- Copy: `apps/demo/components.json`

**Step 1: Create apps/demo directory and copy files**

```bash
mkdir -p apps/demo
# Copy config files
cp ../pandahrms-ui-demo/index.html apps/demo/
cp ../pandahrms-ui-demo/vite.config.ts apps/demo/
cp ../pandahrms-ui-demo/tsconfig.json apps/demo/
cp ../pandahrms-ui-demo/tsconfig.app.json apps/demo/
cp ../pandahrms-ui-demo/tsconfig.node.json apps/demo/
cp ../pandahrms-ui-demo/eslint.config.js apps/demo/
cp ../pandahrms-ui-demo/components.json apps/demo/

# Copy public assets (NOT component JSON - that's at root)
cp -r ../pandahrms-ui-demo/public apps/demo/

# Copy src but NOT components/ui (we'll import from registry)
cp -r ../pandahrms-ui-demo/src apps/demo/
rm -rf apps/demo/src/components/ui
```

**Step 2: Keep demo-specific components**

The demo has two non-registry components in `src/components/`:
- `theme-toggle.tsx`
- `install-command.tsx`

These should stay in `apps/demo/src/components/`. They were NOT in `src/components/ui/` so the rm above won't delete them.

**Step 3: Also keep `src/lib/utils.ts` and `src/hooks/use-mobile.ts`**

These exist in both projects. The demo's copies should be removed since they'll be imported from the registry. But the demo imports these as `@/lib/utils` and `@/hooks/use-mobile`. We'll handle the aliasing in Task 5.

Actually, keep the demo's `src/lib/utils.ts` for now -- it's a simple cn() helper and ensures the demo can build independently. Remove it in Task 5 if aliasing works.

**Step 4: Create apps/demo/package.json**

```json
{
  "name": "@pandawork-ui/demo",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@pandawork-ui/registry": "workspace:*",
    "next-themes": "^0.4.6",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@tailwindcss/vite": "^4.2.1",
    "@types/node": "^24.12.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.0",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "tailwindcss": "^4.2.1",
    "typescript": "~5.9.3",
    "vite": "^8.0.0"
  }
}
```

Key change: component deps (Radix, lucide, etc.) removed from demo -- they come transitively from `@pandawork-ui/registry`.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add demo app with showcase pages"
```

---

### Task 4: Add barrel index.ts to all registry component dirs

The demo imports `@/components/ui/button` which needs to resolve to a directory with an index.ts. Some registry component dirs already have index.ts (19 of them per changelog), the rest need one.

**Step 1: Check which component dirs already have index.ts**

```bash
find packages/registry/registry/default -name "index.ts" -type f
```

**Step 2: For each component dir WITHOUT index.ts, create one**

Each index.ts re-exports everything from the main component file. Pattern:

```typescript
// packages/registry/registry/default/<name>/index.ts
export * from "./<name>"
```

For components with multiple files (e.g., app-shell has app-shell.tsx, app-shell-types.ts, sidebar.tsx, use-mobile.ts), the index.ts should export from all public files.

Run a script to generate missing barrel files:

```bash
cd packages/registry/registry/default
for dir in */; do
  name="${dir%/}"
  if [ ! -f "$dir/index.ts" ]; then
    echo "export * from \"./$name\"" > "$dir/index.ts"
  fi
done
```

**Step 3: Handle multi-file components manually**

Check these known multi-file components and ensure their index.ts exports are complete:
- `app-shell/` (app-shell.tsx, app-shell-types.ts, sidebar.tsx, use-mobile.ts)
- `form/` (form.tsx -- may depend on react-hook-form re-exports)

Read each multi-file component dir and create appropriate barrel exports.

**Step 4: Verify TypeScript resolves**

```bash
cd packages/registry
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add barrel exports to all registry component dirs"
```

---

### Task 5: Configure demo to import from registry

**Files:**
- Modify: `apps/demo/vite.config.ts`
- Modify: `apps/demo/tsconfig.app.json`
- Remove: `apps/demo/src/lib/utils.ts` (use registry's)
- Remove: `apps/demo/src/hooks/use-mobile.ts` (use registry's)

**Step 1: Update apps/demo/vite.config.ts**

```typescript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  base: "/pandawork-ui/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@/components/ui": path.resolve(__dirname, "../../packages/registry/registry/default"),
      "@/lib/utils": path.resolve(__dirname, "../../packages/registry/src/lib/utils"),
      "@/hooks": path.resolve(__dirname, "../../packages/registry/src/hooks"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

Important: `@/components/ui` alias must come BEFORE the general `@` alias so it takes priority. The demo's own `@/components/theme-toggle` and `@/components/install-command` still resolve via the general `@` alias.

**Step 2: Update apps/demo/tsconfig.app.json paths**

```json
{
  "compilerOptions": {
    ...existing options...
    "baseUrl": ".",
    "paths": {
      "@/components/ui/*": ["../../packages/registry/registry/default/*"],
      "@/lib/utils": ["../../packages/registry/src/lib/utils"],
      "@/hooks/*": ["../../packages/registry/src/hooks/*"],
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

**Step 3: Remove duplicate utility files from demo**

```bash
rm apps/demo/src/lib/utils.ts
rm apps/demo/src/hooks/use-mobile.ts
```

If `src/lib/` or `src/hooks/` directories are now empty, remove them. But check first -- the demo may have other files there.

**Step 4: Verify demo builds**

```bash
cd apps/demo
pnpm dev
# Check browser -- components should render
# Ctrl+C
pnpm build
```

Expected: Build succeeds with no TypeScript or Vite errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire demo imports to registry via workspace aliases"
```

---

### Task 6: Configure registry build output path

The `shadcn build` command in the registry package needs to output to the monorepo root's `public/r/` directory.

**Step 1: Check shadcn build output configuration**

Read `packages/registry/components.json` and `packages/registry/registry.json` to understand where `shadcn build` outputs. The shadcn CLI may use a `--output` flag or config field.

If shadcn build always outputs to `./public/r/` relative to the package:
- Option A: Change the registry:build script to move output after build
- Option B: Symlink `packages/registry/public` to root `public`

**Step 2: Update registry:build script**

If output path can't be configured, update `packages/registry/package.json`:

```json
{
  "scripts": {
    "registry:build": "shadcn build && cp -r public/r ../../public/r && cp public/llms.txt ../../public/llms.txt"
  }
}
```

Or better: update the root script to handle this:

```json
{
  "scripts": {
    "registry:build": "pnpm --filter @pandawork-ui/registry registry:build"
  }
}
```

And in the registry package, check if `shadcn build` has an `--outDir` option. If so, use `shadcn build --outDir ../../public`.

**Step 3: Test registry build**

```bash
cd /path/to/pandawork-ui
pnpm registry:build
ls public/r/
# Should contain all component JSON files
```

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: configure registry build output to root public/"
```

---

### Task 7: Update GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create the workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm --filter @pandawork-ui/demo build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: apps/demo/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Commit**

```bash
git add -A
git commit -m "ci: add GitHub Pages deploy workflow for demo app"
```

---

### Task 8: Update demo components.json registry URL

**Files:**
- Modify: `apps/demo/components.json`

**Step 1: Update the registry URL**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
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
  "iconLibrary": "lucide",
  "registries": {
    "@pandawork": {
      "url": "https://raw.githubusercontent.com/pandaworks-software-plt/pandawork-ui/main/public/r/{name}.json"
    }
  }
}
```

Note: Registry key changes from `@pandahrms` to `@pandawork`.

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: update registry URL to pandawork-ui repo"
```

---

### Task 9: Add CLAUDE.md and update changelogs

**Files:**
- Create: `CLAUDE.md`
- Copy + update: `CHANGELOG.md`

**Step 1: Create root CLAUDE.md**

Update from the existing registry CLAUDE.md, reflecting the new monorepo structure. Key changes:
- Project name: `pandawork-ui`
- Structure section: describe `apps/demo` and `packages/registry`
- Commands section: root-level scripts (`pnpm dev`, `pnpm registry:build`, `pnpm build`)
- Adding a component: same workflow but note direct imports in demo
- Modifying a component: no more `npx shadcn add` -- demo picks up changes automatically
- Standards section: keep as-is

**Step 2: Copy and update CHANGELOG.md**

```bash
cp ../pandahrms-ui-registry/CHANGELOG.md .
```

Add an entry under `[Unreleased]`:

```markdown
### Changed

- Merged `pandahrms-ui-registry` and `pandahrms-ui-demo` into `pandawork-ui` monorepo
- Demo app imports components directly from registry package (no more shadcn copy workflow)
- GitHub Pages base path changed from `/pandahrms-ui-demo/` to `/pandawork-ui/`
- Registry URL changed from `pandahrms-ui-registry` to `pandawork-ui`
```

**Step 3: Copy llms.txt changelog section update**

Update the Changelog section in `public/llms.txt` with a note about the repo rename and URL change.

**Step 4: Commit**

```bash
git add -A
git commit -m "docs: add CLAUDE.md and update changelogs for monorepo"
```

---

### Task 10: Install dependencies and verify everything works

**Step 1: Install all workspace dependencies**

```bash
cd /Users/kyson/Developer/pandaworks/_pandahrms/pandawork-ui
pnpm install
```

Expected: Clean install with no peer dep warnings.

**Step 2: Verify registry build**

```bash
pnpm registry:build
ls public/r/ | head -5
```

Expected: Component JSON files generated in `public/r/`.

**Step 3: Verify demo dev server**

```bash
pnpm dev
```

Open browser, verify:
- Showcase sidebar renders with all component categories
- Click through 3-4 different component demos (button, card, modal, app-shell)
- Dark mode toggle works
- No console errors

**Step 4: Verify demo production build**

```bash
pnpm build
```

Expected: `tsc -b && vite build` succeeds with no errors. Output in `apps/demo/dist/`.

**Step 5: Fix any issues**

Common issues to watch for:
- Missing peer deps in demo (add to demo's package.json if needed)
- TypeScript path resolution errors (check tsconfig paths match vite aliases)
- CSS/Tailwind not loading (ensure `@tailwindcss/vite` plugin is in demo's vite config)
- Sonner/toast imports that depend on `next-themes` (demo has next-themes as dep)

**Step 6: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues in monorepo setup"
```

---

### Task 11: Copy docs/plans from old registry

**Step 1: Copy design docs**

```bash
mkdir -p docs/plans
cp ../pandahrms-ui-registry/docs/plans/* docs/plans/
```

**Step 2: Commit**

```bash
git add -A
git commit -m "docs: carry over design documents from registry repo"
```
