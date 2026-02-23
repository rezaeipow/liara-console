import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { setUnreadNotificationsCount } from "@/app/store/slices/uiSlice";
import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import { getNotificationsDensityLayout, getNotificationsSnackbarState, useNotificationsDerived } from "./hooks";
import NotificationsFiltersPanel from "./components/NotificationsFiltersPanel";
import NotificationsHero from "./components/NotificationsHero";
import NotificationsListPanel from "./components/NotificationsListPanel";
import NotificationsReadAllConfirmDialog from "./components/NotificationsReadAllConfirmDialog";
import { useNotificationsPageState } from "./useNotificationsPageState";

export default function NotificationsPage() {
  const {
    items,
    actionData,
    submit,
    dispatch,
    filter,
    search,
    setQueryParam,
    dismissedNoticeKey,
    setDismissedNoticeKey,
    tableDensity,
    isRouteLoading,
    isSubmitting,
  } = useNotificationsPageState();
  const densityLayout = getNotificationsDensityLayout(tableDensity);
  const { unreadCount, readCount, filteredItems, unreadFiltered, readFiltered } = useNotificationsDerived(items, filter, search);

  useEffect(() => {
    dispatch(setUnreadNotificationsCount(unreadCount));
  }, [dispatch, unreadCount]);
  const { noticeMessage, noticeKey, snackbarOpen } = getNotificationsSnackbarState(actionData, dismissedNoticeKey);
  const [confirmReadAllOpen, setConfirmReadAllOpen] = useState(false);

  return (
    <>
      <ConsoleContentContainer spacing={2.2} aria-busy={isRouteLoading}>
        <NotificationsHero
          isRouteLoading={isRouteLoading}
          isCompact={tableDensity === "compact"}
          isSubmitting={isSubmitting}
          unreadCount={unreadCount}
          onOpenMarkAllConfirm={() => setConfirmReadAllOpen(true)}
        />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "280px minmax(0, 1fr)" }, gap: 1.25 }}>
          <NotificationsFiltersPanel
            tableDensity={tableDensity}
            itemsCount={items.length}
            unreadCount={unreadCount}
            readCount={readCount}
            filter={filter}
            search={search}
            setQueryParam={setQueryParam}
          />
          <NotificationsListPanel
            tableDensity={tableDensity}
            filter={filter}
            filteredItems={filteredItems}
            unreadFiltered={unreadFiltered}
            readFiltered={readFiltered}
            listSpacing={densityLayout.listSpacing}
            itemPaddingX={densityLayout.itemPaddingX}
            itemPaddingY={densityLayout.itemPaddingY}
            itemInnerSpacing={densityLayout.itemInnerSpacing}
            isSubmitting={isSubmitting}
          />
        </Box>
      </ConsoleContentContainer>

      <FeedbackSnackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        severity={actionData?.formError ? "error" : "success"}
        message={noticeMessage}
        statusCode={actionData?.errorStatus}
        hint={actionData?.errorHint}
        onClose={() => setDismissedNoticeKey(noticeKey)}
      />
      <NotificationsReadAllConfirmDialog
        open={confirmReadAllOpen}
        isSubmitting={isSubmitting}
        onClose={() => setConfirmReadAllOpen(false)}
        onConfirm={() => {
          void submit({ intent: "mark-all-read" }, { method: "post", replace: true });
          setConfirmReadAllOpen(false);
        }}
      />
    </>
  );
}

