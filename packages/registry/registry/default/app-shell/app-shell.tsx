import type { CSSProperties, ReactNode } from "react";
import { ChevronRight, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/sidebar";
import type { AppShellProps, NavItem, NavLinkItem, UserAction } from "@/components/ui/app-shell-types";

function DefaultLink({ href, children, ...props }: { href: string; children: ReactNode; className?: string; [key: string]: unknown }) {
  return <a href={href} {...props}>{children}</a>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function NavItemFlat({
  item,
  linkComponent: Link = DefaultLink,
}: {
  item: NavLinkItem;
  linkComponent?: AppShellProps["linkComponent"];
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={item.active}
        tooltip={item.label}
      >
        <Link href={item.href}>
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
  linkComponent?: AppShellProps["linkComponent"];
}) {
  const hasActiveChild = item.items?.some(
    (sub: NavItem) => sub.type !== "separator" && sub.active
  );

  return (
    <Collapsible
      asChild
      defaultOpen={item.active || hasActiveChild}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={item.active}
            tooltip={item.label}
          >
            {item.icon && <item.icon />}
            <span>{item.label}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((sub: NavItem, index: number) =>
              sub.type === "separator" ? (
                <SidebarSeparator key={`sep-${index}`} className="my-1" />
              ) : (
                <SidebarMenuSubItem key={sub.href}>
                  <SidebarMenuSubButton asChild isActive={sub.active}>
                    <Link href={sub.href}>
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
    maxWidth === "none"
      ? undefined
      : { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild tooltip={branding.name}>
                <Link href={branding.href ?? "/"}>
                  {branding.logo ? (
                    branding.logoWrapper === false ? (
                      <img
                        src={branding.logo}
                        alt={branding.name}
                        className="size-8"
                      />
                    ) : (
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <img
                          src={branding.logo}
                          alt={branding.name}
                          className="size-4"
                        />
                      </div>
                    )
                  ) : (
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold">
                      {branding.name.charAt(0)}
                    </div>
                  )}
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {branding.name}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item: NavItem, index: number) =>
                  item.type === "separator" ? (
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      tooltip={user.name}
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="size-8 rounded-lg">
                        {user.avatar && (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        )}
                        <AvatarFallback className="rounded-lg">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        {user.email && (
                          <span className="truncate text-xs">
                            {user.email}
                          </span>
                        )}
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
                          {user.avatar && (
                            <AvatarImage
                              src={user.avatar}
                              alt={user.name}
                            />
                          )}
                          <AvatarFallback className="rounded-lg">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user.name}
                          </span>
                          {user.email && (
                            <span className="truncate text-xs">
                              {user.email}
                            </span>
                          )}
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
                              className={cn(
                                action.variant === "destructive" &&
                                  "text-destructive focus:text-destructive"
                              )}
                              onClick={action.onClick}
                              asChild={!!action.href}
                            >
                              {action.href ? (
                                <Link href={action.href}>
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
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        )}

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            {header && (
              <>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex flex-1 items-center">{header}</div>
              </>
            )}
            {navbarActions && (
              <div className="ml-auto flex items-center gap-1">
                {navbarActions}
              </div>
            )}
          </div>
        </header>
        <div className={cn("flex-1 overflow-y-auto overflow-x-hidden min-w-0", contentClassName ?? "p-4")}>
          <div className="mx-auto" style={resolvedMaxWidth}>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { AppShell };
export type { AppShellProps, NavItem, NavLinkItem, NavSeparatorItem, UserAction } from "@/components/ui/app-shell-types";
