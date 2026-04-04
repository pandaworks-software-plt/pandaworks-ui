# Expandable Text Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an expandable text component that collapses long content with configurable visible lines, using `<pre>` for newline support.

**Architecture:** CSS `line-clamp` on a `<pre>` element with `white-space: pre-wrap`. Overflow detection via `scrollHeight > clientHeight` to conditionally render a text-link toggle.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, cn() utility

---

### Task 1: Create the ExpandableText component

**Files:**
- Create: `registry/default/expandable-text/expandable-text.tsx`

**Step 1: Write the component**

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface ExpandableTextProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of visible lines before collapsing. Default: 3 */
  visibleLines?: number
  /** Label for expand trigger. Default: "Show more" */
  showMoreLabel?: string
  /** Label for collapse trigger. Default: "Show less" */
  showLessLabel?: string
}

const ExpandableText = React.forwardRef<HTMLDivElement, ExpandableTextProps>(
  (
    {
      className,
      children,
      visibleLines = 3,
      showMoreLabel = "Show more",
      showLessLabel = "Show less",
      ...props
    },
    ref
  ) => {
    const contentRef = React.useRef<HTMLPreElement>(null)
    const [expanded, setExpanded] = React.useState(false)
    const [isOverflowing, setIsOverflowing] = React.useState(false)

    React.useEffect(() => {
      const el = contentRef.current
      if (!el) return

      const check = () => {
        setIsOverflowing(el.scrollHeight > el.clientHeight)
      }

      check()

      const observer = new ResizeObserver(check)
      observer.observe(el)
      return () => observer.disconnect()
    }, [children, visibleLines])

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <pre
          ref={contentRef}
          className={cn(
            "whitespace-pre-wrap break-words font-sans text-sm text-foreground",
            !expanded && "overflow-hidden"
          )}
          style={
            !expanded
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: visibleLines,
                  WebkitBoxOrient: "vertical" as const,
                }
              : undefined
          }
        >
          {children}
        </pre>
        {isOverflowing && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {expanded ? showLessLabel : showMoreLabel}
          </button>
        )}
      </div>
    )
  }
)
ExpandableText.displayName = "ExpandableText"

export { ExpandableText }
```

**Step 2: Verify it builds**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm lint`
Expected: PASS

**Step 3: Commit**

```bash
git add registry/default/expandable-text/expandable-text.tsx
git commit -m "feat(ui): add expandable-text registry component"
```

---

### Task 2: Copy component to showcase UI directory

**Files:**
- Create: `src/components/ui/expandable-text.tsx` (copy of registry source)

**Step 1: Copy the file**

```bash
cp registry/default/expandable-text/expandable-text.tsx src/components/ui/expandable-text.tsx
```

**Step 2: Commit**

```bash
git add src/components/ui/expandable-text.tsx
git commit -m "feat(showcase): add expandable-text to showcase ui components"
```

---

### Task 3: Add registry.json entry

**Files:**
- Modify: `registry.json`

**Step 1: Add entry to items array**

Add the following entry after the `error-fallback` entry (last item):

```json
{
  "name": "expandable-text",
  "type": "registry:ui",
  "title": "Expandable Text",
  "description": "A text component that collapses long content with configurable visible lines, using pre for newline support.",
  "dependencies": [],
  "registryDependencies": [],
  "files": [
    {
      "path": "registry/default/expandable-text/expandable-text.tsx",
      "type": "registry:ui"
    }
  ]
}
```

**Step 2: Commit**

```bash
git add registry.json
git commit -m "feat(registry): add expandable-text to registry.json"
```

---

### Task 4: Create the demo

**Files:**
- Create: `src/showcase/demos/expandable-text-demo.tsx`

**Step 1: Write the demo**

