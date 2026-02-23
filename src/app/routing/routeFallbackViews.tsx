import { Box, CircularProgress, Paper, Skeleton, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { ListSkeletonCardProps } from "./types";

function HeroSkeletonCard() {
  const theme = useTheme();
  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: { xs: 1.5, sm: 2 }, border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`, background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.16)}, ${alpha(theme.palette.secondary.main, 0.1)})`, backdropFilter: glassBackdrop.hero }}>
      <Stack spacing={1}>
        <Skeleton variant="text" width={220} height={40} />
        <Skeleton variant="text" width="58%" height={24} />
      </Stack>
    </Paper>
  );
}

function ListSkeletonCard({ count }: ListSkeletonCardProps) {
  const theme = useTheme();
  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: { xs: 1.5, sm: 2 }, border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`, background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.74)}, ${alpha(theme.palette.common.white, 0.56)})`, backdropFilter: glassBackdrop.card }}>
      <Stack spacing={1}>{Array.from({ length: count }).map((_, index) => <Skeleton key={`route-fallback-${index}`} variant="rounded" height={56} />)}</Stack>
    </Paper>
  );
}

export function RouteLoader() {
  return <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}><CircularProgress size={24} /></Box>;
}

export function BillingInitialSkeleton() {
  return (
    <Stack spacing={2} sx={{ width: "100%", maxWidth: { xs: "100%", sm: 980, lg: 1080 }, mx: "auto", mt: { xs: 1.25, sm: 1.5 }, px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 } }}>
      <HeroSkeletonCard />
      <ListSkeletonCard count={4} />
    </Stack>
  );
}

export function ConsoleInitialSkeleton() {
  return (
    <Stack spacing={2} sx={{ width: "100%", maxWidth: { xs: "100%", sm: 1080, lg: 1220 }, mx: "auto", mt: { xs: 1.25, sm: 1.5 }, px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 } }}>
      <HeroSkeletonCard />
      <ListSkeletonCard count={5} />
    </Stack>
  );
}
