export type ProjectStatus = "planning" | "active" | "on-hold" | "completed";
export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in-progress" | "review" | "done";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  department: "Engineering" | "Design" | "Product" | "Operations" | "Marketing";
  timezone: string;
  avatarColor: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  ownerId: string;
  memberIds: string[];
  startDate: string;
  dueDate: string;
  progress: number;
  budget: number;
  tags: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  dueDate: string;
  estimatedHours: number;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  actorId: string;
  projectId?: string;
  verb: string;
  object: string;
  at: string;
}
