import { forwardRef, useRef, useState, useEffect, type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export interface ExpandableTextProps
  extends HTMLAttributes<HTMLDivElement> {
  /** Number of visible lines before collapsing. Default: 3 */
  visibleLines?: number
  /** Label for expand trigger. Default: "Show more" */
  showMoreLabel?: string
  /** Label for collapse trigger. Default: "Show less" */
  showLessLabel?: string
}

const ExpandableText = forwardRef<HTMLDivElement, ExpandableTextProps>(
  (
    {
      className,
      children,
      visibleLines = 3,
      showMoreLabel = "Show more",
      showLessLabel = "Show less",
      ...props
    },
    ref
  ) => {
    const contentRef = useRef<HTMLPreElement>(null)
    const [expanded, setExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)

    useEffect(() => {
      const el = contentRef.current
      if (!el || expanded) return

      const check = () => {
        setIsOverflowing(el.scrollHeight > el.clientHeight)
      }

      check()

      const observer = new ResizeObserver(check)
      observer.observe(el)
      return () => observer.disconnect()
    }, [children, visibleLines, expanded])

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <pre
          ref={contentRef}
          className={cn(
            "whitespace-pre-wrap break-words font-sans text-sm text-foreground",
            !expanded && "overflow-hidden"
          )}
          style={
            !expanded
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: visibleLines,
                  WebkitBoxOrient: "vertical" as const,
                }
              : undefined
          }
        >
          {children}
        </pre>
        {isOverflowing && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {expanded ? showLessLabel : showMoreLabel}
          </button>
        )}
      </div>
    )
  }
)
ExpandableText.displayName = "ExpandableText"

export { ExpandableText }
