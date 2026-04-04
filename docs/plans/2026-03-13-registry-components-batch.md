# Registry Components Batch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 5 new registry components (loading-page, animated-number, stepper, connection-banner, error-fallback) from bridge specs.

**Architecture:** Each component follows the existing registry pattern: source in `registry/default/<name>/`, entry in `registry.json`, demo in `src/showcase/demos/`, and registration in `showcase-app.tsx`. All components use semantic color tokens and `cn()` utility.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4 (OKLCH), lucide-react, shadcn registry

---

## Conventions Reference

- Component source: `registry/default/<name>/<name>.tsx`
- Registry manifest: `registry.json` (add to `items` array)
- Demo file: `src/showcase/demos/<name>-demo.tsx`
- Demo registration: `src/showcase/showcase-app.tsx` (import + COMPONENTS array + CATEGORIES filter)
- Build: `pnpm registry:build` (generates `public/r/<name>.json`)
- All components use `import { cn } from "@/lib/utils"` for className merging
- Named exports (not default exports) for components
- No app-specific imports (no stores, no router, no env vars)

---

### Task 1: Create loading-page registry component

**Files:**
- Create: `registry/default/loading-page/loading-page.tsx`

**Step 1: Create the component file**

```tsx
import { cn } from "@/lib/utils";

interface LoadingPageProps {
  /** Logo or icon to display above the loading dots */
  logo?: React.ReactNode;
  /** Loading message text */
  message?: string;
  /** Additional className for the container */
  className?: string;
}

function LoadingPage({
  logo,
  message = "Loading...",
  className,
}: LoadingPageProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-6",
        className
      )}
    >
      {logo && (
        <div className="relative">
          {logo}
          <div className="absolute inset-0 animate-pulse rounded-lg bg-primary/20" />
        </div>
      )}
      <div className="flex flex-col items-center gap-3">
        <div className="flex space-x-1">
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export { LoadingPage, type LoadingPageProps };
```

---

### Task 2: Add loading-page to registry.json

**Files:**
- Modify: `registry.json`

**Step 1: Add entry to items array**

Add after the last item in the `items` array:

```json
{
  "name": "loading-page",
  "type": "registry:ui",
  "title": "Loading Page",
  "description": "A full-screen loading state with optional logo, animated dots, and customizable message.",
  "dependencies": [],
  "registryDependencies": [],
  "files": [
    {
      "path": "registry/default/loading-page/loading-page.tsx",
      "type": "registry:ui"
    }
  ]
}
```

---

### Task 3: Create loading-page demo

**Files:**
- Create: `src/showcase/demos/loading-page-demo.tsx`

**Step 1: Create demo file**

Demo should show:
1. Basic loading page (dots + default message)
2. With custom message
3. With logo placeholder (use a simple div with text as stand-in)

Import `DemoSection` from `@/showcase/component-page` and `LoadingPage` from `@/components/ui/loading-page`.

Each demo variant wrapped in a `DemoSection` with `title` and `code` string props. The live preview goes as children. Use a fixed-height container (`h-48 border rounded-lg`) so the full-screen component is contained within the demo area.

---

### Task 4: Create animated-number registry component

**Files:**
- Create: `registry/default/animated-number/animated-number.tsx`

**Step 1: Create the component file**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  /** Target value to animate to */
  value: number;
  /** Animation duration in ms */
  duration?: number;
  /** Additional className */
  className?: string;
  /** Text to append after the number (e.g., "%", "pts") */
  suffix?: string;
  /** Text to prepend before the number (e.g., "$", "RM") */
  prefix?: string;
  /** Number of decimal places */
  decimals?: number;
  /** Custom number formatter (overrides decimals if provided) */
  formatter?: (value: number) => string;
}

