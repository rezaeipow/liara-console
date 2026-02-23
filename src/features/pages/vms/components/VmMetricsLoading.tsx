import { Paper, Skeleton, Stack } from "@mui/material";

export default function VmMetricsLoading() {
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
