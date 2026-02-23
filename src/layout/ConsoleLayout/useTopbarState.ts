import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery, useTheme, type SelectChangeEvent } from "@mui/material";
import { useFetcher, useLocation, useNavigate } from "react-router-dom";
import { BillingAPI } from "@/api/billingApi";
import { NotificationsAPI } from "@/api/notificationsApi";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { selectUser } from "@/app/store/slices/authSlice";
import { selectAccounts, selectActiveAccountId } from "@/app/store/slices/accountSlice";
import {
  hideToast,
  openMobileSidebar,
  selectBillingCredit,
  selectSidebarMode,
  selectToast,
  selectUnreadNotificationsCount,
  setBillingCredit,
  setUnreadNotificationsCount,
  toggleSidebarMode,
} from "@/app/store/slices/uiSlice";
import type { TopbarState } from "./types";

export function useTopbarState(): TopbarState {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const accountSwitchFetcher = useFetcher();
  const location = useLocation();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isSmMd = !isXs && !isLgUp;

  const sidebarMode = useAppSelector(selectSidebarMode);
  const toast = useAppSelector(selectToast);
  const unreadNotificationsCount = useAppSelector(selectUnreadNotificationsCount);
  const user = useAppSelector(selectUser);
  const accounts = useAppSelector(selectAccounts);
  const activeAccountId = useAppSelector(selectActiveAccountId);
  const creditAmount = useAppSelector(selectBillingCredit);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const accountItems = useMemo(
    () => (accounts.length > 0 ? accounts : [{ id: "default-account", name: "Default Account" }]),
    [accounts],
  );

  const selectedAccountId = activeAccountId ?? accountItems[0].id;
  const accountMenuVisibleCount = 3;
  const accountMenuItemHeight = 40;
  const accountMenuMaxHeight = accountMenuVisibleCount * accountMenuItemHeight;

  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await NotificationsAPI.list();
      const unread = response.items.filter((item) => !item.read).length;
      dispatch(setUnreadNotificationsCount(unread));
    } catch {
      // Keep previous count on transient failures.
    }
  }, [dispatch]);

  const refreshCredit = useCallback(async () => {
    try {
      const response = await BillingAPI.getCredit();
      dispatch(setBillingCredit(response.credit));
    } catch {
      // Keep last successful amount on transient billing failures.
    }
  }, [dispatch]);

  useEffect(() => {
    void refreshUnreadCount();
  }, [refreshUnreadCount, location.pathname]);

  useEffect(() => {
    void refreshCredit();
  }, [refreshCredit, selectedAccountId]);

  useEffect(() => {
    if (location.pathname.startsWith("/console/billing")) {
      void refreshCredit();
    }
  }, [location.pathname, refreshCredit]);

  return {
    theme,
    isXs,
    isLgUp,
    isSmMd,
    sidebarMode,
    toastOpen: toast.open,
    toastSeverity: toast.severity,
    toastMessage: toast.message,
    unreadNotificationsCount,
    userName: user?.name,
    userAvatar: user?.avatar,
    accountItems,
    selectedAccountId,
    accountMenuMaxHeight,
    accountMenuItemHeight,
    accountSwitching: accountSwitchFetcher.state !== "idle",
    creditAmount,
    menuAnchorEl: anchorEl,
    isMenuOpen: Boolean(anchorEl),
    onMenuOpen: (event) => setAnchorEl(event.currentTarget),
    onMenuClose: () => setAnchorEl(null),
    onLogout: () => {
      setAnchorEl(null);
      void navigate("/auth/complete?mode=logout&next=%2Flogin&logout=1");
    },
    onAccountChange: (event: SelectChangeEvent) => {
      void accountSwitchFetcher.submit(
        { intent: "switch", accountId: event.target.value },
        { method: "post", action: "/console/accounts" },
      );
    },
    onSidebarToggle: () => {
      if (isXs) {
        dispatch(openMobileSidebar());
        return;
      }
      if (!isLgUp) {
        dispatch(toggleSidebarMode());
      }
    },
    onToastClose: () => dispatch(hideToast()),
  };
}
