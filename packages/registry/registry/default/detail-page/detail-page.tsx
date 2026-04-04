import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react"
import { ArrowLeft, Copy, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

/* ---------------------------------- Root ---------------------------------- */

const DetailPage = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    data-slot="detail-page"
    ref={ref}
    className={cn("space-y-6", className)}
    {...props}
  />
))
DetailPage.displayName = "DetailPage"

/* --------------------------------- Header --------------------------------- */

interface DetailPageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  backHref?: string
  backLabel?: string
  icon?: ReactNode
  title: string
  subtitle?: string
  actions?: ReactNode
}

const DetailPageHeader = forwardRef<HTMLDivElement, DetailPageHeaderProps>(
  ({ className, backHref, backLabel, icon, title, subtitle, actions, ...props }, ref) => (
    <div data-slot="detail-page-header" ref={ref} className={cn("space-y-3", className)} {...props}>
      {backHref && (
        <a
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </a>
      )}
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground dark:bg-muted/20">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  )
)
DetailPageHeader.displayName = "DetailPageHeader"

/* ---------------------------------- Main ---------------------------------- */

const DetailPageMain = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    data-slot="detail-page-main"
    ref={ref}
    className={cn(
      "grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]",
      className
    )}
    {...props}
  />
))
DetailPageMain.displayName = "DetailPageMain"

/* -------------------------------- Content --------------------------------- */

const DetailPageContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    data-slot="detail-page-content"
    ref={ref}
    className={cn("min-w-0 space-y-6", className)}
    {...props}
  />
))
DetailPageContent.displayName = "DetailPageContent"

/* -------------------------------- Sidebar --------------------------------- */

const DetailPageSidebar = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <aside
    data-slot="detail-page-sidebar"
    ref={ref}
    className={cn(
      "space-y-0 lg:sticky lg:top-6 lg:self-start",
      className
    )}
    {...props}
  />
))
DetailPageSidebar.displayName = "DetailPageSidebar"

/* ------------------------------ Meta Item --------------------------------- */

interface DetailPageMetaItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: ReactNode
  copyable?: boolean
  onCopyValue?: (text: string) => void | Promise<void>
}

function CopyButton({ value, onCopyValue }: { value: string; onCopyValue?: (text: string) => void | Promise<void> }) {
  const { copied, copy } = useCopyToClipboard()

  const handleCopy = async (e: MouseEvent) => {
    e.stopPropagation()
    await copy(value, onCopyValue)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}

const DetailPageMetaItem = forwardRef<
  HTMLDivElement,
  DetailPageMetaItemProps
>(({ className, label, value, copyable, onCopyValue, ...props }, ref) => (
  <div
    data-slot="detail-page-meta-item"
    ref={ref}
    className={cn(
      "border-b py-3 first:pt-0 last:border-b-0",
      className
    )}
    {...props}
  >
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="mt-0.5 flex items-center gap-1.5">
      <span className="min-w-0 truncate text-sm font-medium">{value}</span>
      {copyable && typeof value === "string" && <CopyButton value={value} onCopyValue={onCopyValue} />}
    </div>
  </div>
))
DetailPageMetaItem.displayName = "DetailPageMetaItem"

/* -------------------------------- Exports --------------------------------- */

export {
  DetailPage,
  DetailPageHeader,
  DetailPageMain,
  DetailPageContent,
  DetailPageSidebar,
  DetailPageMetaItem,
}
export type { DetailPageHeaderProps, DetailPageMetaItemProps }
