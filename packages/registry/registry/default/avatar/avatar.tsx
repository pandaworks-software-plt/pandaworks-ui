import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementRef,
  type ReactNode,
} from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn, getInitialName } from '@/lib';

type AvatarShape = 'circle' | 'square';
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const shapeClass = (shape?: AvatarShape) => (shape === 'square' ? 'rounded-md' : 'rounded-full');

// Size scale shared with AvatarGroup so a standalone Avatar and an Avatar inside
// an AvatarGroup render at identical dimensions for the same `size` prop.
const avatarSizeClass: Record<AvatarSize, string> = {
  xs: 'size-5 text-[10px]',
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-lg',
};

// Sizes where the blurred-backdrop layer is large enough to be readable.
// xs / sm skip it — the blur radius is barely visible at 20–28px and the
// extra image decode is wasted work in dense lists. `undefined` is the
// legacy h-10 w-10 default, which sits between md and lg.
const BACKDROP_SIZES = new Set<AvatarSize | undefined>(['md', 'lg', 'xl', undefined]);

const AvatarSizeContext = createContext<AvatarSize | undefined>(undefined);

type AvatarProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  shape?: AvatarShape;
  /**
   * Avatar dimensions. Aligns with the AvatarGroup size scale.
   * Omit to keep the historical default of h-10 w-10.
   */
  size?: AvatarSize;
  /**
   * Shorthand for `size="xs"` — designed for dense surfaces such as table rows
   * or inline list cells. Wins over `size` when both are set.
   */
  compact?: boolean;
};

const Avatar = forwardRef<ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, shape, size, compact, ...props }, ref) => {
    const resolvedSize: AvatarSize | undefined = compact ? 'xs' : size;
    return (
      <AvatarSizeContext.Provider value={resolvedSize}>
        <AvatarPrimitive.Root
          ref={ref}
          data-shape={shape ?? 'circle'}
          data-size={resolvedSize}
          className={cn(
            // bg-muted gives an opaque base so a transparent-PNG avatar never
            // bleeds the page through the avatar shape. Covered by the image
            // once loaded and by the (possibly colorized) Fallback before then.
            'relative flex shrink-0 overflow-hidden bg-muted',
            resolvedSize ? avatarSizeClass[resolvedSize] : 'h-10 w-10',
            shapeClass(shape),
            className
          )}
          {...props}
        />
      </AvatarSizeContext.Provider>
    );
  }
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, src, ...props }, ref) => {
  const size = useContext(AvatarSizeContext);
  const showBackdrop = BACKDROP_SIZES.has(size) && typeof src === 'string' && src.length > 0;

  return (
    <>
      {showBackdrop && (
        <AvatarPrimitive.Image
          aria-hidden
          src={src}
          // Self-blurred, desaturated copy of the image used as an ambient
          // backdrop. Scale-1.75 + blur-md spreads opaque pixels outward so
          // transparent-PNG avatars get a soft halo instead of page-bg bleed;
          // saturate-50 + opacity-60 keeps the foreground visually dominant.
          className="pointer-events-none absolute inset-0 h-full w-full scale-[1.75] object-cover opacity-60 blur-md saturate-50"
        />
      )}
      <AvatarPrimitive.Image
        ref={ref}
        src={src}
        className={cn('relative z-10 aspect-square h-full w-full', className)}
        {...props}
      />
    </>
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AVATAR_HUE_STEP = 360 / 26;

function getColorizeChar(children: ReactNode): string | null {
  if (typeof children === 'string' || typeof children === 'number') {
    const text = String(children).trim();
    return text.length > 0 ? text[0] : null;
  }
  if (Array.isArray(children)) {
    for (const child of children) {
      const found = getColorizeChar(child);
      if (found) return found;
    }
  }
  return null;
}

function getAvatarHue(char: string): number {
  const code = char.toUpperCase().charCodeAt(0);
  let index: number;
  if (code >= 65 && code <= 90) {
    index = code - 65;
  } else if (code >= 48 && code <= 57) {
    index = ((code - 48) * 31) % 26;
  } else {
    index = (((code * 7) % 26) + 26) % 26;
  }
  return index * AVATAR_HUE_STEP;
}

type AvatarFallbackProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
  colorize?: boolean;
};

const AvatarFallback = forwardRef<ElementRef<typeof AvatarPrimitive.Fallback>, AvatarFallbackProps>(
  ({ className, colorize = true, children, style, ...props }, ref) => {
    const displayChildren = typeof children === 'string' ? getInitialName(children) || children : children;

    let computedStyle: CSSProperties | undefined = style;
    if (colorize) {
      const char = getColorizeChar(displayChildren);
      if (char) {
        const hue = getAvatarHue(char);
        computedStyle = {
          backgroundColor: `oklch(0.62 0.14 ${hue})`,
          color: '#ffffff',
          ...style,
        };
      }
    }
    return (
      <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
          // Inherit the parent Avatar's rounded-* (full or md) so square avatars
          // don't show a round fallback while loading. The Root already paints
          // bg-muted underneath, but keep it here too so the Fallback covers
          // any backdrop-image layer that already rendered.
          'relative z-20 flex h-full w-full items-center justify-center rounded-[inherit] bg-muted',
          className
        )}
        style={computedStyle}
        {...props}
      >
        {displayChildren}
      </AvatarPrimitive.Fallback>
    );
  }
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback, avatarSizeClass };
export type { AvatarShape, AvatarSize };
