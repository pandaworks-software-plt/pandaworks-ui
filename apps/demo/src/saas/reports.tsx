import { useMemo, useState } from "react";
import { BarChart3, Download, PieChart, Target, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useStore } from "./store";
import { PROJECT_STATUS, TASK_STATUS, formatCurrency } from "./shared";
import type { Priority, ProjectStatus, TaskStatus } from "./types";

const PRIORITY_ORDER: Priority[] = ["urgent", "high", "medium", "low"];

export function Reports() {
  const { projects, tasks, members } = useStore();
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("quarter");

  const projectByStatus = useMemo(() => {
    const map = new Map<ProjectStatus, number>();
    for (const p of projects) map.set(p.status, (map.get(p.status) ?? 0) + 1);
    return map;
  }, [projects]);

  const taskByStatus = useMemo(() => {
    const map = new Map<TaskStatus, number>();
    for (const t of tasks) map.set(t.status, (map.get(t.status) ?? 0) + 1);
    return map;
  }, [tasks]);

  const priorityDist = useMemo(() => {
    const map = new Map<Priority, number>();
    for (const p of projects) map.set(p.priority, (map.get(p.priority) ?? 0) + 1);
    return PRIORITY_ORDER.map((p) => ({ priority: p, count: map.get(p) ?? 0 }));
  }, [projects]);

  const budgetByOwner = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) {
      map.set(p.ownerId, (map.get(p.ownerId) ?? 0) + p.budget);
    }
    return Array.from(map.entries())
      .map(([id, total]) => {
        const owner = members.find((m) => m.id === id);
        return { owner, total };
      })
      .sort((a, b) => b.total - a.total);
  }, [projects, members]);

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const activeBudget = projects.filter((p) => p.status === "active").reduce((sum, p) => sum + p.budget, 0);
  const avgProgress =
    projects.length === 0
      ? 0
      : Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);

  const statusEntries = Array.from(projectByStatus.entries());
  const statusMax = Math.max(...statusEntries.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Cross-cutting analytics across projects, people, and dollars."
        actions={
          <>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quarter">Quarter</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={() => toast("Export queued")}>
              <Download className="size-4" />
              Export
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total committed budget</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{formatCurrency(totalBudget)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-3" />
                +12%
              </span>{" "}
              vs last {period}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Budget in active projects</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{formatCurrency(activeBudget)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeBudget / (totalBudget || 1)) * 100)}% of the portfolio
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Average progress</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{avgProgress}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={avgProgress} className="h-1.5" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Projects by status</CardTitle>
                <CardDescription>Where each project sits right now.</CardDescription>
              </div>
              <BarChart3 className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {statusEntries.map(([status, count]) => {
              const meta = PROJECT_STATUS[status];
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", meta.dotClass)} />
                      {meta.label}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", meta.dotClass)}
                      style={{ width: `${(count / statusMax) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Task workload</CardTitle>
                <CardDescription>Tasks grouped by current status.</CardDescription>
              </div>
              <PieChart className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {(["todo", "in-progress", "review", "done"] as TaskStatus[]).map((status) => {
                const meta = TASK_STATUS[status];
                const count = taskByStatus.get(status) ?? 0;
                return (
                  <div key={status} className="rounded-md border border-border/50 bg-background/60 p-3 shadow-none">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
                      {meta.label}
                    </div>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">{count}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Priority distribution</CardTitle>
                <CardDescription>How urgent the portfolio skews right now.</CardDescription>
              </div>
              <Target className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {priorityDist.map(({ priority, count }) => (
              <div key={priority} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{priority}</span>
                  <span className="tabular-nums text-muted-foreground">{count}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      priority === "urgent" && "bg-rose-500",
                      priority === "high" && "bg-amber-500",
                      priority === "medium" && "bg-sky-500",
                      priority === "low" && "bg-slate-400",
                    )}
                    style={{ width: `${(count / Math.max(1, projects.length)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Budget by owner</CardTitle>
                <CardDescription>Where the money sits across project leaders.</CardDescription>
              </div>
              <TrendingDown className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead className="text-right">Total budget</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetByOwner.map(({ owner, total }) => {
                  const owned = projects.filter((p) => p.ownerId === owner?.id);
                  return (
                    <TableRow key={owner?.id ?? "unknown"}>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{owner?.name ?? "Unassigned"}</p>
                          <p className="truncate text-xs text-muted-foreground">{owner?.role}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {owned.slice(0, 3).map((p) => (
                            <code
                              key={p.id}
                              className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
                            >
                              {p.key}
                            </code>
                          ))}
                          {owned.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{owned.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums">
                        {formatCurrency(total)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
