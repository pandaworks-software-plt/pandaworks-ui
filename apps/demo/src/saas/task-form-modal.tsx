import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectPicker } from "@/components/ui/select-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Member, Priority, Task, TaskStatus } from "./types";
import { useStore } from "./store";

interface TaskFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  task?: Task;
  onSubmit: (input: Omit<Task, "id" | "createdAt">) => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "In Review" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

function toDate(value: string | undefined) {
  return value ? new Date(value) : null;
}

function toISODate(value: Date | null) {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

interface TaskFormBodyProps {
  projectId: string;
  task?: Task;
  members: Member[];
  onSubmit: TaskFormModalProps["onSubmit"];
  onOpenChange: (open: boolean) => void;
}

function TaskFormBody({ projectId, task, members, onSubmit, onOpenChange }: TaskFormBodyProps) {
  const isEdit = !!task;
  const [title, setTitle] = useState(() => task?.title ?? "");
  const [description, setDescription] = useState(() => task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(() => task?.status ?? "todo");
  const [priority, setPriority] = useState<Priority>(() => task?.priority ?? "medium");
  const [assigneeId, setAssigneeId] = useState(() => task?.assigneeId ?? "");
  const [dueDate, setDueDate] = useState<Date | null>(() => toDate(task?.dueDate));
  const [estimatedHours, setEstimatedHours] = useState(() =>
    task ? String(task.estimatedHours) : "",
  );

  const canSubmit = title.trim() && dueDate;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !dueDate) return;
    onSubmit({
      projectId,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      assigneeId: assigneeId || null,
      dueDate: toISODate(dueDate),
      estimatedHours: Number(estimatedHours) || 0,
    });
    onOpenChange(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Update task details and assignment." : "Add a new task to this project."}
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Wire up auth redirect"
                required
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add extra context (optional)."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Assignee</Label>
              <SelectPicker
                mode="single"
                value={assigneeId}
                onChange={setAssigneeId}
                options={members.map((m) => ({ value: m.id, label: m.name, subtitle: m.role }))}
                placeholder="Assign someone (optional)"
                searchPlaceholder="Search members..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Due date</Label>
                <DatePicker selected={dueDate} onChange={setDueDate} placeholder="Pick a due date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-hours">Estimate (hrs)</Label>
                <Input
                  id="task-hours"
                  type="number"
                  min="0"
                  step="1"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="e.g. 8"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={!canSubmit}>
              {isEdit ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
    </form>
  );
}

export function TaskFormModal({ open, onOpenChange, projectId, task, onSubmit }: TaskFormModalProps) {
  const { members } = useStore();
  const [session, setSession] = useState(0);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setSession((s) => s + 1);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        {open ? (
          <TaskFormBody
            key={`${session}-${task?.id ?? "new"}`}
            projectId={projectId}
            task={task}
            members={members}
            onSubmit={onSubmit}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
