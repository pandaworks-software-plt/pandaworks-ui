import { forwardRef, type ReactNode, type TdHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import { TableCell } from '@/components/ui/table';
import { TruncatedLabel } from '@/components/ui/truncated-label';

interface TableListCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'title'> {
  /** Optional leading visual (status icon, type icon, etc.) placed before the eyebrow/title. */
  leadingIcon?: ReactNode;
  /** Small monospaced muted label placed before the title (e.g. ticket number, code). */
  eyebrow?: ReactNode;
  /** Primary line text. Rendered with TruncatedLabel so long titles get a tooltip. */
  title: string;
  /** Meta sub-line content — typically a mix of Badge, text, and MetaDivider. */
  meta?: ReactNode;
}

const TableListCell = forwardRef<HTMLTableCellElement, TableListCellProps>(function TableListCell(
  { leadingIcon, eyebrow, title, meta, className, ...rest },
  ref
) {
  return (
    <TableCell ref={ref} data-slot="table-list-cell" className={cn('w-full max-w-0 px-6 py-4', className)} {...rest}>
      <div className="flex min-w-0 items-center gap-2">
        {leadingIcon}
        {eyebrow !== undefined && eyebrow !== null && (
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{eyebrow}</span>
        )}
        <TruncatedLabel text={title} className="font-medium" />
      </div>
      {meta && <div className="mt-1 flex flex-wrap items-center gap-2">{meta}</div>}
    </TableCell>
  );
});

const MetaDivider = forwardRef<HTMLSpanElement>(function MetaDivider(_props, ref) {
  return <span ref={ref} aria-hidden="true" className="h-3 w-px bg-border" />;
});

export { TableListCell, MetaDivider };
export type { TableListCellProps };
