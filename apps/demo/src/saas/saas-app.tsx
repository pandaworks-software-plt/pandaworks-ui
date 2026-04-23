import { forwardRef, useCallback, useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Plus,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { RouterProvider, useRouter } from "./router";
import { StoreProvider, useStore } from "./store";
import { Dashboard } from "./dashboard";
import { ProjectsList } from "./projects-list";
import { ProjectDetail } from "./project-detail";
import { Team } from "./team";
import { Reports } from "./reports";
import { Settings } from "./settings";
import { ProjectFormModal } from "./project-form-modal";
import { CommandPalette } from "./command-palette";
import { MemberAvatar } from "./shared";
import { cn } from "@/lib/utils";

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const ShellLink = forwardRef<HTMLAnchorElement, LinkProps>(({ href, children, className, ...rest }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      window.location.hash = href;
    }
  };

  return (
    <a ref={ref} href={href} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
});
ShellLink.displayName = "ShellLink";

function useCurrentRouteName() {
  const { route } = useRouter();
  return route.name;
}

function TopBar({
  onCreateProject,
  onOpenPalette,
}: {
  onCreateProject: () => void;
  onOpenPalette: () => void;
}) {
  const { currentUser } = useStore();

  return (
    <div className="flex w-full items-center gap-3">
      <button
        type="button"
        onClick={onOpenPalette}
        className="flex h-8 flex-1 items-center gap-2 rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-muted sm:max-w-md"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">Search projects, people, or commands…</span>
        <kbd className="hidden items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-xs font-medium sm:inline-flex">
          <span>⌘</span>K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="brand" size="sm" className="hidden sm:inline-flex" onClick={onCreateProject}>
          <Plus className="size-4" />
          New project
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          onClick={() => toast("No new notifications", { icon: <Bell className="size-4" /> })}
        >
          <Bell className="size-4" />
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account"
              className="ml-1 rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <MemberAvatar member={currentUser} size="sm" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-3 py-2">
              <MemberAvatar member={currentUser} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{currentUser.name}</p>
                <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => (window.location.hash = "#/settings?tab=profile")}>
              <User className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.hash = "#/settings")}>
              <SettingsIcon className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Help docs opened")}>
              <LifeBuoy className="size-4" />
              Help & docs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast("Signed out (demo)")} className="text-destructive focus:text-destructive">
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function PageRenderer() {
  const { route } = useRouter();
  switch (route.name) {
    case "dashboard":
      return <Dashboard />;
    case "projects":
      return <ProjectsList />;
    case "project":
      return <ProjectDetail projectId={route.id} />;
    case "team":
      return <Team />;
    case "reports":
      return <Reports />;
    case "settings":
      return <Settings />;
  }
}

function SaasShell() {
  const active = useCurrentRouteName();
  const { addProject } = useStore();
  const { navigate } = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const handleCreateProject = useCallback(() => setCreateOpen(true), []);

  return (
    <>
      <AppShell
        branding={{
          name: "Pandawork",
          href: "#/dashboard",
        }}
        navigation={[
          {
            label: "Workspace",
            href: "#/dashboard",
            icon: LayoutDashboard,
            active: active === "dashboard",
          },
          {
            label: "Projects",
            href: "#/projects",
            icon: FolderKanban,
            active: active === "projects" || active === "project",
          },
          {
            label: "Team",
            href: "#/team",
            icon: Users,
            active: active === "team",
          },
          {
            label: "Reports",
            href: "#/reports",
            icon: BarChart3,
            active: active === "reports",
          },
          { type: "separator" },
          {
            label: "Settings",
            href: "#/settings",
            icon: SettingsIcon,
            active: active === "settings",
          },
        ]}
        user={{
          name: "Ahmad Razif",
          email: "ahmad.razif@pandaworks.com",
          actions: [
            { label: "Profile", href: "#/settings?tab=profile", icon: User },
            { label: "Settings", href: "#/settings", icon: SettingsIcon },
            {
              label: "Sign out",
              onClick: () => toast("Signed out (demo)"),
              icon: LogOut,
              variant: "destructive",
            },
          ],
        }}
        header={
          <TopBar
            onCreateProject={handleCreateProject}
            onOpenPalette={() => setPaletteOpen(true)}
          />
        }
        linkComponent={ShellLink}
        maxWidth={1400}
        contentClassName={cn("p-6 lg:p-8")}
      >
        <div className="mx-auto max-w-[1200px]">
          <DemoBanner />
          <PageRenderer />
        </div>
      </AppShell>

      <ProjectFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(input) => {
          const created = addProject(input);
          toast.success("Project created", {
            description: `${created.name} · ${created.key}`,
            action: {
              label: "Open",
              onClick: () => navigate({ name: "project", id: created.id }),
            },
          });
        }}
      />

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onCreateProject={handleCreateProject}
      />
    </>
  );
}

function DemoBanner() {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("saas-demo-banner") === "1");
  if (dismissed) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border bg-pattern-aurora-indigo p-3 text-sm">
      <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Sparkles className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium">Pandawork · a full-stack showcase built on Pandaworks UI.</p>
        <p className="text-xs text-muted-foreground">
          Everything on this screen — the shell, forms, modals, toasts, and tables — is wired from the registry.
          State is in-memory, so feel free to poke around.
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          sessionStorage.setItem("saas-demo-banner", "1");
          setDismissed(true);
        }}
      >
        Got it
      </Button>
    </div>
  );
}

export default function SaasApp() {
  return (
    <TooltipProvider>
      <StoreProvider>
        <RouterProvider>
          <SaasShell />
          <Toaster position="bottom-right" richColors closeButton />
        </RouterProvider>
      </StoreProvider>
    </TooltipProvider>
  );
}
