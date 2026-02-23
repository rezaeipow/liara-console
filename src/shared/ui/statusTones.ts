import type { AppService, Deployment, Vm } from "@/api/types";
import type { StatusChipTone } from "./statusChipSx";

export type AppLikeStatus = AppService["status"] | Deployment["status"];

export function getAppLikeStatusTone(status: AppLikeStatus): StatusChipTone {
  if (status === "running" || status === "success") return "success";
  if (status === "deploying") return "warning";
  return "error";
}

export function getDeploymentStatusTone(status: Deployment["status"]): StatusChipTone {
  if (status === "success") return "success";
  if (status === "running") return "warning";
  return "error";
}

export function getDeploymentFilterTone(status: "all" | Deployment["status"]): StatusChipTone {
  if (status === "all") return "neutral";
  return getDeploymentStatusTone(status);
}

export function getVmStatusTone(status: Vm["status"]): StatusChipTone {
  return status === "running" ? "success" : "neutral";
}

export function getTicketStatusTone(
  status: "open" | "pending" | "closed",
): "warning" | "info" | "success" {
  if (status === "open") return "warning";
  if (status === "pending") return "info";
  return "success";
}
