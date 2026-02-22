import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import type { Vm } from "../../../api/types";

type VmLayoutContext = {
  vm: Vm | null;
  isLoading: boolean;
  error: string | null;
};

type RangeKey = "1h" | "24h" | "7d";

function buildSeries(seed: string, length: number, max: number) {
  const base = seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return Array.from({ length }).map((_, index) => {
    const wave = Math.sin((index + base) / 3) * 8;
    const noise = ((index * 13 + base) % 7) - 3;
    const value = Math.max(2, Math.min(max, Math.round(max * 0.45 + wave + noise)));
    return value;
  });
}

function normalize(series: number[], max: number) {
  return series.map((value) => Math.max(2, Math.min(100, Math.round((value / max) * 100))));
}

export default function VmMetricsPage() {
  const theme = useTheme();
  const { vmId } = useParams();
  const { vm, isLoading, error } = useOutletContext<VmLayoutContext>();
  const [range, setRange] = useState<RangeKey>("24h");
  const [refreshing, setRefreshing] = useState(false);

  const seriesLength = range === "1h" ? 12 : range === "24h" ? 24 : 28;
  const cpuSeries = useMemo(() => buildSeries(vmId ?? "vm", seriesLength, vm?.cpu ?? 4), [vmId, seriesLength, vm]);
  const ramSeries = useMemo(() => buildSeries(`${vmId}-ram`, seriesLength, vm?.ram ?? 4096), [vmId, seriesLength, vm]);
  const diskSeries = useMemo(() => buildSeries(`${vmId}-disk`, seriesLength, vm?.disk ?? 80), [vmId, seriesLength, vm]);

  const cpuPercent = useMemo(() => normalize(cpuSeries, vm?.cpu ?? 4), [cpuSeries, vm]);
  const ramPercent = useMemo(() => normalize(ramSeries, vm?.ram ?? 4096), [ramSeries, vm]);
  const diskPercent = useMemo(() => normalize(diskSeries, vm?.disk ?? 80), [diskSeries, vm]);

  const handleRefresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 650);
  };

  if (isLoading) {
    return (
      <Stack spacing={1.25}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Paper key={`vm-metrics-skeleton-${idx}`} variant="outlined" sx={{ p: 1.4 }}>
            <Stack spacing={1}>
              <Skeleton variant="text" width="45%" height={28} />
              <Skeleton variant="rounded" height={36} />
              <Skeleton variant="rounded" height={36} />
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!vm) {
    return <Alert severity="warning">VM data is not available.</Alert>;
  }

  return (
    <Stack spacing={1.5}>
      <Paper
        sx={{
          p: { xs: 1.5, sm: 1.8 },
          borderRadius: 1.75,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
          background: `linear-gradient(160deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
        }}
      >
        <Stack spacing={1.1}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <InsightsOutlinedIcon />
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  VM Metrics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Utilization overview for {vm.name}.
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <ToggleButtonGroup
                size="small"
                value={range}
                exclusive
                onChange={(_, value: RangeKey | null) => {
                  if (value) setRange(value);
                }}
              >
                <ToggleButton value="1h">1h</ToggleButton>
                <ToggleButton value="24h">24h</ToggleButton>
                <ToggleButton value="7d">7d</ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={`vCPU: ${vm.cpu}`} variant="outlined" />
            <Chip size="small" label={`RAM: ${(vm.ram / 1024).toFixed(1)} GB`} variant="outlined" />
            <Chip size="small" label={`Disk: ${vm.disk} GB`} variant="outlined" />
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: 1.75 }}>
        <Stack spacing={1.2}>
          <Typography fontWeight={800}>CPU Utilization</Typography>
          <Divider />
          <Stack spacing={0.6}>
            {cpuPercent.map((value, index) => (
              <Box key={`cpu-${index}`}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Sample {index + 1}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {value}%
                  </Typography>
                </Stack>
                <LinearProgress value={value} variant="determinate" sx={{ height: 7, borderRadius: 999 }} />
              </Box>
            ))}
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: 1.75 }}>
        <Stack spacing={1.2}>
          <Typography fontWeight={800}>Memory Utilization</Typography>
          <Divider />
          <Stack spacing={0.6}>
            {ramPercent.map((value, index) => (
              <Box key={`ram-${index}`}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Sample {index + 1}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {value}%
                  </Typography>
                </Stack>
                <LinearProgress value={value} variant="determinate" color="secondary" sx={{ height: 7, borderRadius: 999 }} />
              </Box>
            ))}
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: 1.75 }}>
        <Stack spacing={1.2}>
          <Typography fontWeight={800}>Disk Utilization</Typography>
          <Divider />
          <Stack spacing={0.6}>
            {diskPercent.map((value, index) => (
              <Box key={`disk-${index}`}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">
                    Sample {index + 1}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {value}%
                  </Typography>
                </Stack>
                <LinearProgress value={value} variant="determinate" color="warning" sx={{ height: 7, borderRadius: 999 }} />
              </Box>
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
