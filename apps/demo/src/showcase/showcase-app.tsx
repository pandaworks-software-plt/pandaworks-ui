import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ShowcaseSidebar, type SidebarCategory } from './showcase-sidebar';
import { ComponentPage } from './component-page';
import { AiIntegrationView } from './ai-integration-view';

const AI_INTEGRATION_KEY = 'ai-integration';

import ButtonDemo from './demos/button-demo';
import InputDemo from './demos/input-demo';
import NumberInputDemo from './demos/number-input-demo';
import PasswordInputDemo from './demos/password-input-demo';
import LabelDemo from './demos/label-demo';
import CheckboxDemo from './demos/checkbox-demo';
import TextareaDemo from './demos/textarea-demo';
import FormDemo from './demos/form-demo';
import RadioGroupDemo from './demos/radio-group-demo';
import SwitchDemo from './demos/switch-demo';
import SelectDemo from './demos/select-demo';
import SelectPickerDemo from './demos/select-picker-demo';
import UserPickerDemo from './demos/user-picker-demo';
import DatePickerDemo from './demos/date-picker-demo';
import DateRangePickerDemo from './demos/date-range-picker-demo';
import SliderDemo from './demos/slider-demo';
import TableDemo from './demos/table-demo';
import CardDemo from './demos/card-demo';
import BadgeDemo from './demos/badge-demo';
import AvatarDemo from './demos/avatar-demo';
import CalendarDemo from './demos/calendar-demo';
import SkeletonDemo from './demos/skeleton-demo';
import ProgressDemo from './demos/progress-demo';
import AlertDemo from './demos/alert-demo';
import ModalDemo from './demos/modal-demo';
import AlertDialogDemo from './demos/alert-dialog-demo';
import SheetDemo from './demos/sheet-demo';
import TooltipDemo from './demos/tooltip-demo';
import PopoverDemo from './demos/popover-demo';
import DropdownMenuDemo from './demos/dropdown-menu-demo';
import CommandDemo from './demos/command-demo';
import CollapsibleDemo from './demos/collapsible-demo';
import AccordionDemo from './demos/accordion-demo';
import SeparatorDemo from './demos/separator-demo';
import TabsDemo from './demos/tabs-demo';
import BreadcrumbDemo from './demos/breadcrumb-demo';
import ScrollAreaDemo from './demos/scroll-area-demo';
import ToggleDemo from './demos/toggle-demo';
import ToggleGroupDemo from './demos/toggle-group-demo';
import SonnerDemo from './demos/sonner-demo';
import PaginationDemo from './demos/pagination-demo';
import AppShellDemo from './demos/app-shell-demo';
import PageHeaderDemo from './demos/page-header-demo';
import DetailPageDemo from './demos/detail-page-demo';
import FilterBarDemo from './demos/filter-bar-demo';
import SplitButtonDemo from './demos/split-button-demo';
import PatternBackgroundDemo from './demos/pattern-background-demo';
import AttachmentInputDemo from './demos/attachment-input-demo';
import SelectableCardDemo from './demos/selectable-card-demo';
import CodeLabelDemo from './demos/code-label-demo';
import LoadingPageDemo from './demos/loading-page-demo';
import AnimatedNumberDemo from './demos/animated-number-demo';
import StepperDemo from './demos/stepper-demo';
import ConnectionBannerDemo from './demos/connection-banner-demo';
import ErrorFallbackDemo from './demos/error-fallback-demo';
import ExpandableTextDemo from './demos/expandable-text-demo';
import TruncatedLabelDemo from './demos/truncated-label-demo';
import ActionButtonDemo from './demos/action-button-demo';
import SearchInputDemo from './demos/search-input-demo';
import AvatarGroupDemo from './demos/avatar-group-demo';
import EmptyStateDemo from './demos/empty-state-demo';
import StatCardDemo from './demos/stat-card-demo';
import MultiStatCardDemo from './demos/multi-stat-card-demo';
import ProgressStatCardDemo from './demos/progress-stat-card-demo';
import MeterRowDemo from './demos/meter-row-demo';
import ListRowDemo from './demos/list-row-demo';
import TimelineDemo from './demos/timeline-demo';
import IconBadgeDemo from './demos/icon-badge-demo';
import CardGroupDemo from './demos/card-group-demo';
import InlineEditableFieldDemo from './demos/inline-editable-field-demo';
import MetaEditPillDemo from './demos/meta-edit-pill-demo';
import ColorsDemo from './demos/colors-demo';
import TypographyDemo from './demos/typography-demo';
import TonesDemo from './demos/tones-demo';

