import { Skeleton, Stack } from "@mui/material";
import type { ConsoleResourceLayoutHeaderLoadingProps } from "./types";

export default function ConsoleResourceLayoutHeaderLoading({ isLoading }: ConsoleResourceLayoutHeaderLoadingProps) {
  if (!isLoading) return null;
  return (
    <Stack spacing={0.9}>
      <Skeleton variant="text" width={220} height={36} />
      <Skeleton variant="text" width={180} />
      <Stack direction="row" spacing={0.8}>
        <Skeleton variant="rounded" width={88} height={24} />
        <Skeleton variant="rounded" width={82} height={24} />
        <Skeleton variant="rounded" width={96} height={24} />
      </Stack>
    </Stack>
  );
}
