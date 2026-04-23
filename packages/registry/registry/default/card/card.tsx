import { forwardRef, type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type CardColor =
  | "blue"
  | "purple"
  | "peach"
  | "indigo"
  | "green"
  | "amber"
  | "rose"
  | "teal"

const colorGradients: Record<CardColor, string> = {
  blue: "bg-gradient-to-b from-blue-100/80 via-white via-40% to-white border-blue-200/60 dark:from-blue-950/60 dark:via-card dark:via-40% dark:to-card dark:border-blue-800/40",
  purple:
    "bg-gradient-to-b from-purple-100/80 via-white via-40% to-white border-purple-200/60 dark:from-purple-950/60 dark:via-card dark:via-40% dark:to-card dark:border-purple-800/40",
  peach:
    "bg-gradient-to-b from-orange-100/80 via-white via-40% to-white border-orange-200/60 dark:from-orange-950/60 dark:via-card dark:via-40% dark:to-card dark:border-orange-800/40",
  indigo:
    "bg-gradient-to-b from-indigo-100/80 via-white via-40% to-white border-indigo-200/60 dark:from-indigo-950/60 dark:via-card dark:via-40% dark:to-card dark:border-indigo-800/40",
  green:
    "bg-gradient-to-b from-green-100/80 via-white via-40% to-white border-green-200/60 dark:from-green-950/60 dark:via-card dark:via-40% dark:to-card dark:border-green-800/40",
  amber:
    "bg-gradient-to-b from-amber-100/80 via-white via-40% to-white border-amber-200/60 dark:from-amber-950/60 dark:via-card dark:via-40% dark:to-card dark:border-amber-800/40",
  rose: "bg-gradient-to-b from-rose-100/80 via-white via-40% to-white border-rose-200/60 dark:from-rose-950/60 dark:via-card dark:via-40% dark:to-card dark:border-rose-800/40",
  teal: "bg-gradient-to-b from-teal-100/80 via-white via-40% to-white border-teal-200/60 dark:from-teal-950/60 dark:via-card dark:via-40% dark:to-card dark:border-teal-800/40",
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  color?: CardColor
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, color, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border/70 bg-card text-card-foreground shadow-xs transition-shadow duration-200 hover:shadow-sm dark:border-border",
        color && colorGradients[color],
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 p-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardAction = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-action"
    className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
    {...props}
  />
))
CardAction.displayName = "CardAction"

const CardTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardAction }
