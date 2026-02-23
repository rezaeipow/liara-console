import { Alert, Paper, Skeleton, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { AppEnvContentProps } from "@/shared/types/appsComponents";
import AppEnvRows from "./AppEnvRows";

export default function AppEnvContent({ isLoading, rows, rowErrors, revealSecrets, onUpdate, onRemove, theme }: AppEnvContentProps) {
  return (
    <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: 1.5, border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}` }}>
      {isLoading ? (
        <Stack spacing={1}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Paper key={`env-skeleton-${idx}`} variant="outlined" sx={{ p: 1.2 }}>
              <Stack spacing={0.8}>
                <Skeleton variant="rounded" height={36} />
                <Skeleton variant="rounded" height={36} />
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : rows.length === 0 ? (
        <Alert severity="info">No environment variables yet. Add your first key.</Alert>
      ) : (
        <AppEnvRows rows={rows} rowErrors={rowErrors} revealSecrets={revealSecrets} onUpdate={onUpdate} onRemove={onRemove} theme={theme} />
      )}
    </Paper>
  );
}
