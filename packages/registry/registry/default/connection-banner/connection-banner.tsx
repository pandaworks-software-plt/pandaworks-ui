import { useState } from "react";
import { WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ConnectionBannerProps {
  /** Whether the connection is currently online */
  isOnline: boolean;
  /** Called when the user clicks Retry */
  onRetry: () => void | Promise<void>;
  /** Custom message */
  message?: string;
  /** Additional className */
  className?: string;
}

function ConnectionBanner({
  isOnline,
  onRetry,
  message = "Can't connect to server",
  className,
}: ConnectionBannerProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  if (isOnline) return null;

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between bg-destructive px-4 text-destructive-foreground shadow-md transition-transform duration-300",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <WifiOff className="h-5 w-5" />
        <span className="font-medium">{message}</span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleRetry}
        disabled={isRetrying}
        className="bg-white text-destructive hover:bg-white/90 dark:bg-gray-100 dark:text-destructive dark:hover:bg-gray-200"
      >
        {isRetrying ? "Retrying..." : "Retry"}
      </Button>
    </div>
  );
}

export { ConnectionBanner, type ConnectionBannerProps };
