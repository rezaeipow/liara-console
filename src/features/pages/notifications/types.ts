import type { NotificationsLoaderData } from "./notificationsData";

export type NotificationSectionProps = {
  title: string;
  items: NotificationsLoaderData["items"];
  listSpacing: number;
  itemPaddingX: number;
  itemPaddingY: number;
  itemInnerSpacing: number;
  tableDensity: "compact" | "standard" | "comfortable";
  isSubmitting: boolean;
};