function AnimatedNumber({
  value,
  duration = 500,
  className,
  suffix,
  prefix,
  decimals = 0,
  formatter,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    const startTime = performance.now();
    let frameId: number;

    if (startValue === endValue) return;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = startValue + (endValue - startValue) * easeOutQuad;

      setDisplayValue(
        decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current)
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [value, duration, decimals]);

  const formatted = formatter
    ? formatter(displayValue)
    : decimals > 0
      ? displayValue.toFixed(decimals)
      : String(displayValue);

  return (
    <span className={cn(className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export { AnimatedNumber, type AnimatedNumberProps };
```

---

### Task 5: Add animated-number to registry.json

**Files:**
- Modify: `registry.json`

**Step 1: Add entry to items array**

```json
{
  "name": "animated-number",
  "type": "registry:ui",
  "title": "Animated Number",
  "description": "A number display that animates smoothly between values using requestAnimationFrame with easeOutQuad easing.",
  "dependencies": [],
  "registryDependencies": [],
  "files": [
    {
      "path": "registry/default/animated-number/animated-number.tsx",
      "type": "registry:ui"
    }
  ]
}
```

---

### Task 6: Create animated-number demo

**Files:**
- Create: `src/showcase/demos/animated-number-demo.tsx`

**Step 1: Create demo file**

Demo should show:
1. Basic counter with a button to randomize value (0-100)
2. With suffix (e.g., "%")
3. With prefix (e.g., "RM ")
4. With decimals (2 decimal places)
5. With custom formatter (Intl.NumberFormat with commas)

Use `useState` for interactive demos. Each wrapped in `DemoSection`.

---

### Task 7: Create stepper registry component

**Files:**
- Create: `registry/default/stepper/stepper.tsx`

**Step 1: Create the component file**

Use semantic tokens per the bridge spec color mapping:
- Completed circle: `border-primary bg-primary`, check icon `text-primary-foreground`
- Current circle: `border-primary`, number `text-primary`
- Pending circle: `border-border`, number `text-muted-foreground`
- Connector completed: `bg-primary`
- Connector pending: `bg-border`
- Current title: `text-foreground`
- Other titles: `text-muted-foreground`
- Description: `text-muted-foreground`

```tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ReactNode } from "react";

interface Step {
  id: number;
  title: string;
  description?: string;
  tooltip?: ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted && "border-primary bg-primary",
                    isCurrent && "border-primary bg-background",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border bg-background"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isCurrent
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                <div className="mt-2 max-w-[120px] text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <>
                      {step.tooltip ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <p className="mt-0.5 line-clamp-2 cursor-help text-xs text-muted-foreground transition-colors hover:text-foreground">
                              {step.description}
                            </p>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-3">
                            {step.tooltip}
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
              {!isLast && (
                <div className="mx-4 flex-1">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-all",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Stepper, type Step, type StepperProps };
```

---

### Task 8: Add stepper to registry.json

**Files:**
- Modify: `registry.json`

**Step 1: Add entry to items array**

```json
{
  "name": "stepper",
  "type": "registry:ui",
  "title": "Stepper",
  "description": "A horizontal multi-step progress indicator with completed, current, and pending states.",
  "dependencies": [
    "lucide-react"
  ],
  "registryDependencies": [
    "popover"
  ],
  "files": [
    {
      "path": "registry/default/stepper/stepper.tsx",
      "type": "registry:ui"
    }
  ]
}
```

---

### Task 9: Create stepper demo

**Files:**
- Create: `src/showcase/demos/stepper-demo.tsx`

**Step 1: Create demo file**

Demo should show:
1. Basic stepper with 4 steps, currentStep controlled by prev/next buttons
2. Stepper with descriptions
3. Stepper with tooltip on a step description

Use `useState` for currentStep. Steps example: "Details", "Review", "Approval", "Complete".

---

### Task 10: Create connection-banner registry component

**Files:**
- Create: `registry/default/connection-banner/connection-banner.tsx`

**Step 1: Create the component file**

```tsx
"use client";

import { useState } from "react";
import { WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ConnectionBannerProps {
  /** Whether the connection is currently online */
  isOnline: boolean;
  /** Called when the user clicks Retry */
  onRetry: () => void | Promise<void>;
  /** Custom message */
  message?: string;
  /** Additional className */
  className?: string;
}

function ConnectionBanner({
  isOnline,
  onRetry,
  message = "Can't connect to server",
  className,
}: ConnectionBannerProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  if (isOnline) return null;

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between bg-destructive px-4 text-destructive-foreground shadow-md transition-transform duration-300",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <WifiOff className="h-5 w-5" />
        <span className="font-medium">{message}</span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleRetry}
        disabled={isRetrying}
        className="bg-white text-destructive hover:bg-white/90 dark:bg-gray-100 dark:text-destructive dark:hover:bg-gray-200"
      >
        {isRetrying ? "Retrying..." : "Retry"}
      </Button>
    </div>
  );
}

export { ConnectionBanner, type ConnectionBannerProps };
```

---

### Task 11: Add connection-banner to registry.json

**Files:**
- Modify: `registry.json`

**Step 1: Add entry to items array**

```json
{
  "name": "connection-banner",
  "type": "registry:ui",
  "title": "Connection Banner",
  "description": "A fixed top banner that shows when the app loses connectivity, with a retry button.",
  "dependencies": [
    "lucide-react"
  ],
  "registryDependencies": [
    "button"
  ],
  "files": [
    {
      "path": "registry/default/connection-banner/connection-banner.tsx",
      "type": "registry:ui"
    }
  ]
}
```

---

### Task 12: Create connection-banner demo

**Files:**
- Create: `src/showcase/demos/connection-banner-demo.tsx`

**Step 1: Create demo file**

Demo should show:
1. Simulated offline state with toggle button to switch isOnline on/off
2. The banner appears/disappears based on state
3. Retry button triggers a simulated async retry (setTimeout 1s)

Use `useState` for isOnline toggle. Show the banner inside a relative container with `overflow-hidden rounded-lg border` so it doesn't cover the whole page. Override the `className` to use `position: relative` instead of `fixed` for demo purposes.

---

### Task 13: Create error-fallback registry component

**Files:**
- Create: `registry/default/error-fallback/error-fallback.tsx`

**Step 1: Create the component file**

```tsx
import { AlertCircle, RefreshCcw, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorFallbackProps {
  /** The error object */
  error: Error | unknown;
  /** Called when user clicks "Try Again" */
  onReset: () => void;
  /** Variant: "root" = full-screen with reload, "route" = inline with custom secondary */
  variant?: "root" | "route";
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Custom action button (replaces the secondary action: Reload/Go Home) */
  secondaryAction?: React.ReactNode;
  /** Show error details (e.g., in dev mode) */
  showDevDetails?: boolean;
  /** Additional className */
  className?: string;
}

function ErrorFallback({
  error,
  onReset,
  variant = "root",
  title = "Something went wrong",
  description,
  secondaryAction,
  showDevDetails = false,
  className,
}: ErrorFallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";

  const defaultDescription =
    description ??
    (variant === "root"
      ? "The application encountered an unexpected error. Please reload the page or try again."
      : "This section encountered an error. Please try again or navigate away.");

  const defaultSecondaryAction =
    variant === "root" ? (
      <Button
        onClick={() => window.location.reload()}
        variant="default"
        className="flex-1"
      >
        <RotateCcw className="mr-2 h-4 w-4" /> Reload Page
      </Button>
    ) : null;

  return (
    <div
      className={cn(
        "flex items-center justify-center p-4",
        variant === "root" ? "min-h-screen bg-background" : "min-h-[400px]",
        className
      )}
    >
      <Card className="w-full max-w-lg border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <CardTitle className="text-red-900 dark:text-red-100">
              {title}
            </CardTitle>
          </div>
          <CardDescription className="text-red-700 dark:text-red-300">
            {defaultDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showDevDetails && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
              <p className="break-all font-mono text-sm text-red-900 dark:text-red-100">
                {errorMessage}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={onReset} variant="outline" className="flex-1">
              <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            {secondaryAction ?? defaultSecondaryAction}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { ErrorFallback, type ErrorFallbackProps };
```

---

### Task 14: Add error-fallback to registry.json

**Files:**
- Modify: `registry.json`

**Step 1: Add entry to items array**

```json
{
  "name": "error-fallback",
  "type": "registry:ui",
  "title": "Error Fallback",
  "description": "An error boundary fallback with root (full-screen + reload) and route (inline + custom action) variants.",
  "dependencies": [
    "lucide-react"
  ],
  "registryDependencies": [
    "button",
    "card"
  ],
  "files": [
    {
      "path": "registry/default/error-fallback/error-fallback.tsx",
      "type": "registry:ui"
    }
  ]
}
```

---

### Task 15: Create error-fallback demo

**Files:**
- Create: `src/showcase/demos/error-fallback-demo.tsx`

**Step 1: Create demo file**

Demo should show:
1. Root variant (full-screen style, contained in bordered div)
2. Route variant (inline style)
3. With dev details shown
4. With custom secondary action

Use `ErrorFallback` from `@/components/ui/error-fallback`. Pass `onReset={() => alert("Reset clicked")}` for demos.

---

### Task 16: Register all 5 demos in showcase-app.tsx

**Files:**
- Modify: `src/showcase/showcase-app.tsx`

**Step 1: Add imports**

Add these imports after the existing import block (after `CodeLabelDemo`):

```tsx
import LoadingPageDemo from "./demos/loading-page-demo";
import AnimatedNumberDemo from "./demos/animated-number-demo";
import StepperDemo from "./demos/stepper-demo";
import ConnectionBannerDemo from "./demos/connection-banner-demo";
import ErrorFallbackDemo from "./demos/error-fallback-demo";
```

**Step 2: Add to COMPONENTS array**

Add these entries to the `COMPONENTS` array:

```tsx
{
  name: "loading-page",
  title: "Loading Page",
  description: "A full-screen loading state with optional logo, animated dots, and customizable message.",
  demo: LoadingPageDemo,
},
{
  name: "animated-number",
  title: "Animated Number",
  description: "A number display that animates smoothly between values using requestAnimationFrame with easeOutQuad easing.",
  demo: AnimatedNumberDemo,
},
{
  name: "stepper",
  title: "Stepper",
  description: "A horizontal multi-step progress indicator with completed, current, and pending states.",
  demo: StepperDemo,
},
{
  name: "connection-banner",
  title: "Connection Banner",
  description: "A fixed top banner that shows when the app loses connectivity, with a retry button.",
  demo: ConnectionBannerDemo,
},
{
  name: "error-fallback",
  title: "Error Fallback",
  description: "An error boundary fallback with root (full-screen + reload) and route (inline + custom action) variants.",
  demo: ErrorFallbackDemo,
},
```

**Step 3: Add to CATEGORIES**

- Add `"loading-page"`, `"connection-banner"`, `"error-fallback"` to the **Feedback** category filter
- Add `"animated-number"` to the **Data Display** category filter
- Add `"stepper"` to the **Navigation** category filter

---

### Task 17: Build registry and verify

**Step 1: Run registry build**

```bash
cd /Users/kyson/Developer/pandaworks/_pandahrms-workspace/pandahrms-ui-registry
pnpm registry:build
```

Expected: generates `public/r/loading-page.json`, `public/r/animated-number.json`, `public/r/stepper.json`, `public/r/connection-banner.json`, `public/r/error-fallback.json`

**Step 2: Run lint to verify**

```bash
pnpm lint
```

Expected: no errors

**Step 3: Verify dev server starts**

```bash
pnpm dev
```

Expected: Vite dev server starts without errors. All 5 new components visible in the showcase sidebar under their respective categories.
