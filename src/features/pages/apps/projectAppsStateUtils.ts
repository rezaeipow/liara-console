import type { AppService, Deployment } from "@/api/types";
import type { AppMeta } from "./pageTypes";

export function buildMetaByAppId(apps: AppService[], deployments: Deployment[]) {
  const grouped = deployments.reduce<Record<string, Deployment[]>>((acc, item) => {
    if (!acc[item.appId]) acc[item.appId] = [];
    acc[item.appId].push(item);
    return acc;
  }, {});

  return Object.fromEntries(
    apps.map((app) => {
      const sorted = [...(grouped[app.id] ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latest = sorted[0];
      const meta: AppMeta = { totalDeployments: sorted.length, lastDeploymentAt: latest?.createdAt ?? null, lastDeploymentStatus: latest?.status ?? null };
      return [app.id, meta];
    }),
  );
}

export function buildProjectAppsSummary(apps: AppService[]) {
  return {
    total: apps.length,
    running: apps.filter((a) => a.status === "running").length,
    deploying: apps.filter((a) => a.status === "deploying").length,
    failed: apps.filter((a) => a.status === "failed").length,
    attention: apps.filter((a) => a.status !== "running").length,
  };
}

export function buildProjectAppsActivity(apps: AppService[], metaByAppId: Record<string, AppMeta>) {
  return apps
    .map((app) => ({ appId: app.id, appName: app.name, status: metaByAppId[app.id]?.lastDeploymentStatus ?? "running", createdAt: metaByAppId[app.id]?.lastDeploymentAt }))
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5);
}

export function getProjectAppsErrorMessage(error: unknown) {
  if (!error) return undefined;
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    return data?.message ?? "Could not load apps.";
  }
  return "Could not load apps.";
}
