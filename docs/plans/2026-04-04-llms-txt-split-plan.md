# llms.txt Split Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split the monolithic `public/llms.txt` (1,302 lines / 35 KB) into a lightweight index + 16 doc files so LLM consumers only load what they need.

**Architecture:** Keep `public/llms.txt` as a ~200-line index with catalog table, decision guide, styling conventions, and changelog. Move full component API docs into `public/docs/` as 10 dedicated files (complex components) and 6 category files (simple components grouped).

**Tech Stack:** Markdown files, no build tooling changes needed.

**Source file:** `/Users/kyson/Developer/pandaworks/_pandahrms/pandawork-ui/public/llms.txt`

---

### Task 1: Create public/docs/ directory and 10 dedicated component doc files

Extract the following components from `public/llms.txt` into individual files. Each file should contain only the component's content (description, code examples, props, variants) -- no markdown front matter, no `##` heading (start with `#`).

**Files to create:**

**Step 1: Create `public/docs/button.md`**

Extract lines 162-235 (Button section). Also include the Button Action Presets table from the project's CLAUDE.md since llms.txt references it. The file should start with:

```markdown
# Button

A unified button with multiple variants, sizes, action presets, icon support, auto-tooltips, and loading state.
```

Include: all variants (default, brand, destructive, outline, secondary, ghost, link), sizes, the action presets table, icon/tooltip/loading props, and code examples.

**Step 2: Create `public/docs/app-shell.md`**

Extract lines 27-73 (AppShell section).

**Step 3: Create `public/docs/filter-bar.md`**

Extract lines 564-606 (FilterBar section).

**Step 4: Create `public/docs/select-picker.md`**

Extract lines 358-402 (SelectPicker section).

**Step 5: Create `public/docs/attachment-input.md`**

Extract lines 506-538 (AttachmentInput section).

**Step 6: Create `public/docs/modal.md`**

Extract lines 127-158 (Modal section). Read the source file `packages/registry/registry/default/modal/modal.tsx` to verify props are complete.

**Step 7: Create `public/docs/detail-page.md`**

Extract lines 97-125 (DetailPage section).

**Step 8: Create `public/docs/form.md`**

Extract lines 453-483 (Form section).

**Step 9: Create `public/docs/split-button.md`**

Extract lines 485-504 (SplitButton section).

**Step 10: Create `public/docs/error-fallback.md`**

Extract lines 834-862 (ErrorFallback section).

For each file: convert the `####` heading to `#`, keep all code examples and props exactly as-is.

---

### Task 2: Create 6 category doc files

Group the remaining simple components by category.

**Step 1: Create `public/docs/layout.md`**

```markdown
# Layout Components

Components for page structure and navigation layout.
```

Include these components (each as a `## ComponentName` section):
- PageHeader (lines 75-95)
- Stepper (lines 1096-1116)
- Separator (lines 1118-1125)
- Breadcrumb (lines 1020-1035)

**Step 2: Create `public/docs/forms.md`**

```markdown
# Form Components

Input controls and form elements.
```

Include:
- Input (lines 263-270)
- Label (lines 272-281)
- Textarea (lines 283-290)
- Checkbox (lines 292-303)
- RadioGroup (lines 305-322)
- Switch (lines 324-335)
- Select (lines 337-356)
- DatePicker (lines 404-421)
- DateRangePicker (lines 423-442)
- Slider (lines 444-451)
- SearchInput (lines 237-261)
- SelectableCard (lines 540-562)

**Step 3: Create `public/docs/data-display.md`**

```markdown
# Data Display Components

Components for presenting data and content.
```

Include:
- Card (lines 633-649)
- Table (lines 651-673)
- Badge (lines 610-620)
- Avatar (lines 622-631)
- Calendar (lines 675-681)
- Skeleton (lines 683-690)
- Progress (lines 692-698)
- CodeLabel (lines 700-710)
- AnimatedNumber (lines 712-729)
- ExpandableText (lines 731-753)

**Step 4: Create `public/docs/feedback.md`**

```markdown
# Feedback Components

Components for alerts, confirmations, loading states, and notifications.
```

