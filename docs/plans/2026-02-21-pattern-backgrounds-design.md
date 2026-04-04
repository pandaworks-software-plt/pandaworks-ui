# Pattern Background Utilities

## Overview

A set of CSS utility classes that add subtle visual patterns to any container. Instead of flat `bg-background` or `bg-card` surfaces, these patterns provide texture and depth while staying non-distracting.

## Pattern Catalog

### Structural Patterns

| Class | Technique | Feel |
|-------|-----------|------|
| `bg-pattern-dots` | Repeating `radial-gradient` dots on a 20px grid | Clean, techy, SaaS |
| `bg-pattern-grid` | Two `linear-gradient` lines (H + V) forming 24px cells | Modern, Linear/Vercel |
| `bg-pattern-cross` | `linear-gradient` plus marks on 20px spacing | Subtle alternative to grid |

### Organic Patterns

| Class | Technique | Feel |
|-------|-----------|------|
| `bg-pattern-aurora` | Multiple `radial-gradient` blobs at fixed positions | Soft, premium |
| `bg-pattern-aurora-{color}` | Color-tinted aurora matching Card color palette | Themed, branded |

Aurora color variants: `blue`, `purple`, `peach`, `indigo`, `green`, `amber`, `rose`, `teal`

### Textural Patterns

| Class | Technique | Feel |
|-------|-----------|------|
| `bg-pattern-noise` | Inline SVG `<feTurbulence>` as data URI background | Tactile, editorial |

## Implementation

All patterns defined in `globals.css` inside `@layer utilities`.

### Design Constraints

- Opacity: 3-8% range (barely visible, never competes with content)
- Dark mode: Automatic adjustment via `.dark` selector (inverts dot/line color)
- Performance: Pure CSS, no JS, no external assets
- Composable: Works alongside any `bg-*`, `rounded-*`, `p-*` Tailwind class

### Pattern Specifications

**bg-pattern-dots**
```css
background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
background-size: 20px 20px;
color with opacity ~5%
```

**bg-pattern-grid**
```css
background-image:
  linear-gradient(to right, color 1px, transparent 1px),
  linear-gradient(to bottom, color 1px, transparent 1px);
background-size: 24px 24px;
line opacity ~5%
```

**bg-pattern-cross**
```css
background-image:
  linear-gradient(color 1px, transparent 1px),
  linear-gradient(90deg, color 1px, transparent 1px);
background-size: 20px 20px;
background-position: center center;
cross size ~8px, opacity ~5%
```

**bg-pattern-aurora**
```css
background-image:
  radial-gradient(ellipse at 20% 50%, color1 0%, transparent 50%),
  radial-gradient(ellipse at 80% 20%, color2 0%, transparent 50%),
  radial-gradient(ellipse at 60% 80%, color3 0%, transparent 50%);
blob opacity ~8%
```

**bg-pattern-aurora-{color}** -- Same structure as aurora but using the corresponding Tailwind color palette (e.g., `blue-200/8` light, `blue-800/10` dark).

**bg-pattern-noise**
```css
background-image: url("data:image/svg+xml,...feTurbulence...");
opacity ~4%
```

## Usage Examples

```tsx
// Dashboard page background
<main className="bg-pattern-dots min-h-screen">
  ...
</main>

// Hero section with aurora
<section className="bg-pattern-aurora-blue rounded-xl p-8">
  <h1>Welcome back</h1>
</section>

// Card with subtle noise texture
<Card className="bg-pattern-noise">
  <CardHeader>...</CardHeader>
</Card>

// Empty state with grid
<div className="bg-pattern-grid flex items-center justify-center py-20">
  <p>No data yet</p>
</div>

// Combine with existing color tints
<div className="bg-pattern-grid bg-primary/3 rounded-lg p-6">
  ...
</div>
```

## Showcase Demo

Add a `pattern-background-demo.tsx` to the showcase that displays each pattern in a visible container, so developers can preview them side by side.

## File Changes

1. `src/globals.css` -- Add pattern utility classes in `@layer utilities`
2. `src/showcase/demos/pattern-background-demo.tsx` -- New demo page
3. `src/showcase/showcase-app.tsx` -- Register demo in sidebar

## Edge Cases

- Very small containers: Patterns may not tile enough to be visible. Not a problem -- they gracefully degrade to plain backgrounds.
- Stacking patterns: Two patterns on the same element would conflict. Document that patterns should not be stacked.
- Print: Patterns should be invisible in print (`@media print` reset if needed).
