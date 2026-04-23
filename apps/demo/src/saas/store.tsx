import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ACTIVITY, MEMBERS, PROJECTS, TASKS } from "./data";
import type { ActivityEntry, Member, Project, Task } from "./types";

interface StoreContextValue {
  members: Member[];
  projects: Project[];
  tasks: Task[];
  activity: ActivityEntry[];
  currentUser: Member;
  addProject: (input: Omit<Project, "id" | "createdAt">) => Project;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (input: Omit<Task, "id" | "createdAt">) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [members] = useState<Member[]>(MEMBERS);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [activity, setActivity] = useState<ActivityEntry[]>(ACTIVITY);
  const currentUser = members[0];

  const logActivity = useCallback(
    (entry: Omit<ActivityEntry, "id" | "at" | "actorId"> & { actorId?: string }) => {
      setActivity((prev) => [
        {
          id: uid("a"),
          actorId: entry.actorId ?? currentUser.id,
          at: new Date().toISOString(),
          verb: entry.verb,
          object: entry.object,
          projectId: entry.projectId,
        },
        ...prev,
      ]);
    },
    [currentUser.id],
  );

  const addProject = useCallback<StoreContextValue["addProject"]>(
    (input) => {
      const project: Project = {
        ...input,
        id: uid("p"),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setProjects((prev) => [project, ...prev]);
      logActivity({ verb: "created project", object: project.name, projectId: project.id });
      return project;
    },
    [logActivity],
  );

  const updateProject = useCallback<StoreContextValue["updateProject"]>(
    (id, patch) => {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
      const target = projects.find((p) => p.id === id);
      if (target) {
        logActivity({ verb: "updated project", object: target.name, projectId: id });
      }
    },
    [logActivity, projects],
  );

  const deleteProject = useCallback<StoreContextValue["deleteProject"]>(
    (id) => {
      const target = projects.find((p) => p.id === id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setTasks((prev) => prev.filter((t) => t.projectId !== id));
      if (target) {
        logActivity({ verb: "archived project", object: target.name });
      }
    },
    [logActivity, projects],
  );

  const addTask = useCallback<StoreContextValue["addTask"]>(
    (input) => {
      const task: Task = {
        ...input,
        id: uid("t"),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setTasks((prev) => [task, ...prev]);
      logActivity({ verb: "created task", object: task.title, projectId: task.projectId });
      return task;
    },
    [logActivity],
  );

  const updateTask = useCallback<StoreContextValue["updateTask"]>(
    (id, patch) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
      const target = tasks.find((t) => t.id === id);
      if (target) {
        logActivity({ verb: "updated task", object: target.title, projectId: target.projectId });
      }
    },
    [logActivity, tasks],
  );

  const deleteTask = useCallback<StoreContextValue["deleteTask"]>(
    (id) => {
      const target = tasks.find((t) => t.id === id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (target) {
        logActivity({ verb: "deleted task", object: target.title, projectId: target.projectId });
      }
    },
    [logActivity, tasks],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      members,
      projects,
      tasks,
      activity,
      currentUser,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
    }),
    [
      members,
      projects,
      tasks,
      activity,
      currentUser,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
