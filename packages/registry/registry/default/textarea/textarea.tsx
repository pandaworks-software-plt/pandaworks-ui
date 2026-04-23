import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border border-input bg-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-sm shadow-xs transition-all duration-150 ease-out outline-none focus-visible:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