interface ComponentMeta {
  name: string;
  title: string;
  description: string;
  demo: React.ComponentType;
}

const COMPONENTS: ComponentMeta[] = [
  {
    name: 'colors',
    title: 'Colors',
    description:
      'Stone neutrals, panda-blue brand accent, semantic chroma (success/info/warning/danger), WCAG AA pairings, and the adaptive shadcn-style theme tokens.',
    demo: ColorsDemo,
  },
  {
    name: 'typography',
    title: 'Typography',
    description:
      'Inter (sans), Comfortaa (display), JetBrains Mono (mono), the body / display / mono size scales, and the strict heading-font policy.',
    demo: TypographyDemo,
  },
  {
    name: 'tones',
    title: 'Tones',
    description:
      'Shared semantic vocabulary used across Badge, MeterRow, ProgressStatCard, and StatCard delta — pick the tone by what the value means, not by what color you want.',
    demo: TonesDemo,
  },
  {
    name: 'app-shell',
    title: 'App Shell',
    description: 'A data-driven layout component with collapsible sidebar, header bar, and user menu.',
    demo: AppShellDemo,
  },
  {
    name: 'page-header',
    title: 'Page Header',
    description: 'A page header with title, description, and action buttons slot for consistent page layouts.',
    demo: PageHeaderDemo,
  },
  {
    name: 'detail-page',
    title: 'Detail Page',
    description:
      'A compound layout for resource detail pages with header, 2-column grid, metadata sidebar, and copyable meta items.',
    demo: DetailPageDemo,
  },
  {
    name: 'button',
    title: 'Button',
    description:
      'A unified button with multiple variants, sizes, action presets, icon prop, tooltip, and loading state.',
    demo: ButtonDemo,
  },
  {
    name: 'input',
    title: 'Input',
    description: 'A styled text input field for forms.',
    demo: InputDemo,
  },
  {
    name: 'number-input',
    title: 'Number Input',
    description:
      'A controlled numeric input with min/max clamping, step-aware decimal precision, suffix, error state, and arrow-key stepping. Ignores wheel scrolling so values don’t change accidentally on focused fields.',
    demo: NumberInputDemo,
  },
  {
    name: 'password-input',
    title: 'Password Input',
    description:
      'A password field with a built-in show/hide toggle. Forwards refs and accepts every standard input prop; the toggle button is fully keyboard-accessible and is disabled in lockstep with the input.',
    demo: PasswordInputDemo,
  },
  {
    name: 'search-input',
    title: 'Search Input',
    description: 'A search input with icon, optional clear button, and built-in debounce for filtering lists.',
    demo: SearchInputDemo,
  },
  {
    name: 'label',
    title: 'Label',
    description: 'An accessible label for form controls.',
    demo: LabelDemo,
  },
  {
    name: 'checkbox',
    title: 'Checkbox',
    description: 'A checkbox input with checked, unchecked, and indeterminate states.',
    demo: CheckboxDemo,
  },
  {
    name: 'textarea',
    title: 'Textarea',
    description: 'A multi-line text input field for forms.',
    demo: TextareaDemo,
  },
  {
    name: 'form',
    title: 'Form',
    description: 'Form components with field context, validation, and accessible labels built on react-hook-form.',
    demo: FormDemo,
  },
  {
    name: 'radio-group',
    title: 'Radio Group',
    description: 'A set of mutually exclusive radio options.',
    demo: RadioGroupDemo,
  },
  {
    name: 'switch',
    title: 'Switch',
    description: 'A toggle switch for boolean on/off states.',
    demo: SwitchDemo,
  },
  {
    name: 'select',
    title: 'Select',
    description: 'A dropdown select input built on Radix UI.',
    demo: SelectDemo,
  },
  {
    name: 'select-picker',
    title: 'Select Picker',
    description:
      'A searchable select picker supporting single and multiple selection with type-safe discriminated union props.',
    demo: SelectPickerDemo,
  },
  {
    name: 'user-picker',
    title: 'User Picker',
    description: 'An avatar-trigger picker for assigning one user or many with searchable Command dropdown behavior.',
    demo: UserPickerDemo,
  },
  {
    name: 'date-picker',
    title: 'Date Picker',
    description: 'A single date picker with calendar popover.',
    demo: DatePickerDemo,
  },
  {
    name: 'date-range-picker',
    title: 'Date Range Picker',
    description: 'A dual date picker with quick-select panels for selecting date ranges.',
    demo: DateRangePickerDemo,
  },
  {
    name: 'slider',
    title: 'Slider',
    description: 'A range slider input with single and dual thumb support.',
    demo: SliderDemo,
  },
  {
    name: 'table',
    title: 'Table',
    description: 'A table component with header, body, row, and cell sub-components.',
    demo: TableDemo,
  },
  {
    name: 'card',
    title: 'Card',
    description: 'A card container component with header, content, and footer sections.',
    demo: CardDemo,
  },
  {
    name: 'badge',
    title: 'Badge',
    description: 'A small status indicator with multiple variants.',
    demo: BadgeDemo,
  },
  {
    name: 'avatar',
    title: 'Avatar',
    description: 'An image element with a fallback for representing a user.',
    demo: AvatarDemo,
  },
  {
    name: 'calendar',
    title: 'Calendar',
    description: 'A date calendar component with single, multiple, and range selection modes.',
    demo: CalendarDemo,
  },
  {
    name: 'skeleton',
    title: 'Skeleton',
    description: 'An animated placeholder for loading content.',
    demo: SkeletonDemo,
  },
  {
    name: 'progress',
    title: 'Progress',
    description: 'A progress bar indicating completion status.',
    demo: ProgressDemo,
  },
  {
    name: 'alert',
    title: 'Alert',
    description: 'A callout for displaying important messages with default, destructive, and info variants.',
    demo: AlertDemo,
  },
  {
    name: 'modal',
    title: 'Modal',
    description: 'An opinionated modal with sticky header, scrollable body, and sticky footer built on Dialog.',
    demo: ModalDemo,
  },
  {
    name: 'alert-dialog',
    title: 'Alert Dialog',
    description: 'A modal dialog for confirmations requiring user acknowledgement.',
    demo: AlertDialogDemo,
  },
  {
    name: 'sheet',
    title: 'Sheet',
    description: 'A slide-out panel overlay component.',
    demo: SheetDemo,
  },
  {
    name: 'tooltip',
    title: 'Tooltip',
    description: 'A popup that displays information related to an element on hover or focus.',
    demo: TooltipDemo,
  },
  {
    name: 'popover',
    title: 'Popover',
    description: 'A floating content popover triggered by a button or element.',
    demo: PopoverDemo,
  },
  {
    name: 'dropdown-menu',
    title: 'Dropdown Menu',
    description: 'A menu of actions or options triggered by a button.',
    demo: DropdownMenuDemo,
  },
  {
    name: 'command',
    title: 'Command',
    description: 'A command menu component built on cmdk for searchable lists and command palettes.',
    demo: CommandDemo,
  },
  {
    name: 'collapsible',
    title: 'Collapsible',
    description: 'A component that expands and collapses content.',
    demo: CollapsibleDemo,
  },
  {
    name: 'accordion',
    title: 'Accordion',
    description: 'A vertically stacked set of expandable content sections.',
    demo: AccordionDemo,
  },
  {
    name: 'separator',
    title: 'Separator',
    description: 'A visual divider between content sections.',
    demo: SeparatorDemo,
  },
  {
    name: 'tabs',
    title: 'Tabs',
    description:
      'A tabbed interface component with default and line variants, supporting horizontal and vertical orientations.',
    demo: TabsDemo,
  },
  {
    name: 'breadcrumb',
    title: 'Breadcrumb',
    description: 'A navigation breadcrumb trail with links, separator, and ellipsis support.',
    demo: BreadcrumbDemo,
  },
  {
    name: 'scroll-area',
    title: 'Scroll Area',
    description: 'A custom scrollable area with styled scrollbars.',
    demo: ScrollAreaDemo,
  },
  {
    name: 'toggle',
    title: 'Toggle',
    description: 'A two-state button that can be toggled on or off.',
    demo: ToggleDemo,
  },
  {
    name: 'toggle-group',
    title: 'Toggle Group',
    description: 'A group of toggle buttons supporting single or multiple selection.',
    demo: ToggleGroupDemo,
  },
  {
    name: 'sonner',
    title: 'Sonner',
    description: 'A toast notification component powered by sonner with theme-aware styling.',
    demo: SonnerDemo,
  },
  {
    name: 'pagination',
    title: 'Pagination',
    description: 'A page navigation component with previous, next, page links, and ellipsis.',
    demo: PaginationDemo,
  },
  {
    name: 'attachment-input',
    title: 'Attachment Input',
    description:
      'A file attachment input with dropzone and compact variants, supporting single and multiple file modes with validation.',
    demo: AttachmentInputDemo,
  },
  {
    name: 'selectable-card',
    title: 'Selectable Card',
    description: 'A composable card component for single (radio) or multi (checkbox) selection with size variants.',
    demo: SelectableCardDemo,
  },
  {
    name: 'filter-bar',
    title: 'Filter Bar',
    description:
      'Two composable filter components: a compact FilterButton trigger and ActiveFilters chips display with operators, supporting option lists, dates, and text search.',
    demo: FilterBarDemo,
  },
  {
    name: 'split-button',
    title: 'Split Button',
    description: 'A compound split button with a primary action and a dropdown chevron for secondary actions.',
    demo: SplitButtonDemo,
  },
  {
    name: 'pattern-background',
    title: 'Pattern Background',
    description:
      'CSS utility classes that add subtle visual patterns like dots, grids, noise, and aurora blobs to any container.',
    demo: PatternBackgroundDemo,
  },
  {
    name: 'code-label',
    title: 'Code Label',
    description:
      'An inline monospace label with a copy-to-clipboard button for displaying IDs, commands, and code snippets.',
    demo: CodeLabelDemo,
  },
  {
    name: 'loading-page',
    title: 'Loading Page',
    description: 'A full-screen loading state with optional logo, animated dots, and customizable message.',
    demo: LoadingPageDemo,
  },
  {
    name: 'animated-number',
    title: 'Animated Number',
    description:
      'A number display that animates smoothly between values using requestAnimationFrame with easeOutQuad easing.',
    demo: AnimatedNumberDemo,
  },
  {
    name: 'stepper',
    title: 'Stepper',
    description: 'A horizontal multi-step progress indicator with completed, current, and pending states.',
    demo: StepperDemo,
  },
  {
    name: 'connection-banner',
    title: 'Connection Banner',
    description: 'A fixed top banner that shows when the app loses connectivity, with a retry button.',
    demo: ConnectionBannerDemo,
  },
  {
    name: 'error-fallback',
    title: 'Error Fallback',
    description:
      'An error boundary fallback with root (full-screen + reload) and route (inline + custom action) variants.',
    demo: ErrorFallbackDemo,
  },
  {
    name: 'expandable-text',
    title: 'Expandable Text',
    description:
      'A text component that collapses long content with configurable visible lines, using pre for newline support.',
    demo: ExpandableTextDemo,
  },
  {
    name: 'truncated-label',
    title: 'Truncated Label',
    description:
      'A single- or multi-line label that truncates with ellipsis when it overflows and shows the full text in a tooltip on hover/focus. Tooltip only appears when truncation is actually happening.',
    demo: TruncatedLabelDemo,
  },
  {
    name: 'action-button',
    title: 'Action Button',
    description:
      'Button action presets with standardized icons, auto-labels, tooltips on icon-only sizes, and loading states.',
    demo: ActionButtonDemo,
  },
  {
    name: 'avatar-group',
    title: 'Avatar Group',
    description:
      "A horizontal stack of overlapping Avatars with configurable max count and a +N overflow tile. Inherits the Avatar's circle/square shape.",
    demo: AvatarGroupDemo,
  },
  {
    name: 'empty-state',
    title: 'Empty State',
    description:
      'Centered empty-state block with icon, title, optional description, and action slot. Three sizes (sm, md, lg).',
    demo: EmptyStateDemo,
  },
  {
    name: 'stat-card',
    title: 'Stat Card',
    description:
      'Dashboard stat tile composed from Card, AnimatedNumber, and Badge. Optional icon, suffix, hint, and a trend chip with up/down/flat tones.',
    demo: StatCardDemo,
  },
  {
    name: 'multi-stat-card',
    title: 'Multi Stat Card',
    description:
      'Two or more related stat metrics rendered inside a single card with dividers between cells. Each cell mirrors StatCard (icon + label, headline value, optional hint and delta chip). Horizontal or vertical orientation.',
    demo: MultiStatCardDemo,
  },
  {
    name: 'progress-stat-card',
    title: 'Progress Stat Card',
    description:
      'Card combining a titled headline, a Progress bar, and a row of tone-aware stat cells. Use for cycle / pipeline / completion summaries where one progress metric and its breakdown belong on the same card.',
    demo: ProgressStatCardDemo,
  },
  {
    name: 'meter-row',
    title: 'Meter Row',
    description:
      'Labeled horizontal bar with optional trailing value and per-row tone. Use for status, priority, and allocation charts.',
    demo: MeterRowDemo,
  },
  {
    name: 'list-row',
    title: 'List Row',
    description:
      'Avatar/icon + title + subtitle + trailing-meta layout primitive. Renders as a div by default; pass asButton for keyboard-accessible clickable rows.',
    demo: ListRowDemo,
  },
  {
    name: 'timeline',
    title: 'Timeline',
    description:
      'Vertical event feed with tone-coded dots and optional connector line. Each item supports title, subtitle, trailing meta, and optional icon override. Use for activity streams, audit logs, and changelog-style histories.',
    demo: TimelineDemo,
  },
  {
    name: 'icon-badge',
    title: 'Icon Badge',
    description:
      'Decorative tone-tinted icon container (rounded / circle / square × sm / md / lg). Use for centered hero icons on auth pages, setup wizards, status panels, empty states. Not a button — use Button for clickable controls.',
    demo: IconBadgeDemo,
  },
  {
    name: 'card-group',
    title: 'Card Group',
    description:
      'Responsive grid container for groups of related cards with consistent gutters. Auto-collapses to single-column on mobile, two columns on md, configurable up to four. Optional shared title + trailing action.',
    demo: CardGroupDemo,
  },
  {
    name: 'inline-editable-field',
    title: 'Inline Editable Field',
    description:
      'Display ↔ inline edit toggle with built-in Save / Cancel buttons. The editor is a render prop receiving programmatic save/cancel + isSaving so editors can wire Enter/Escape and disable while saving.',
    demo: InlineEditableFieldDemo,
  },
  {
    name: 'meta-edit-pill',
    title: 'Meta Edit Pill',
    description:
      'Click-to-edit inline value pill that pairs a static label with a DropdownMenu-driven value. Single-select mode (Priority / Severity / Module) with optional Clear, and multi-select mode (Platforms / Tags) backed by checkbox items. Compose several together for detail-page meta strips.',
    demo: MetaEditPillDemo,
  },
];

