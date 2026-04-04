# Attachment Input Component Design

## Overview

A file attachment input component for the Pandahrms UI registry. Supports single/multiple file modes via discriminated union props, two visual variants (dropzone and compact), and pre-populated files for edit forms. Handles file selection and validation only - no upload logic.

## Component API

```tsx
interface AttachmentFile {
  id?: string        // For existing files (edit forms)
  name: string
  size: number
  type: string
  url?: string       // For existing files - preview/download link
  file?: File        // For newly selected files (absent on existing)
}

interface AttachmentInputBaseProps {
  variant?: "dropzone" | "compact"  // Default: "dropzone"
  accept?: string                    // e.g. "image/*,.pdf"
  maxSize?: number                   // Max file size in bytes
  disabled?: boolean
  className?: string
}

interface SingleAttachmentInputProps extends AttachmentInputBaseProps {
  mode: "single"
  value: AttachmentFile | null
  onChange: (file: AttachmentFile | null) => void
}

interface MultipleAttachmentInputProps extends AttachmentInputBaseProps {
  mode: "multiple"
  value: AttachmentFile[]
  onChange: (files: AttachmentFile[]) => void
  maxFiles?: number
}

type AttachmentInputProps = SingleAttachmentInputProps | MultipleAttachmentInputProps
```

## Visual Variants

### Dropzone (default)

- Dashed border area with upload icon and instructional text
- Auto-generated hint from accept/maxSize props (e.g. "PNG, JPG, PDF up to 10MB")
- Highlights on drag-over: border transitions to `border-primary`, bg to `bg-primary/5`
- File list rendered below the dropzone as rows with file-type icon, name, formatted size, and remove button

### Compact

- Input-style button matching existing Input component height (h-9) and styling tokens
- Paperclip icon with "Attach files..." placeholder text
- Selected files shown as badges below, each with a remove button

## Behavior

### File Selection
- Dropzone: drag-and-drop or click to open file picker
- Compact: click to open file picker
- Hidden `<input type="file">` triggered via ref in both variants

### Single Mode
- New file replaces current one
- Remove button clears back to null

### Multiple Mode
- New files appended to existing list
- Duplicates (same name+size) silently skipped
- maxFiles enforced - input disables when limit reached
- Each file individually removable

### Validation
- File type mismatch: "File type not accepted. Expected: PNG, JPG, PDF"
- File too large: "File exceeds maximum size of 10MB"
- Max files exceeded: "Maximum of N files allowed"
- Errors shown as destructive text below the component, auto-dismiss after 5 seconds

### Existing Files (Edit Forms)
- Render identically to newly selected files
- Consumer distinguishes new vs existing by checking for `file` property presence
- Remove triggers onChange with the file removed

## Implementation Structure

Single file following the filter-bar pattern:

```
registry/default/attachment-input/
  attachment-input.tsx
```

### Internal Structure
1. Types - AttachmentFile, props interfaces, discriminated union
2. Helpers - formatFileSize(), getFileIcon(), generateAcceptLabel()
3. Sub-components (not exported): DropzoneArea, CompactTrigger, FileListItem
4. Main export - AttachmentInput function + AttachmentInputProps type

### Dependencies
- lucide-react: Upload, Paperclip, X, File, FileImage, FileText icons
- Registry deps: button (remove action), badge (compact file chips)
- No external drag-and-drop libraries (native HTML5 drag events)

## Files to Create/Modify

1. `registry/default/attachment-input/attachment-input.tsx` - the component
2. `src/components/ui/attachment-input.tsx` - mirror copy for showcase
3. `src/showcase/demos/attachment-input-demo.tsx` - demo page
4. `registry.json` - add entry
5. `src/showcase/showcase-app.tsx` - register demo
6. Run `pnpm registry:build` to generate `public/r/attachment-input.json`
