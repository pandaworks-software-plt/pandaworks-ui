# Showcase Code Samples & Full Demo Fix - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add per-section code usage samples to component demo pages and fix the full demo to open in a new tab.

**Architecture:** Extend `DemoSection` with an optional `code` prop that toggles between preview/code views. Create a standalone full-demo entry point so the Employee Management example renders without the showcase wrapper.

**Tech Stack:** React, Tailwind CSS, Vite (for multi-page entry)

---

### Task 1: Update DemoSection with code toggle

**Files:**
- Modify: `src/showcase/component-page.tsx`

**Step 1: Add code prop and toggle UI to DemoSection**

Update `DemoSectionProps` to accept an optional `code: string` prop. When present, render a "Preview / Code" toggle above the content area. The code view shows a `<pre><code>` block with a copy button.

```tsx
interface DemoSectionProps {
  title: string;
  code?: string;
  children: React.ReactNode;
}
```

The toggle uses two buttons styled as tabs. Code view includes:
- `<pre>` with `bg-muted rounded-lg border p-4 overflow-x-auto`
- Copy button in top-right corner (reuse Check/Copy pattern from InstallCommand)
- `font-mono text-sm` styling

**Step 2: Verify visually**

Run: `pnpm dev` and navigate to any component page. DemoSections without `code` should render identically to before (no toggle shown).

**Step 3: Commit**

```
feat(showcase): add code toggle to DemoSection component
```

---

### Task 2: Fix full demo to open in a new tab

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/showcase/showcase-app.tsx`
- Modify: `src/showcase/showcase-sidebar.tsx`
- Create: `src/full-demo.tsx`
- Create: `full-demo.html`
- Modify: `vite.config.ts` (add multi-page entry)

**Step 1: Create standalone full-demo entry point**

Create `full-demo.html` at root alongside `index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pandahrms - Employee Management Demo</title>
  </head>
  <body class="min-h-screen bg-background text-foreground font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/src/full-demo.tsx"></script>
  </body>
</html>
```

Create `src/full-demo.tsx`:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**Step 2: Add multi-page config to Vite**

Read and modify `vite.config.ts` to add `full-demo.html` as a build input:
```ts
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
      'full-demo': resolve(__dirname, 'full-demo.html'),
    },
  },
},
```

**Step 3: Update sidebar to open full-demo in new tab**

In `showcase-sidebar.tsx`, detect the "full-demo" item and render it as a link/button that opens `/full-demo.html` in a new tab instead of calling `onSelect`.

In `showcase-app.tsx`, remove the `active === "full-demo"` rendering branch since it's no longer shown inline.

**Step 4: Verify**

Run `pnpm dev`, click "Employee Management" in sidebar - should open `/full-demo.html` in a new browser tab with full AppShell, no double sidebar.

**Step 5: Commit**

```
fix(showcase): open full demo in new tab to avoid double sidebar
```

---

### Task 3: Add code samples to all demo files

**Files:** All 49 files in `src/showcase/demos/*-demo.tsx`

Add `code` prop strings to each `DemoSection` call. Each code string is a clean usage snippet showing imports and JSX. Only add code to sections where it's useful (skip sections that just repeat variants with minor prop changes -- add code to the first/primary section of each demo, and to sections that show distinct patterns).

**Group A - Forms (parallel):**
- `button-demo.tsx` - variants, sizes, with-icon, loading, disabled
- `input-demo.tsx`
- `label-demo.tsx`
- `checkbox-demo.tsx`
- `textarea-demo.tsx`
- `form-demo.tsx`
- `radio-group-demo.tsx`
- `switch-demo.tsx`
- `select-demo.tsx`
- `select-picker-demo.tsx`
- `date-picker-demo.tsx`
- `date-range-picker-demo.tsx`
- `slider-demo.tsx`
- `split-button-demo.tsx`
- `attachment-input-demo.tsx`
- `selectable-card-demo.tsx`
- `filter-bar-demo.tsx`

**Group B - Data Display + Feedback + Navigation (parallel):**
- `badge-demo.tsx`
- `avatar-demo.tsx`
- `calendar-demo.tsx`
- `card-demo.tsx`
- `code-label-demo.tsx`
- `skeleton-demo.tsx`
- `progress-demo.tsx`
- `table-demo.tsx`
- `alert-demo.tsx`
- `alert-dialog-demo.tsx`
- `sonner-demo.tsx`
- `accordion-demo.tsx`
- `breadcrumb-demo.tsx`
- `collapsible-demo.tsx`
- `command-demo.tsx`
- `pagination-demo.tsx`
- `scroll-area-demo.tsx`
- `separator-demo.tsx`
- `tabs-demo.tsx`

**Group C - Overlay + Toggle + Layout (parallel):**
- `dialog-demo.tsx`
- `dropdown-menu-demo.tsx`
- `popover-demo.tsx`
- `sheet-demo.tsx`
- `tooltip-demo.tsx`
- `toggle-demo.tsx`
- `toggle-group-demo.tsx`
- `app-shell-demo.tsx`
- `page-header-demo.tsx`
- `detail-page-demo.tsx`

**Skip (pattern galleries, no code needed):**
- `button-patterns-demo.tsx`
- `button-patterns-v2-demo.tsx`
- `pattern-background-demo.tsx`

**Commit after all demos updated:**

```
feat(showcase): add usage code samples to all component demos
```

---

### Task 4: Final verification

**Step 1:** Run `pnpm dev` and spot-check 5-6 components for code toggle behavior.
**Step 2:** Run `pnpm lint` to verify no lint errors.
**Step 3:** Verify dark mode works on code blocks.
**Step 4:** Run `pnpm build` to verify production build succeeds with multi-page setup.
