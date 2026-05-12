import { ChevronDown } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface MetaEditPillOption {
  /** Stable identifier passed back through `onChange`. */
  value: string;
  /** Human label rendered in the dropdown and as the display value. */
  label: string;
}

interface MetaEditPillBaseProps {
  /** Field name shown in front of the value (e.g. "Priority"). */
  label: ReactNode;
  /** Choices the user can pick from. */
  options: MetaEditPillOption[];
  /** Text shown when no value is selected. Defaults to "Nil". */
  emptyText?: string;
  /** When false, renders the value as plain text without the click-to-edit chevron. */
  canEdit: boolean;
  /** Mutation-in-flight flag; greys the trigger and blocks interaction. */
  disabled?: boolean;
  /** className passthrough for the outer wrapper. */
  className?: string;
}

export interface MetaEditPillSingleProps extends MetaEditPillBaseProps {
  mode: 'single';
  value: string | null;
  /** When true, shows a "Clear" item at the top of the menu that fires onChange(null). */
  allowClear?: boolean;
  /** Override the default "Clear" label (e.g. "No module"). */
  clearLabel?: string;
  onChange: (value: string | null) => void;
}

export interface MetaEditPillMultiProps extends MetaEditPillBaseProps {
  mode: 'multi';
  value: string[];
  onChange: (value: string[]) => void;
}

export type MetaEditPillProps = MetaEditPillSingleProps | MetaEditPillMultiProps;

function renderDisplay(props: MetaEditPillProps): string {
  if (props.mode === 'single') {
    const match = props.options.find((option) => option.value === props.value);
    return match?.label ?? props.emptyText ?? 'Nil';
  }
  if (props.value.length === 0) return props.emptyText ?? 'Nil';
  return props.value.map((value) => props.options.find((option) => option.value === value)?.label ?? value).join(', ');
}

/**
 * Inline click-to-edit value pill. Renders as `<label> <value>` where `<value>`
 * is a `DropdownMenu` trigger. Use for compact meta strips (status, priority,
 * severity, tags) on detail pages where each field has a fixed option set.
 *
 * The component is presentational — wire the `onChange` callback to your own
 * mutation hook. When `canEdit` is false, it falls back to a static label /
 * value pair so the same JSX renders for read-only viewers.
 */
const MetaEditPill = forwardRef<HTMLSpanElement, MetaEditPillProps>(function MetaEditPill(props, ref) {
  const display = renderDisplay(props);
  const labelText = typeof props.label === 'string' ? props.label.toLowerCase() : 'value';

  if (!props.canEdit) {
    return (
      <span ref={ref} data-slot="meta-edit-pill" className={cn('inline-flex items-center gap-2', props.className)}>
        <span className="font-medium text-foreground">{props.label}</span>
        <span className="text-muted-foreground">{display}</span>
      </span>
    );
  }

  return (
    <span ref={ref} data-slot="meta-edit-pill" className={cn('inline-flex items-center gap-2', props.className)}>
      <span className="font-medium text-foreground">{props.label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={props.disabled}
            className={cn(
              '-mx-1 inline-flex items-center gap-1 rounded-sm px-1 text-muted-foreground transition-colors',
              'hover:bg-muted/60 hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-60'
            )}
            aria-label={`Change ${labelText}`}
          >
            <span>{display}</span>
            <ChevronDown className="size-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
          {props.mode === 'single' ? (
            <>
              {props.allowClear ? (
                <>
                  <DropdownMenuItem onSelect={() => props.onChange(null)} disabled={props.value === null}>
                    {props.clearLabel ?? 'Clear'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : null}
              {props.options.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => props.onChange(option.value)}
                  disabled={option.value === props.value}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            props.options.map((option) => {
              const checked = props.value.includes(option.value);
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={checked}
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={(next) => {
                    if (next) {
                      props.onChange([...props.value, option.value]);
                    } else {
                      props.onChange(props.value.filter((value) => value !== option.value));
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
});
MetaEditPill.displayName = 'MetaEditPill';

export { MetaEditPill };
