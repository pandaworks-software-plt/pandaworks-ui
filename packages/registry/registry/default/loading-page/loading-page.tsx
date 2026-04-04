import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface LoadingPageProps {
  /** Logo or icon to display above the loading dots */
  logo?: ReactNode;
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
      data-slot="loading-page"
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
