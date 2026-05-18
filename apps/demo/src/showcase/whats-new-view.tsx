import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WhatsNewEntry {
  date: string;
  componentName: string;
  title: string;
  summary: string;
  kind: 'added' | 'changed' | 'fixed';
}

const ENTRIES: WhatsNewEntry[] = [
  {
    date: '2026-05-18',
    componentName: 'avatar',
    title: 'Avatar transparent-PNG fix + blurred backdrop',
    summary:
      'Avatar Root now paints a bg-muted base so transparent-PNG avatars no longer bleed the page through the circle. AvatarImage also renders a self-blurred, desaturated, dimmed copy of the image behind the foreground at md / lg / xl sizes — an Apple-Music-style ambient halo. xs and sm skip the backdrop to keep dense lists cheap.',
    kind: 'fixed',
  },
  {
    date: '2026-05-18',
    componentName: 'avatar-group',
    title: 'AvatarGroup stacked separation',
    summary:
      'Each stacked avatar (and the +N overflow tile) now carries a 1px hairline border on top of the existing 2px background ring, so neighbouring circles read as clearly separated even when the avatar content is close in tone to the page background. The group also forwards the resolved size prop to each child Avatar so the new AvatarImage blurred-backdrop layer gates correctly inside groups.',
    kind: 'changed',
  },
  {
    date: '2026-05-16',
    componentName: 'table-list-cell',
    title: 'TableListCell',
    summary:
      'Two-line primary cell for Table rows: leading icon + eyebrow + title on the first line, optional flex-wrap meta strip below. Standardises the ticket / project / template listing row pattern. Ships with the sibling MetaDivider helper for separating meta groups.',
    kind: 'added',
  },
  {
    date: '2026-05-16',
    componentName: 'badge',
    title: 'Badge size variant',
    summary:
      'Badge gains a `size` prop (`default` | `xs`). `xs` produces a dense chip (`h-5 px-1.5 text-[11px] leading-none`) for meta strips inside table rows. Pairs with TableListCell. Existing call sites unaffected — `size` defaults to `default`.',
    kind: 'changed',
  },
  {
    date: '2026-05-14',
    componentName: 'inbox-menu',
    title: 'InboxMenu',
    summary:
      'Header-level notification center. Bell trigger with an unread-count badge, scrollable popover list, optional "Mark all read" + "View all" links. Controlled via items + callbacks.',
    kind: 'added',
  },
  {
    date: '2026-05-14',
    componentName: 'tag-input',
    title: 'TagInput',
    summary:
      'Free-form-and/or-allowlist multi-tag input. Type + Enter/comma to commit, Backspace to remove the last chip. Optional `suggestions` opens an autocomplete popover; `allowFreeForm={false}` locks to the suggestion list.',
    kind: 'added',
  },
  {
    date: '2026-05-14',
    componentName: 'settings-row',
    title: 'SettingsRow',
    summary:
      'Pure-layout row for /settings/* pages: title + description + helper + control + trailing slot. Inline or stacked layout. Opt-in per-row Save / Cancel via the `showSave` prop.',
    kind: 'added',
  },
  {
    date: '2026-05-14',
    componentName: 'theme-toggle',
    title: 'ThemeToggle',
    summary:
      'Icon-only dropdown that switches the app between light, dark, and system themes. Persists the choice in localStorage and ships an `applyStoredTheme()` helper for app-entry no-FOUC bootstrap.',
    kind: 'added',
  },
  {
    date: '2026-05-12',
    componentName: 'alert-dialog',
    title: 'AlertDialog motion update',
    summary:
      "Show/hide animation now slides up from the bottom, matching Modal's motion so confirmation prompts feel like part of the same family.",
    kind: 'changed',
  },
  {
    date: '2026-05-12',
    componentName: 'modal',
    title: 'Modal sizes; Dialog removed',
    summary:
      'Modal gains a `size` prop (sm / default / lg) so it can cover the old Dialog footprint. Dialog and its sub-exports are no longer public — migrate to Modal (form prompts) or AlertDialog (confirmations).',
    kind: 'changed',
  },
];

function groupByDate(entries: WhatsNewEntry[]): { date: string; items: WhatsNewEntry[] }[] {
  const map = new Map<string, WhatsNewEntry[]>();
  for (const entry of entries) {
    const list = map.get(entry.date) ?? [];
    list.push(entry);
    map.set(entry.date, list);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, items]) => ({ date, items }));
}

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function kindVariant(kind: WhatsNewEntry['kind']): 'success' | 'info' | 'warning' {
  if (kind === 'added') return 'success';
  if (kind === 'changed') return 'info';
  return 'warning';
}

export function WhatsNewView() {
  const groups = groupByDate(ENTRIES);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-semibold tracking-tight">What's new</h1>
        </div>
        <p className="text-muted-foreground">
          A short log of recent additions, changes, and fixes in the lucid-ui registry. For the full history, see{' '}
          <a
            href="https://github.com/pandaworks-sw/lucid-ui/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            CHANGELOG.md
          </a>
          .
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.date} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {formatDate(group.date)}
            </h2>
            <ul className="space-y-3">
              {group.items.map((entry) => (
                <li
                  key={`${entry.date}-${entry.componentName}-${entry.title}`}
                  className={cn('rounded-lg border bg-card p-4 transition-colors hover:border-border')}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant={kindVariant(entry.kind)} className="capitalize">
                      {entry.kind}
                    </Badge>
                    <a
                      href={`#/${entry.componentName}`}
                      className="text-sm font-semibold text-foreground hover:text-primary hover:underline"
                    >
                      {entry.title}
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
