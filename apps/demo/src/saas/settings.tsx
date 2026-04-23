import { useState } from "react";
import { Bell, Building2, Key, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CodeLabel } from "@/components/ui/code-label";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "./router";
import { useStore } from "./store";

const TAB_VALUES = ["profile", "workspace", "notifications", "security", "api"] as const;
type Tab = (typeof TAB_VALUES)[number];

export function Settings() {
  const { route, navigate } = useRouter();
  const { currentUser } = useStore();
  const tab = route.name === "settings" && TAB_VALUES.includes(route.tab as Tab) ? (route.tab as Tab) : "profile";

  function setTab(next: Tab) {
    navigate({ name: "settings", tab: next });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, workspace, and security preferences."
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} orientation="vertical" className="flex flex-col gap-6 lg:flex-row">
        <TabsList className="h-auto shrink-0 flex-col items-stretch gap-1 bg-transparent p-0 lg:w-52">
          <TabsTrigger value="profile" className="justify-start gap-2">
            <User className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="workspace" className="justify-start gap-2">
            <Building2 className="size-4" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start gap-2">
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="justify-start gap-2">
            <Shield className="size-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api" className="justify-start gap-2">
            <Key className="size-4" />
            API keys
          </TabsTrigger>
        </TabsList>

        <div className="min-w-0 flex-1 space-y-6">
          <TabsContent value="profile" className="mt-0 space-y-6">
            <ProfileSection defaultName={currentUser.name} defaultEmail={currentUser.email} />
          </TabsContent>
          <TabsContent value="workspace" className="mt-0 space-y-6">
            <WorkspaceSection />
          </TabsContent>
          <TabsContent value="notifications" className="mt-0 space-y-6">
            <NotificationsSection />
          </TabsContent>
          <TabsContent value="security" className="mt-0 space-y-6">
            <SecuritySection />
          </TabsContent>
          <TabsContent value="api" className="mt-0 space-y-6">
            <ApiKeysSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function ProfileSection({ defaultName, defaultEmail }: { defaultName: string; defaultEmail: string }) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [bio, setBio] = useState("Staff engineer leading the Atlas platform migration and Luna billing rewrite.");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profile</CardTitle>
        <CardDescription>Update your name, contact email, and short bio.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea id="profile-bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => { setName(defaultName); setEmail(defaultEmail); }}>
            Reset
          </Button>
          <Button variant="brand" action="save" onClick={() => toast.success("Profile saved")} />
        </div>
      </CardContent>
    </Card>
  );
}

