import { useAppSelector } from "@/app/store/hooks";
import { selectActiveAccount } from "@/app/store/slices/accountSlice";
import { selectUnreadNotificationsCount } from "@/app/store/slices/uiSlice";
import { useTableDensity } from "@/shared/hooks/useTableDensity";
import type { ConsoleHomeState } from "./types";

export function useConsoleHomeState(): ConsoleHomeState {
  const activeAccount = useAppSelector(selectActiveAccount);
  const unreadNotifications = useAppSelector(selectUnreadNotificationsCount);
  const { tableDensity, isCompact } = useTableDensity();

  return {
    activeAccountName: activeAccount?.name ?? "",
    hasActiveAccount: Boolean(activeAccount),
    unreadNotifications,
    tableDensity,
    isCompact,
  };
}