const CATEGORIES: SidebarCategory[] = [
  {
    label: 'Foundations',
    items: COMPONENTS.filter((c) => ['colors', 'typography', 'tones'].includes(c.name)).sort((a, b) =>
      a.title.localeCompare(b.title)
    ),
  },
  {
    label: 'Layout',
    items: COMPONENTS.filter((c) =>
      ['app-shell', 'card-group', 'detail-page', 'page-header', 'empty-state'].includes(c.name)
    ).sort((a, b) => a.title.localeCompare(b.title)),
  },
  {
    label: 'Forms',
    items: COMPONENTS.filter((c) =>
      [
        'action-button',
        'attachment-input',
        'button',
        'checkbox',
        'date-picker',
        'date-range-picker',
        'filter-bar',
        'form',
        'inline-editable-field',
        'meta-edit-pill',
        'input',
        'number-input',
        'password-input',
        'search-input',
        'label',
        'radio-group',
        'select',
        'selectable-card',
        'select-picker',
        'user-picker',
        'slider',
        'split-button',
        'switch',
        'textarea',
      ].includes(c.name)
    ).sort((a, b) => a.title.localeCompare(b.title)),
  },
  {
    label: 'Data Display',
    items: COMPONENTS.filter((c) =>
      [
        'animated-number',
        'avatar',
        'avatar-group',
        'badge',
        'calendar',
        'card',
        'code-label',
        'expandable-text',
        'icon-badge',
        'list-row',
        'meter-row',
        'multi-stat-card',
        'progress',
        'progress-stat-card',
        'skeleton',
        'stat-card',
        'table',
        'timeline',
        'truncated-label',
      ].includes(c.name)
    ).sort((a, b) => a.title.localeCompare(b.title)),
  },
  {
    label: 'Feedback',
    items: COMPONENTS.filter((c) =>
      ['alert', 'alert-dialog', 'connection-banner', 'error-fallback', 'loading-page', 'sonner'].includes(c.name)
    ).sort((a, b) => a.title.localeCompare(b.title)),
  },
  {
    label: 'Overlay',
    items: COMPONENTS.filter((c) => ['dropdown-menu', 'modal', 'popover', 'sheet', 'tooltip'].includes(c.name)).sort(
      (a, b) => a.title.localeCompare(b.title)
    ),
  },
  {
    label: 'Navigation',
    items: COMPONENTS.filter((c) =>
      [
        'accordion',
        'breadcrumb',
        'collapsible',
        'command',
        'pagination',
        'scroll-area',
        'separator',
        'stepper',
        'tabs',
      ].includes(c.name)
    ).sort((a, b) => a.title.localeCompare(b.title)),
  },
  {
    label: 'Toggle',
    items: COMPONENTS.filter((c) => ['toggle', 'toggle-group'].includes(c.name)).sort((a, b) =>
      a.title.localeCompare(b.title)
    ),
  },
  {
    label: 'Utilities',
    items: COMPONENTS.filter((c) => ['pattern-background'].includes(c.name)).sort((a, b) =>
      a.title.localeCompare(b.title)
    ),
  },
];

