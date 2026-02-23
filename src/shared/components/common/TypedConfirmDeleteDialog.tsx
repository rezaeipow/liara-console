import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import type { TypedConfirmDeleteDialogProps } from "./types";

export default function TypedConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  expectedName,
  inputLabel,
  confirmText,
  onConfirmTextChange,
  confirmDisabled,
  confirmLabel = "Delete",
  submittingLabel = "Deleting...",
  isSubmitting = false,
  description,
  error,
}: TypedConfirmDeleteDialogProps) {
  const isConfirmDisabled = confirmDisabled ?? (confirmText.trim() !== expectedName || isSubmitting);

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1.2} sx={{ pt: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {description ?? (
              <>
                Type <strong>{expectedName || "-"}</strong> to confirm permanent deletion.
              </>
            )}
          </Typography>
          <TextField
            size="small"
            label={inputLabel}
            value={confirmText}
            onChange={(event) => onConfirmTextChange(event.target.value)}
            disabled={isSubmitting}
          />
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={isConfirmDisabled}>
          {isSubmitting ? submittingLabel : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
