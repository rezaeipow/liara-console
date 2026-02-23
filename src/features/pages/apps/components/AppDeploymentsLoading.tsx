import { Paper, Skeleton, Stack } from "@mui/material";

export default function AppDeploymentsLoading() {
  return (
    <Stack spacing={1}>
      {Array.from({ length: 3 }).map((_, idx) => (
        <Paper
          key={`deployment-skeleton-${idx}`}
          variant="outlined"
          sx={{ p: 1.4, borderRadius: 1.5 }}
        >
          <Stack spacing={0.8}>
            <Stack direction="row" justifyContent="space-between">
              <Skeleton variant="text" width="36%" />
              <Skeleton variant="rounded" width={82} height={24} />
            </Stack>
            <Skeleton variant="text" width="52%" />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
