import { request } from "./httpClient";
import type { NotificationItem } from "./types";

export const NotificationsAPI = {
  list: () => request<{ items: NotificationItem[] }>("/notifications"),

  markRead: (id: string) =>
    request<{ success: boolean }>(`/notifications/${id}/read`, {
      method: "POST",
    }),

  markAllRead: () =>
    request<{ success: boolean }>("/notifications/read-all", {
      method: "POST",
    }),
};

