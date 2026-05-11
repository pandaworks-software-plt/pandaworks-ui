import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SITE_URL = 'https://pandaworks-sw.github.io/lucid-ui';

const AI_PROMPT = `I want to use the Lucid UI component library in this React project.

Read these first, in order:

1. ${SITE_URL}/llms.txt — the catalog. Every component, a one-line description, links to per-component docs, a decision guide, and a changelog. Always start here. Never recommend a component without confirming it exists in this catalog.
2. ${SITE_URL}/docs/<name>.md — per-component or per-category API docs (e.g. button.md, forms.md, decision-guide.md). Fetch on demand for props or usage examples.

Lucid is distributed as the \`@pandaworks-sw/lucid-ui\` npm package on **GitHub Packages** (not the public npm registry).

Setup:

1. Add \`.npmrc\` at the project root:

   @pandaworks-sw:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}

2. Set \`GITHUB_TOKEN\` (classic PAT with \`read:packages\` scope) on every developer machine and CI job that runs \`pnpm install\`.

3. Install: \`pnpm add @pandaworks-sw/lucid-ui\`

4. Wire up Tailwind v4 + design tokens in your app's entry CSS:

   @import "tailwindcss";
   @import "@pandaworks-sw/lucid-ui/styles.css";
   @source "../node_modules/@pandaworks-sw/lucid-ui";

5. Import components: \`import { Button, Badge, Modal, StatCard } from '@pandaworks-sw/lucid-ui';\`

Peer deps: \`react >=19\`, \`react-dom >=19\`, \`lucide-react >=0.500\`, \`react-hook-form >=7\`, \`tailwindcss >=4\`. Fonts (Inter, Comfortaa, JetBrains Mono) are not bundled — load them via Google Fonts \`<link>\` in your index.html.

Rules:
- Always fetch llms.txt before suggesting components — the catalog is the source of truth, not your training data.
- Prefer Lucid components over hand-rolling UI. If a screen needs something not in the catalog, say so explicitly rather than inventing it.
- For Button actions, use the action prop (\`action="create" | "edit" | "save" | "delete" | ...\`) instead of manually wiring icon + variant + label. See docs/button.md.
- Use design tokens (primary, secondary, muted, accent, destructive, foreground, background, border, ring, card, popover, brand, success, info, warning) — not hardcoded palette colors like \`bg-emerald-500\`.
- Customizations land upstream in the lucid-ui repo. Don't fork a single component locally — open a PR or wrap the component in a project-local component.
- Never re-export a Lucid component with a tweaked default — wrap with a clearly-named project component instead.
`;

export function AiIntegrationView() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(AI_PROMPT);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Use with an AI Agent</h1>
        </div>
        <p className="text-muted-foreground">
          Paste this prompt into Claude Code, Cursor, Copilot, or any other AI coding agent. It points the agent at the
          library's <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">llms.txt</code> catalog and tells
          it how to install the{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@pandaworks-sw/lucid-ui</code> npm package
          from GitHub Packages.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">AI integration prompt</h2>
          <Button size="sm" variant={copied ? 'secondary' : 'default'} onClick={copyPrompt}>
            {copied ? (
              <>
                <Check className="mr-1.5 size-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1.5 size-3.5" />
                Copy prompt
              </>
            )}
          </Button>
        </div>
        <div className="relative rounded-lg border bg-muted">
          <button
            onClick={copyPrompt}
            aria-label="Copy prompt"
            className={cn('absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground')}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
          <pre className="overflow-x-auto p-4 pr-10">
            <code className="whitespace-pre-wrap font-mono text-sm text-foreground">{AI_PROMPT}</code>
          </pre>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">What the agent will fetch</h2>
        <ul className="space-y-2 rounded-lg border bg-background p-4 text-sm">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">llms.txt</span>
            <a
              href={`${SITE_URL}/llms.txt`}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-muted-foreground hover:text-foreground hover:underline"
            >
              {SITE_URL}/llms.txt
            </a>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">docs/</span>
            <a
              href={`${SITE_URL}/docs/decision-guide.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-muted-foreground hover:text-foreground hover:underline"
            >
              {SITE_URL}/docs/&lt;name&gt;.md
            </a>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">npm</span>
            <span className="break-all text-muted-foreground">
              @pandaworks-sw/lucid-ui{' '}
              <span className="text-foreground/60">(GitHub Packages, not the public npm registry)</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
