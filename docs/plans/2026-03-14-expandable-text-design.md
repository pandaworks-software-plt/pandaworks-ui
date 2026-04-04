# Expandable Text Component Design

## Overview

A text component that collapses long content with a configurable visible line limit, using `<pre>` for newline character support. Shows a "Show more" / "Show less" text link toggle when content overflows.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visibleLines` | `number` | `3` | Number of visible lines before collapsing |
| `showMoreLabel` | `string` | `"Show more"` | Label for expand trigger |
| `showLessLabel` | `string` | `"Show less"` | Label for collapse trigger |
| `children` | `ReactNode` | - | Text content to display |
| `className` | `string` | - | Additional classes on outer wrapper |

Extends `React.HTMLAttributes<HTMLDivElement>` for the outer wrapper.

## Approach

CSS `line-clamp` on a `<pre>` element:

- `<pre>` with `white-space: pre-wrap` and `word-break: break-word` renders `\n` as line breaks while wrapping long lines
- `line-clamp` via inline style (`WebkitLineClamp`) caps visible lines when collapsed
- `scrollHeight > clientHeight` comparison on mount detects overflow, conditionally showing the toggle
- Toggle is a `<button>` styled as an inline text link

## Structure

```
<div className={cn("...", className)}>
  <pre
    ref={contentRef}
    style (collapsed): display: -webkit-box, WebkitLineClamp: visibleLines, WebkitBoxOrient: vertical, overflow: hidden
    style (expanded): none of the above
    className="whitespace-pre-wrap break-words font-sans text-sm ..."
  >
    {children}
  </pre>
  {isOverflowing && (
    <button onClick={toggle} className="text-sm text-muted-foreground hover:text-foreground ...">
      {expanded ? showLessLabel : showMoreLabel}
    </button>
  )}
</div>
```

## Dependencies

- None beyond `cn()` from `lib/utils`
- No Radix primitives required

## Files

- `registry/default/expandable-text/expandable-text.tsx` - Component source
- `src/showcase/demos/expandable-text-demo.tsx` - Demo with multiple sections
- Updates to `registry.json` and `src/showcase/showcase-app.tsx`
