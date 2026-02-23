import { Paper, Skeleton, Stack } from "@mui/material";

export default function ProjectSummaryCardSkeleton() {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: { xs: 1.25, sm: 1.75 } }}>
      <Stack spacing={1.1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width="62%" height={28} />
          <Skeleton variant="rounded" width={64} height={24} />
        </Stack>
        <Skeleton variant="rounded" height={62} />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" height={46} sx={{ flex: 1 }} />
          <Skeleton variant="rounded" height={46} sx={{ flex: 1 }} />
        </Stack>
        <Skeleton variant="rounded" height={36} />
      </Stack>
    </Paper>
  );
}
