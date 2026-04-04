import type { ComponentType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface AppShellProps {
  branding: {
    name: string;
    logo?: string;
    href?: string;
    /** Whether to show the default wrapper box around the logo. Set to false if your logo already has its own background/container. Default: true */
    logoWrapper?: boolean;
  };
  navigation: NavItem[];
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    actions?: UserAction[];
  };
  header?: ReactNode;
  navbarActions?: ReactNode;
  children: ReactNode;
  /** Max-width for the content area. Number = pixels, string = CSS value. "none" to disable. Default: 1400 */
  maxWidth?: number | string;
  /** Custom link component to replace all <a> tags (e.g. TanStack Router's Link or Next.js Link). Default: "a" */
  linkComponent?: ComponentType<{
    href: string;
    children: ReactNode;
    className?: string;
    [key: string]: any;
  }>;
  /** Override the default content area padding classes. Replaces default "p-4". */
  contentClassName?: string;
}

export type NavItem = NavLinkItem | NavSeparatorItem;

export interface NavLinkItem {
  type?: "link";
  label: string;
  href: string;
  icon?: LucideIcon;
  active?: boolean;
  items?: NavItem[];
}

export interface NavSeparatorItem {
  type: "separator";
}

export interface UserAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "default" | "destructive";
}
