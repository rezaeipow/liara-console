import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import { Box, Divider, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { deriveMockUsage, formatMemory } from "../vmOverviewUtils";
import type { VmOverviewResourceCardProps } from "../pageTypes";

export default function VmOverviewResourceCard(props: VmOverviewResourceCardProps) {
  const { vm } = props;
  const usage = deriveMockUsage(vm.id, vm.cpu, vm.ram, vm.disk);
  const cpuPercent = Math.round((usage.cpuUsed / vm.cpu) * 100);
  const ramPercent = Math.round((usage.ramUsed / vm.ram) * 100);
  const diskPercent = Math.round((usage.diskUsed / vm.disk) * 100);

  return (
    <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: 1.75 }}>
      <Stack spacing={1.1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <MemoryOutlinedIcon />
          <Typography fontWeight={800}>Resource Snapshot</Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Usage values are mock telemetry generated deterministically for this demo.
        </Typography>
        <Divider />

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">CPU</Typography>
            <Typography variant="caption" color="text.secondary">
              {usage.cpuUsed}/{vm.cpu} vCPU ({cpuPercent}%)
            </Typography>
          </Stack>
          <LinearProgress value={cpuPercent} variant="determinate" sx={{ mt: 0.5, height: 8, borderRadius: 999 }} />
        </Box>

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">RAM</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatMemory(usage.ramUsed)}/{formatMemory(vm.ram)} ({ramPercent}%)
            </Typography>
          </Stack>
          <LinearProgress
            value={ramPercent}
            variant="determinate"
            sx={{ mt: 0.5, height: 8, borderRadius: 999 }}
            color="secondary"
          />
        </Box>

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">Disk</Typography>
            <Typography variant="caption" color="text.secondary">
              {usage.diskUsed}/{vm.disk} GB ({diskPercent}%)
            </Typography>
          </Stack>
          <LinearProgress
            value={diskPercent}
            variant="determinate"
            sx={{ mt: 0.5, height: 8, borderRadius: 999 }}
            color="warning"
          />
        </Box>
      </Stack>
    </Paper>
  );
}
