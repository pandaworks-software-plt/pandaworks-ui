import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Puzzle, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const REPO_URL = 'https://github.com/pandaworks-sw/lucid-ui.git';
const PLUGIN_SPEC = 'lucid-ui@lucid-ui';

const INSTALL_COMMANDS = `/plugin marketplace add ${REPO_URL}
/plugin install ${PLUGIN_SPEC}`;

interface SkillEntry {
  name: string;
  badge: 'Auto-trigger' | 'Manual';
  icon: typeof Sparkles;
  summary: string;
  triggers?: string[];
  invocation?: string;
}

const SKILLS: SkillEntry[] = [
  {
    name: 'lucid-discover',
    badge: 'Auto-trigger',
    icon: Sparkles,
    summary:
      'Fires automatically when Claude Code starts UI work in a project that depends on @pandaworks-sw/lucid-ui. Fetches the live catalogue, picks the right component for the task, and enforces the design-system rules (heading font policy, button sizing, no className identity overrides, no hand-rolled palette colors).',
    triggers: [
      'add a button',
      'build a form',
      'wrapped number',
      'status pill',
      'empty state',
      'page header',
      'stat card',
      'data table',
    ],
  },
  {
    name: 'lucid-refactor',
    badge: 'Manual',
    icon: Wrench,
    summary:
      'Refactors a page (and the subcomponents it renders) to use lucid-ui components. Walks the import graph, inventories every primitive plus hand-rolled pattern, auto-replaces canonical patterns from the changelog, surfaces edge cases to the user, then validates with lint, tsc, and Playwright.',
    invocation: '/lucid-refactor <page-file-path-or-URL>',
  },
];

export function SkillsView() {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const installTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (installTimerRef.current) clearTimeout(installTimerRef.current);
    },
    []
  );

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMANDS);
      setCopiedInstall(true);
      if (installTimerRef.current) clearTimeout(installTimerRef.current);
      installTimerRef.current = setTimeout(() => setCopiedInstall(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Puzzle className="size-5 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Use with Claude Code</h1>
        </div>
        <p className="text-muted-foreground">
          Install the lucid-ui Claude Code plugin to give your agent first-class skills for this design system. The
          plugin ships a passive discovery skill that fires on UI intent and a manual refactor skill for migrating
          existing pages. Both run only in projects that list{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@pandaworks-sw/lucid-ui</code> in their
          package.json.
        </p>
        <p className="text-xs text-muted-foreground">
          For other AI coding agents (Cursor, Codex, Copilot), use the prompt on the{' '}
          <a href="#/ai-integration" className="text-foreground underline-offset-2 hover:underline">
            Use with AI
          </a>{' '}
          page instead.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Install (two commands)</h2>
          <Button size="sm" variant={copiedInstall ? 'secondary' : 'default'} onClick={copyInstall}>
            {copiedInstall ? (
              <>
                <Check className="mr-1.5 size-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1.5 size-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="relative rounded-lg border bg-muted">
          <button
            onClick={copyInstall}
            aria-label="Copy install commands"
            className={cn('absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground')}
          >
            {copiedInstall ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
          <pre className="overflow-x-auto p-4 pr-10">
            <code className="whitespace-pre-wrap font-mono text-sm text-foreground">{INSTALL_COMMANDS}</code>
          </pre>
        </div>
        <p className="text-xs text-muted-foreground">
          Run these inside a Claude Code session in your consumer project. The first command registers this repo as a
          marketplace; the second installs the lucid-ui plugin from it. Reload the session afterwards so the skills are
          picked up.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">What you get</h2>
        <div className="space-y-3">
          {SKILLS.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.name} className="rounded-lg border bg-background p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-medium text-foreground">
                        {skill.name}
                      </code>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-xs font-medium',
                          skill.badge === 'Auto-trigger'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {skill.badge}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{skill.summary}</p>
                    {skill.triggers && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-medium text-muted-foreground">Example trigger phrases</span>
                        <div className="flex flex-wrap gap-1.5">
                          {skill.triggers.map((t) => (
                            <span
                              key={t}
                              className="rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-xs text-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {skill.invocation && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-medium text-muted-foreground">Invocation</span>
                        <code className="block rounded-md border bg-muted/50 px-2 py-1 font-mono text-xs text-foreground">
                          {skill.invocation}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Verify the install</h2>
        <ul className="space-y-2 rounded-lg border bg-background p-4 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">1</span>
            <span>
              Open a new Claude Code session in a project that lists{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">@pandaworks-sw/lucid-ui</code> as a
              dependency.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">2</span>
            <span>
              Ask the agent something like &quot;add a status badge to the dashboard&quot;. The{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">lucid-discover</code> skill should fire
              and read the live catalogue before suggesting code.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-primary">3</span>
            <span>
              For a large refactor, run{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">/lucid-refactor &lt;page-path&gt;</code>{' '}
              to swap local primitives and hand-rolled patterns to lucid components in one pass.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
