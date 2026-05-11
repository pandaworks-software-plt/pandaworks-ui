# UserPicker

Avatar-trigger picker for assigning one user or many. Use for assignee, owner, collaborator, watcher, approver, or reviewer fields where the selected value should read visually as a person instead of a text select.

Composes `Popover`, `Command`, `Avatar`, and `AvatarGroup`. Search is enabled automatically when `users.length > 8`, or can be controlled with `searchable`.

```tsx
import { UserPicker, type UserPickerUser } from "@/components/ui/user-picker"

const users: UserPickerUser[] = [
  { id: "maya", name: "Maya Tan", email: "maya.tan@example.com" },
  { id: "amir", name: "Amir Rahman", email: "amir.rahman@example.com" },
]

// Single user
<UserPicker
  users={users}
  value={assigneeId}
  onValueChange={setAssigneeId}
/>

// Multiple users
<UserPicker
  mode="multi"
  users={users}
  value={collaboratorIds}
  onValueChange={setCollaboratorIds}
  maxAvatarsShown={3}
/>
```

Types:

```ts
export interface UserPickerUser {
  id: string
  name: string
  email?: string
  imageUrl?: string | null
}
```

Props:

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `users` | `UserPickerUser[]` | required | Options rendered in the Command menu. |
| `mode` | `"single" \| "multi"` | `"single"` | Discriminates the value and callback types. |
| `value` | `string \| null` | required | Single mode selected user id, or `null` for unassigned. |
| `onValueChange` | `(userId: string \| null) => void` | required | Single mode change handler. |
| `allowUnassigned` | `boolean` | `true` | Single mode only. Renders an unassigned menu row that sets `value` to `null`. |
| `value` | `string[]` | required | Multi mode selected user ids. |
| `onValueChange` | `(userIds: string[]) => void` | required | Multi mode change handler. |
| `maxAvatarsShown` | `number` | `3` | Multi mode only. Passed to `AvatarGroup`; overflow renders as `+N`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Trigger avatar size. `sm` = `h-6 w-6`, `md` = `h-8 w-8`, `lg` = `h-10 w-10`. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Popover alignment. |
| `searchable` | `boolean` | `users.length > 8` | Controls whether the Command search input is shown. |
| `searchPlaceholder` | `string` | `"Search users..."` | Placeholder for the Command input. |
| `emptyMessage` | `string` | `"No users found."` | Empty state shown after filtering. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `className` | `string` | undefined | Applied to the trigger button. |
| `placeholder` | `string` | `"Unassigned"` single, `"Assign users"` multi | Used for the empty trigger title and the single-mode unassigned row. |

Trigger behavior:

- Single mode with a value renders one `Avatar` for the selected user.
- Single mode without a value renders a muted `UserCircle` fallback avatar.
- Multi mode with selections renders an `AvatarGroup`; overflow is handled by `AvatarGroup`.
- Multi mode without selections renders the same muted `UserCircle` fallback avatar.
- The trigger stops click propagation so it can be used inside clickable rows.

When to use UserPicker vs SelectPicker:

- UserPicker: assignee, owner, reviewer, collaborator, watcher, approver, or any user identity field where an avatar trigger is expected.
- SelectPicker: general searchable options that are not people, or when the trigger should show text/badges instead of avatars.
