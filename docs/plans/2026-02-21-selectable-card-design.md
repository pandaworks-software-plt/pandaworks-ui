# SelectableCard Component Design

## Overview

A composable card component that acts as a selection target - supports both single selection (radio, inside RadioGroup) and multi-selection (checkbox, standalone).

## API

### Radio Mode (inside RadioGroup)

```tsx
<RadioGroup value={value} onValueChange={setValue}>
  <SelectableCard value="option-a" size="lg">
    <img src="..." className="size-12 rounded-lg" />
    <div>
      <p className="font-semibold">Option A</p>
      <p className="text-sm text-muted-foreground">Description</p>
    </div>
  </SelectableCard>
  <SelectableCard value="option-b" size="lg">
    ...
  </SelectableCard>
</RadioGroup>
```

### Checkbox Mode (standalone)

```tsx
<SelectableCard checked={isChecked} onCheckedChange={setIsChecked}>
  <div>
    <p className="font-semibold">Feature</p>
    <p className="text-sm text-muted-foreground">Description</p>
  </div>
</SelectableCard>
```

## Props (Discriminated Union)

### Shared Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Card content |
| className | string | - | Additional classes |
| disabled | boolean | false | Disabled state |
| size | "sm" \| "default" \| "lg" | "default" | Size variant |

### Radio Mode Props (when `value` is provided)

| Prop | Type | Description |
|------|------|-------------|
| value | string | Required. Radio value, expects RadioGroup parent |

### Checkbox Mode Props (when `checked` is provided)

| Prop | Type | Description |
|------|------|-------------|
| checked | boolean | Checked state |
| onCheckedChange | (checked: boolean) => void | Change handler |

## Visual Design

### States

- **Default**: `border border-border rounded-lg bg-background cursor-pointer`
- **Hover**: `hover:border-primary/50`
- **Selected**: `border-primary ring-1 ring-primary/20 bg-primary/5 dark:bg-primary/10`
- **Disabled**: `opacity-50 cursor-not-allowed`

### Size Variants

| Size | Padding | Gap | Indicator Size |
|------|---------|-----|----------------|
| sm | p-3 | gap-3 | size-4 |
| default | p-4 | gap-4 | size-5 |
| lg | p-5 | gap-5 | size-5 |

### Layout

Horizontal flex: `[children content (flex-1)] ... [indicator]`

- Indicator is built-in at trailing end (radio circle or checkbox)
- Children fill remaining space
- Transition: `transition-colors duration-150`

## Dependencies

- `@radix-ui/react-radio-group` (existing registry dependency)
- `@radix-ui/react-checkbox` (new dependency)

## Registry Dependencies

- `radio-group` (existing)

## Files

- `registry/default/selectable-card/selectable-card.tsx`
- `src/showcase/demos/selectable-card-demo.tsx`
