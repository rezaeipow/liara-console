import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { ProjectListItem } from "../projectsData";
import type { ProjectCreateActionData, ProjectCreateLoaderData } from "../projectsData";

export type ServiceCountCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  theme: Theme;
};

export type ProjectSummaryCardProps = {
  project: ProjectListItem;
  theme: Theme;
  dateFormatter: Intl.DateTimeFormat;
};

export type NewProjectFormProps = {
  actionData: ProjectCreateActionData | undefined;
  loaderData: ProjectCreateLoaderData;
  defaultRegion: string;
  defaultPlan: string;
  isSubmitting: boolean;
};

export type NewProjectSetupPreviewProps = {
  defaultRegion: string;
  defaultPlan: string;
};
