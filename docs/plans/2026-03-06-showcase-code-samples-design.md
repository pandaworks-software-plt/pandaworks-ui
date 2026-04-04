# Showcase Code Samples & Full Demo Fix

Date: 2026-03-06

## Problem

1. Component demo pages show live demos but no usage code samples - developers need to guess the import paths and props.
2. The "Employee Management" full demo renders inside the showcase layout, causing a double sidebar (showcase sidebar + AppShell sidebar).

## Design

### 1. Per-Section Code Toggle

Add an optional `code` prop to `DemoSection`. When provided:

- Render a "Preview / Code" toggle above the demo container
- "Preview" (default) shows the live demo as today
- "Code" shows a `<pre><code>` block with the usage snippet
- Include a copy-to-clipboard button on the code view (reuse pattern from `InstallCommand`)
- Style the code block with `bg-muted font-mono text-sm` to match the existing install command aesthetic

Each demo file provides code strings as template literals for its sections, showing clean import + usage JSX (not the full demo wrapper).

### 2. Full Demo Opens in New Tab

Change the "Employee Management" sidebar item behavior:

- Instead of rendering `<App />` inline in the showcase `<main>`, open a standalone page in a new browser tab
- Create a dedicated `/full-demo.html` entry point (Vite multi-page) or use a query param (`?standalone=true`) to render `<App />` without the showcase wrapper
- The sidebar item becomes a link with `target="_blank"` behavior

**Chosen approach:** Use hash routing. When `#/full-demo` is active, render `<App />` as a full-page standalone (hide the showcase sidebar entirely), or simpler: just `window.open` a standalone URL.

**Simplest approach chosen:** Render the full demo in a new tab by having the sidebar button call `window.open('/#/full-demo', '_blank')` and create a standalone render path in `main.tsx` that checks the hash.

## Components Changed

- `src/showcase/component-page.tsx` - Add `code` prop to `DemoSection`, add code block UI
- `src/showcase/demos/*-demo.tsx` - Add code strings to each demo section
- `src/showcase/showcase-app.tsx` - Change full-demo handling
- `src/showcase/showcase-sidebar.tsx` - Make full-demo item open new tab
- `src/main.tsx` - Add standalone full-demo render path
