import { Box, CircularProgress, Paper, Skeleton, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Suspense } from "react";
import { RouteErrorPage } from "./pages";

function RouteLoader() {
  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <CircularProgress size={24} />
    </Box>
  );
}

function BillingInitialSkeleton() {
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
          border: `1px solid ${alpha("#1f6feb", 0.24)}`,
          background:
            "linear-gradient(120deg, rgba(31,111,235,0.16), rgba(14,165,164,0.10))",
          backdropFilter: "blur(14px)",
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
          border: `1px solid ${alpha("#1f6feb", 0.18)}`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.74), rgba(255,255,255,0.56))",
          backdropFilter: "blur(10px)",
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

export function AppInitialFallback() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  if (pathname.startsWith("/console/billing")) {
    return <BillingInitialSkeleton />;
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