function getHashComponent() {
  const hash = window.location.hash.replace('#/', '');
  if (hash === AI_INTEGRATION_KEY) return AI_INTEGRATION_KEY;
  const allNames = COMPONENTS.map((c) => c.name);
  return allNames.includes(hash) ? hash : 'button';
}

export default function ShowcaseApp() {
  const [active, setActive] = useState(getHashComponent);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    const onHashChange = () => setActive(getHashComponent());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSelect = useCallback((name: string) => {
    window.location.hash = `#/${name}`;
  }, []);

  const component = COMPONENTS.find((c) => c.name === active);

  const query = search.trim().toLowerCase();
  const matches = query
    ? COMPONENTS.filter((c) => c.title.toLowerCase().includes(query) || c.name.toLowerCase().includes(query)).slice(
        0,
        8
      )
    : [];

  const pickMatch = (name: string) => {
    handleSelect(name);
    setSearch('');
    setSearchOpen(false);
    setHighlight(0);
  };

  const showDropdown = searchOpen && matches.length > 0;

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background text-foreground">
        <ShowcaseSidebar categories={CATEGORIES} active={active} onSelect={handleSelect} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-12 shrink-0 items-center border-b bg-background px-4">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                  setHighlight(0);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchOpen(false);
                    e.currentTarget.blur();
                  } else if (e.key === 'ArrowDown' && matches.length > 0) {
                    e.preventDefault();
                    setHighlight((h) => (h + 1) % matches.length);
                  } else if (e.key === 'ArrowUp' && matches.length > 0) {
                    e.preventDefault();
                    setHighlight((h) => (h - 1 + matches.length) % matches.length);
                  } else if (e.key === 'Enter' && matches.length > 0) {
                    e.preventDefault();
                    pickMatch(matches[highlight]?.name ?? matches[0].name);
                  }
                }}
                placeholder="Search components..."
                className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {showDropdown && (
                <ul
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-md border bg-popover py-1 shadow-md"
                >
                  {matches.map((m, i) => (
                    <li key={m.name}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={i === highlight}
                        onMouseEnter={() => setHighlight(i)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          pickMatch(m.name);
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left text-sm transition-colors ${
                          i === highlight ? 'bg-accent text-foreground' : 'text-foreground hover:bg-accent'
                        }`}
                      >
                        <span className="truncate">{m.title}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{m.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            {active === AI_INTEGRATION_KEY ? (
              <div className="mx-auto max-w-4xl px-8 py-8">
                <AiIntegrationView />
              </div>
            ) : component ? (
              <div className="mx-auto max-w-4xl px-8 py-8">
                <ComponentPage title={component.title} description={component.description}>
                  <component.demo />
                </ComponentPage>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
