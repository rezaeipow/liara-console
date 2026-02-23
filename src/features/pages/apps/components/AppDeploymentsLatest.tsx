import { Box, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ConsoleStatusChip from "@/shared/components/console/ConsoleStatusChip";
import { getDeploymentStatusTone } from "@/shared/ui/statusTones";
import type { AppDeploymentsLatestProps } from "@/shared/types/appsComponents";

export default function AppDeploymentsLatest({ latest, isLoading, theme, formatDate }: AppDeploymentsLatestProps) {
  if (isLoading || !latest) return null;
  return (
    <Paper sx={{ p: 1.25, borderRadius: 1.5, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, background: `linear-gradient(115deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.08)})` }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between">
        <Box>
          <Typography fontWeight={800}>Latest deployment: v{latest.version}</Typography>
          <Typography variant="body2" color="text.secondary">{formatDate(latest.createdAt)}</Typography>
        </Box>
        <ConsoleStatusChip label={latest.status} tone={getDeploymentStatusTone(latest.status)} />
      </Stack>
    </Paper>
  );
}