function WorkspaceSection() {
  const [name, setName] = useState("Pandawork");
  const [slug, setSlug] = useState("pandawork");
  const [timezone, setTimezone] = useState("Asia/Kuala_Lumpur");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Workspace</CardTitle>
        <CardDescription>Shared settings that apply to everyone on the team.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="ws-name">Workspace name</Label>
            <Input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ws-slug">URL slug</Label>
            <Input id="ws-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2 sm:max-w-xs">
          <Label>Default timezone</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur</SelectItem>
              <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
              <SelectItem value="Asia/Jakarta">Asia/Jakarta</SelectItem>
              <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="brand" action="save" onClick={() => toast.success("Workspace saved")} />
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsSection() {
  const [email, setEmail] = useState({ digest: true, mentions: true, deadlines: true, weekly: false });
  const [push, setPush] = useState({ mentions: true, statusChange: false, newTask: true });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notifications</CardTitle>
        <CardDescription>Choose how and when we nudge you.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <p className="text-sm font-medium">Email</p>
          <div className="grid gap-3">
            <ToggleRow
              label="Daily digest"
              hint="One email every morning with your tasks, mentions, and due dates."
              checked={email.digest}
              onCheckedChange={(v) => setEmail((p) => ({ ...p, digest: v }))}
            />
            <ToggleRow
              label="Mentions"
              hint="Get emailed when someone @mentions you in a task or comment."
              checked={email.mentions}
              onCheckedChange={(v) => setEmail((p) => ({ ...p, mentions: v }))}
            />
            <ToggleRow
              label="Deadline reminders"
              hint="Heads-up the day before a task or project is due."
              checked={email.deadlines}
              onCheckedChange={(v) => setEmail((p) => ({ ...p, deadlines: v }))}
            />
            <ToggleRow
              label="Weekly roll-up"
              hint="Every Monday, a roll-up of what shipped last week."
              checked={email.weekly}
              onCheckedChange={(v) => setEmail((p) => ({ ...p, weekly: v }))}
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <p className="text-sm font-medium">Push</p>
          <div className="grid gap-3">
            <ToggleRow
              label="Mentions"
              hint="Ping on your device when you're mentioned."
              checked={push.mentions}
              onCheckedChange={(v) => setPush((p) => ({ ...p, mentions: v }))}
            />
            <ToggleRow
              label="Status changes"
              hint="When a project or task you own moves status."
              checked={push.statusChange}
              onCheckedChange={(v) => setPush((p) => ({ ...p, statusChange: v }))}
            />
            <ToggleRow
              label="New task assigned"
              hint="The moment a new task is assigned to you."
              checked={push.newTask}
              onCheckedChange={(v) => setPush((p) => ({ ...p, newTask: v }))}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="brand" action="save" onClick={() => toast.success("Preferences saved")} />
        </div>
      </CardContent>
    </Card>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function SecuritySection() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [strict, setStrict] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sign-in</CardTitle>
          <CardDescription>Tighten how people access the workspace.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 pt-6">
          <ToggleRow
            label="Two-factor authentication"
            hint="Require 2FA for all teammates. Works with authenticator apps."
            checked={twoFactor}
            onCheckedChange={setTwoFactor}
          />
          <ToggleRow
            label="Strict session policy"
            hint="Invalidate all sessions after 7 days. Forces re-auth weekly."
            checked={strict}
            onCheckedChange={setStrict}
          />
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <Checkbox id="compliance" defaultChecked />
            <div className="space-y-0.5">
              <Label htmlFor="compliance" className="font-medium">
                Require SSO for the Engineering department
              </Label>
              <p className="text-xs text-muted-foreground">
                Engineers must authenticate via SAML. Other departments can use email + password.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert variant="destructive">
        <AlertTitle>Danger zone</AlertTitle>
        <AlertDescription>
          Deleting the workspace removes all projects, tasks, and member access. This action cannot be undone.
        </AlertDescription>
      </Alert>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Delete workspace</CardTitle>
          <CardDescription>
            This permanently removes every project, task, and file in this workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button variant="destructive" size="sm" onClick={() => toast.error("Demo only — nothing was deleted")}>
            Delete workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ApiKeysSection() {
  const [keys, setKeys] = useState([
    { id: "k1", name: "Production · Atlas", value: "pw_live_sk_7fc2••••c341", scope: "read-write", created: "2026-02-11" },
    { id: "k2", name: "Staging · Luna", value: "pw_test_sk_a41d••••88ef", scope: "read-only", created: "2026-03-04" },
  ]);

  function createKey() {
    const next = {
      id: `k${Date.now()}`,
      name: "New key",
      value: `pw_live_sk_${Math.random().toString(16).slice(2, 6)}••••${Math.random().toString(16).slice(2, 6)}`,
      scope: "read-only",
      created: new Date().toISOString().slice(0, 10),
    };
    setKeys((prev) => [next, ...prev]);
    toast.success("API key created", { description: "Copy it now — you won't see it again." });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">API keys</CardTitle>
          <CardDescription>Used by integrations and CLI tools.</CardDescription>
        </div>
        <Button variant="brand" size="sm" onClick={createKey}>
          <Key className="size-4" />
          New key
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-3 pt-6">
        {keys.map((key) => (
          <div key={key.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium">{key.name}</p>
              <div className="flex items-center gap-2">
                <CodeLabel value={key.value} size="sm" />
                <Badge variant="secondary" className="rounded-full text-xs capitalize">
                  {key.scope}
                </Badge>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Created</p>
              <p className="font-medium text-foreground">{key.created}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setKeys((prev) => prev.filter((k) => k.id !== key.id));
                toast("Key revoked");
              }}
              aria-label="Revoke key"
            >
              ×
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
