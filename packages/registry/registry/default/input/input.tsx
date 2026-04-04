import { forwardRef, type ComponentProps } from "react"

import { cn } from "@/lib/utils"

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        data-slot="input"
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all duration-150 ease-out ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:shadow-[0_1px_2px_rgba(0,0,0,0.06)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
