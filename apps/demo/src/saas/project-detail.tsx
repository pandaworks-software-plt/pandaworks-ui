import { useMemo, useState } from "react";
import {
  Activity,
  Calendar as CalendarIcon,
  CheckCircle2,
  ClipboardList,
  Flag,
  FolderKanban,
  Link as LinkIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeLabel } from "@/components/ui/code-label";
import {
  DetailPage,
  DetailPageContent,
  DetailPageHeader,
  DetailPageMain,
  DetailPageMetaItem,
  DetailPageSidebar,
  DetailPageSidebarSection,
} from "@/components/ui/detail-page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpandableText } from "@/components/ui/expandable-text";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useStore } from "./store";
import { useRouter } from "./router";
import {
  MemberAvatar,
  MemberStack,
  PriorityBadge,
  StatusPill,
  TaskStatusPill,
  formatCurrency,
  formatDate,
  relativeTime,
} from "./shared";
import type { Task, TaskStatus } from "./types";
import { ProjectFormModal } from "./project-form-modal";
import { TaskFormModal } from "./task-form-modal";
import { ConfirmDialog } from "./confirm-dialog";

const TAB_VALUES = ["overview", "tasks", "team", "activity"] as const;
type TabValue = (typeof TAB_VALUES)[number];

const TASK_STATUS_ORDER: TaskStatus[] = ["todo", "in-progress", "review", "done"];

