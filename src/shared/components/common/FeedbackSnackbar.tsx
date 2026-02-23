import { Alert, Snackbar, Stack, Typography } from "@mui/material";
import type { FeedbackSnackbarProps } from "./types";

export default function FeedbackSnackbar({
  open,
  onClose,
  severity,
  message,
  autoHideDuration = 3000,
  details,
  statusCode,
  hint,
}: FeedbackSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={severity} variant="filled" onClose={onClose} aria-live="assertive">
        <Stack spacing={0.2}>
          {message ? <Typography variant="body2">{message}</Typography> : null}
          {statusCode ? <Typography variant="caption">Error code: {statusCode}</Typography> : null}
          {hint ? <Typography variant="caption">{hint}</Typography> : null}
          {details}
        </Stack>
      </Alert>
    </Snackbar>
  );
}

