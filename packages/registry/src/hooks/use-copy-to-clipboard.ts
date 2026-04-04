import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const RESET_DELAY_MS = 2000;

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copy = useCallback(async (value: string, onCopy?: (text: string) => void | Promise<void>) => {
    try {
      await navigator.clipboard.writeText(value);
      clearTimeout(timerRef.current);
      setCopied(true);
      if (onCopy) {
        await onCopy(value);
      } else {
        toast.success("Copied to clipboard");
      }
      timerRef.current = setTimeout(() => setCopied(false), RESET_DELAY_MS);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  return { copied, copy };
}
