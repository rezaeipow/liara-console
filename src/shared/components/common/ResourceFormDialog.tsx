import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import type { ResourceFormDialogProps } from "./types";

export default function ResourceFormDialog({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel = "Save",
  submittingLabel = "Saving...",
  isSubmitting = false,
  submitDisabled = false,
  maxWidth = "xs",
  fullWidth = true,
  compactContent = false,
}: ResourceFormDialogProps) {
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth={fullWidth}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1.2} sx={{ pt: compactContent ? 0.25 : 1 }}>
          {children}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={isSubmitting || submitDisabled}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
