import { Box, CircularProgress, Paper, Skeleton, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Suspense } from "react";
import { glassBackdrop } from "../../shared/ui/glassTokens";
import { RouteErrorPage } from "./pages";

function RouteLoader() {
  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <CircularProgress size={24} />
    </Box>
  );
}

function BillingInitialSkeleton() {
  const theme = useTheme();

  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 980, lg: 1080 },
        mx: "auto",
        mt: { xs: 1.25, sm: 1.5 },
        px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: { xs: 1.5, sm: 2 },
          border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
          background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.16)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          backdropFilter: glassBackdrop.hero,
        }}
      >
        <Stack spacing={1}>
          <Skeleton variant="text" width={180} height={40} />
          <Skeleton variant="text" width="50%" height={24} />
        </Stack>
      </Paper>

      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: { xs: 1.5, sm: 2 },
          border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
          background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.74)}, ${alpha(theme.palette.common.white, 0.56)})`,
          backdropFilter: glassBackdrop.card,
        }}
      >
        <Stack spacing={1}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`billing-initial-${index}`} variant="rounded" height={56} />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

function ConsoleInitialSkeleton() {
  const theme = useTheme();

  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 1080, lg: 1220 },
        mx: "auto",
        mt: { xs: 1.25, sm: 1.5 },
        px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: { xs: 1.5, sm: 2 },
          border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
          background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.16)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          backdropFilter: glassBackdrop.hero,
        }}
      >
        <Stack spacing={1}>
          <Skeleton variant="text" width={220} height={40} />
          <Skeleton variant="text" width="58%" height={24} />
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={96} height={28} />
            <Skeleton variant="rounded" width={104} height={28} />
          </Stack>
        </Stack>
      </Paper>

      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: { xs: 1.5, sm: 2 },
          border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
          background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.74)}, ${alpha(theme.palette.common.white, 0.56)})`,
          backdropFilter: glassBackdrop.card,
        }}
      >
        <Stack spacing={1}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`console-initial-${index}`} variant="rounded" height={56} />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

export function AppInitialFallback() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  if (pathname.startsWith("/console/billing")) {
    return <BillingInitialSkeleton />;
  }
  if (pathname.startsWith("/console")) {
    return <ConsoleInitialSkeleton />;
  }
  return <RouteLoader />;
}

export function RouteFallback() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <RouteErrorPage />
    </Suspense>
  );
}

