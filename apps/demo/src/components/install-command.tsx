import { Check, Copy } from "lucide-react";
import { useState } from "react";

const BASE_URL =
  "https://raw.githubusercontent.com/pandaworks-software-plt/pandaworks-ui/main/public/r";

export function InstallCommand({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);
  const command = `pnpm dlx shadcn@latest add ${BASE_URL}/${name}.json`;

  function copy() {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted px-4 py-2 font-mono text-sm">
      <code className="flex-1 truncate text-muted-foreground">{command}</code>
      <button
        onClick={copy}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}
