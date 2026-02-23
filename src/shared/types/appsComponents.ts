import type { AppService, Deployment } from "@/api/types";
import type { Theme } from "@mui/material/styles";
import type { ViewMode } from "@/shared/types/view";
import type { AppMeta, ProjectAppsSortMode, ProjectAppsStatusFilter } from "@/features/pages/apps/pageTypes";
import type { EnvRow, RowErrors, LogItem, LogLevel } from "@/features/pages/apps/pageTypes";
import type { AppSettingsActionData } from "@/features/pages/apps/appSettingsData";

export type ProjectAppsHeaderActionsProps = {
  projectId: string | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenCreate: () => void;
};

export type ProjectAppsSummaryProps = {
  theme: Theme;
  summary: {
    total: number;
    running: number;
    deploying: number;
    failed: number;
    attention: number;
  };
};

export type ProjectAppsFilterBarProps = {
  theme: Theme;
  q: string;
  statusFilter: ProjectAppsStatusFilter;
  sortMode: ProjectAppsSortMode;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProjectAppsStatusFilter) => void;
  onSortChange: (value: ProjectAppsSortMode) => void;
};

export type ProjectAppsCardsViewProps = {
  apps: AppService[];
  metaByAppId: Record<string, AppMeta>;
  projectId: string | undefined;
  theme: Theme;
  actionLoadingId: string | null;
  onRestart: (appId: string) => void;
  onOpenDelete: (appId: string) => void;
};

export type ProjectAppsTableViewProps = {
  apps: AppService[];
  metaByAppId: Record<string, AppMeta>;
  projectId: string | undefined;
  theme: Theme;
  actionLoadingId: string | null;
  onRestart: (appId: string) => void;
  onOpenDelete: (appId: string) => void;
};

export type ProjectAppsDirectoryPanelProps = {
  theme: Theme;
  isLoading: boolean;
  appsCount: number;
  visibleApps: AppService[];
  metaByAppId: Record<string, AppMeta>;
  viewMode: ViewMode;
  projectId: string | undefined;
  actionLoadingId: string | null;
  onRestart: (appId: string) => void;
  onOpenDelete: (appId: string) => void;
  onOpenCreate: () => void;
  onClearFilters: () => void;
};

export type ProjectAppsActivityPanelProps = {
  theme: Theme;
  activity: Array<{
    appId: string;
    appName: string;
    status: Deployment["status"];
    createdAt: string | null;
  }>;
  visible: boolean;
};

export type ProjectAppsCreateDialogProps = {
  open: boolean;
  isCreating: boolean;
  canCreate: boolean;
  name: string;
  region: string;
  plan: string;
  regionOptions: string[];
  planOptions: string[];
  onClose: () => void;
  onSubmit: () => void;
  onNameChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onPlanChange: (value: string) => void;
};

