import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react"
import {
  File as FileIcon,
  FileImage,
  FileText,
  FileSpreadsheet,
  FileArchive,
  Paperclip,
  Upload,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AttachmentFile {
  id?: string
  name: string
  size: number
  type: string
  url?: string
  file?: File
}

interface AttachmentInputBaseProps {
  variant?: "dropzone" | "compact"
  accept?: string
  maxSize?: number
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

export type AttachmentInputProps =
  | SingleAttachmentInputProps
  | MultipleAttachmentInputProps

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BYTES_PER_UNIT = 1024;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(BYTES_PER_UNIT))
  const size = bytes / Math.pow(BYTES_PER_UNIT, i)
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return FileImage
  if (type === "application/pdf" || type.startsWith("text/")) return FileText
  if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    type === "text/csv"
  )
    return FileSpreadsheet
  if (type.includes("zip") || type.includes("archive") || type.includes("tar"))
    return FileArchive
  return FileIcon
}

function generateAcceptLabel(accept: string | undefined): string | null {
  if (!accept) return null
  const parts = accept.split(",").map((s) => s.trim())
  const labels: string[] = []
  for (const part of parts) {
    if (part.startsWith(".")) {
      labels.push(part.slice(1).toUpperCase())
    } else if (part === "image/*") {
      labels.push("Images")
    } else if (part === "video/*") {
      labels.push("Videos")
    } else if (part === "audio/*") {
      labels.push("Audio")
    } else if (part === "application/pdf") {
      labels.push("PDF")
    } else {
      const ext = part.split("/")[1]
      if (ext && ext !== "*") labels.push(ext.toUpperCase())
    }
  }
  return labels.length > 0 ? labels.join(", ") : null
}

function isDuplicate(file: File, existing: AttachmentFile[]): boolean {
  return existing.some((f) => f.name === file.name && f.size === file.size)
}

function fileToAttachment(file: File): AttachmentFile {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    file,
  }
}

// ---------------------------------------------------------------------------
// FileListItem
// ---------------------------------------------------------------------------

