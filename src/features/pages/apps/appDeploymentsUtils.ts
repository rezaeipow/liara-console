import type { Deployment } from "@/api/types";
import { createMonthDayTimeFormatter } from "@/shared/utils/dateTime";

const dt = createMonthDayTimeFormatter();

export const appDeploymentsStatusOptions: Array<"all" | Deployment["status"]> = ["all", "success", "running", "failed"];
export const appDeploymentsSortOptions: Array<"newest" | "oldest"> = ["newest", "oldest"];

export function formatDeploymentDateTime(value: string) {
  return dt.format(new Date(value));
}

export function getDeploymentDetail(item: Deployment) {
  const idSeed = item.id.slice(-4);
  return {
    commit: `${item.version.replace(/\./g, "")}${idSeed}`.slice(0, 7),
    trigger: item.status === "running" ? "Auto deploy pipeline" : "Manual release",
    actor: item.status === "failed" ? "Release Engineer" : "CI Bot",
  };
}
