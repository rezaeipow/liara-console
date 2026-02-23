import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Button, Chip, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { VmMetricsHeaderProps } from "../pageTypes";

export default function VmMetricsHeader({ theme, vmName, range, refreshing, onRangeChange, onRefresh, cpu, ram, disk }: VmMetricsHeaderProps) {
  return (
    <Paper sx={{ p: { xs: 1.5, sm: 1.8 }, borderRadius: 1.75, border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`, background: `linear-gradient(160deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.08)})` }}>
      <Stack spacing={1.1}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <InsightsOutlinedIcon />
            <Box>
              <Typography variant="h6" fontWeight={800}>VM Metrics</Typography>
              <Typography variant="body2" color="text.secondary">Utilization overview for {vmName}.</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <ToggleButtonGroup size="small" value={range} exclusive onChange={(_, value) => { if (value) onRangeChange(value); }}>
              <ToggleButton value="1h">1h</ToggleButton>
              <ToggleButton value="24h">24h</ToggleButton>
              <ToggleButton value="7d">7d</ToggleButton>
            </ToggleButtonGroup>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh} disabled={refreshing}>{refreshing ? "Refreshing..." : "Refresh"}</Button>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
          <Chip size="small" label={`vCPU: ${cpu}`} variant="outlined" />
          <Chip size="small" label={`RAM: ${(ram / 1024).toFixed(1)} GB`} variant="outlined" />
          <Chip size="small" label={`Disk: ${disk} GB`} variant="outlined" />
        </Stack>
      </Stack>
    </Paper>
  );
}
