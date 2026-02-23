import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { ConfirmDialogProps } from "./types";

export default function ConfirmDialog({
  open,
  title,
  onClose,
  onConfirm,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "primary",
  confirmVariant = "contained",
  confirmDisabled = false,
  isSubmitting = false,
  fullWidth = true,
  maxWidth = "xs",
  ariaLabelledby,
}: ConfirmDialogProps) {
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby={ariaLabelledby}
    >
      <DialogTitle id={ariaLabelledby}>{title}</DialogTitle>
      <DialogContent>
        {children ?? (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          {cancelLabel}
        </Button>
        <Button
          variant={confirmVariant}
          color={confirmColor}
          onClick={onConfirm}
          disabled={isSubmitting || confirmDisabled}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
