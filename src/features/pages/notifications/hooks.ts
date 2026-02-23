import { useMemo } from "react";
import type { NotificationsActionData, NotificationsLoaderData } from "./notificationsData";
import type { NotificationsDensityLayout } from "@/shared/types/notificationsComponents";

export function useNotificationsDerived(
  items: NotificationsLoaderData["items"],
  filter: "all" | "read" | "unread",
  search: string,
) {
  return useMemo(() => {
    const unreadCount = items.filter((item) => !item.read).length;
    const readCount = items.length - unreadCount;
    const normalized = search.trim().toLowerCase();
    const filteredItems = items.filter((item) => {
      if (filter === "read" && !item.read) return false;
      if (filter === "unread" && item.read) return false;
      if (!normalized) return true;
      return item.title.toLowerCase().includes(normalized) || item.body.toLowerCase().includes(normalized);
    });
    return {
      unreadCount,
      readCount,
      filteredItems,
      unreadFiltered: filteredItems.filter((item) => !item.read),
      readFiltered: filteredItems.filter((item) => item.read),
    };
  }, [filter, items, search]);
}

export function getNotificationsSnackbarState(
  actionData: NotificationsActionData | undefined,
  dismissedNoticeKey: string | null,
) {
  const noticeMessage = actionData?.formError ?? actionData?.successMessage;
  const noticeKey = actionData?.successAt
    ? `success-${actionData.successAt}`
    : actionData?.formError
      ? `error-${actionData.formError}`
      : null;
  return {
    noticeMessage,
    noticeKey,
    snackbarOpen: Boolean(noticeKey) && noticeKey !== dismissedNoticeKey,
  };
}

export function getNotificationsDensityLayout(
  tableDensity: "compact" | "standard" | "comfortable",
): NotificationsDensityLayout {
  return {
    listSpacing: tableDensity === "comfortable" ? 1.8 : tableDensity === "compact" ? 0.18 : 1,
    itemPaddingX: tableDensity === "comfortable" ? 2.2 : tableDensity === "compact" ? 0.5 : 1.3,
    itemPaddingY: tableDensity === "comfortable" ? 2.2 : tableDensity === "compact" ? 0.35 : 1.3,
    itemInnerSpacing: tableDensity === "comfortable" ? 1.4 : tableDensity === "compact" ? 0.12 : 0.8,
  };
}
