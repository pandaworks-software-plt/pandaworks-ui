import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { ChevronRight, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useIsCompactDesktop } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import type { AppShellProps, NavItem, NavLinkItem, UserAction } from '@/components/ui/app-shell-types';

function DefaultLink({
  href,
  children,
  ...props
}: {
  href: string;
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

function useMobileAutoClose() {
  const { isMobile, setOpenMobile } = useSidebar();
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (isMobile && !event.defaultPrevented) {
      setOpenMobile(false);
    }
  };
}

function NavItemFlat({
  item,
  linkComponent: Link = DefaultLink,
}: {
  item: NavLinkItem;
  linkComponent?: AppShellProps['linkComponent'];
}) {
  const handleClick = useMobileAutoClose();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={item.active} tooltip={item.label}>
        <Link href={item.href} onClick={handleClick}>
          {item.icon && <item.icon />}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavItemCollapsible({
  item,
  linkComponent: Link = DefaultLink,
}: {
  item: NavLinkItem;
  linkComponent?: AppShellProps['linkComponent'];
}) {
  const hasActiveChild = item.items?.some((sub: NavItem) => sub.type !== 'separator' && sub.active);
  const handleClick = useMobileAutoClose();

  return (
    <Collapsible asChild defaultOpen={item.active || hasActiveChild} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={item.active} tooltip={item.label}>
            {item.icon && <item.icon />}
            <span>{item.label}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((sub: NavItem, index: number) =>
              sub.type === 'separator' ? (
                <SidebarSeparator key={`sep-${index}`} className="my-1" />
              ) : (
                <SidebarMenuSubItem key={sub.href}>
                  <SidebarMenuSubButton asChild isActive={sub.active}>
                    <Link href={sub.href} onClick={handleClick}>
                      {sub.icon && <sub.icon />}
                      <span>{sub.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function BrandingLink({
  branding,
  linkComponent: Link = DefaultLink,
}: {
  branding: AppShellProps['branding'];
  linkComponent?: AppShellProps['linkComponent'];
}) {
  const handleClick = useMobileAutoClose();
  return (
    <SidebarMenuButton size="lg" asChild tooltip={branding.name}>
      <Link href={branding.href ?? '/'} onClick={handleClick}>
        {branding.logo ? (
          branding.logoWrapper === false ? (
            <img src={branding.logo} alt={branding.name} className="size-8" />
          ) : (
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <img src={branding.logo} alt={branding.name} className="size-4" />
            </div>
          )
        ) : (
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold">
            {branding.name.charAt(0)}
          </div>
        )}
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{branding.name}</span>
          {branding.subtitle && <span className="truncate text-xs text-muted-foreground">{branding.subtitle}</span>}
        </div>
      </Link>
    </SidebarMenuButton>
  );
}

function UserMenu({
  user,
  linkComponent: Link = DefaultLink,
}: {
  user: NonNullable<AppShellProps['user']>;
  linkComponent?: AppShellProps['linkComponent'];
}) {
  const handleClick = useMobileAutoClose();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          tooltip={user.name}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="size-8 rounded-lg">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className="rounded-lg">{user.name}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            {user.email && <span className="truncate text-xs">{user.email}</span>}
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="rounded-lg">{user.name}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              {user.email && <span className="truncate text-xs">{user.email}</span>}
            </div>
          </div>
        </DropdownMenuLabel>
        {user.actions && user.actions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {user.actions.map((action: UserAction) => (
                <DropdownMenuItem
                  key={action.label}
                  className={cn(action.variant === 'destructive' && 'text-destructive focus:text-destructive')}
                  onClick={action.onClick}
                  asChild={!!action.href}
                >
                  {action.href ? (
                    <Link href={action.href} onClick={handleClick}>
                      {action.icon && <action.icon />}
                      {action.label}
                    </Link>
                  ) : (
                    <>
                      {action.icon && <action.icon />}
                      {action.label}
                    </>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppShell({
  branding,
  navigation,
  user,
  header,
  navbarActions,
  children,
  maxWidth = 1400,
  linkComponent: Link = DefaultLink,
  contentClassName,
}: AppShellProps) {
  const resolvedMaxWidth: CSSProperties | undefined =
    maxWidth === 'none' ? undefined : { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth };

  const isCompact = useIsCompactDesktop();
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(!isCompact);
  }, [isCompact]);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <BrandingLink branding={branding} linkComponent={Link} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item: NavItem, index: number) =>
                  item.type === 'separator' ? (
                    <SidebarSeparator key={`sep-${index}`} className="my-1" />
                  ) : item.items && item.items.length > 0 ? (
                    <NavItemCollapsible key={item.href} item={item} linkComponent={Link} />
                  ) : (
                    <NavItemFlat key={item.href} item={item} linkComponent={Link} />
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {user && (
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <UserMenu user={user} linkComponent={Link} />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        )}

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full min-w-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 shrink-0" />
            {header && (
              <>
                <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
                <div className="flex min-w-0 flex-1 items-center">{header}</div>
              </>
            )}
            {navbarActions && <div className="ml-auto flex shrink-0 items-center gap-1">{navbarActions}</div>}
          </div>
        </header>
        <div className={cn('flex-1 overflow-y-auto overflow-x-hidden min-w-0', contentClassName ?? 'p-4')}>
          <div className="mx-auto" style={resolvedMaxWidth}>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { AppShell };
export type {
  AppShellProps,
  NavItem,
  NavLinkItem,
  NavSeparatorItem,
  UserAction,
} from '@/components/ui/app-shell-types';
