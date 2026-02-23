import { Alert, Button } from "@mui/material";
import type { AppEnvAlertsProps } from "@/shared/types/appsComponents";

export default function AppEnvAlerts({ notice, error, hasValidationError, isLoading, onRetry }: AppEnvAlertsProps) {
  return (
    <>
      {notice ? <Alert severity="success">{notice}</Alert> : null}
      {error ? (
        <Alert severity="error" action={<Button size="small" color="inherit" onClick={onRetry}>Retry</Button>}>
          {error}
        </Alert>
      ) : null}
      {hasValidationError && !isLoading ? <Alert severity="warning">Fix validation errors before saving.</Alert> : null}
    </>
  );
}
