import ResourceActionConfirmDialog from "@/shared/components/common/ResourceActionConfirmDialog";
import type { NotificationsReadAllConfirmDialogProps } from "@/shared/types/notificationsComponents";

export default function NotificationsReadAllConfirmDialog(
  props: NotificationsReadAllConfirmDialogProps,
) {
  const { open, isSubmitting, onClose, onConfirm } = props;

  return (
    <ResourceActionConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Mark all as read?"
      message="All unread notifications will be marked as read."
      confirmLabel={isSubmitting ? "Applying..." : "Mark all as read"}
      confirmColor="primary"
      isSubmitting={isSubmitting}
    />
  );
}
