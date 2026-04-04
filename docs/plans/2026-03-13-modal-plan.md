# Modal Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a Modal registry component that wraps Dialog with sticky header, scrollable body, sticky footer, and `sm:min-w-4xl` default width.

**Architecture:** Wrapper component over existing Dialog primitives. Re-exports `Dialog`, `DialogTrigger`, `DialogClose` as `Modal`, `ModalTrigger`, `ModalClose`. New sub-components `ModalContent`, `ModalHeader`, `ModalBody`, `ModalFooter` provide the opinionated layout.

**Tech Stack:** React, Radix UI Dialog (via existing dialog component), Tailwind CSS, Lucide icons

---

### Task 1: Create modal.tsx component file

**Files:**
- Create: `registry/default/modal/modal.tsx`

**Step 1: Create the modal directory**

Run: `mkdir -p registry/default/modal`

**Step 2: Write modal.tsx**

Create `registry/default/modal/modal.tsx` with this content:

```tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog"

const Modal = Dialog

const ModalTrigger = DialogTrigger

const ModalClose = DialogClose

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full sm:min-w-4xl max-w-4xl translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        "flex flex-col max-h-[85vh] p-0",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
ModalContent.displayName = "ModalContent"

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  showCloseButton?: boolean
}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, title, description, showCloseButton = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 px-6 py-4 border-b sm:text-left",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
        {title}
      </DialogPrimitive.Title>
      {description && (
        <DialogPrimitive.Description className="text-sm text-muted-foreground">
          {description}
        </DialogPrimitive.Description>
      )}
      {showCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </div>
  )
)
ModalHeader.displayName = "ModalHeader"

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto px-6 py-4", className)}
    {...props}
  />
))
ModalBody.displayName = "ModalBody"

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 py-4 border-t",
      className
    )}
    {...props}
  />
)
ModalFooter.displayName = "ModalFooter"

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
}
```

---

### Task 2: Add modal entry to registry.json

**Files:**
- Modify: `registry.json`

**Step 1: Add the modal entry**

Add this entry to the `items` array in `registry.json` (after the `dialog` entry):

```json
{
  "name": "modal",
  "type": "registry:ui",
  "title": "Modal",
  "description": "An opinionated modal with sticky header, scrollable body, and sticky footer built on Dialog.",
  "dependencies": [
    "@radix-ui/react-dialog"
  ],
  "registryDependencies": [
    "dialog"
  ],
  "files": [
    {
      "path": "registry/default/modal/modal.tsx",
      "type": "registry:ui"
    }
  ]
}
```

---

### Task 3: Build the registry and verify

**Step 1: Run registry build**

Run: `pnpm registry:build`
Expected: Builds successfully, generates `public/r/modal.json`

**Step 2: Verify the output file exists**

Run: `ls public/r/modal.json`
Expected: File exists

**Step 3: Verify the output content**

Read `public/r/modal.json` and confirm it contains the modal component code and lists `dialog` as a registry dependency.

---

### Task 4: Lint check

**Step 1: Run linter**

Run: `pnpm lint`
Expected: No errors in `registry/default/modal/modal.tsx`
