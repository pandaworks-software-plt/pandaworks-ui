import { forwardRef, type HTMLAttributes, type MouseEvent } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Copy, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

const codeLabelVariants = cva(
  "inline-flex items-center gap-2 rounded-md border font-mono bg-muted/50 text-foreground dark:bg-muted/20",
  {
    variants: {
      size: {
        default: "px-3 py-1.5 text-sm",
        sm: "px-2 py-1 text-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface CodeLabelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof codeLabelVariants> {
  value: string
}

const CodeLabel = forwardRef<HTMLDivElement, CodeLabelProps>(
  ({ className, size, value, ...props }, ref) => {
    const { copied, copy } = useCopyToClipboard()

    const handleCopy = async (e: MouseEvent) => {
      e.stopPropagation()
      await copy(value)
    }

    return (
      <div
        data-slot="code-label"
        ref={ref}
        className={cn(codeLabelVariants({ size }), className)}
        {...props}
      >
        <span className="min-w-0 truncate">{value}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
    )
  }
)
CodeLabel.displayName = "CodeLabel"

export { CodeLabel, codeLabelVariants }
