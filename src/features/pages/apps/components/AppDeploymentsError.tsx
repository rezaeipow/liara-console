import { Alert, Button } from "@mui/material";
import type { AppDeploymentsErrorProps } from "@/shared/types/appsComponents";

export default function AppDeploymentsError({ error, onRetry }: AppDeploymentsErrorProps) {
  if (!error) return null;
  return (
    <Alert severity="error" action={<Button size="small" color="inherit" onClick={onRetry}>Retry</Button>}>
      {error}
    </Alert>
  );
}
