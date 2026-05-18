import { DemoSection } from '@/showcase/component-page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Small SVG-as-data-URL with a transparent background, used to show how
// transparent-PNG avatars now render against the bg-muted base instead of
// bleeding the page background through the circle.
const TRANSPARENT_CHARACTER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <circle cx="40" cy="30" r="14" fill="#3b82f6"/>
    <path d="M40 48c-12 0-22 8-22 18v14h44V66c0-10-10-18-22-18z" fill="#3b82f6"/>
  </svg>`
)}`;

const PHOTO_URLS = [
  'https://i.pravatar.cc/128?img=12',
  'https://i.pravatar.cc/128?img=32',
  'https://i.pravatar.cc/128?img=47',
];

export default function AvatarDemo() {
  return (
    <>
      <DemoSection
        title="Default"
        code={`import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="/avatar.png" alt="John Doe" />
  <AvatarFallback>John Doe</AvatarFallback>
</Avatar>`}
      >
        <p className="text-sm text-muted-foreground">
          Pass a full name as the fallback's children — it auto-converts to 2-character initials and a deterministic
          background color is applied. Already-short strings (e.g. <code className="font-mono text-xs">JD</code>) pass
          through unchanged.
        </p>
        <div className="flex items-center gap-4 pt-3">
          <Avatar>
            <AvatarFallback>John Doe</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-sm text-muted-foreground">Software Engineer</p>
          </div>
        </div>
      </DemoSection>

      <DemoSection
        title="Sizes"
        code={`<Avatar size="xs"><AvatarFallback>XS</AvatarFallback></Avatar>
<Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
<Avatar size="md"><AvatarFallback>MD</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
<Avatar size="xl"><AvatarFallback>XL</AvatarFallback></Avatar>`}
      >
        <p className="text-sm text-muted-foreground">
          Pass <code className="font-mono text-xs">size</code> for any preset on the shared{' '}
          <code className="font-mono text-xs">AvatarSize</code> scale. The scale is shared with{' '}
          <code className="font-mono text-xs">AvatarGroup</code> so a standalone avatar and a grouped one render at
          identical pixel sizes for the same token.
        </p>
        <div className="flex items-end gap-4 pt-3">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Avatar size={size}>
                <AvatarFallback>{size.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{size}</span>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="Compact"
        code={`<Avatar compact>
  <AvatarFallback>Alice Reyes</AvatarFallback>
</Avatar>`}
      >
        <p className="text-sm text-muted-foreground">
          Pass <code className="font-mono text-xs">compact</code> to drop to a 5x5 / 10px-text footprint without
          juggling Tailwind size classes. Designed for inline placement in dense table rows where a default 10x10 avatar
          would force the row height to grow.
        </p>
        <div className="flex items-center gap-3 pt-3">
          <Avatar compact>
            <AvatarFallback>Alice Reyes</AvatarFallback>
          </Avatar>
          <Avatar compact>
            <AvatarFallback>Bob Kim</AvatarFallback>
          </Avatar>
          <Avatar compact>
            <AvatarFallback colorize={false}>?</AvatarFallback>
          </Avatar>
        </div>
      </DemoSection>

      <DemoSection title="Group">
        <div className="flex -space-x-3">
          <Avatar className="border-2 border-background">
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>BK</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>CL</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback>DM</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background">
            <AvatarFallback colorize={false} className="text-xs">
              +3
            </AvatarFallback>
          </Avatar>
        </div>
      </DemoSection>

      <DemoSection
        title="From full name"
        code={`<Avatar>
  <AvatarFallback>Alice Reyes</AvatarFallback>
</Avatar>`}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The fallback runs string children through <code className="font-mono text-xs">getInitialName</code> (from{' '}
            <code className="font-mono text-xs">@/lib</code>), so each name renders as a 2-character monogram — "Alice
            Reyes" → "AR", "Devi Marasinghe" → "DM", "Eli" → "EL".
          </p>
          {[
            { name: 'Alice Reyes', role: 'HR Manager' },
            { name: 'Bob Kim', role: 'Team Lead' },
            { name: 'Clara Lee', role: 'Designer' },
            { name: 'Devi Marasinghe', role: 'Recruiter' },
          ].map((person) => (
            <div key={person.name} className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{person.name}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{person.name}</p>
                <p className="text-sm text-muted-foreground">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="Square shape"
        code={`<Avatar shape="square">
  <AvatarFallback colorize>PW</AvatarFallback>
</Avatar>`}
      >
        <p className="text-sm text-muted-foreground">
          Pass <code className="font-mono text-xs">shape="square"</code> to switch from the default circle to a
          rounded-square tile. Useful for project keys, app icons, and other "thing" identities (vs people).
        </p>
        <div className="flex items-center gap-4 pt-3">
          <Avatar shape="square">
            <AvatarFallback colorize>PW</AvatarFallback>
          </Avatar>
          <Avatar shape="square">
            <AvatarFallback colorize>AT</AvatarFallback>
          </Avatar>
          <Avatar shape="square">
            <AvatarFallback colorize>NV</AvatarFallback>
          </Avatar>
          <Avatar shape="square" className="size-12">
            <AvatarFallback colorize>LU</AvatarFallback>
          </Avatar>
        </div>
      </DemoSection>

      <DemoSection
        title="Color palette (default)"
        code={`<Avatar>
  <AvatarFallback>A</AvatarFallback>
</Avatar>`}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Each fallback derives its background from the first character — A–Z map to 26 evenly spaced OKLCH hues,
            digits and other characters fall back to a deterministic hash. This is on by default; pass{' '}
            <code className="font-mono text-xs">colorize={'{false}'}</code> to opt out.
          </p>
          <div className="flex flex-wrap gap-2">
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
              <Avatar key={letter}>
                <AvatarFallback>{letter}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </DemoSection>

      <DemoSection
        title="With image — blurred backdrop"
        code={`<Avatar size="lg">
  <AvatarImage src="/avatar.png" alt="Alice Reyes" />
  <AvatarFallback>Alice Reyes</AvatarFallback>
</Avatar>`}
      >
        <p className="text-sm text-muted-foreground">
          When an <code className="font-mono text-xs">AvatarImage</code> is rendered at{' '}
          <code className="font-mono text-xs">md</code> or larger, the same image is also drawn behind the foreground as
          a scaled-up, desaturated, blurred backdrop. Opaque photos get a soft ambient color halo. Transparent PNGs (see
          the second row) get a soft character halo on top of the new{' '}
          <code className="font-mono text-xs">bg-muted</code> base so they never bleed the page background.{' '}
          <code className="font-mono text-xs">xs</code> and <code className="font-mono text-xs">sm</code> avatars skip
          the backdrop layer — the blur is invisible at that scale and the extra image decode is wasted work.
        </p>
        <div className="flex flex-col gap-6 pt-3">
          <div className="flex items-end gap-4">
            {(['sm', 'md', 'lg', 'xl'] as const).map((size, idx) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Avatar size={size}>
                  <AvatarImage src={PHOTO_URLS[idx % PHOTO_URLS.length]} alt="" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{size}</span>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-4">
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Avatar size={size}>
                  <AvatarImage src={TRANSPARENT_CHARACTER} alt="" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{size} · transparent PNG</span>
              </div>
            ))}
          </div>
        </div>
      </DemoSection>

      <DemoSection
        title="Plain (opt out of color)"
        code={`<Avatar>
  <AvatarFallback colorize={false}>JD</AvatarFallback>
</Avatar>`}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            For neutral monograms (e.g. system tiles, placeholders), set{' '}
            <code className="font-mono text-xs">colorize={'{false}'}</code> to drop back to the muted background.
          </p>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback colorize={false}>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback colorize={false}>+3</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback colorize={false}>?</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </DemoSection>
    </>
  );
}
