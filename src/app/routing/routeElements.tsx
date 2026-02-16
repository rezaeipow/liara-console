import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { RouteErrorPage } from "./pages";

function RouteLoader() {
  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <CircularProgress size={24} />
    </Box>
  );
}

export function RouteFallback() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <RouteErrorPage />
    </Suspense>
  );
}
