import { DemoSection } from '@/showcase/component-page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarGroup } from '@/components/ui/avatar-group';

const TEAM = [
  { id: '1', initials: 'AR' },
  { id: '2', initials: 'BK' },
  { id: '3', initials: 'CL' },
  { id: '4', initials: 'DM' },
  { id: '5', initials: 'EN' },
  { id: '6', initials: 'FT' },
  { id: '7', initials: 'GH' },
];

const PHOTO_TEAM = [
  { id: '1', src: 'https://i.pravatar.cc/96?img=12', fallback: 'AR' },
  { id: '2', src: 'https://i.pravatar.cc/96?img=32', fallback: 'BK' },
  { id: '3', src: 'https://i.pravatar.cc/96?img=47', fallback: 'CL' },
  { id: '4', src: 'https://i.pravatar.cc/96?img=68', fallback: 'DM' },
  { id: '5', src: 'https://i.pravatar.cc/96?img=24', fallback: 'EN' },
];

export default function AvatarGroupDemo() {
  return (
    <>
      <DemoSection
        title="With overflow"
        code={`<AvatarGroup max={3} size="md">
  {team.map(m => (
    <Avatar key={m.id}>
      <AvatarFallback colorize>{m.initials}</AvatarFallback>
    </Avatar>
  ))}
</AvatarGroup>`}
      >
        <AvatarGroup max={3} size="md">
          {TEAM.map((m) => (
            <Avatar key={m.id}>
              <AvatarFallback colorize>{m.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </DemoSection>

      <DemoSection title="Without max (show all)">
        <AvatarGroup size="md">
          {TEAM.slice(0, 4).map((m) => (
            <Avatar key={m.id}>
              <AvatarFallback colorize>{m.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </DemoSection>

      <DemoSection title="Sizes">
        <div className="flex flex-col gap-4">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <div key={size} className="flex items-center gap-3">
              <span className="w-12 text-xs font-medium text-muted-foreground">{size}</span>
              <AvatarGroup size={size} max={4}>
                {TEAM.map((m) => (
                  <Avatar key={m.id}>
                    <AvatarFallback colorize>{m.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="With photos — stacked separation"
        code={`<AvatarGroup max={4} size="md">
  {team.map(m => (
    <Avatar key={m.id}>
      <AvatarImage src={m.src} alt={m.fallback} />
      <AvatarFallback>{m.fallback}</AvatarFallback>
    </Avatar>
  ))}
</AvatarGroup>`}
      >
        <p className="text-sm text-muted-foreground">
          Each stacked avatar gets a 2px page-background ring plus a 1px hairline border. The ring punches each circle
          out of its neighbour; the hairline keeps the edge readable when the photo content is close in tone to the page
          background (e.g. dark transparent PNGs on a dark surface).
        </p>
        <AvatarGroup max={4} size="md">
          {PHOTO_TEAM.map((m) => (
            <Avatar key={m.id}>
              <AvatarImage src={m.src} alt={m.fallback} />
              <AvatarFallback>{m.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </DemoSection>

      <DemoSection
        title="Square shape"
        code={`<AvatarGroup max={3} size="md" shape="square">
  …
</AvatarGroup>`}
      >
        <AvatarGroup max={3} size="md" shape="square">
          {TEAM.map((m) => (
            <Avatar key={m.id}>
              <AvatarFallback colorize>{m.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </DemoSection>
    </>
  );
}
