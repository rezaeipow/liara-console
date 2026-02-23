import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Divider, Stack, Typography } from "@mui/material";
import ConfirmDialog from "./ConfirmDialog";
import type { ResourceActionConfirmDialogProps } from "./types";

export default function ResourceActionConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  submittingLabel = "Processing...",
  confirmColor = "primary",
  isSubmitting = false,
  showWarningIcon = false,
  metaLabel,
  metaValue,
}: ResourceActionConfirmDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      confirmColor={confirmColor}
      confirmLabel={isSubmitting ? submittingLabel : confirmLabel}
      isSubmitting={isSubmitting}
    >
      <Stack spacing={1} sx={{ pt: 0.25 }}>
        {showWarningIcon ? <WarningAmberIcon color="error" /> : null}
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        {metaLabel && metaValue ? (
          <>
            <Divider />
            <Typography variant="caption" color="text.secondary">
              {metaLabel}: {metaValue}
            </Typography>
          </>
        ) : null}
      </Stack>
    </ConfirmDialog>
  );
}
