// Barrel entry for @pandaworks-sw/lucid-ui.
// Re-exports every component (and supporting hooks/utils) from the registry sources.
// Generated to mirror packages/registry/registry/default/*; keep in sync when adding components.

export * from '../registry/default/accordion';
export * from '../registry/default/alert';
export * from '../registry/default/alert-dialog';
export * from '../registry/default/animated-number';
export * from '../registry/default/app-shell';
export * from '../registry/default/attachment-input';
export * from '../registry/default/avatar';
export * from '../registry/default/avatar-group';
export * from '../registry/default/badge';
export * from '../registry/default/breadcrumb';
export * from '../registry/default/button';
export * from '../registry/default/calendar';
export * from '../registry/default/card';
export * from '../registry/default/card-group';
export * from '../registry/default/checkbox';
export * from '../registry/default/code-label';
export * from '../registry/default/collapsible';
export * from '../registry/default/command';
export * from '../registry/default/connection-banner';
export * from '../registry/default/date-picker';
export * from '../registry/default/date-range-picker';
export * from '../registry/default/detail-page';
export * from '../registry/default/dropdown-menu';
export * from '../registry/default/empty-state';
export * from '../registry/default/error-fallback';
export * from '../registry/default/expandable-text';
export * from '../registry/default/filter-bar';
export * from '../registry/default/form';
export * from '../registry/default/icon-badge';
export * from '../registry/default/inbox-menu';
export * from '../registry/default/inline-editable-field';
export * from '../registry/default/input';
export * from '../registry/default/label';
export * from '../registry/default/list-row';
export * from '../registry/default/loading-page';
export * from '../registry/default/meta-edit-pill';
export * from '../registry/default/meter-row';
export * from '../registry/default/modal';
export * from '../registry/default/multi-stat-card';
export * from '../registry/default/number-input';
export * from '../registry/default/page-header';
export * from '../registry/default/pagination';
export * from '../registry/default/password-input';
export * from '../registry/default/popover';
export * from '../registry/default/progress';
export * from '../registry/default/progress-stat-card';
export * from '../registry/default/radio-group';
export * from '../registry/default/scroll-area';
export * from '../registry/default/search-input';
export * from '../registry/default/select';
export * from '../registry/default/select-picker';
export * from '../registry/default/selectable-card';
export * from '../registry/default/separator';
export * from '../registry/default/settings-row';
export * from '../registry/default/sheet';
export * from '../registry/default/skeleton';
export * from '../registry/default/slider';
export * from '../registry/default/sonner';
export * from '../registry/default/split-button';
export * from '../registry/default/stat-card';
export * from '../registry/default/stepper';
export * from '../registry/default/switch';
export * from '../registry/default/table';
export * from '../registry/default/table-list-cell';
export * from '../registry/default/tabs';
export * from '../registry/default/tag-input';
export * from '../registry/default/textarea';
export * from '../registry/default/theme-toggle';
export * from '../registry/default/timeline';
export * from '../registry/default/toggle';
export * from '../registry/default/toggle-group';
export * from '../registry/default/tooltip';
export * from '../registry/default/truncated-label';
export * from '../registry/default/user-picker';

// sidebar/* and app-shell-types/* are intentionally NOT re-exported here:
// the app-shell barrel already re-exports their contents and adding them again
// would produce duplicate-export errors.

// Hooks
export * from './hooks/use-copy-to-clipboard';
// useIsMobile is already re-exported via app-shell; do not re-export src/hooks/use-mobile here.

// Utils
export { cn, getInitialName } from './lib';
