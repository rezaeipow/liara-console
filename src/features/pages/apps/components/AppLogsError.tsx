import { Alert, Button } from "@mui/material";
import type { AppLogsErrorProps } from "@/shared/types/appsComponents";

export default function AppLogsError({ error, onRetry }: AppLogsErrorProps) {
  if (!error) return null;
  return (
    <Alert severity="error" action={<Button size="small" color="inherit" onClick={onRetry}>Retry</Button>}>
      {error}
    </Alert>
  );
}