export type ProjectAppsDeleteDialogProps = {
  open: boolean;
  isDeleting: boolean;
  targetName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export type ProjectAppsMainContentProps = {
  viewMode: ViewMode;
  theme: Theme;
  isLoading: boolean;
  appsCount: number;
  visibleApps: AppService[];
  metaByAppId: Record<string, AppMeta>;
  projectId: string | undefined;
  actionLoadingId: string | null;
  onRestart: (appId: string) => void;
  onOpenDelete: (appId: string) => void;
  onOpenCreate: () => void;
  onClearFilters: () => void;
  activity: Array<{
    appId: string;
    appName: string;
    status: Deployment["status"];
    createdAt: string | null;
  }>;
};

export type ProjectAppsDialogsProps = {
  createDialogOpen: boolean;
  isCreating: boolean;
  canCreate: boolean;
  name: string;
  region: string;
  plan: string;
  regionOptions: string[];
  planOptions: string[];
  onCloseCreate: () => void;
  onSubmitCreate: () => void;
  onNameChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onPlanChange: (value: string) => void;
  deleteDialogOpen: boolean;
  isDeleting: boolean;
  targetName: string;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
};

export type ProjectAppsDialogsWithFeedbackProps = ProjectAppsDialogsProps & {
  feedback: {
    open: boolean;
    severity: "success" | "error" | "info";
    message: string;
  };
  onCloseFeedback: () => void;
};

export type AppDeploymentsHeaderProps = {
  viewMode: ViewMode;
  onViewChange: (value: ViewMode) => void;
  onRefresh: () => void;
  isLoading: boolean;
};

export type AppDeploymentsStatsProps = {
  stats: { total: number; success: number; failed: number; running: number };
  isLoading: boolean;
};

export type AppDeploymentsLatestProps = {
  latest: Deployment | null;
  isLoading: boolean;
  theme: Theme;
  formatDate: (value: string) => string;
};

export type AppDeploymentsFilterBarProps = {
  theme: Theme;
  statusFilter: "all" | Deployment["status"];
  sortOrder: "newest" | "oldest";
  onStatusChange: (value: "all" | Deployment["status"]) => void;
  onSortChange: (value: "newest" | "oldest") => void;
};

export type AppDeploymentsErrorProps = {
  error: string | null;
  onRetry: () => void;
};

export type AppDeploymentsCardsProps = {
  items: Deployment[];
  theme: Theme;
  formatDate: (value: string) => string;
};

export type AppDeploymentsTableProps = {
  items: Deployment[];
  formatDate: (value: string) => string;
};

export type AppDeploymentsViewStateProps = {
  isLoading: boolean;
  hasAnyItems: boolean;
  filteredItems: Deployment[];
  viewMode: ViewMode;
  onRetry: () => void;
  onClearFilters: () => void;
  theme: Theme;
  formatDate: (value: string) => string;
};

export type AppEnvHeaderProps = {
  isSaving: boolean;
  hasValidationError: boolean;
  onAddRow: () => void;
  onSave: () => void;
};

export type AppEnvVisibilityToggleProps = {
  hasSecretRows: boolean;
  revealSecrets: boolean;
  onToggle: (next: boolean) => void;
};

export type AppEnvAlertsProps = {
  notice: string | null;
  error: string | null;
  hasValidationError: boolean;
  isLoading: boolean;
  onRetry: () => void;
};

export type AppEnvRowItemProps = {
  row: EnvRow;
  index: number;
  errors: RowErrors | undefined;
  revealSecrets: boolean;
  onUpdate: (rowId: string, patch: Partial<EnvRow>) => void;
  onRemove: (rowId: string) => void;
  theme: Theme;
};

export type AppEnvRowsProps = {
  rows: EnvRow[];
  rowErrors: Record<string, RowErrors>;
  revealSecrets: boolean;
  onUpdate: (rowId: string, patch: Partial<EnvRow>) => void;
  onRemove: (rowId: string) => void;
  theme: Theme;
};

export type AppEnvContentProps = {
  isLoading: boolean;
  rows: EnvRow[];
  rowErrors: Record<string, RowErrors>;
  revealSecrets: boolean;
  onUpdate: (rowId: string, patch: Partial<EnvRow>) => void;
  onRemove: (rowId: string) => void;
  theme: Theme;
};

export type AppLogsHeaderProps = {
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onClear: () => void;
};

export type AppLogsControlsProps = {
  level: LogLevel;
  autoStream: boolean;
  lastUpdatedAt: string | null;
  onLevelChange: (value: LogLevel) => void;
  onAutoStreamChange: (value: boolean) => void;
  formatDateTime: (value: string) => string;
};

export type AppLogsErrorProps = {
  error: string | null;
  onRetry: () => void;
};

export type AppLogsContentProps = {
  isLoading: boolean;
  logs: LogItem[];
  theme: Theme;
  formatDateTime: (value: string) => string;
};

export type AppOverviewLoadingProps = {
  isLoading: boolean;
};

export type AppOverviewCardsProps = {
  appStatus: AppService["status"];
  deploymentsCount: number | null;
  envCount: number | null;
  theme: Theme;
};

export type AppSettingsHeaderProps = {
  error: string | null;
};

export type AppSettingsGeneralSectionProps = {
  name: string;
  helperText: string;
  isRenaming: boolean;
  isLoading: boolean;
  hasApp: boolean;
  canRename: boolean;
  renameError: string | undefined;
  region: string | undefined;
  plan: string | undefined;
  onNameChange: (value: string) => void;
  onRename: () => void;
};

export type AppSettingsRuntimeSectionProps = {
  disabled: boolean;
  onOpenRestart: () => void;
};

export type AppSettingsDangerSectionProps = {
  disabled: boolean;
  onOpenDelete: () => void;
};

export type AppSettingsDialogsProps = {
  appName: string;
  restartDialogOpen: boolean;
  isRestarting: boolean;
  onCloseRestart: () => void;
  onConfirmRestart: () => void;
  deleteDialogOpen: boolean;
  deleteConfirmText: string;
  isDeleting: boolean;
  deleteDisabled: boolean;
  deleteError: string | null;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  onDeleteConfirmTextChange: (value: string) => void;
};

export type AppSettingsState = {
  appName: string;
  appRegion: string | undefined;
  appPlan: string | undefined;
  hasApp: boolean;
  isLoading: boolean;
  error: string | null;
  name: string;
  renameHelper: string;
  canRename: boolean;
  renameData: AppSettingsActionData | undefined;
  isRenaming: boolean;
  restartDialogOpen: boolean;
  isRestarting: boolean;
  deleteDialogOpen: boolean;
  deleteConfirmText: string;
  isDeleting: boolean;
  deleteError: string | null;
  deleteDisabled: boolean;
  feedback: {
    open: boolean;
    severity: "success" | "error" | "info";
    message: string;
  };
  setName: (value: string) => void;
  setRestartDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setDeleteConfirmText: (value: string) => void;
  clearFeedback: () => void;
  closeDeleteDialog: () => void;
  handleRename: () => Promise<void>;
  handleRestart: () => Promise<void>;
  handleDelete: () => Promise<void>;
};
