import { forwardRef, type ButtonHTMLAttributes, type ElementType } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Archive,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Printer,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type ButtonAction =
  | "create"
  | "edit"
  | "save"
  | "delete"
  | "cancel"
  | "view"
  | "export"
  | "import"
  | "archive"
  | "duplicate"
  | "print"
  | "link"

interface ActionPreset {
  icon: ElementType
  variant: NonNullable<VariantProps<typeof buttonVariants>["variant"]>
  label: string
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px active:shadow-none active:transition-none disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        brand:
          "bg-brand text-brand-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_0_rgba(0,0,0,0.15)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.18)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(0,0,0,0.15)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.18)]",
        outline:
          "border border-border bg-background text-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-muted hover:shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_0_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_1px_0_rgba(0,0,0,0.2)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.25)]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline active:translate-y-0 shadow-none",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-7 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-6",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const ACTION_PRESETS: Record<ButtonAction, ActionPreset> = {
  create: { icon: Plus, variant: "brand", label: "Create" },
  edit: { icon: Pencil, variant: "outline", label: "Edit" },
  save: { icon: Save, variant: "brand", label: "Save" },
  delete: { icon: Trash2, variant: "destructive", label: "Delete" },
  cancel: { icon: X, variant: "outline", label: "Cancel" },
  view: { icon: Eye, variant: "ghost", label: "View" },
  export: { icon: Download, variant: "outline", label: "Export" },
  import: { icon: Upload, variant: "outline", label: "Import" },
  archive: { icon: Archive, variant: "secondary", label: "Archive" },
  duplicate: { icon: Copy, variant: "outline", label: "Duplicate" },
  print: { icon: Printer, variant: "outline", label: "Print" },
  link: { icon: ExternalLink, variant: "ghost", label: "Link" },
}

const ICON_SIZES = new Set<ButtonProps["size"]>(["icon", "icon-sm", "icon-lg"])

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  action?: ButtonAction
  icon?: ElementType
  tooltip?: string
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant: variantProp,
      size,
      asChild = false,
      action,
      icon: iconProp,
      tooltip,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const preset = action ? ACTION_PRESETS[action] : undefined
    const resolvedVariant = variantProp ?? preset?.variant ?? "default"
    const ResolvedIcon = loading ? Loader2 : (iconProp ?? preset?.icon ?? null)
    const isIconOnly = ICON_SIZES.has(size)

    // Auto-label: if action set, no children, and not icon-only, use preset label
    const resolvedChildren =
      children ?? (!isIconOnly && preset ? preset.label : undefined)

    const Comp = asChild ? Slot : "button"

    const button = (
      <Comp
        className={cn(
          buttonVariants({ variant: resolvedVariant, size, className })
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {ResolvedIcon && (
          <ResolvedIcon
            className={cn(loading && "animate-spin")}
          />
        )}
        {resolvedChildren}
      </Comp>
    )

    // Auto-tooltip for icon-only sizes
    if (isIconOnly && ResolvedIcon) {
      const tooltipText = tooltip ?? preset?.label
      if (tooltipText) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{tooltipText}</TooltipContent>
          </Tooltip>
        )
      }
    }

    return button
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonAction }
