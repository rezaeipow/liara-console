import { Skeleton, Stack } from "@mui/material";
import type { AppOverviewLoadingProps } from "@/shared/types/appsComponents";

export default function AppOverviewLoading({ isLoading }: AppOverviewLoadingProps) {
  if (!isLoading) return null;
  return (
    <Stack spacing={1.2}>
      <Skeleton variant="text" width={220} height={30} />
      <Skeleton variant="rounded" height={86} />
      <Skeleton variant="rounded" height={86} />
    </Stack>
  );
}
