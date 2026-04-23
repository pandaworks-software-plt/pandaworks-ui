import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectPicker } from "@/components/ui/select-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import type { Member, Priority, Project, ProjectStatus } from "./types";
import { useStore } from "./store";

interface ProjectFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  onSubmit: (input: Omit<Project, "id" | "createdAt">) => void;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "on-hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const TAG_OPTIONS = [
  "backend",
  "frontend",
  "mobile",
  "design",
  "infra",
  "data",
  "ai",
  "product",
  "docs",
  "billing",
  "integrations",
  "ops",
].map((t) => ({ value: t, label: t }));

function toDate(value: string | undefined) {
  return value ? new Date(value) : null;
}

function toISODate(value: Date | null) {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

interface ProjectFormBodyProps {
  project?: Project;
  members: Member[];
  onSubmit: ProjectFormModalProps["onSubmit"];
  onOpenChange: (open: boolean) => void;
}

function ProjectFormBody({ project, members, onSubmit, onOpenChange }: ProjectFormBodyProps) {
  const isEdit = !!project;
  const [name, setName] = useState(() => project?.name ?? "");
  const [key, setKey] = useState(() => project?.key ?? "PW-");
  const [description, setDescription] = useState(() => project?.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(() => project?.status ?? "planning");
  const [priority, setPriority] = useState<Priority>(() => project?.priority ?? "medium");
  const [ownerId, setOwnerId] = useState(() => project?.ownerId ?? members[0]?.id ?? "");
  const [memberIds, setMemberIds] = useState(
    () => project?.memberIds ?? (members[0] ? [members[0].id] : []),
  );
  const [startDate, setStartDate] = useState<Date | null>(() => toDate(project?.startDate));
  const [dueDate, setDueDate] = useState<Date | null>(() => toDate(project?.dueDate));
  const [progress, setProgress] = useState(() => project?.progress ?? 0);
  const [budget, setBudget] = useState(() => (project ? String(project.budget) : ""));
  const [tags, setTags] = useState(() => project?.tags ?? []);

  const canSubmit = name.trim() && key.trim() && ownerId && startDate && dueDate;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !startDate || !dueDate) return;
    onSubmit({
      name: name.trim(),
      key: key.trim().toUpperCase(),
      description: description.trim(),
      status,
      priority,
      ownerId,
      memberIds: memberIds.length > 0 ? memberIds : [ownerId],
      startDate: toISODate(startDate),
      dueDate: toISODate(dueDate),
      progress,
      budget: Number(budget) || 0,
      tags,
    });
    onOpenChange(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <ModalHeader
            title={isEdit ? "Edit project" : "New project"}
            description={
              isEdit
                ? "Update project details, timeline, and team assignment."
                : "Start a new project. You can change anything later."
            }
          />
          <ModalBody className="space-y-6">
            <section className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">Basics</h3>
                <p className="text-xs text-muted-foreground">Name your project and describe the goal.</p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Project name</Label>
                  <Input
                    id="project-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nova Design System"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-key">Key</Label>
                  <Input
                    id="project-key"
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                    placeholder="PW-NOVA"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline the scope and expected outcomes."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <SelectPicker
                  mode="multiple"
                  value={tags}
                  onChange={setTags}
                  options={TAG_OPTIONS}
                  placeholder="Select tags..."
                  searchPlaceholder="Search tags..."
                />
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">Status & timeline</h3>
                <p className="text-xs text-muted-foreground">When does this happen, and where does it sit?</p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Start date</Label>
                  <DatePicker selected={startDate} onChange={setStartDate} placeholder="Pick a start date" />
                </div>
                <div className="grid gap-2">
                  <Label>Due date</Label>
                  <DatePicker selected={dueDate} onChange={setDueDate} placeholder="Pick a due date" />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Progress</Label>
                  <span className="text-sm font-medium tabular-nums text-muted-foreground">{progress}%</span>
                </div>
                <Slider
                  value={[progress]}
                  onValueChange={(v) => setProgress(v[0] ?? 0)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">Team & budget</h3>
                <p className="text-xs text-muted-foreground">Who's on it and how much is committed?</p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Owner</Label>
                  <SelectPicker
                    mode="single"
                    value={ownerId}
                    onChange={setOwnerId}
                    options={members.map((m) => ({ value: m.id, label: m.name, subtitle: m.role }))}
                    placeholder="Assign an owner"
                    searchPlaceholder="Search members..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-budget">Budget (USD)</Label>
                  <Input
                    id="project-budget"
                    type="number"
                    min="0"
                    step="1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 150000"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Team members</Label>
                <SelectPicker
                  mode="multiple"
                  value={memberIds}
                  onChange={setMemberIds}
                  options={members.map((m) => ({ value: m.id, label: m.name, subtitle: m.role }))}
                  placeholder="Add team members"
                  searchPlaceholder="Search members..."
                />
              </div>
            </section>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={!canSubmit}>
              {isEdit ? "Save changes" : "Create project"}
            </Button>
          </ModalFooter>
    </form>
  );
}

export function ProjectFormModal({ open, onOpenChange, project, onSubmit }: ProjectFormModalProps) {
  const { members } = useStore();
  const [session, setSession] = useState(0);

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (next) setSession((s) => s + 1);
        onOpenChange(next);
      }}
    >
      <ModalContent>
        {open ? (
          <ProjectFormBody
            key={`${session}-${project?.id ?? "new"}`}
            project={project}
            members={members}
            onSubmit={onSubmit}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </ModalContent>
    </Modal>
  );
}
