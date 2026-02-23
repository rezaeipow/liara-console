import { Chip, Stack } from "@mui/material";
import type { ProjectVmsSummaryProps } from "../pageTypes";
import { formatMemory } from "../projectVmsUtils";

export default function ProjectVmsSummary(props: ProjectVmsSummaryProps) {
  const { summary } = props;

  return (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
      <Chip size="small" label={`Total: ${summary.total}`} variant="outlined" />
      <Chip size="small" label={`Running: ${summary.running}`} variant="outlined" />
      <Chip size="small" label={`Stopped: ${summary.stopped}`} variant="outlined" />
      <Chip size="small" label={`vCPU: ${summary.totalCpu}`} variant="outlined" />
      <Chip size="small" label={`RAM: ${formatMemory(summary.totalRam)}`} variant="outlined" />
    </Stack>
  );
}
