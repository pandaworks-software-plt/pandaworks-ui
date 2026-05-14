import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type SettingsRowLayout = 'inline' | 'stacked';

export interface SettingsRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  helperText?: ReactNode;
  trailing?: ReactNode;
  layout?: SettingsRowLayout;
  showSave?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  dirty?: boolean;
  saving?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

const SettingsRow = forwardRef<HTMLDivElement, SettingsRowProps>(function SettingsRow(
  {
    title,
    description,
    helperText,
    trailing,
    layout = 'inline',
    showSave = false,
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
    dirty = true,
    saving = false,
    onSave,
    onCancel,
    className,
    children,
    ...rest
  },
  ref
) {
  const labelBlock = (
    <div className="min-w-0 flex-1 space-y-1">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );

  return (
    <div
      ref={ref}
      data-slot="settings-row"
      data-layout={layout}
      className={cn('flex flex-col gap-3 py-4', className)}
      {...rest}
    >
      {layout === 'inline' ? (
        <div className="flex w-full items-start gap-4">
          {labelBlock}
          {children && <div className="shrink-0">{children}</div>}
          {trailing && <div className="shrink-0">{trailing}</div>}
        </div>
      ) : (
        <>
          <div className="flex w-full items-start gap-4">
            {labelBlock}
            {trailing && <div className="shrink-0">{trailing}</div>}
          </div>
          {children && <div className="w-full">{children}</div>}
        </>
      )}

      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}

      {showSave && (
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button action="cancel" onClick={onCancel} disabled={saving} type="button">
              {cancelLabel}
            </Button>
          )}
          <Button action="save" onClick={onSave} disabled={!dirty || saving} loading={saving} type="button">
            {saveLabel}
          </Button>
        </div>
      )}
    </div>
  );
});
SettingsRow.displayName = 'SettingsRow';

export { SettingsRow };
