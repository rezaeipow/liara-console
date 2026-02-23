import type { ReactNode } from "react";
import type { TableDensity } from "@/app/store/slices/uiSlice";

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  to: string;
  icon: ReactNode;
  primary?: boolean;
};

export type ConsoleActivityItem = {
  id: string;
  title: string;
  detail: string;
  to: string;
};

export type ConsoleHomeHeroProps = {
  activeAccountName: string;
  hasActiveAccount: boolean;
  unreadNotifications: number;
  tableDensity: TableDensity;
  isCompact: boolean;
};

export type ConsoleHomeStatGridProps = {
  unreadNotifications: number;
};

export type ConsoleHomeQuickActionsCardProps = {
  quickActions: QuickAction[];
  isCompact: boolean;
};

export type ConsoleHomeActivityCardProps = {
  activityItems: ConsoleActivityItem[];
  isCompact: boolean;
};

export type ConsoleHomeBottomGridProps = {
  quickActions: QuickAction[];
  activityItems: ConsoleActivityItem[];
  isCompact: boolean;
};

export type ConsoleHomeState = {
  activeAccountName: string;
  hasActiveAccount: boolean;
  unreadNotifications: number;
  tableDensity: TableDensity;
  isCompact: boolean;
};

export type ConsoleHomeStatItem = {
  id: string;
  label: string;
  value: string;
  hint: string;
  to: string;
  icon: ReactNode;
};

export type ConsoleHomeNavCardProps = {
  item: ConsoleHomeStatItem;
};
