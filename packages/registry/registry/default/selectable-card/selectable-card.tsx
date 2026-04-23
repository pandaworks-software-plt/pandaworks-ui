import { type ReactNode } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const selectableCardVariants = cva(
  'group flex w-full cursor-pointer items-center rounded-lg border border-border/70 bg-card text-left shadow-xs outline-none transition-[color,border-color,box-shadow,background-color] duration-150 hover:border-primary/50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 data-[state=checked]:ring-1 data-[state=checked]:ring-primary/20 dark:border-border dark:data-[state=checked]:bg-primary/10',
  {
    variants: {
      size: {
        sm: 'gap-3 p-3',
        default: 'gap-4 p-4',
        lg: 'gap-5 p-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const indicatorSizes = {
  sm: { outer: 'size-4', inner: 'size-2', check: 'size-3' },
  default: { outer: 'size-5', inner: 'size-2.5', check: 'size-3.5' },
  lg: { outer: 'size-5', inner: 'size-2.5', check: 'size-3.5' },
} as const;

type SelectableCardSize = NonNullable<
  VariantProps<typeof selectableCardVariants>['size']
>;

interface SelectableCardBaseProps
  extends VariantProps<typeof selectableCardVariants> {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

interface SelectableCardRadioProps extends SelectableCardBaseProps {
  value: string;
  checked?: never;
  onCheckedChange?: never;
}

interface SelectableCardCheckboxProps extends SelectableCardBaseProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  value?: never;
}

type SelectableCardProps =
  | SelectableCardRadioProps
  | SelectableCardCheckboxProps;

function SelectableCard(props: SelectableCardProps) {
  const { size = 'default', className, disabled, children } = props;
  const resolvedSize: SelectableCardSize = size ?? 'default';
  const sizes = indicatorSizes[resolvedSize];

  if ('value' in props && props.value != null) {
    return (
      <RadioGroupPrimitive.Item
        data-slot="selectable-card"
        value={props.value}
        disabled={disabled}
        className={cn(selectableCardVariants({ size }), className)}
      >
        <div className="min-w-0 flex-1">{children}</div>
        <div
          className={cn(
            'relative shrink-0 rounded-full border-2 border-input transition-colors group-data-[state=checked]:border-primary',
            sizes.outer
          )}
        >
          <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
            <CircleIcon
              className={cn('fill-primary text-primary', sizes.inner)}
            />
          </RadioGroupPrimitive.Indicator>
        </div>
      </RadioGroupPrimitive.Item>
    );
  }

  const { checked, onCheckedChange } = props as SelectableCardCheckboxProps;

  return (
    <CheckboxPrimitive.Root
      data-slot="selectable-card"
      checked={checked}
      onCheckedChange={(state) => {
        if (typeof state === 'boolean') {
          onCheckedChange?.(state);
        }
      }}
      disabled={disabled}
      className={cn(selectableCardVariants({ size }), className)}
    >
      <div className="min-w-0 flex-1">{children}</div>
      <div
        className={cn(
          'relative shrink-0 rounded-[4px] border-2 border-input transition-colors group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary',
          sizes.outer
        )}
      >
        <CheckboxPrimitive.Indicator className="absolute inset-0 flex items-center justify-center text-primary-foreground">
          <CheckIcon className={sizes.check} />
        </CheckboxPrimitive.Indicator>
      </div>
    </CheckboxPrimitive.Root>
  );
}

export { SelectableCard, selectableCardVariants };
export type {
  SelectableCardProps,
  SelectableCardRadioProps,
  SelectableCardCheckboxProps,
};
