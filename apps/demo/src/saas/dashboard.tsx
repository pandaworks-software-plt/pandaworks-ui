import { useMemo } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  FolderKanban,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useStore } from "./store";
import { useRouter } from "./router";
import { MemberAvatar, MemberStack, PriorityBadge, StatusPill, formatDate, relativeTime } from "./shared";
import type { Project } from "./types";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  hint: string;
  delta?: string;
  deltaTone?: "up" | "down" | "flat";
  accent?: string;
}

function StatCard({ icon: Icon, label, value, suffix, hint, delta, deltaTone = "up", accent }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", accent)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-semibold tracking-tight">
          <AnimatedNumber value={value} />
          {suffix && <span className="text-base font-medium text-muted-foreground">{suffix}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{hint}</span>
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
                deltaTone === "up" &&
                  "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
                deltaTone === "down" &&
                  "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
                deltaTone === "flat" && "bg-muted text-muted-foreground",
              )}
            >
              <TrendingUp className="size-3" />
              {delta}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DepartmentChart({ projects, memberLookup }: { projects: Project[]; memberLookup: Record<string, string> }) {
  const totals = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) {
      for (const mid of p.memberIds) {
        const dept = memberLookup[mid];
        if (!dept) continue;
        map.set(dept, (map.get(dept) ?? 0) + 1);
      }
    }
    const arr = Array.from(map.entries()).map(([dept, count]) => ({ dept, count }));
    arr.sort((a, b) => b.count - a.count);
    return arr;
  }, [projects, memberLookup]);

  const max = Math.max(...totals.map((t) => t.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Team allocation</CardTitle>
        <CardDescription>Seats by department across active projects.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {totals.map(({ dept, count }) => (
          <div key={dept} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{dept}</span>
              <span className="tabular-nums text-muted-foreground">{count}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { projects, tasks, members, activity } = useStore();
  const { navigate } = useRouter();

  const activeProjects = projects.filter((p) => p.status === "active");
  const tasksDue = tasks.filter((t) => t.status !== "done").length;
  const tasksDone = tasks.filter((t) => t.status === "done").length;
  const completion = tasks.length > 0 ? Math.round((tasksDone / tasks.length) * 100) : 0;

  const memberLookup = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m.department])),
    [members],
  );

  const memberById = useMemo(() => Object.fromEntries(members.map((m) => [m.id, m])), [members]);

  const spotlight = [...activeProjects]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);

  const upcoming = [...tasks]
    .filter((t) => t.status !== "done")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Workspace"
        description="Snapshot of projects, tasks, and team activity across Pandawork."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate({ name: "reports" })}>
              View reports
            </Button>
            <Button variant="brand" size="sm" onClick={() => navigate({ name: "projects" })}>
              Browse projects
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FolderKanban}
          label="Active projects"
          value={activeProjects.length}
          hint={`of ${projects.length} total`}
          delta="+2 QoQ"
          accent="bg-pattern-aurora-blue"
        />
        <StatCard
          icon={ClipboardList}
          label="Open tasks"
          value={tasksDue}
          hint="across all projects"
          delta="+11%"
          deltaTone="down"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completion rate"
          value={completion}
          suffix="%"
          hint="of all tasks shipped"
          delta="+4 pts"
          accent="bg-pattern-aurora-green"
        />
        <StatCard
          icon={Users}
          label="People"
          value={members.length}
          hint="across 5 departments"
          delta="+1"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Spotlight projects</CardTitle>
              <CardDescription>Biggest bets currently in flight.</CardDescription>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate({ name: "projects" })}>
              See all
            </Button>
          </CardHeader>
          <CardContent className="space-y-0">
            {spotlight.map((project, idx) => {
              const owner = memberById[project.ownerId];
              const teamMembers = project.memberIds.map((id) => memberById[id]).filter(Boolean);
              const openTasks = tasks.filter(
                (t) => t.projectId === project.id && t.status !== "done",
              ).length;
              return (
                <div key={project.id}>
                  {idx > 0 && <Separator className="my-4" />}
                  <button
                    type="button"
                    onClick={() => navigate({ name: "project", id: project.id })}
                    className="group flex w-full flex-col gap-3 text-left transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {project.key}
                          </code>
                          <h4 className="truncate text-sm font-semibold group-hover:text-primary">
                            {project.name}
                          </h4>
                        </div>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <StatusPill status={project.status} />
                        <PriorityBadge priority={project.priority} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span className="tabular-nums">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                      <div className="hidden sm:flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Owner</p>
                          <p className="text-xs font-medium">{owner?.name ?? "—"}</p>
                        </div>
                        <MemberStack members={teamMembers} size="xs" max={3} />
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Open</p>
                          <p className="text-xs font-medium tabular-nums">{openTasks}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <DepartmentChart projects={projects} memberLookup={memberLookup} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Upcoming deadlines</CardTitle>
              <CardDescription>Tasks due soonest, across all projects.</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Clock className="size-3" />
              {upcoming.length}
            </Badge>
          </CardHeader>
          <CardContent className="divide-y">
            {upcoming.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              const assignee = task.assigneeId ? memberById[task.assigneeId] : undefined;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => project && navigate({ name: "project", id: project.id, tab: "tasks" })}
                  className="flex w-full items-center gap-3 py-3 text-left hover:bg-muted/40"
                >
                  <MemberAvatar member={assignee} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {project?.key} · {project?.name}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-medium">{formatDate(task.dueDate)}</p>
                    <PriorityBadge priority={task.priority} />
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>What the team shipped, updated, and flagged lately.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {activity.slice(0, 6).map((entry) => {
                const actor = memberById[entry.actorId];
                return (
                  <li key={entry.id} className="flex gap-3">
                    <MemberAvatar member={actor} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">
                        <span className="font-medium">{actor?.name ?? "Someone"}</span>{" "}
                        <span className="text-muted-foreground">{entry.verb}</span>{" "}
                        <span className="font-medium">{entry.object}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{relativeTime(entry.at)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
