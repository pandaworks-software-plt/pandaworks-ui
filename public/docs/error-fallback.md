# ErrorFallback

An error boundary fallback with root (full-screen + reload) and route (inline + custom action) variants.

```tsx
import { ErrorFallback } from "@/components/ui/error-fallback"

// Root-level (full-screen with Reload Page button)
<ErrorFallback error={error} onReset={reset} variant="root" />

// Route-level (inline card with custom secondary action)
<ErrorFallback
  error={error}
  onReset={reset}
  variant="route"
  secondaryAction={<Button onClick={() => navigate("/")}>Go Home</Button>}
  showDevDetails={process.env.NODE_ENV === "development"}
/>
```

Props:
- `error: unknown` -- The error object
- `onReset: () => void` -- Called on "Try Again" click
- `variant?: "root" | "route"` -- "root" = full-screen, "route" = inline (default: "root")
- `title?: string` -- Error title (default: "Something went wrong")
- `description?: string` -- Custom description text
- `secondaryAction?: ReactNode` -- Custom secondary action button
- `showDevDetails?: boolean` -- Show error message details (default: false)

Dependencies: button, card
