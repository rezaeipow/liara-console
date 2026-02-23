import type { AppService } from "@/api/types";
import type {
  AppMeta,
  ProjectAppsSortMode,
  ProjectAppsStatusFilter,
} from "./pageTypes";

export const regionOptions = ["ir-thr", "tr-ist", "de-fra", "us-nyc"];
export const planOptions = ["starter", "basic", "pro", "business"];
export const statusOptions: ProjectAppsStatusFilter[] = [
  "all",
  "running",
  "deploying",
  "failed",
];
export const sortOptions: ProjectAppsSortMode[] = [
  "latest",
  "name-asc",
  "name-desc",
  "status",
];

export function statusRank(status: AppService["status"]) {
  if (status === "failed") return 0;
  if (status === "deploying") return 1;
  return 2;
}

export function getVisibleApps(
  apps: AppService[],
  metaByAppId: Record<string, AppMeta>,
  q: string,
  statusFilter: ProjectAppsStatusFilter,
  sortMode: ProjectAppsSortMode,
) {
  const query = q.trim().toLowerCase();
  const next = apps.filter((app) => {
    const matchesQuery = query ? app.name.toLowerCase().includes(query) : true;
    const matchesStatus =
      statusFilter === "all" ? true : app.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  next.sort((left, right) => {
    if (sortMode === "name-asc") return left.name.localeCompare(right.name);
    if (sortMode === "name-desc") return right.name.localeCompare(left.name);
    if (sortMode === "status")
      return statusRank(left.status) - statusRank(right.status);
    const leftTime = new Date(
      metaByAppId[left.id]?.lastDeploymentAt ?? 0,
    ).getTime();
    const rightTime = new Date(
      metaByAppId[right.id]?.lastDeploymentAt ?? 0,
    ).getTime();
    return rightTime - leftTime;
  });

  return next;
}
