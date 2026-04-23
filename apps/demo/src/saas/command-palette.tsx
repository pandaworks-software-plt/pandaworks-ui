import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, FolderKanban, LayoutDashboard, Plus, Settings, Users } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "./store";
import { useRouter, type Route } from "./router";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: () => void;
}

export function CommandPalette({ open, onOpenChange, onCreateProject }: CommandPaletteProps) {
  const { projects, members } = useStore();
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  function go(route: Route) {
    onOpenChange(false);
    navigate(route);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command className="**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-semibold **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider **:[[cmdk-group-heading]]:text-muted-foreground">
          <CommandInput placeholder="Search projects, teammates, or run a command..." value={query} onValueChange={setQuery} />
          <CommandList className="max-h-[60vh]">
            <CommandEmpty>No results for "{query}"</CommandEmpty>
            <CommandGroup heading="Quick actions">
              <CommandItem
                onSelect={() => {
                  onOpenChange(false);
                  onCreateProject();
                }}
              >
                <Plus className="size-4" />
                Create new project
              </CommandItem>
              <CommandItem onSelect={() => go({ name: "dashboard" })}>
                <LayoutDashboard className="size-4" />
                Go to dashboard
              </CommandItem>
              <CommandItem onSelect={() => go({ name: "projects" })}>
                <FolderKanban className="size-4" />
                Go to projects
              </CommandItem>
              <CommandItem onSelect={() => go({ name: "team" })}>
                <Users className="size-4" />
                Go to team
              </CommandItem>
              <CommandItem onSelect={() => go({ name: "reports" })}>
                <BarChart3 className="size-4" />
                Go to reports
              </CommandItem>
              <CommandItem onSelect={() => go({ name: "settings" })}>
                <Settings className="size-4" />
                Open settings
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {projects.slice(0, 6).map((p) => (
                <CommandItem
                  key={p.id}
                  value={`${p.name} ${p.key}`}
                  onSelect={() => go({ name: "project", id: p.id })}
                >
                  <FolderKanban className="size-4" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm">{p.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{p.key}</span>
                  </div>
                  <ArrowRight className="size-3 opacity-50" />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="People">
              {members.slice(0, 5).map((m) => (
                <CommandItem
                  key={m.id}
                  value={m.name}
                  onSelect={() => go({ name: "team" })}
                >
                  <Users className="size-4" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm">{m.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{m.role}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
