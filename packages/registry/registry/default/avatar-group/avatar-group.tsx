import {
  forwardRef,
  Children,
  isValidElement,
  cloneElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib';
import { Avatar, AvatarFallback, type AvatarShape, type AvatarSize } from '@/components/ui/avatar';

const avatarGroupVariants = cva('flex items-center', {
  variants: {
    size: {
      xs: '-space-x-1',
      sm: '-space-x-2',
      md: '-space-x-2',
      lg: '-space-x-3',
      xl: '-space-x-4',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

type AvatarGroupSize = AvatarSize;

export interface AvatarGroupProps
  extends HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof avatarGroupVariants>, 'size'> {
  /** Maximum number of avatars to display before collapsing into a "+N" tile. */
  max?: number;
  size?: AvatarGroupSize;
  shape?: AvatarShape;
}

// Each stacked avatar layers a 2px page-background ring (for punched-out separation
// from neighbours) over a 1px hairline border (so the edge stays readable when the
// avatar content matches the page background — e.g. a dark transparent-PNG on a
// dark surface). Together they give every circle a clean, defined boundary.
const STACK_SEPARATION = 'border border-border/60 ring-2 ring-background';

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, size = 'sm', shape, children, ...props }, ref) => {
    const all = Children.toArray(children).filter(isValidElement) as ReactElement<
      ComponentPropsWithoutRef<typeof Avatar>
    >[];
    const visible = max != null ? all.slice(0, max) : all;
    const overflow = max != null ? all.length - visible.length : 0;

    return (
      <div ref={ref} data-slot="avatar-group" className={cn(avatarGroupVariants({ size }), className)} {...props}>
        {visible.map((child, idx) =>
          cloneElement(child, {
            key: child.key ?? idx,
            shape: child.props.shape ?? shape,
            size,
            className: cn(STACK_SEPARATION, child.props.className),
          })
        )}
        {overflow > 0 && (
          <Avatar shape={shape} size={size} className={STACK_SEPARATION}>
            <AvatarFallback colorize={false} className="font-medium">
              +{overflow}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

export { AvatarGroup, avatarGroupVariants };
