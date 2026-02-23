import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { ProjectOverviewActionData, ProjectOverviewLoaderData } from "./projectsData";
import type { ProjectListItem, ProjectsLoaderData } from "./projectsData";

export type ProjectHealthFilter = "all" | "healthy" | "provisioning";
export type ProjectSortMode = "created-desc" | "created-asc" | "name-asc" | "name-desc";

export type ProjectsPageState = {
  data: ProjectsLoaderData;
  isLoading: boolean;
  searchInput: string;
  healthFilter: ProjectHealthFilter;
  sortMode: ProjectSortMode;
  visibleItems: ProjectListItem[];
  pageSummary: string;
  dateFormatter: Intl.DateTimeFormat;
  onSearchInputChange: (value: string) => void;
  onChangeQuery: (value: string) => void;
  onChangeHealth: (value: ProjectHealthFilter) => void;
  onChangeSort: (value: ProjectSortMode) => void;
  onClearHealth: () => void;
  loadMore: () => void;
};

export type ProjectsHeroProps = {
  theme: Theme;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
};

export type ProjectsDirectorySectionProps = {
  theme: Theme;
  isLoading: boolean;
  data: ProjectsLoaderData;
  visibleItems: ProjectListItem[];
  healthFilter: ProjectHealthFilter;
  sortMode: ProjectSortMode;
  pageSummary: string;
  dateFormatter: Intl.DateTimeFormat;
  onChangeQuery: (value: string) => void;
  onChangeHealth: (value: ProjectHealthFilter) => void;
  onChangeSort: (value: ProjectSortMode) => void;
  onClearHealth: () => void;
  loadMore: () => void;
};

export type ProjectOverviewMetricCard = {
  id: string;
  icon: ReactNode;
  label: string;
  value: string | number;
  description?: string;
  href?: string;
  hrefLabel?: string;
  hrefIcon?: ReactNode;
};

export type ProjectOverviewState = {
  data: ProjectOverviewLoaderData;
  actionData?: ProjectOverviewActionData;
  isSubmitting: boolean;
  actionIntent: string;
  renameDialogOpen: boolean;
  deleteDialogOpen: boolean;
  deleteConfirmText: string;
  nextProjectName: string;
  createdAt: string;
  isHealthy: boolean;
  renameError?: string;
  deleteDisabled: boolean;
  overviewCards: ProjectOverviewMetricCard[];
  formatActivityDate: (value: string) => string;
  feedbackOpen: boolean;
  feedbackSeverity: "success" | "error" | "info" | "warning";
  feedbackMessage: string;
  onOpenRenameDialog: () => void;
  onCloseRenameDialog: () => void;
  onNextProjectNameChange: (value: string) => void;
  onSubmitRename: () => void;
  onOpenDeleteDialog: () => void;
  onCloseDeleteDialog: () => void;
  onDeleteConfirmTextChange: (value: string) => void;
  onSubmitDelete: () => void;
  onFeedbackClose: () => void;
};

export type ProjectOverviewHeroProps = {
  projectName: string;
  projectRegion: string;
  projectPlan: string;
  createdAt: string;
  isHealthy: boolean;
  onRenameClick: () => void;
  onDeleteClick: () => void;
};

export type ProjectOverviewMetricsGridProps = {
  cards: ProjectOverviewMetricCard[];
};

export type ProjectOverviewActivitySectionProps = {
  items: Array<{ id: string; title: string; createdAt: string }>;
  formatDateTime: (value: string) => string;
};

export type ProjectOverviewDialogsProps = {
  openRename: boolean;
  openDelete: boolean;
  nextProjectName: string;
  renameError?: string;
  isSubmitting: boolean;
  actionIntent: string;
  deleteConfirmText: string;
  deleteDisabled: boolean;
  projectName: string;
  onCloseRename: () => void;
  onSubmitRename: () => void;
  onNameChange: (value: string) => void;
  onCloseDelete: () => void;
  onDeleteConfirmTextChange: (value: string) => void;
  onSubmitDelete: () => void;
};

export type ProjectsDirectoryHeaderProps = {
  title: string;
  createProjectLabel: string;
};

export type ProjectsDirectoryFiltersProps = {
  theme: Theme;
  healthFilter: ProjectHealthFilter;
  sortMode: ProjectSortMode;
  onChangeHealth: (value: ProjectHealthFilter) => void;
  onChangeSort: (value: ProjectSortMode) => void;
};

export type ProjectsDirectoryContentProps = {
  theme: Theme;
  isLoading: boolean;
  data: ProjectsLoaderData;
  visibleItems: ProjectListItem[];
  dateFormatter: Intl.DateTimeFormat;
  onChangeQuery: (value: string) => void;
  onClearHealth: () => void;
};

export type ProjectsDirectoryFooterProps = {
  pageSummary: string;
  isLoading: boolean;
  hasMore: boolean;
  hasQuery: boolean;
  onLoadMore: () => void;
};
