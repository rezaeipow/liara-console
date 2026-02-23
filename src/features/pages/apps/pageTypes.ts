import type { AppService, Deployment } from "@/api/types";
import type { Dispatch, SetStateAction } from "react";
import type { StatusChipTone } from "@/shared/ui/statusChipSx";

export type AppLayoutContext = {
  app: AppService | null;
  isLoading: boolean;
  error: string | null;
  setApp: Dispatch<SetStateAction<AppService | null>>;
};

export type AppLayoutPageState = {
  app: AppService | null;
  isLoading: boolean;
  error: string | null;
  projectAppsHref: string | null;
  statusChipTone: StatusChipTone;
  setApp: Dispatch<SetStateAction<AppService | null>>;
};

export type ProjectAppsStatusFilter = "all" | AppService["status"];
export type ProjectAppsSortMode =
  | "latest"
  | "name-asc"
  | "name-desc"
  | "status";
export type AppDeploymentsStatusFilter = "all" | Deployment["status"];
export type AppDeploymentsSortOrder = "newest" | "oldest";

export type AppMeta = {
  totalDeployments: number;
  lastDeploymentAt: string | null;
  lastDeploymentStatus: Deployment["status"] | null;
};

export type LogLevel = "all" | "info" | "warn" | "error";
export type LogItem = {
  id: string;
  appId: string;
  level: string;
  message: string;
  fetchedAt: string;
};

export type EnvRow = {
  id: string;
  key: string;
  value: string;
  secret: boolean;
};

export type RowErrors = {
  key?: string;
  value?: string;
};