```tsx
import { useState } from "react";
import { DemoSection } from "@/showcase/component-page";
import { ExpandableText } from "@/components/ui/expandable-text";

const LONG_TEXT = `This is the first line of a long paragraph.
Second line continues here with more detail.
Third line adds even more context to the content.
Fourth line is where the text starts to overflow.
Fifth line should be hidden when collapsed.
Sixth line is definitely beyond the default limit.
Seventh line for good measure.`;

const SHORT_TEXT = `This is a short text.
It only has two lines.`;

const WRAPPED_TEXT =
  "This is a very long single line of text that should wrap naturally when it exceeds the container width. It demonstrates that the component handles both explicit newline characters and CSS-wrapped long lines correctly. The expandable behavior should work seamlessly in both cases.";

export default function ExpandableTextDemo() {
  return (
    <>
      <DemoSection
        title="Default (3 lines)"
        code={`import { ExpandableText } from "@/components/ui/expandable-text"

<ExpandableText>
  {\`Line 1\\nLine 2\\nLine 3\\nLine 4\\nLine 5\`}
</ExpandableText>`}
      >
        <ExpandableText>{LONG_TEXT}</ExpandableText>
      </DemoSection>

      <DemoSection title="Custom visible lines (2)">
        <ExpandableText visibleLines={2}>{LONG_TEXT}</ExpandableText>
      </DemoSection>

      <DemoSection title="Custom visible lines (5)">
        <ExpandableText visibleLines={5}>{LONG_TEXT}</ExpandableText>
      </DemoSection>

      <DemoSection title="Short text (no toggle)">
        <ExpandableText>{SHORT_TEXT}</ExpandableText>
      </DemoSection>

      <DemoSection title="Long wrapping text">
        <ExpandableText visibleLines={2}>{WRAPPED_TEXT}</ExpandableText>
      </DemoSection>

      <DemoSection title="Custom labels">
        <ExpandableText
          visibleLines={2}
          showMoreLabel="Read more..."
          showLessLabel="Read less..."
        >
          {LONG_TEXT}
        </ExpandableText>
      </DemoSection>
    </>
  );
}
```

**Step 2: Commit**

```bash
git add src/showcase/demos/expandable-text-demo.tsx
git commit -m "feat(showcase): add expandable-text demo"
```

---

### Task 5: Register demo in showcase-app

**Files:**
- Modify: `src/showcase/showcase-app.tsx`

**Step 1: Add import**

Add after the `ErrorFallbackDemo` import:

```tsx
import ExpandableTextDemo from "./demos/expandable-text-demo";
```

**Step 2: Add to COMPONENTS array**

Add entry after `error-fallback`:

```tsx
{
  name: "expandable-text",
  title: "Expandable Text",
  description:
    "A text component that collapses long content with configurable visible lines, using pre for newline support.",
  demo: ExpandableTextDemo,
},
```

**Step 3: Add to CATEGORIES**

Add `"expandable-text"` to the `"Data Display"` category filter array (alphabetically, after `"code-label"`).

**Step 4: Verify dev server**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm lint`
Expected: PASS

**Step 5: Commit**

```bash
git add src/showcase/showcase-app.tsx
git commit -m "feat(showcase): register expandable-text in showcase app"
```

---

### Task 6: Build registry output

**Step 1: Build**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm registry:build`
Expected: PASS, generates `public/r/expandable-text.json`

**Step 2: Verify output exists**

Run: `ls public/r/expandable-text.json`
Expected: File exists

**Step 3: Commit**

```bash
git add public/r/expandable-text.json
git commit -m "build: generate expandable-text registry output"
```

---

### Task 7: Visual verification

**Step 1: Start dev server**

Run: `cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry && pnpm dev`

**Step 2: Verify in browser**

Navigate to `http://localhost:5173/#/expandable-text` and verify:
- Default 3-line collapse works
- "Show more" / "Show less" toggle works
- Short text shows no toggle
- Custom `visibleLines` prop works
- Wrapping long text collapses correctly
- Dark mode works
- Custom labels render correctly