Include:
- Alert (lines 757-769)
- AlertDialog (lines 771-797)
- Sonner/Toast (lines 864-877)
- LoadingPage (lines 799-812)
- ConnectionBanner (lines 814-832)

**Step 5: Create `public/docs/overlay.md`**

```markdown
# Overlay Components

Dialogs, sheets, menus, tooltips, and popovers.
```

Include:
- Dialog (lines 881-906)
- Sheet (lines 908-931)
- DropdownMenu (lines 933-953)
- Tooltip (lines 955-971)
- Popover (lines 973-984)
- Command (lines 1048-1066)

**Step 6: Create `public/docs/navigation.md`**

```markdown
# Navigation Components

Tabs, accordions, pagination, and other navigation patterns.
```

Include:
- Tabs (lines 988-1002)
- Accordion (lines 1004-1018)
- Collapsible (lines 1037-1046)
- Pagination (lines 1068-1084)
- ScrollArea (lines 1086-1094)
- Toggle (lines 1129-1138)
- ToggleGroup (lines 1140-1151)

---

### Task 3: Rewrite public/llms.txt as the index

Replace the entire `public/llms.txt` with a lean index. Structure:

```markdown
# Pandaworks UI Registry

> Shared component registry for Pandahrms frontend projects. Built on shadcn/ui with Tailwind CSS v4, OKLCH color space, and Radix UI primitives.

## Installation

Install any component via the shadcn CLI:

\`\`\`bash
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/pandaworks-software-plt/pandaworks-ui/main/public/r/<component-name>.json
\`\`\`

Components are installed to `src/components/ui/`. Import from `@/components/ui/<name>`.

## Tech Stack

- React 19, TypeScript
- Tailwind CSS v4 (OKLCH color space)
- Radix UI primitives
- class-variance-authority for variants
- Lucide icons

## Component Catalog

For full API docs, props, and code examples, read the linked doc file.

### Layout

| Component | Description | Docs |
|-----------|-------------|------|
| AppShell | Data-driven app layout with collapsible sidebar, header, user menu | [app-shell.md](docs/app-shell.md) |
| PageHeader | Page title, description, and action buttons | [layout.md](docs/layout.md) |
| DetailPage | Resource detail/show page layout | [detail-page.md](docs/detail-page.md) |
| Modal | Form modal with sticky header/footer, size variants | [modal.md](docs/modal.md) |
| Stepper | Horizontal multi-step progress indicator | [layout.md](docs/layout.md) |
| Separator | Horizontal or vertical divider | [layout.md](docs/layout.md) |
| Breadcrumb | Navigation breadcrumb trail | [layout.md](docs/layout.md) |

### Forms

| Component | Description | Docs |
|-----------|-------------|------|
| Button | Variants, action presets, icon, tooltip, loading | [button.md](docs/button.md) |
| Input | Text input field | [forms.md](docs/forms.md) |
| Label | Form label | [forms.md](docs/forms.md) |
| Textarea | Multi-line text input | [forms.md](docs/forms.md) |
| Checkbox | Checkbox with label support | [forms.md](docs/forms.md) |
| RadioGroup | Radio button group | [forms.md](docs/forms.md) |
| Switch | Toggle switch | [forms.md](docs/forms.md) |
| Select | Static dropdown (< 10 items) | [forms.md](docs/forms.md) |
| SelectPicker | Searchable dropdown, single/multi select | [select-picker.md](docs/select-picker.md) |
| DatePicker | Single date picker | [forms.md](docs/forms.md) |
| DateRangePicker | Date range picker | [forms.md](docs/forms.md) |
| Slider | Range slider | [forms.md](docs/forms.md) |
| Form | react-hook-form integration with field context | [form.md](docs/form.md) |
| SearchInput | Debounced search input with clear button | [forms.md](docs/forms.md) |
| SplitButton | Primary action + dropdown secondary actions | [split-button.md](docs/split-button.md) |
| AttachmentInput | File upload with dropzone/compact variants | [attachment-input.md](docs/attachment-input.md) |
| SelectableCard | Card-based single/multi selection | [forms.md](docs/forms.md) |
| FilterBar | FilterButton trigger + ActiveFilters chips | [filter-bar.md](docs/filter-bar.md) |

### Data Display

| Component | Description | Docs |
|-----------|-------------|------|
| Card | Container with header, content, footer | [data-display.md](docs/data-display.md) |
| Table | Data table with header, body, footer | [data-display.md](docs/data-display.md) |
| Badge | Status indicator (default, secondary, destructive, outline) | [data-display.md](docs/data-display.md) |
| Avatar | User avatar with image and fallback | [data-display.md](docs/data-display.md) |
| Calendar | Date calendar | [data-display.md](docs/data-display.md) |
| Skeleton | Loading placeholder | [data-display.md](docs/data-display.md) |
| Progress | Progress bar | [data-display.md](docs/data-display.md) |
| CodeLabel | Inline monospace label with copy button | [data-display.md](docs/data-display.md) |
| AnimatedNumber | Animated number display with easing | [data-display.md](docs/data-display.md) |
| ExpandableText | Collapsible long text with show more/less | [data-display.md](docs/data-display.md) |

### Feedback

| Component | Description | Docs |
|-----------|-------------|------|
| Alert | Alert banner (default, destructive, info) | [feedback.md](docs/feedback.md) |
| AlertDialog | Modal confirmation dialog | [feedback.md](docs/feedback.md) |
| Sonner | Toast notifications | [feedback.md](docs/feedback.md) |
| LoadingPage | Full-screen loading state | [feedback.md](docs/feedback.md) |
| ConnectionBanner | Offline/connectivity warning banner | [feedback.md](docs/feedback.md) |
| ErrorFallback | Error boundary fallback (root/route variants) | [error-fallback.md](docs/error-fallback.md) |

### Overlay

| Component | Description | Docs |
|-----------|-------------|------|
| Dialog | Modal dialog with header, content, footer | [overlay.md](docs/overlay.md) |
| Sheet | Slide-out panel (top, right, bottom, left) | [overlay.md](docs/overlay.md) |
| DropdownMenu | Context/action menu | [overlay.md](docs/overlay.md) |
| Tooltip | Hover tooltip | [overlay.md](docs/overlay.md) |
| Popover | Click-triggered popover | [overlay.md](docs/overlay.md) |
| Command | Command palette with search | [overlay.md](docs/overlay.md) |

### Navigation

| Component | Description | Docs |
|-----------|-------------|------|
| Tabs | Tab panels (pill and line variants) | [navigation.md](docs/navigation.md) |
| Accordion | Collapsible sections | [navigation.md](docs/navigation.md) |
| Collapsible | Single collapsible section | [navigation.md](docs/navigation.md) |
| Pagination | Page navigation | [navigation.md](docs/navigation.md) |
| ScrollArea | Custom scrollbar container | [navigation.md](docs/navigation.md) |
| Toggle | Single toggle button | [navigation.md](docs/navigation.md) |
| ToggleGroup | Group of toggle buttons | [navigation.md](docs/navigation.md) |
```

Then include the Decision Guide table, Styling Conventions section, and full Changelog section (all copied verbatim from current llms.txt lines 1153-1302).

---

### Task 4: Update CLAUDE.md references

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update the CLAUDE.md to mention the docs/ structure**

In the CLAUDE.md, update any reference to `public/llms.txt` to note the new structure: index at `public/llms.txt`, detailed docs at `public/docs/*.md`.

Also update the "Adding a Component" and "Modifying a Component" sections to mention updating the relevant doc file in `public/docs/`.

---

### Task 5: Verify and build

**Step 1: Verify all content was preserved**

Check that every component from the original llms.txt has a corresponding entry in both:
- The catalog table in the new `llms.txt`
- A doc file in `public/docs/`

**Step 2: Line count check**

```bash
wc -l public/llms.txt
# Expected: ~200-250 lines

wc -l public/docs/*.md
# Expected: ~1100 lines total across 16 files
```

**Step 3: Verify demo build still works**

```bash
pnpm --filter @pandaworks-ui/demo build
```

(The docs are static files, but verify nothing broke.)
