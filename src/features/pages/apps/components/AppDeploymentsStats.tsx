import { Box, Paper, Typography } from "@mui/material";
import type { AppDeploymentsStatsProps } from "@/shared/types/appsComponents";

export default function AppDeploymentsStats({ stats, isLoading }: AppDeploymentsStatsProps) {
  if (isLoading) return null;
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: 1 }}>
      <Paper variant="outlined" sx={{ p: 1.2 }}><Typography variant="caption" color="text.secondary">Total</Typography><Typography fontWeight={800}>{stats.total}</Typography></Paper>
      <Paper variant="outlined" sx={{ p: 1.2 }}><Typography variant="caption" color="text.secondary">Success</Typography><Typography fontWeight={800}>{stats.success}</Typography></Paper>
      <Paper variant="outlined" sx={{ p: 1.2 }}><Typography variant="caption" color="text.secondary">Running</Typography><Typography fontWeight={800}>{stats.running}</Typography></Paper>
      <Paper variant="outlined" sx={{ p: 1.2 }}><Typography variant="caption" color="text.secondary">Failed</Typography><Typography fontWeight={800}>{stats.failed}</Typography></Paper>
    </Box>
  );
}
