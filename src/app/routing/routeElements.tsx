import { Suspense } from "react";
import { RouteErrorPage } from "./pages";
import { BillingInitialSkeleton, ConsoleInitialSkeleton, RouteLoader } from "./routeFallbackViews";

export function AppInitialFallback() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  if (pathname.startsWith("/console/billing")) return <BillingInitialSkeleton />;
  if (pathname.startsWith("/console")) return <ConsoleInitialSkeleton />;
  return <RouteLoader />;
}

export function RouteFallback() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <RouteErrorPage />
    </Suspense>
  );
}
