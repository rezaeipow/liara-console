import type { Vm } from "@/api/types";
import type { Dispatch, SetStateAction } from "react";
import type { Theme } from "@mui/material/styles";
import type { MouseEvent } from "react";
import type { ViewMode } from "@/shared/types/view";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type VmLayoutContext = {
  vm: Vm | null;
  isLoading: boolean;
  error: string | null;
  setVm: Dispatch<SetStateAction<Vm | null>>;
};

export type ProjectVmsStatusFilter = "all" | Vm["status"];
export type ProjectVmsSortMode = "name-asc" | "name-desc" | "cpu-desc" | "ram-desc";
export type VmActionType = "start" | "stop" | "reboot" | "delete";
export type ProjectVmsPendingAction = {
  vmId: string;
  type: VmActionType;
};
export type RangeKey = "1h" | "24h" | "7d";

export type VmMetricsHeaderProps = {
  theme: Theme;
  vmName: string;
  range: RangeKey;
  refreshing: boolean;
  onRangeChange: (value: RangeKey) => void;
  onRefresh: () => void;
  cpu: number;
  ram: number;
  disk: number;
};

export type VmMetricSeriesCardProps = {
  title: string;
  color?: "primary" | "secondary" | "warning";
  series: number[];
};

export type VmOverviewActionLoading = "start" | "stop" | "reboot" | null;

export type VmOverviewNotice = {
  message: string;
  severity: "success" | "error" | "info";
} | null;

export type VmOverviewState = {
  vm: Vm | null;
  isLoading: boolean;
  error: string | null;
  actionLoading: VmOverviewActionLoading;
  notice: VmOverviewNotice;
  setNotice: Dispatch<SetStateAction<VmOverviewNotice>>;
  runAction: (type: "start" | "stop" | "reboot") => Promise<void>;
};

export type VmOverviewHeaderCardProps = {
  theme: Theme;
  vm: Vm;
};

export type VmOverviewActionsCardProps = {
  vm: Vm;
  actionLoading: VmOverviewActionLoading;
  onAction: (type: "start" | "stop" | "reboot") => void;
};

export type VmOverviewResourceCardProps = {
  vm: Vm;
};

export type VmSettingsPageState = {
  vm: Vm | null;
  isLoading: boolean;
  error: string | null;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  isRenaming: boolean;
  canRename: boolean;
  renameHelper: string;
  renameFieldError: string | null;
  onRename: () => void;
  restartDialogOpen: boolean;
  setRestartDialogOpen: Dispatch<SetStateAction<boolean>>;
  isRestarting: boolean;
  onRestart: () => Promise<void>;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  deleteConfirmText: string;
  setDeleteConfirmText: Dispatch<SetStateAction<string>>;
  deleteDisabled: boolean;
  isDeleting: boolean;
  deleteError: string | null;
  setDeleteError: Dispatch<SetStateAction<string | null>>;
  onDelete: () => Promise<void>;
  feedback: {
    open: boolean;
    severity: "success" | "error" | "info";
    message: string;
  };
  clearFeedback: () => void;
};

export type VmSettingsGeneralSectionProps = {
  vm: Vm | null;
  isLoading: boolean;
  name: string;
  onNameChange: (value: string) => void;
  renameHelper: string;
  renameFieldError: string | null;
  canRename: boolean;
  isRenaming: boolean;
  onRename: () => void;
};

export type VmSettingsRuntimeSectionProps = {
  vm: Vm | null;
  isLoading: boolean;
  onOpenRestartDialog: () => void;
};

export type VmSettingsDangerSectionProps = {
  vm: Vm | null;
  isLoading: boolean;
  onOpenDeleteDialog: () => void;
};

export type ProjectVmsSummary = {
  total: number;
  running: number;
  stopped: number;
  totalCpu: number;
  totalRam: number;
};

export type ProjectVmsCreateFormState = {
  name: string;
  cpu: string;
  ram: string;
  disk: string;
};

