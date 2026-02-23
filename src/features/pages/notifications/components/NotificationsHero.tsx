import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import { Button } from "@mui/material";
import { Form } from "react-router-dom";
import ConsoleHeroCard from "@/shared/components/console/ConsoleHeroCard";
import type { NotificationsHeroProps } from "@/shared/types/notificationsComponents";

export default function NotificationsHero({
  isRouteLoading,
  isCompact,
  isSubmitting,
  unreadCount,
  onOpenMarkAllConfirm,
}: NotificationsHeroProps) {
  return (
    <ConsoleHeroCard
      title="Notifications"
      description="Review account activity, service alerts, and system updates."
      icon={<NotificationsActiveOutlinedIcon fontSize="small" />}
      loading={isRouteLoading}
      compact={isCompact}
      actions={
        <Form method="post" replace>
          <input type="hidden" name="intent" value="mark-all-read" />
          <Button
            type="button"
            variant="contained"
            startIcon={<DoneAllOutlinedIcon />}
            aria-label="Mark all notifications as read"
            disabled={isSubmitting || unreadCount === 0}
            onClick={onOpenMarkAllConfirm}
          >
            Mark all as read
          </Button>
        </Form>
      }
    />
  );
}
