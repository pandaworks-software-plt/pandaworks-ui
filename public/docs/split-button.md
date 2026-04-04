# SplitButton

Compound button with primary action and dropdown for secondary actions.

```tsx
import {
  SplitButton, SplitButtonAction,
  SplitButtonMenu, SplitButtonMenuItem,
} from "@/components/ui/split-button"

<SplitButton variant="default">
  <SplitButtonAction onClick={handleSave}>Save</SplitButtonAction>
  <SplitButtonMenu>
    <SplitButtonMenuItem onClick={handleSaveDraft}>Save as Draft</SplitButtonMenuItem>
    <SplitButtonMenuItem onClick={handlePublish}>Save and Publish</SplitButtonMenuItem>
  </SplitButtonMenu>
</SplitButton>
```

Variants: `default`, `secondary`, `outline`, `destructive`, `ghost`
Sizes: `sm`, `default`, `lg`