export type ProjectVmsPageState = {
  projectId: string | undefined;
  query: string;
  statusFilter: ProjectVmsStatusFilter;
  sortMode: ProjectVmsSortMode;
  viewMode: ViewMode;
  vms: Vm[];
  filteredVms: Vm[];
  summary: ProjectVmsSummary;
  isLoading: boolean;
  isCreating: boolean;
  isDeleting: boolean;
  actionLoadingId: string | null;
  createDialogOpen: boolean;
  confirmOpen: boolean;
  pendingAction: ProjectVmsPendingAction | null;
  menuVmId: string | null;
  menuAnchorEl: HTMLElement | null;
  error: FetchBaseQueryError | SerializedError | undefined;
  errorMessage: string | undefined;
  feedback: {
    open: boolean;
    severity: "success" | "error" | "info";
    message: string;
  };
  createForm: ProjectVmsCreateFormState;
  createFormErrors: {
    name: string | null;
    cpu: string | null;
    ram: string | null;
    disk: string | null;
  };
  canCreateVm: boolean;
  setCreateDialogOpen: Dispatch<SetStateAction<boolean>>;
  setConfirmOpen: Dispatch<SetStateAction<boolean>>;
  setCreateForm: Dispatch<SetStateAction<ProjectVmsCreateFormState>>;
  setMenuAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
  setMenuVmId: Dispatch<SetStateAction<string | null>>;
  refresh: () => void;
  setQueryParam: (key: string, value: string, defaultValue?: string) => void;
  setStatusFilter: (value: ProjectVmsStatusFilter) => void;
  setSortMode: (value: ProjectVmsSortMode) => void;
  askAction: (vmId: string, type: VmActionType) => void;
  closeConfirm: () => void;
  runAction: () => Promise<void>;
  handleCreateVm: () => Promise<void>;
  clearFeedback: () => void;
};

export type ProjectVmsHeaderActionsProps = {
  projectId: string | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenCreate: () => void;
};

export type ProjectVmsSummaryProps = {
  summary: ProjectVmsSummary;
};

export type ProjectVmsFilterBarProps = {
  theme: Theme;
  query: string;
  statusFilter: ProjectVmsStatusFilter;
  sortMode: ProjectVmsSortMode;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProjectVmsStatusFilter) => void;
  onSortChange: (value: ProjectVmsSortMode) => void;
};

export type ProjectVmsCardsViewProps = {
  theme: Theme;
  items: Vm[];
  actionLoadingId: string | null;
  onAskAction: (vmId: string, type: VmActionType) => void;
  onOpenMenu: (event: MouseEvent<HTMLElement>, vmId: string) => void;
};

export type ProjectVmCardProps = {
  theme: Theme;
  vm: Vm;
  actionLoadingId: string | null;
  onAskAction: (vmId: string, type: VmActionType) => void;
  onOpenMenu: (event: MouseEvent<HTMLElement>, vmId: string) => void;
};

export type ProjectVmsTableViewProps = {
  items: Vm[];
  actionLoadingId: string | null;
  onAskAction: (vmId: string, type: VmActionType) => void;
};

export type ProjectVmsContentProps = {
  theme: Theme;
  state: ProjectVmsPageState;
  onOpenCreate: () => void;
  onClearFilters: () => void;
  onOpenMenu: (event: MouseEvent<HTMLElement>, vmId: string) => void;
};

export type ProjectVmsDialogsProps = {
  state: ProjectVmsPageState;
  pendingVmName: string;
  confirmTitle: string;
  confirmMessage: string;
};

export type ProjectVmsCreateDialogProps = {
  state: ProjectVmsPageState;
};

export type ProjectVmsActionsMenuProps = {
  menuAnchorEl: HTMLElement | null;
  menuVmId: string | null;
  actionLoadingId: string | null;
  onClose: () => void;
  onDelete: (vmId: string) => void;
};
