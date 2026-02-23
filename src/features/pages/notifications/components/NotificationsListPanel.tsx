import { Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EmptyStateAlert from "@/shared/components/common/EmptyStateAlert";
import type { NotificationsListPanelProps } from "@/shared/types/notificationsComponents";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import NotificationSection from "./NotificationSection";

export default function NotificationsListPanel(props: NotificationsListPanelProps) {
  const { tableDensity, filter, filteredItems, unreadFiltered, readFiltered, listSpacing, itemPaddingX, itemPaddingY, itemInnerSpacing, isSubmitting } = props;
  return (
    <Paper sx={{ p: { xs: 1.4, sm: 1.8 }, borderRadius: tableDensity === "compact" ? { xs: 0.7, sm: 1 } : { xs: 1.4, sm: 1.8 }, border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`, background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`, backdropFilter: glassBackdrop.card }}>
      <Stack spacing={1.1}>
        {filteredItems.length === 0 ? (
          <EmptyStateAlert>
            <Stack spacing={0.4}>
              <Typography fontWeight={800}>No notifications found</Typography>
              <Typography variant="body2" color="text.secondary">Try changing search text or filter.</Typography>
            </Stack>
          </EmptyStateAlert>
        ) : (
          <>
            {filter !== "read" && unreadFiltered.length > 0 ? (
              <NotificationSection title="Unread" items={unreadFiltered} listSpacing={listSpacing} itemPaddingX={itemPaddingX} itemPaddingY={itemPaddingY} itemInnerSpacing={itemInnerSpacing} tableDensity={tableDensity} isSubmitting={isSubmitting} />
            ) : null}
            {filter !== "unread" && readFiltered.length > 0 ? (
              <NotificationSection title="Read" items={readFiltered} listSpacing={listSpacing} itemPaddingX={itemPaddingX} itemPaddingY={itemPaddingY} itemInnerSpacing={itemInnerSpacing} tableDensity={tableDensity} isSubmitting={isSubmitting} />
            ) : null}
          </>
        )}
      </Stack>
    </Paper>
  );
}