function FileListItem({
  attachment,
  onRemove,
  disabled,
}: {
  attachment: AttachmentFile
  onRemove: () => void
  disabled?: boolean
}) {
  const Icon = getFileIcon(attachment.type)

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm transition-colors",
        "dark:bg-muted/30"
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1 truncate text-foreground">
        {attachment.name}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatFileSize(attachment.size)}
      </span>
      {!disabled && (
        <button
          type="button"
          className={cn(
            "shrink-0 rounded-full p-0.5 text-muted-foreground transition-colors",
            "hover:bg-muted-foreground/20 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          onClick={onRemove}
          aria-label={`Remove ${attachment.name}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CompactFileChip
// ---------------------------------------------------------------------------

function CompactFileChip({
  attachment,
  onRemove,
  disabled,
}: {
  attachment: AttachmentFile
  onRemove: () => void
  disabled?: boolean
}) {
  const Icon = getFileIcon(attachment.type)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-foreground",
        "dark:bg-muted/40"
      )}
    >
      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
      <span className="max-w-[120px] truncate">{attachment.name}</span>
      {!disabled && (
        <button
          type="button"
          className={cn(
            "ml-0.5 shrink-0 rounded-full p-0.5 text-muted-foreground transition-colors",
            "hover:bg-muted-foreground/20 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={`Remove ${attachment.name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}

// ---------------------------------------------------------------------------
// DropzoneArea
// ---------------------------------------------------------------------------

function DropzoneArea({
  accept,
  maxSize,
  disabled,
  hasFiles,
  fileCount,
  maxFiles,
  onClick,
  onDrop,
}: {
  accept?: string
  maxSize?: number
  disabled?: boolean
  hasFiles: boolean
  fileCount: number
  maxFiles?: number
  onClick: () => void
  onDrop: (files: FileList) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  const acceptLabel = generateAcceptLabel(accept)
  const sizeLabel = maxSize ? formatFileSize(maxSize) : null
  const atLimit = maxFiles !== undefined && fileCount >= maxFiles

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !atLimit) setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (!disabled && !atLimit && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files)
    }
  }

  const hintParts: string[] = []
  if (acceptLabel) hintParts.push(acceptLabel)
  if (sizeLabel) hintParts.push(`up to ${sizeLabel}`)
  const hint = hintParts.length > 0 ? hintParts.join(" - ") : null

  return (
    <button
      type="button"
      disabled={disabled || atLimit}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-8 text-center transition-all duration-150 ease-out",
        "border-muted-foreground/25 bg-muted/30",
        "hover:border-muted-foreground/40 hover:bg-muted/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "dark:bg-muted/10 dark:hover:bg-muted/20",
        isDragOver &&
          "border-primary bg-primary/5 dark:bg-primary/10",
        (disabled || atLimit) &&
          "cursor-not-allowed opacity-40 hover:border-muted-foreground/25 hover:bg-muted/30"
      )}
    >
      <Upload
        className={cn(
          "h-8 w-8 text-muted-foreground transition-colors",
          isDragOver && "text-primary"
        )}
      />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          {atLimit
            ? "File limit reached"
            : hasFiles
              ? "Drop more files or click to add"
              : "Drag & drop files here, or click to browse"}
        </p>
        {hint && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
        {maxFiles !== undefined && (
          <p className="text-xs text-muted-foreground">
            {fileCount} of {maxFiles} files
          </p>
        )}
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// CompactTrigger
// ---------------------------------------------------------------------------

function CompactTrigger({
  disabled,
  atLimit,
  onClick,
}: {
  disabled?: boolean
  atLimit: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled || atLimit}
      onClick={onClick}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all duration-150 ease-out",
        "text-muted-foreground",
        "hover:bg-muted hover:text-foreground hover:shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        (disabled || atLimit) &&
          "cursor-not-allowed opacity-40 hover:bg-background hover:text-muted-foreground hover:shadow-[0_1px_0_rgba(0,0,0,0.04)]"
      )}
    >
      <Paperclip className="h-4 w-4 shrink-0" />
      <span>{atLimit ? "File limit reached" : "Attach files..."}</span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// ErrorMessage
// ---------------------------------------------------------------------------

function ErrorMessage({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    const timer = setTimeout(() => onDismissRef.current(), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <p className="text-xs text-destructive" role="alert">
      {message}
    </p>
  )
}

// ---------------------------------------------------------------------------
// AttachmentInput
// ---------------------------------------------------------------------------

function AttachmentInput(props: AttachmentInputProps) {
  const {
    variant = "dropzone",
    accept,
    maxSize,
    disabled = false,
    className,
    mode,
  } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const files: AttachmentFile[] =
    mode === "single"
      ? props.value
        ? [props.value]
        : []
      : props.value

  const maxFiles = mode === "multiple" ? props.maxFiles : undefined
  const atLimit =
    mode === "multiple" && maxFiles !== undefined && files.length >= maxFiles

  const clearError = useCallback(() => setError(null), [])

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const incoming = Array.from(fileList)
      const validated: AttachmentFile[] = []

      for (const file of incoming) {
        if (maxSize && file.size > maxSize) {
          setError(
            `File exceeds maximum size of ${formatFileSize(maxSize)}`
          )
          continue
        }

        if (mode === "multiple" && isDuplicate(file, files)) {
          continue
        }

        validated.push(fileToAttachment(file))
      }

      if (validated.length === 0) return

      if (mode === "single") {
        props.onChange(validated[0])
      } else {
        const remaining =
          maxFiles !== undefined
            ? maxFiles - files.length
            : validated.length
        if (remaining <= 0) {
          setError(`Maximum of ${maxFiles} files allowed`)
          return
        }
        const toAdd = validated.slice(0, remaining)
        if (validated.length > remaining) {
          setError(`Maximum of ${maxFiles} files allowed`)
        }
        props.onChange([...files, ...toAdd])
      }

      if (inputRef.current) {
        inputRef.current.value = ""
      }
    },
    [mode, files, maxSize, maxFiles, props.onChange]
  )

  const handleRemove = useCallback(
    (index: number) => {
      if (mode === "single") {
        props.onChange(null)
      } else {
        props.onChange(files.filter((_, i) => i !== index))
      }
    },
    [mode, files, props.onChange]
  )

  const openPicker = () => {
    if (!disabled && !atLimit) {
      inputRef.current?.click()
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div data-slot="attachment-input" className={cn("flex flex-col gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={mode === "multiple"}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {variant === "dropzone" ? (
        <DropzoneArea
          accept={accept}
          maxSize={maxSize}
          disabled={disabled}
          hasFiles={files.length > 0}
          fileCount={files.length}
          maxFiles={maxFiles}
          onClick={openPicker}
          onDrop={(fileList) => handleFiles(fileList)}
        />
      ) : (
        <CompactTrigger
          disabled={disabled}
          atLimit={atLimit}
          onClick={openPicker}
        />
      )}

      {error && <ErrorMessage message={error} onDismiss={clearError} />}

      {files.length > 0 &&
        (variant === "dropzone" ? (
          <div className="flex flex-col gap-1.5">
            {files.map((attachment, index) => (
              <FileListItem
                key={`${attachment.name}-${attachment.size}`}
                attachment={attachment}
                onRemove={() => handleRemove(index)}
                disabled={disabled}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {files.map((attachment, index) => (
              <CompactFileChip
                key={`${attachment.name}-${attachment.size}`}
                attachment={attachment}
                onRemove={() => handleRemove(index)}
                disabled={disabled}
              />
            ))}
          </div>
        ))}
    </div>
  )
}

export { AttachmentInput }
