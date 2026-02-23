import { Alert, Button } from "@mui/material";
import type { EmptyStateAlertProps } from "./types";

export default function EmptyStateAlert({
  children,
  actionLabel,
  onAction,
  action,
}: EmptyStateAlertProps) {
  const actionNode =
    action ??
    (actionLabel && onAction ? (
      <Button size="small" color="inherit" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null);

  return (
    <Alert severity="info" action={actionNode}>
      {children}
    </Alert>
  );
}

