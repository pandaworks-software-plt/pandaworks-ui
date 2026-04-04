import { AlertCircle, RefreshCcw, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorFallbackProps {
  /** The error object */
  error: unknown;
  /** Called when user clicks "Try Again" */
  onReset: () => void;
  /** Variant: "root" = full-screen with reload, "route" = inline with custom secondary */
  variant?: "root" | "route";
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Custom action button (replaces the secondary action: Reload/Go Home) */
  secondaryAction?: React.ReactNode;
  /** Show error details (e.g., in dev mode) */
  showDevDetails?: boolean;
  /** Additional className */
  className?: string;
}

function ErrorFallback({
  error,
  onReset,
  variant = "root",
  title = "Something went wrong",
  description,
  secondaryAction,
  showDevDetails = false,
  className,
}: ErrorFallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";

  const defaultDescription =
    description ??
    (variant === "root"
      ? "The application encountered an unexpected error. Please reload the page or try again."
      : "This section encountered an error. Please try again or navigate away.");

  const defaultSecondaryAction =
    !secondaryAction && variant === "root" ? (
      <Button
        onClick={() => window.location.reload()}
        variant="default"
        className="flex-1"
      >
        <RotateCcw className="mr-2 h-4 w-4" /> Reload Page
      </Button>
    ) : null;

  return (
    <div
      data-slot="error-fallback"
      className={cn(
        "flex items-center justify-center p-4",
        variant === "root" ? "min-h-screen bg-background" : "min-h-[400px]",
        className
      )}
    >
      <Card className="w-full max-w-lg border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <CardTitle className="text-red-900 dark:text-red-100">
              {title}
            </CardTitle>
          </div>
          <CardDescription className="text-red-700 dark:text-red-300">
            {defaultDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showDevDetails && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
              <p className="break-all font-mono text-sm text-red-900 dark:text-red-100">
                {errorMessage}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={onReset} variant="outline" className="flex-1">
              <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            {secondaryAction ?? defaultSecondaryAction}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { ErrorFallback, type ErrorFallbackProps };
