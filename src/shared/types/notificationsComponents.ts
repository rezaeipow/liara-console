import type { NotificationItem } from "@/api/types";

export type NotificationsHeroProps = {
  isRouteLoading: boolean;
  isCompact: boolean;
  isSubmitting: boolean;
  unreadCount: number;
  onOpenMarkAllConfirm: () => void;
};

export type NotificationsFiltersPanelProps = {
  tableDensity: "compact" | "standard" | "comfortable";
  itemsCount: number;
  unreadCount: number;
  readCount: number;
  filter: "all" | "read" | "unread";
  search: string;
  setQueryParam: (key: string, value: string, defaultValue?: string) => void;
};

export type NotificationsListPanelProps = {
  tableDensity: "compact" | "standard" | "comfortable";
  filter: "all" | "read" | "unread";
  filteredItems: NotificationItem[];
  unreadFiltered: NotificationItem[];
  readFiltered: NotificationItem[];
  listSpacing: number;
  itemPaddingX: number;
  itemPaddingY: number;
  itemInnerSpacing: number;
  isSubmitting: boolean;
};

export type NotificationsReadAllConfirmDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export type NotificationsDensityLayout = {
  listSpacing: number;
  itemPaddingX: number;
  itemPaddingY: number;
  itemInnerSpacing: number;
};
