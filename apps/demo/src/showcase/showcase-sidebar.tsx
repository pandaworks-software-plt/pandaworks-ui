import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export interface SidebarCategory {
  label: string;
  items: { name: string; title: string }[];
}

interface ShowcaseSidebarProps {
  categories: SidebarCategory[];
  active: string;
  onSelect: (name: string) => void;
}

export function ShowcaseSidebar({
  categories,
  active,
  onSelect,
}: ShowcaseSidebarProps) {
  const [search, setSearch] = useState("");
  const query = search.toLowerCase();

  const filtered = categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query)
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-muted/30">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <h1 className="text-sm font-semibold tracking-tight">
          Pandahrms UI
        </h1>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
          Registry
        </span>
      </div>

      <div className="px-3 pt-3">
        <a
          href={`${import.meta.env.BASE_URL}saas-showcase`}
          className="group flex items-center justify-between rounded-md border bg-linear-to-br from-primary/10 via-primary/5 to-transparent px-3 py-2 text-sm transition-colors hover:border-primary/40"
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">SaaS showcase</p>
            <p className="text-xs text-muted-foreground group-hover:text-foreground">
              A full demo app using the registry
            </p>
          </div>
          <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-foreground" />
        </a>
      </div>

      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components..."
            className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {filtered.map((cat) => (
          <div key={cat.label} className="mb-4">
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {cat.label}
            </p>
            <ul className="space-y-0.5">
              {cat.items.map((item) => (
                <li key={item.name}>
                  {item.name === "full-demo" ? (
                    <a
                      href={`${import.meta.env.BASE_URL}full-demo.html`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      {item.title}
                      <ExternalLink className="size-3 opacity-50" />
                    </a>
                  ) : (
                    <button
                      onClick={() => onSelect(item.name)}
                      className={cn(
                        "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                        active === item.name
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {item.title}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">
            No components found.
          </p>
        )}
      </nav>

      <div className="flex items-center justify-between border-t px-4 py-3">
        <span className="text-xs text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
