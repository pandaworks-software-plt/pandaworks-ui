import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Member, Priority, ProjectStatus, TaskStatus } from "./types";

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("en-MY", { year: "numeric", month: "short", day: "numeric" });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.round((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(iso);
}

export const PROJECT_STATUS: Record<ProjectStatus, { label: string; dotClass: string; tone: string }> = {
  planning: {
    label: "Planning",
    dotClass: "bg-slate-400",
    tone: "text-muted-foreground bg-muted",
  },
  active: {
    label: "Active",
    dotClass: "bg-emerald-500",
    tone: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10",
  },
  "on-hold": {
    label: "On Hold",
    dotClass: "bg-amber-500",
    tone: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10",
  },
  completed: {
    label: "Completed",
    dotClass: "bg-sky-500",
    tone: "text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-500/10",
  },
};

export const TASK_STATUS: Record<TaskStatus, { label: string; dotClass: string; tone: string }> = {
  todo: {
    label: "To Do",
    dotClass: "bg-slate-400",
    tone: "text-muted-foreground bg-muted",
  },
  "in-progress": {
    label: "In Progress",
    dotClass: "bg-blue-500",
    tone: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10",
  },
  review: {
    label: "In Review",
    dotClass: "bg-purple-500",
    tone: "text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-500/10",
  },
  done: {
    label: "Done",
    dotClass: "bg-emerald-500",
    tone: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10",
  },
};

export const PRIORITY: Record<Priority, { label: string; tone: string }> = {
  low: {
    label: "Low",
    tone: "text-slate-600 border-slate-300 dark:text-slate-300 dark:border-slate-600",
  },
  medium: {
    label: "Medium",
    tone: "text-sky-700 border-sky-300 dark:text-sky-300 dark:border-sky-500/40",
  },
  high: {
    label: "High",
    tone: "text-amber-700 border-amber-300 dark:text-amber-300 dark:border-amber-500/40",
  },
  urgent: {
    label: "Urgent",
    tone: "text-rose-700 border-rose-300 bg-rose-50 dark:text-rose-300 dark:border-rose-500/50 dark:bg-rose-500/10",
  },
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  const meta = PROJECT_STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        meta.tone,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} aria-hidden />
      {meta.label}
    </span>
  );
}

export function TaskStatusPill({ status }: { status: TaskStatus }) {
  const meta = TASK_STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        meta.tone,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} aria-hidden />
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITY[priority];
  return (
    <Badge variant="outline" className={cn("font-medium", meta.tone)}>
      {meta.label}
    </Badge>
  );
}

interface MemberAvatarProps {
  member?: Member;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const AVATAR_SIZES: Record<NonNullable<MemberAvatarProps["size"]>, string> = {
  xs: "size-5 text-xs",
  sm: "size-7 text-xs",
  md: "size-9 text-sm",
  lg: "size-14 text-base",
};

export function MemberAvatar({ member, size = "sm", className }: MemberAvatarProps) {
  if (!member) {
    return (
      <Avatar className={cn(AVATAR_SIZES[size], className)}>
        <AvatarFallback className="bg-muted">?</AvatarFallback>
      </Avatar>
    );
  }
  return (
    <Avatar className={cn(AVATAR_SIZES[size], className)}>
      <AvatarFallback
        className="font-medium text-white"
        style={{ backgroundColor: member.avatarColor }}
      >
        {initials(member.name)}
      </AvatarFallback>
    </Avatar>
  );
}

interface MemberStackProps {
  members: Member[];
  max?: number;
  size?: MemberAvatarProps["size"];
}

export function MemberStack({ members, max = 4, size = "sm" }: MemberStackProps) {
  const visible = members.slice(0, max);
  const rest = members.length - visible.length;
  const ringSize = size === "xs" ? "ring-2" : "ring-2";

  return (
    <div className="flex -space-x-2">
      {visible.map((m) => (
        <MemberAvatar
          key={m.id}
          member={m}
          size={size}
          className={cn("ring-background", ringSize)}
        />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            AVATAR_SIZES[size],
            "inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground ring-2 ring-background",
          )}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}
