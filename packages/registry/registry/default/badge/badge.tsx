import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 max-w-full truncate',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive-aa text-destructive-foreground hover:bg-destructive-aa/90',
        outline: 'text-foreground',
        success: 'border-transparent bg-success/15 text-success-soft-fg dark:bg-success/20',
        warning: 'border-transparent bg-warning/15 text-warning-soft-fg dark:bg-warning/20',
        info: 'border-transparent bg-info/15 text-info-soft-fg dark:bg-info/20',
        muted: 'border-transparent bg-muted text-muted-foreground dark:text-stone-300',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        xs: 'h-5 px-1.5 text-[11px] leading-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const dotVariants = cva('size-1.5 shrink-0 rounded-full', {
  variants: {
    variant: {
      default: 'bg-primary-foreground/80',
      secondary: 'bg-secondary-foreground/60',
      destructive: 'bg-destructive-foreground/80',
      outline: 'bg-foreground/40',
      success: 'bg-success',
      warning: 'bg-warning',
      info: 'bg-info',
      muted: 'bg-muted-foreground/60',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  /** Override the tooltip text. Defaults to the children text content. */
  tooltipText?: string;
  /** Show a leading status dot tinted to match the variant. */
  dot?: boolean;
}

function Badge({ className, variant, size, children, tooltipText, dot, ...props }: BadgeProps) {
  const label = tooltipText ?? (typeof children === 'string' ? children : undefined);

  const badge = (
    <div data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && <span aria-hidden className={cn(dotVariants({ variant }))} />}
      {children}
    </div>
  );

  if (!label) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export { Badge, badgeVariants };
