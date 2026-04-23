import { useMemo, useState } from "react";
import {
  Archive,
  ArrowUpDown,
  Copy,
  Filter,
  Flag,
  FolderKanban,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { SearchInput } from "@/components/ui/search-input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { FilterButton, ActiveFilters, type ActiveFilter, type FilterField } from "@/components/ui/filter-bar";
import { SplitButton, SplitButtonAction, SplitButtonMenu, SplitButtonMenuItem } from "@/components/ui/split-button";
import { cn } from "@/lib/utils";
import { useStore } from "./store";
import { useRouter } from "./router";
import { MemberStack, PriorityBadge, StatusPill, formatCurrency, formatDate } from "./shared";
import type { Project, ProjectStatus } from "./types";
import { ProjectFormModal } from "./project-form-modal";
import { ConfirmDialog } from "./confirm-dialog";

type SortKey = "name" | "status" | "progress" | "dueDate" | "budget";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 5;

const STATUS_ORDER: Record<ProjectStatus, number> = {
  active: 0,
  planning: 1,
  "on-hold": 2,
  completed: 3,
};

export function ProjectsList() {
  const { projects, tasks, members, addProject, updateProject, deleteProject } = useStore();
  const { navigate } = useRouter();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [view, setView] = useState<"table" | "grid">("table");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | undefined>();
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);

  const memberById = useMemo(() => Object.fromEntries(members.map((m) => [m.id, m])), [members]);
  const taskCount = useMemo(() => {
    const map = new Map<string, { total: number; open: number }>();
    for (const t of tasks) {
      const entry = map.get(t.projectId) ?? { total: 0, open: 0 };
      entry.total += 1;
      if (t.status !== "done") entry.open += 1;
      map.set(t.projectId, entry);
    }
    return map;
  }, [tasks]);

  const filterFields: FilterField[] = useMemo(
    () => [
      {
        type: "option",
        key: "status",
        label: "Status",
        icon: Flag,
        options: [
          { value: "planning", label: "Planning" },
          { value: "active", label: "Active" },
          { value: "on-hold", label: "On Hold" },
          { value: "completed", label: "Completed" },
        ],
      },
      {
        type: "option",
        key: "priority",
        label: "Priority",
        icon: Flag,
        options: [
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
          { value: "urgent", label: "Urgent" },
        ],
      },
      {
        type: "option",
        key: "owner",
        label: "Owner",
        options: members.map((m) => ({ value: m.id, label: m.name })),
      },
      {
        type: "option",
        key: "tag",
        label: "Tag",
        icon: Tag,
        options: Array.from(new Set(projects.flatMap((p) => p.tags))).map((t) => ({
          value: t,
          label: t,
        })),
      },
      {
        type: "date-range",
        key: "due",
        label: "Due date",
      },
    ],
    [members, projects],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.key} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      for (const f of filters) {
        if (f.type === "pending") continue;
        if (f.key === "status" && f.type === "option") {
          if (!f.values.includes(p.status)) return false;
        } else if (f.key === "priority" && f.type === "option") {
          if (!f.values.includes(p.priority)) return false;
        } else if (f.key === "owner" && f.type === "option") {
          if (!f.values.includes(p.ownerId)) return false;
        } else if (f.key === "tag" && f.type === "option") {
          if (!p.tags.some((t) => f.values.includes(t))) return false;
        } else if (f.key === "due" && f.type === "date-range") {
          const due = new Date(p.dueDate).getTime();
          if (due < f.start.getTime() || due > f.end.getTime()) return false;
        }
      }
      return true;
    });
  }, [projects, search, filters]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "status":
          return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * dir;
        case "progress":
          return (a.progress - b.progress) * dir;
        case "dueDate":
          return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir;
        case "budget":
          return (a.budget - b.budget) * dir;
      }
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function openCreate() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setModalOpen(true);
  }

  function handleSubmit(input: Omit<Project, "id" | "createdAt">) {
    if (editing) {
      updateProject(editing.id, input);
      toast.success(`Updated "${input.name}"`);
    } else {
      const created = addProject(input);
      toast.success("Project created", {
        description: `${created.name} · ${created.key}`,
        action: {
          label: "Open",
          onClick: () => navigate({ name: "project", id: created.id }),
        },
      });
    }
  }

  function handleDuplicate(project: Project) {
    const copy = addProject({
      ...project,
      name: `${project.name} (copy)`,
      key: `${project.key}-COPY`,
      status: "planning",
      progress: 0,
    });
    toast.success("Project duplicated", { description: copy.key });
  }

  function handleArchive(project: Project) {
    updateProject(project.id, { status: "on-hold" });
    toast.message(`${project.name} moved to On Hold`, {
      description: "You can resume it anytime from the status filter.",
    });
  }

  function handleActivate(project: Project) {
    updateProject(project.id, { status: "active" });
    toast.success(`${project.name} is active`);
  }

  function handleDelete(project: Project) {
    const snapshot = project;
    deleteProject(project.id);
    toast.success("Project deleted", {
      description: `${snapshot.name} is gone.`,
    });
    setConfirmDelete(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Browse, filter, and manage every project across the workspace."
        actions={
          <>
            <Button variant="outline" size="sm" action="export" onClick={() => toast("Export queued")} />
            <SplitButton variant="default" size="default">
              <SplitButtonAction onClick={openCreate}>
                <Plus className="size-4" />
                New project
              </SplitButtonAction>
              <SplitButtonMenu>
                <SplitButtonMenuItem onClick={() => toast("From template — coming soon")}>
                  From template
                </SplitButtonMenuItem>
                <SplitButtonMenuItem onClick={() => toast("Imported 0 projects")}>
                  Import from CSV
                </SplitButtonMenuItem>
              </SplitButtonMenu>
            </SplitButton>
          </>
        }
      />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name, key, tag..."
              className="h-9 w-full sm:max-w-xs"
            />
            <div className="flex items-center gap-2">
              <FilterButton
                fields={filterFields}
                activeKeys={new Set(filters.map((f) => f.key))}
                onAdd={(key) => {
                  setFilters((prev) => [...prev, { key, type: "pending" }]);
                }}
              />
              <span className="text-xs text-muted-foreground">
                <Filter className="mr-1 inline size-3" />
                {filtered.length} of {projects.length}
              </span>
            </div>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as "table" | "grid")}>
            <TabsList>
              <TabsTrigger value="table" className="gap-1">
                <List className="size-3.5" />
                Table
              </TabsTrigger>
              <TabsTrigger value="grid" className="gap-1">
                <LayoutGrid className="size-3.5" />
                Grid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        {filters.length > 0 && (
          <>
            <Separator />
            <div className="px-6 py-3">
              <ActiveFilters fields={filterFields} filters={filters} onChange={setFilters} />
            </div>
          </>
        )}
        <Separator />
        <CardContent className="p-0">
          {view === "table" ? (
            <TableView
              items={pageItems}
              memberById={memberById}
              taskCount={taskCount}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
              onOpen={(id) => navigate({ name: "project", id })}
              onEdit={openEdit}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
              onActivate={handleActivate}
              onDelete={(p) => setConfirmDelete(p)}
            />
          ) : (
            <GridView
              items={pageItems}
              memberById={memberById}
              taskCount={taskCount}
              onOpen={(id) => navigate({ name: "project", id })}
              onEdit={openEdit}
              onDelete={(p) => setConfirmDelete(p)}
            />
          )}
          {pageItems.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <FolderKanban className="size-5" />
              </div>
              <p className="text-sm font-medium">No projects match these filters.</p>
              <Button size="sm" variant="outline" onClick={() => setFilters([])}>
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
        {sorted.length > PAGE_SIZE && (
          <>
            <Separator />
            <div className="flex items-center justify-between px-6 py-3 text-sm">
              <p className="text-xs text-muted-foreground">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}-
                {Math.min(currentPage * PAGE_SIZE, sorted.length)} of {sorted.length}
              </p>
              <ProjectPagination page={currentPage} pageCount={pageCount} onChange={setPage} />
            </div>
          </>
        )}
      </Card>

      <ProjectFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        project={editing}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
        title={`Delete "${confirmDelete?.name}"?`}
        description="This permanently removes the project and all of its tasks. There's no undo in the demo."
        confirmLabel="Delete project"
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
      />
    </div>
  );
}