export function ProjectDetail({ projectId }: { projectId: string }) {
  const { projects, tasks, members, activity, updateProject, deleteProject, addTask, updateTask, deleteTask } = useStore();
  const { route, navigate } = useRouter();
  const project = projects.find((p) => p.id === projectId);

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState(false);
  const [taskModal, setTaskModal] = useState<{ open: boolean; task?: Task }>({ open: false });
  const [confirmTaskDelete, setConfirmTaskDelete] = useState<Task | null>(null);

  const tab: TabValue = useMemo(() => {
    const active = route.name === "project" ? route.tab : undefined;
    return TAB_VALUES.includes(active as TabValue) ? (active as TabValue) : "overview";
  }, [route]);

  const memberById = useMemo(() => Object.fromEntries(members.map((m) => [m.id, m])), [members]);

  if (!project) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FolderKanban className="size-5" />
        </div>
        <p className="text-sm font-medium">Project not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate({ name: "projects" })}>
          Back to projects
        </Button>
      </div>
    );
  }

  const owner = memberById[project.ownerId];
  const team = project.memberIds.map((id) => memberById[id]).filter(Boolean);
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectActivity = activity.filter((a) => a.projectId === project.id);

  const openTasks = projectTasks.filter((t) => t.status !== "done").length;
  const doneTasks = projectTasks.filter((t) => t.status === "done").length;
  const overdue = projectTasks.filter((t) => t.status !== "done" && new Date(t.dueDate) < new Date()).length;

  function handleTabChange(next: string) {
    navigate({ name: "project", id: project!.id, tab: next });
  }

  function handleTaskSubmit(input: Omit<Task, "id" | "createdAt">) {
    if (taskModal.task) {
      updateTask(taskModal.task.id, input);
      toast.success("Task updated");
    } else {
      addTask(input);
      toast.success("Task added");
    }
  }

  function handleTaskStatusChange(task: Task, status: TaskStatus) {
    updateTask(task.id, { status });
    toast.message(`Moved to ${status.replace("-", " ")}`);
  }

  function handleProjectDelete() {
    const name = project!.name;
    deleteProject(project!.id);
    toast.success(`${name} deleted`);
    navigate({ name: "projects" });
  }

  return (
    <DetailPage>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#/dashboard">Workspace</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DetailPageHeader
        icon={<FolderKanban className="size-5" />}
        title={project.name}
        subtitle={`${project.key} · Started ${formatDate(project.startDate)} · Due ${formatDate(project.dueDate)}`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast("Link copied")}>
              <LinkIcon className="size-3.5" />
              Share
            </Button>
            <Button variant="outline" size="sm" action="edit" onClick={() => setEditOpen(true)} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => updateProject(project.id, { status: project.status === "completed" ? "active" : "completed" })}
                >
                  <CheckCircle2 className="size-4" />
                  {project.status === "completed" ? "Reopen project" : "Mark as completed"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => setConfirmDeleteProject(true)}>
                  <Trash2 className="size-4" />
                  Delete project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <StatusPill status={project.status} />
        <PriorityBadge priority={project.priority} />
        <CodeLabel value={project.key} size="sm" />
      </div>

      <DetailPageMain>
        <DetailPageContent>
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="overview" className="gap-1.5">
                <FolderKanban className="size-3.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-1.5">
                <ClipboardList className="size-3.5" />
                Tasks
                <Badge variant="secondary" className="rounded-full px-1.5">
                  {projectTasks.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-1.5">
                <Users className="size-3.5" />
                Team
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-1.5">
                <Activity className="size-3.5" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About this project</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpandableText visibleLines={3}>{project.description}</ExpandableText>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      Progress
                    </CardTitle>
                    <Flag className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-2xl font-semibold tabular-nums">{project.progress}%</p>
                    <Progress value={project.progress} className="h-1.5" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">
                      Open / total tasks
                    </CardTitle>
                    <ClipboardList className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-2xl font-semibold tabular-nums">
                      {openTasks}
                      <span className="text-base font-medium text-muted-foreground"> / {projectTasks.length}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doneTasks} shipped · {overdue} overdue
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground">Budget</CardTitle>
                    <CalendarIcon className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-2xl font-semibold tabular-nums">{formatCurrency(project.budget)}</p>
                    <p className="text-xs text-muted-foreground">Due {formatDate(project.dueDate)}</p>
                  </CardContent>
                </Card>
              </div>

              <TasksBreakdown tasks={projectTasks} />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Tasks</CardTitle>
                    <CardDescription>{projectTasks.length} items · {openTasks} open</CardDescription>
                  </div>
                  <Button size="sm" variant="brand" onClick={() => setTaskModal({ open: true })}>
                    <Plus className="size-4" />
                    Add task
                  </Button>
                </CardHeader>
                <Separator />
                <CardContent className="p-0">
                  {projectTasks.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <ClipboardList className="size-5" />
                      </div>
                      <p className="text-sm font-medium">No tasks yet.</p>
                      <p className="text-xs text-muted-foreground">Add the first one and start tracking.</p>
                      <Button size="sm" variant="brand" onClick={() => setTaskModal({ open: true })}>
                        <Plus className="size-4" />
                        Add task
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Assignee</TableHead>
                          <TableHead>Due</TableHead>
                          <TableHead className="text-right">Est.</TableHead>
                          <TableHead className="w-12" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectTasks.map((task) => {
                          const assignee = task.assigneeId ? memberById[task.assigneeId] : undefined;
                          const overdueTask = task.status !== "done" && new Date(task.dueDate) < new Date();
                          return (
                            <TableRow key={task.id}>
                              <TableCell>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">{task.title}</p>
                                  {task.description && (
                                    <p className="truncate text-xs text-muted-foreground">
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button type="button" aria-label="Change status">
                                      <TaskStatusPill status={task.status} />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    {TASK_STATUS_ORDER.map((status) => (
                                      <DropdownMenuItem
                                        key={status}
                                        onClick={() => handleTaskStatusChange(task, status)}
                                      >
                                        <TaskStatusPill status={status} />
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                              <TableCell>
                                <PriorityBadge priority={task.priority} />
                              </TableCell>
                              <TableCell>
                                {assignee ? (
                                  <div className="flex items-center gap-2">
                                    <MemberAvatar member={assignee} size="xs" />
                                    <span className="text-sm">{assignee.name}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">Unassigned</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <span className={cn("text-sm", overdueTask && "text-destructive font-medium")}>
                                  {formatDate(task.dueDate)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right text-sm tabular-nums">
                                {task.estimatedHours}h
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon-sm">
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setTaskModal({ open: true, task })}>
                                      <Pencil className="size-4" />
                                      Edit task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => setConfirmTaskDelete(task)}
                                    >
                                      <Trash2 className="size-4" />
                                      Delete task
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Team</CardTitle>
                  <CardDescription>{team.length} members assigned to this project.</CardDescription>
                </CardHeader>
                <CardContent className="divide-y">
                  {team.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 py-3">
                      <MemberAvatar member={member} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.role} · {member.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{member.timezone.split("/")[1]?.replace("_", " ")}</p>
                        <p className="text-xs font-medium">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Project activity</CardTitle>
                  <CardDescription>Everything that happened on this project.</CardDescription>
                </CardHeader>
                <CardContent>
                  {projectActivity.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No activity yet. Start creating tasks and it'll show up here.
                    </p>
                  ) : (
                    <ol className="space-y-4">
                      {projectActivity.map((entry) => {
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DetailPageContent>

        <DetailPageSidebar>
          <DetailPageMetaItem label="Key" value={project.key} copyable />
          <DetailPageMetaItem label="Status" value={<StatusPill status={project.status} />} />
          <DetailPageMetaItem label="Priority" value={<PriorityBadge priority={project.priority} />} />
          <DetailPageMetaItem
            label="Owner"
            value={
              owner ? (
                <span className="inline-flex items-center gap-2">
                  <MemberAvatar member={owner} size="xs" />
                  {owner.name}
                </span>
              ) : (
                "Unassigned"
              )
            }
          />
          <DetailPageMetaItem label="Start" value={formatDate(project.startDate)} />
          <DetailPageMetaItem label="Due" value={formatDate(project.dueDate)} />
          <DetailPageMetaItem label="Budget" value={formatCurrency(project.budget)} />

          <DetailPageSidebarSection
            label="Team"
            action={
              <button
                type="button"
                onClick={() => handleTabChange("team")}
                className="text-xs text-primary hover:underline"
              >
                View all
              </button>
            }
          >
            <div className="mt-2 flex items-center gap-2">
              <MemberStack members={team} size="xs" max={5} />
              <span className="text-xs">{team.length} members</span>
            </div>
          </DetailPageSidebarSection>

          <DetailPageSidebarSection label="Tags">
            <div className="mt-1 flex flex-wrap gap-1">
              {project.tags.length === 0 ? (
                <span className="text-xs text-muted-foreground">None</span>
              ) : (
                project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full text-xs">
                    {tag}
                  </Badge>
                ))
              )}
            </div>
          </DetailPageSidebarSection>
        </DetailPageSidebar>
      </DetailPageMain>

      <ProjectFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project}
        onSubmit={(input) => {
          updateProject(project.id, input);
          toast.success("Project updated");
        }}
      />

      <TaskFormModal
        open={taskModal.open}
        onOpenChange={(open) => setTaskModal({ open, task: open ? taskModal.task : undefined })}
        projectId={project.id}
        task={taskModal.task}
        onSubmit={handleTaskSubmit}
      />

      <ConfirmDialog
        open={confirmDeleteProject}
        onOpenChange={setConfirmDeleteProject}
        title={`Delete "${project.name}"?`}
        description="This permanently removes the project and all of its tasks."
        confirmLabel="Delete project"
        onConfirm={handleProjectDelete}
      />

      <ConfirmDialog
        open={!!confirmTaskDelete}
        onOpenChange={(o) => !o && setConfirmTaskDelete(null)}
        title={`Delete "${confirmTaskDelete?.title}"?`}
        description="This removes the task from this project."
        confirmLabel="Delete task"
        onConfirm={() => {
          if (confirmTaskDelete) {
            deleteTask(confirmTaskDelete.id);
            toast.success("Task deleted");
            setConfirmTaskDelete(null);
          }
        }}
      />
    </DetailPage>
  );
}

function TasksBreakdown({ tasks }: { tasks: Task[] }) {
  const buckets = useMemo(() => {
    const result: Record<TaskStatus, Task[]> = {
      todo: [],
      "in-progress": [],
      review: [],
      done: [],
    };
    for (const t of tasks) result[t.status].push(t);
    return result;
  }, [tasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">By status</CardTitle>
        <CardDescription>How the workload is distributed across the board.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-4">
        {TASK_STATUS_ORDER.map((status) => (
          <div key={status} className="rounded-md border border-border/50 bg-background/60 p-3 shadow-none">
            <TaskStatusPill status={status} />
            <p className="mt-2 text-2xl font-semibold tabular-nums">{buckets[status].length}</p>
            <p className="text-xs text-muted-foreground">
              {buckets[status].length === 1 ? "task" : "tasks"}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
