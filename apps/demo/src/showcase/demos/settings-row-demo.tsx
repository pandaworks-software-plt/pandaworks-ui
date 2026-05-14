import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { SettingsRow } from '@/components/ui/settings-row';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DemoSection } from '@/showcase/component-page';

export default function SettingsRowDemo() {
  const [emailMentions, setEmailMentions] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [displayName, setDisplayName] = useState('Kyson Teh');
  const [savedDisplayName, setSavedDisplayName] = useState('Kyson Teh');
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSavedDisplayName(displayName);
      setSaving(false);
    }, 800);
  }

  return (
    <div className="space-y-8">
      <DemoSection
        title="Inline (Switch control, batched save)"
        code={`<Card>
  <CardContent className="divide-y">
    <SettingsRow
      title="Email me on mentions"
      description="Whenever someone @-mentions you in a comment."
    >
      <Switch checked={emailMentions} onCheckedChange={setEmailMentions} />
    </SettingsRow>
    <SettingsRow
      title="Weekly digest"
      description="A Monday-morning summary of last week's activity."
    >
      <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
    </SettingsRow>
  </CardContent>
</Card>`}
      >
        <Card>
          <CardContent className="divide-y p-0">
            <div className="px-6">
              <SettingsRow title="Email me on mentions" description="Whenever someone @-mentions you in a comment.">
                <Switch checked={emailMentions} onCheckedChange={setEmailMentions} />
              </SettingsRow>
            </div>
            <div className="px-6">
              <SettingsRow title="Weekly digest" description="A Monday-morning summary of last week's activity.">
                <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
              </SettingsRow>
            </div>
            <div className="px-6">
              <SettingsRow title="Theme" description="Choose how the app looks on this device.">
                <ThemeToggle />
              </SettingsRow>
            </div>
          </CardContent>
        </Card>
      </DemoSection>

      <DemoSection
        title="Stacked layout with per-row Save"
        code={`<SettingsRow
  layout="stacked"
  title="Display name"
  description="The name shown to other people in your workspace."
  helperText="Visible to everyone in your organization."
  showSave
  dirty={displayName !== savedDisplayName}
  saving={saving}
  onSave={save}
  onCancel={() => setDisplayName(savedDisplayName)}
>
  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} />
</SettingsRow>`}
      >
        <Card>
          <CardContent className="px-6">
            <SettingsRow
              layout="stacked"
              title="Display name"
              description="The name shown to other people in your workspace."
              helperText="Visible to everyone in your organization."
              showSave
              dirty={displayName !== savedDisplayName}
              saving={saving}
              onSave={handleSave}
              onCancel={() => setDisplayName(savedDisplayName)}
            >
              <Input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your full name"
              />
            </SettingsRow>
          </CardContent>
        </Card>
      </DemoSection>

      <DemoSection
        title="With trailing action"
        code={`<SettingsRow
  title="API access token"
  description="Used for server-side integrations."
  trailing={<Button action="duplicate">Copy</Button>}
>
  <CodeLabel>sk_live_••••••••6f3a</CodeLabel>
</SettingsRow>`}
      >
        <Card>
          <CardContent className="px-6">
            <SettingsRow
              title="API access token"
              description="Used for server-side integrations. Rotate from the security page."
              trailing={
                <span className="rounded-md border bg-muted px-2 py-1 font-mono text-xs">sk_live_••••6f3a</span>
              }
            >
              <span className="text-xs text-muted-foreground">Last used 2 hours ago</span>
            </SettingsRow>
            <Separator />
            <SettingsRow
              title="Two-factor authentication"
              description="Require a one-time code on every sign-in."
              helperText="Enrol an authenticator app from your phone."
            >
              <Switch />
            </SettingsRow>
          </CardContent>
        </Card>
      </DemoSection>
    </div>
  );
}