interface TableViewProps {
  items: Project[];
  memberById: Record<string, import("./types").Member>;
  taskCount: Map<string, { total: number; open: number }>;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onOpen: (id: string) => void;
  onEdit: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onArchive: (project: Project) => void;
  onActivate: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function SortHeader({
  active,
  dir,
  onClick,
  children,
  className,
}: {
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground",
        active && "text-foreground",
        className,
      )}
    >
      {children}
      <ArrowUpDown className={cn("size-3", active ? "opacity-80" : "opacity-40", dir === "desc" && "rotate-180")} />
    </button>
  );
}

function TableView({
  items,
  memberById,
  taskCount,
  sortKey,
  sortDir,
  onSort,
  onOpen,
  onEdit,
  onDuplicate,
  onArchive,
  onActivate,
  onDelete,
}: TableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <SortHeader active={sortKey === "name"} dir={sortDir} onClick={() => onSort("name")}>
              Project
            </SortHeader>
          </TableHead>
          <TableHead className="hidden lg:table-cell">Owner & team</TableHead>
          <TableHead className="hidden md:table-cell">
            <SortHeader active={sortKey === "status"} dir={sortDir} onClick={() => onSort("status")}>
              Status
            </SortHeader>
          </TableHead>
          <TableHead className="hidden md:table-cell">Priority</TableHead>
          <TableHead className="w-48">
            <SortHeader active={sortKey === "progress"} dir={sortDir} onClick={() => onSort("progress")}>
              Progress
            </SortHeader>
          </TableHead>
          <TableHead className="hidden xl:table-cell">
            <SortHeader active={sortKey === "dueDate"} dir={sortDir} onClick={() => onSort("dueDate")}>
              Due
            </SortHeader>
          </TableHead>
          <TableHead className="hidden xl:table-cell text-right">
            <SortHeader active={sortKey === "budget"} dir={sortDir} onClick={() => onSort("budget")} className="ml-auto">
              Budget
            </SortHeader>
          </TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((project) => {
          const owner = memberById[project.ownerId];
          const team = project.memberIds.map((id) => memberById[id]).filter(Boolean);
          const counts = taskCount.get(project.id) ?? { total: 0, open: 0 };
          return (
            <TableRow
              key={project.id}
              className="cursor-pointer"
              onClick={() => onOpen(project.id)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-md border text-xs font-semibold text-muted-foreground"
                    style={{
                      backgroundColor: `color-mix(in oklch, ${owner?.avatarColor ?? "oklch(0.7 0.05 260)"} 12%, transparent)`,
                    }}
                  >
                    {project.key.split("-")[1]?.slice(0, 2) ?? "PW"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{project.name}</p>
                      <code className="rounded bg-muted px-1 py-0.5 text-xs font-medium text-muted-foreground">
                        {project.key}
                      </code>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{counts.total} tasks</span>
                      <span className="size-0.5 rounded-full bg-muted-foreground/50" />
                      <span>{counts.open} open</span>
                      {project.tags[0] && (
                        <>
                          <span className="size-0.5 rounded-full bg-muted-foreground/50" />
                          <Badge variant="secondary" className="rounded-full text-xs">
                            {project.tags[0]}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{owner?.name ?? "Unassigned"}</p>
                    <p className="truncate text-xs text-muted-foreground">{owner?.role}</p>
                  </div>
                  <MemberStack members={team} size="xs" max={3} />
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <StatusPill status={project.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <PriorityBadge priority={project.priority} />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.progress}%</span>
                    {counts.open > 0 && <span>{counts.open} open</span>}
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                {formatDate(project.dueDate)}
              </TableCell>
              <TableCell className="hidden xl:table-cell text-right text-sm tabular-nums">
                {formatCurrency(project.budget)}
              </TableCell>
              <TableCell>
                <RowActions
                  project={project}
                  onOpen={() => onOpen(project.id)}
                  onEdit={() => onEdit(project)}
                  onDuplicate={() => onDuplicate(project)}
                  onArchive={() => onArchive(project)}
                  onActivate={() => onActivate(project)}
                  onDelete={() => onDelete(project)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function GridView({
  items,
  memberById,
  taskCount,
  onOpen,
  onEdit,
  onDelete,
}: {
  items: Project[];
  memberById: Record<string, import("./types").Member>;
  taskCount: Map<string, { total: number; open: number }>;
  onOpen: (id: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  return (
    <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((project) => {
        const owner = memberById[project.ownerId];
        const team = project.memberIds.map((id) => memberById[id]).filter(Boolean);
        const counts = taskCount.get(project.id) ?? { total: 0, open: 0 };
        return (
          <Card
            key={project.id}
            className="group cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => onOpen(project.id)}
          >
            <CardHeader className="flex flex-row items-start gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {project.key}
                </code>
                <CardTitle className="line-clamp-1 text-base">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {project.description}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
                    <Pencil className="size-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => { e.stopPropagation(); onDelete(project); }}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <StatusPill status={project.status} />
                <PriorityBadge priority={project.priority} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span className="tabular-nums">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <MemberStack members={team} size="xs" max={4} />
                <div className="text-right text-muted-foreground">
                  <p className="font-medium text-foreground">{owner?.name ?? "Unassigned"}</p>
                  <p>{counts.open} open · due {formatDate(project.dueDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function RowActions({
  project,
  onOpen,
  onEdit,
  onDuplicate,
  onArchive,
  onActivate,
  onDelete,
}: {
  project: Project;
  onOpen: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onActivate: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Row actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onOpen}>
          <FolderKanban className="size-4" />
          Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="size-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {project.status === "active" ? (
          <DropdownMenuItem onClick={onArchive}>
            <Archive className="size-4" />
            Move to on-hold
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onActivate}>
            <Play className="size-4" />
            Activate
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProjectPagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  const pages = useMemo(() => {
    const list: (number | "ellipsis")[] = [];
    const pushRange = (from: number, to: number) => {
      for (let i = from; i <= to; i += 1) list.push(i);
    };
    if (pageCount <= 5) {
      pushRange(1, pageCount);
    } else {
      list.push(1);
      if (page > 3) list.push("ellipsis");
      pushRange(Math.max(2, page - 1), Math.min(pageCount - 1, page + 1));
      if (page < pageCount - 2) list.push("ellipsis");
      list.push(pageCount);
    }
    return list;
  }, [page, pageCount]);

  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onChange(page - 1);
            }}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`e${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  onChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < pageCount) onChange(page + 1);
            }}
            aria-disabled={page === pageCount}
            className={page === pageCount ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
