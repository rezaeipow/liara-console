import type { MouseEvent, ReactNode } from "react";
import type { SelectChangeEvent, Theme } from "@mui/material";
import type { SnackbarSeverity } from "@/shared/components/common/types";

export type SidebarNavItem = {
  label: string;
  path: string;
  icon: ReactNode;
  end?: boolean;
  matchPrefixes?: string[];
};

export type SidebarNavContentProps = {
  drawerWidth: number;
  isCollapsed: boolean;
  isSmMd: boolean;
  isXs: boolean;
  navItems: SidebarNavItem[];
};

export type TopbarAccountItem = {
  id: string;
  name: string;
};

export type TopbarState = {
  theme: Theme;
  isXs: boolean;
  isLgUp: boolean;
  isSmMd: boolean;
  sidebarMode: "expanded" | "collapsed";
  toastOpen: boolean;
  toastSeverity: SnackbarSeverity;
  toastMessage: string;
  unreadNotificationsCount: number;
  userName?: string;
  userAvatar?: string;
  accountItems: TopbarAccountItem[];
  selectedAccountId: string;
  accountMenuMaxHeight: number;
  accountMenuItemHeight: number;
  accountSwitching: boolean;
  creditAmount: number | null;
  menuAnchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  onMenuOpen: (event: MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onLogout: () => void;
  onAccountChange: (event: SelectChangeEvent) => void;
  onSidebarToggle: () => void;
  onToastClose: () => void;
};

export type TopbarBrandProps = {
  isXs: boolean;
  isLgUp: boolean;
  onSidebarToggle: () => void;
};

export type TopbarAccountSelectProps = {
  accountItems: TopbarAccountItem[];
  selectedAccountId: string;
  accountSwitching: boolean;
  accountMenuMaxHeight: number;
  accountMenuItemHeight: number;
  onAccountChange: (event: SelectChangeEvent) => void;
};

export type TopbarCreditSummaryProps = {
  creditAmount: number | null;
};

export type TopbarActionIconsProps = {
  isXs: boolean;
  unreadNotificationsCount: number;
  userName?: string;
  userAvatar?: string;
  menuAnchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  onMenuOpen: (event: MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onLogout: () => void;
};
