# Feedback Components

Components for alerts, confirmations, loading states, and notifications.

## Alert

Variants: `default`, `destructive`, `info`

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

## AlertDialog

Modal dialog requiring user acknowledgement.

```tsx
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Sonner (Toast)

```tsx
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

// In layout:
<Toaster />

// To trigger:
toast("Employee saved successfully")
toast.error("Failed to save")
toast.success("Changes applied")
```

## LoadingPage

A full-screen loading state with optional logo, animated dots, and customizable message.

```tsx
import { LoadingPage } from "@/components/ui/loading-page"

<LoadingPage />
<LoadingPage message="Preparing your dashboard..." />
<LoadingPage logo={<img src="/logo.png" alt="Logo" className="h-12 w-12" />} />
```

Props:
- `logo?: ReactNode` -- Logo or icon above the loading dots
- `message?: string` -- Loading message text (default: "Loading...")

## ConnectionBanner

A fixed top banner that shows when the app loses connectivity, with a retry button.

```tsx
import { ConnectionBanner } from "@/components/ui/connection-banner"

<ConnectionBanner
  isOnline={isOnline}
  onRetry={handleRetry}
  message="Can't connect to server"
/>
```

Props:
- `isOnline: boolean` -- Whether connected (renders nothing when true)
- `onRetry: () => void | Promise<void>` -- Called on Retry click
- `message?: string` -- Custom message (default: "Can't connect to server")

Dependencies: button
