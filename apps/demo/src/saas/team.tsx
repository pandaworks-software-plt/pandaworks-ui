import { useMemo, useState } from "react";
import { Filter, Mail, MapPin, MoreHorizontal, Search, Sparkles, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SelectPicker } from "@/components/ui/select-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useStore } from "./store";
import { useRouter } from "./router";
import { MemberAvatar, MemberStack } from "./shared";
import type { Member } from "./types";

const DEPARTMENTS = ["Engineering", "Design", "Product", "Operations", "Marketing"] as const;

export function Team() {
  const { members, projects } = useStore();
  const { navigate } = useRouter();
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState<"all" | (typeof DEPARTMENTS)[number]>("all");
  const [inviteOpen, setInviteOpen] = useState(false);

  const projectsByMember = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const p of projects) {
      for (const mid of p.memberIds) {
        const list = map.get(mid) ?? [];
        list.push(p.id);
        map.set(mid, list);
      }
    }
    return map;
  }, [projects]);

  const projectById = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p])), [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (dept !== "all" && m.department !== dept) return false;
      if (!q) return true;
      return `${m.name} ${m.email} ${m.role} ${m.department}`.toLowerCase().includes(q);
    });
  }, [members, search, dept]);

  const deptCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of members) counts.set(m.department, (counts.get(m.department) ?? 0) + 1);
    return counts;
  }, [members]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description={`${members.length} people across ${DEPARTMENTS.length} departments.`}
        actions={
          <Button variant="brand" size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="size-4" />
            Invite member
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {DEPARTMENTS.map((d) => (
          <Card key={d} className="cursor-pointer transition-colors hover:bg-muted/40" onClick={() => setDept(d)}>
            <CardHeader className="space-y-1 pb-2">
              <CardDescription className="text-xs">{d}</CardDescription>
              <CardTitle className="text-xl">{deptCounts.get(d) ?? 0}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <MemberStack
                members={members.filter((m) => m.department === d)}
                size="xs"
                max={4}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search teammates..."
              className="h-9 w-full sm:max-w-xs"
            />
            <span className="text-xs text-muted-foreground">
              <Filter className="mr-1 inline size-3" />
              {filtered.length}
            </span>
          </div>
          <Tabs value={dept} onValueChange={(v) => setDept(v as typeof dept)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {DEPARTMENTS.map((d) => (
                <TabsTrigger key={d} value={d}>
                  {d}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => {
            const pids = projectsByMember.get(member.id) ?? [];
            const memberProjects = pids.map((id) => projectById[id]).filter(Boolean);
            return (
              <Card key={member.id} className="border-border/50 bg-background/60 shadow-none transition-colors hover:bg-background/80 dark:border-border">
                <CardHeader className="flex flex-row items-start gap-3 pb-2">
                  <MemberAvatar member={member} size="md" />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm">{member.name}</CardTitle>
                    <CardDescription className="text-xs">{member.role}</CardDescription>
                  </div>
                  <MemberActions member={member} />
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <Mail className="size-3" />
                      {member.email}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="size-3" />
                      {member.timezone.replace(/_/g, " ")}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Projects
                    </p>
                    {memberProjects.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Not assigned to any project.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {memberProjects.slice(0, 4).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => navigate({ name: "project", id: p.id })}
                            className="rounded border bg-muted/50 px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            {p.key}
                          </button>
                        ))}
                        {memberProjects.length > 4 && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            +{memberProjects.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Users className="size-5" />
              </div>
              <p className="text-sm font-medium">No members match this filter.</p>
              <Button size="sm" variant="outline" onClick={() => { setDept("all"); setSearch(""); }}>
                Reset filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <InviteSheet open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}

function MemberActions({ member }: { member: Member }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toast(`Message sent to ${member.name}`)}>
          <Mail className="size-4" />
          Message
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast("Profile opened")}>
          <Search className="size-4" />
          View profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function InviteSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { projects } = useStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState<string>("Engineering");
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  function reset() {
    setEmail("");
    setName("");
    setRole("");
    setDepartment("Engineering");
    setProjectIds([]);
    setMessage("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Invite sent", {
      description: `${email} will join as ${role || "teammate"} in ${department}.`,
    });
    onOpenChange(false);
    reset();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader className="pb-4">
            <SheetTitle>Invite a teammate</SheetTitle>
            <SheetDescription>
              They'll get an email with a link to join your workspace.
            </SheetDescription>
          </SheetHeader>

          <div className={cn("flex-1 space-y-6 overflow-y-auto pr-1")}>
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="invite-email">Work email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@pandaworks.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-name">Full name</Label>
                <Input
                  id="invite-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Farah Hassan"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4" />
                Role & access
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Input
                    id="invite-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Product Designer"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Project access</Label>
                <SelectPicker
                  mode="multiple"
                  value={projectIds}
                  onChange={setProjectIds}
                  options={projects.map((p) => ({ value: p.id, label: p.name, subtitle: p.key }))}
                  placeholder="Grant access to projects"
                  searchPlaceholder="Search projects..."
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="invite-message">Welcome message</Label>
              <Textarea
                id="invite-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Optional — a friendly note included in the invite email."
                rows={3}
              />
            </div>

            <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-1 font-medium text-foreground">
                <Badge variant="secondary">Demo</Badge>
                No real invite is sent.
              </p>
              <p className="mt-1">
                In a live workspace, the recipient would receive an email with a secure magic link valid for 24 hours.
              </p>
            </div>
          </div>

          <SheetFooter className="mt-4 gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="brand" disabled={!email}>
              Send invite
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
