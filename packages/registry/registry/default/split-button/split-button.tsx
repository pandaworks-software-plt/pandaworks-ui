import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────
   Variant styles (shared between action & trigger)
   ───────────────────────────────────────────── */

const splitButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type SplitButtonVariant = NonNullable<
  VariantProps<typeof splitButtonVariants>["variant"]
>
type SplitButtonSize = "sm" | "default" | "lg"

/* ─────────────────────────────────────────────
   Size maps
   ───────────────────────────────────────────── */

const actionSizeClasses: Record<SplitButtonSize, string> = {
  sm: "h-7 px-3 text-xs",
  default: "h-9 px-4",
  lg: "h-11 px-6",
}

const triggerSizeClasses: Record<SplitButtonSize, string> = {
  sm: "h-7 w-7",
  default: "h-9 w-9",
  lg: "h-11 w-11",
}

/* ─────────────────────────────────────────────
   Divider styles per variant
   ───────────────────────────────────────────── */

const dividerClasses: Record<SplitButtonVariant, string> = {
  default: "border-l border-primary-foreground/20",
  destructive: "border-l border-destructive-foreground/20",
  outline: "border-l-0",
  secondary: "border-l border-secondary-foreground/15",
  ghost: "border-l border-input",
}

/* ─────────────────────────────────────────────
   Context
   ───────────────────────────────────────────── */

interface SplitButtonContextValue {
  variant: SplitButtonVariant
  size: SplitButtonSize
  disabled: boolean
  loading: boolean
}

const SplitButtonContext = createContext<SplitButtonContextValue>({
  variant: "default",
  size: "default",
  disabled: false,
  loading: false,
})

/* ─────────────────────────────────────────────
   SplitButton (root)
   ───────────────────────────────────────────── */

interface SplitButtonProps {
  variant?: SplitButtonVariant
  size?: SplitButtonSize
  disabled?: boolean
  loading?: boolean
  children: ReactNode
  className?: string
}

function SplitButton({
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  children,
  className,
}: SplitButtonProps) {
  const ctx = useMemo(
    () => ({ variant, size, disabled: disabled || loading, loading }),
    [variant, size, disabled, loading]
  )

  return (
    <SplitButtonContext.Provider value={ctx}>
      <DropdownMenuPrimitive.Root>
        <div className={cn("inline-flex items-stretch", className)}>
          {children}
        </div>
      </DropdownMenuPrimitive.Root>
    </SplitButtonContext.Provider>
  )
}

/* ─────────────────────────────────────────────
   SplitButtonAction (left side)
   ───────────────────────────────────────────── */

interface SplitButtonActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const SplitButtonAction = forwardRef<
  HTMLButtonElement,
  SplitButtonActionProps
>(({ className, children, disabled: disabledProp, ...props }, ref) => {
  const { variant, size, disabled, loading } =
    useContext(SplitButtonContext)

  return (
    <button
      ref={ref}
      disabled={disabled || disabledProp}
      className={cn(
        splitButtonVariants({ variant }),
        actionSizeClasses[size],
        "rounded-l-md rounded-r-none",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </button>
  )
})
SplitButtonAction.displayName = "SplitButtonAction"

/* ─────────────────────────────────────────────
   SplitButtonMenu (right side: trigger + content)
   ───────────────────────────────────────────── */

interface SplitButtonMenuProps {
  children: ReactNode
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  className?: string
  contentClassName?: string
}

function SplitButtonMenu({
  children,
  align = "end",
  side = "bottom",
  className,
  contentClassName,
}: SplitButtonMenuProps) {
  const { variant, size, disabled } = useContext(SplitButtonContext)

  return (
    <>
      <DropdownMenuPrimitive.Trigger asChild>
        <button
          disabled={disabled}
          className={cn(
            splitButtonVariants({ variant }),
            triggerSizeClasses[size],
            dividerClasses[variant],
            "rounded-l-none rounded-r-md",
            className
          )}
        >
          <ChevronDown className="size-4" />
          <span className="sr-only">More options</span>
        </button>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          side={side}
          sideOffset={4}
          className={cn(
            "z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "origin-[--radix-dropdown-menu-content-transform-origin]",
            contentClassName
          )}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </>
  )
}

/* ─────────────────────────────────────────────
   Re-export dropdown primitives for convenience
   ───────────────────────────────────────────── */

const SplitButtonMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))
SplitButtonMenuItem.displayName = "SplitButtonMenuItem"

const SplitButtonMenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SplitButtonMenuSeparator.displayName = "SplitButtonMenuSeparator"

const SplitButtonMenuLabel = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
    {...props}
  />
))
SplitButtonMenuLabel.displayName = "SplitButtonMenuLabel"

export {
  SplitButton,
  SplitButtonAction,
  SplitButtonMenu,
  SplitButtonMenuItem,
  SplitButtonMenuSeparator,
  SplitButtonMenuLabel,
  splitButtonVariants,
}
