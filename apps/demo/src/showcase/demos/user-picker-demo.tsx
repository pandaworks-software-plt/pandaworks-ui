import { useState } from 'react';
import { DemoSection } from '@/showcase/component-page';
import { UserPicker, type UserPickerUser } from '@/components/ui/user-picker';

const teamUsers: UserPickerUser[] = [
  { id: 'maya', name: 'Maya Tan', email: 'maya.tan@example.com' },
  { id: 'amir', name: 'Amir Rahman', email: 'amir.rahman@example.com' },
  { id: 'jules', name: 'Jules Lim', email: 'jules.lim@example.com' },
  { id: 'nora', name: 'Nora Wong', email: 'nora.wong@example.com' },
  { id: 'dev', name: 'Dev Patel', email: 'dev.patel@example.com' },
];

const imageUsers: UserPickerUser[] = [
  {
    id: 'sophia',
    name: 'Sophia Chen',
    email: 'sophia.chen@example.com',
    imageUrl: 'https://i.pravatar.cc/96?img=47',
  },
  {
    id: 'marcus',
    name: 'Marcus Lee',
    email: 'marcus.lee@example.com',
    imageUrl: 'https://i.pravatar.cc/96?img=12',
  },
  {
    id: 'elena',
    name: 'Elena Garcia',
    email: 'elena.garcia@example.com',
    imageUrl: 'https://i.pravatar.cc/96?img=32',
  },
];

const largeTeamUsers: UserPickerUser[] = [
  ...teamUsers,
  { id: 'aisha', name: 'Aisha Omar', email: 'aisha.omar@example.com' },
  { id: 'ben', name: 'Ben Walker', email: 'ben.walker@example.com' },
  { id: 'clara', name: 'Clara Ng', email: 'clara.ng@example.com' },
  { id: 'dina', name: 'Dina Hassan', email: 'dina.hassan@example.com' },
  { id: 'ethan', name: 'Ethan Chua', email: 'ethan.chua@example.com' },
  { id: 'farah', name: 'Farah Ismail', email: 'farah.ismail@example.com' },
  { id: 'gabriel', name: 'Gabriel Koh', email: 'gabriel.koh@example.com' },
];

export default function UserPickerDemo() {
  const [assignee, setAssignee] = useState<string | null>(null);
  const [owner, setOwner] = useState<string | null>('maya');
  const [profileOwner, setProfileOwner] = useState<string | null>('sophia');
  const [reviewers, setReviewers] = useState<string[]>(['maya', 'amir', 'jules']);
  const [watchers, setWatchers] = useState<string[]>(['maya', 'amir', 'jules', 'nora', 'dev']);

  return (
    <>
      <DemoSection
        title="Default Single"
        code={`import { UserPicker } from "@/components/ui/user-picker"

const users = [
  { id: "maya", name: "Maya Tan", email: "maya.tan@example.com" },
  { id: "amir", name: "Amir Rahman", email: "amir.rahman@example.com" },
]

<UserPicker
  users={users}
  value={assignee}
  onValueChange={setAssignee}
/>`}
      >
        <div className="flex items-center gap-3">
          <UserPicker users={teamUsers} value={assignee} onValueChange={setAssignee} />
          <p className="text-sm text-muted-foreground">
            {assignee ? `Assigned to ${teamUsers.find((user) => user.id === assignee)?.name}` : 'Unassigned'}
          </p>
        </div>
      </DemoSection>

      <DemoSection
        title="Required Single"
        code={`<UserPicker
  users={users}
  value={owner}
  onValueChange={setOwner}
  allowUnassigned={false}
  placeholder="Select owner"
/>`}
      >
        <div className="flex items-center gap-3">
          <UserPicker
            users={teamUsers}
            value={owner}
            onValueChange={setOwner}
            allowUnassigned={false}
            placeholder="Select owner"
          />
          <p className="text-sm text-muted-foreground">Owner: {teamUsers.find((user) => user.id === owner)?.name}</p>
        </div>
      </DemoSection>

      <DemoSection
        title="Single with Images"
        code={`const users = [
  {
    id: "sophia",
    name: "Sophia Chen",
    email: "sophia.chen@example.com",
    imageUrl: "https://i.pravatar.cc/96?img=47",
  },
]

<UserPicker
  users={users}
  value={profileOwner}
  onValueChange={setProfileOwner}
  size="lg"
/>`}
      >
        <div className="flex items-center gap-3">
          <UserPicker users={imageUsers} value={profileOwner} onValueChange={setProfileOwner} size="lg" />
          <p className="text-sm text-muted-foreground">
            Profile owner: {imageUsers.find((user) => user.id === profileOwner)?.name}
          </p>
        </div>
      </DemoSection>

      <DemoSection
        title="Multi Select"
        code={`<UserPicker
  mode="multi"
  users={users}
  value={reviewers}
  onValueChange={setReviewers}
  placeholder="Assign reviewers"
/>`}
      >
        <div className="flex items-center gap-3">
          <UserPicker
            mode="multi"
            users={teamUsers}
            value={reviewers}
            onValueChange={setReviewers}
            placeholder="Assign reviewers"
          />
          <p className="text-sm text-muted-foreground">{reviewers.length} reviewers selected</p>
        </div>
      </DemoSection>

      <DemoSection
        title="Multi with Auto Search"
        code={`<UserPicker
  mode="multi"
  users={largeTeamUsers}
  value={watchers}
  onValueChange={setWatchers}
  maxAvatarsShown={4}
  placeholder="Assign watchers"
/>`}
      >
        <div className="flex items-center gap-3">
          <UserPicker
            mode="multi"
            users={largeTeamUsers}
            value={watchers}
            onValueChange={setWatchers}
            maxAvatarsShown={4}
            placeholder="Assign watchers"
          />
          <p className="text-sm text-muted-foreground">{watchers.length} watchers selected</p>
        </div>
      </DemoSection>
    </>
  );
}
