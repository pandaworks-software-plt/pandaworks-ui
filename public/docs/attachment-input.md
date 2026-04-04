# AttachmentInput

File attachment input with dropzone/compact variants, single/multiple modes.

```tsx
import { AttachmentInput } from "@/components/ui/attachment-input"

// Single file dropzone
<AttachmentInput
  mode="single"
  variant="dropzone"
  value={file}
  onChange={setFile}
  accept="image/*,.pdf"
  maxSize={5 * 1024 * 1024}
/>

// Multiple files compact
<AttachmentInput
  mode="multiple"
  variant="compact"
  value={files}
  onChange={setFiles}
  maxFiles={5}
/>
```

Props:
- `mode: "single" | "multiple"`
- `variant?: "dropzone" | "compact"` (default: "dropzone")
- Single: `value: AttachmentFile | null`, `onChange: (file: AttachmentFile | null) => void`
- Multiple: `value: AttachmentFile[]`, `onChange: (files: AttachmentFile[]) => void`, `maxFiles?: number`
- `accept?: string` -- File type filter (e.g., "image/*,.pdf")
- `maxSize?: number` -- Max file size in bytes
