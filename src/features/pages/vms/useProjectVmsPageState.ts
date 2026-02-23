import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateVmMutation,
  useDeleteVmMutation,
  useGetVmsByProjectQuery,
  useRebootVmMutation,
  useStartVmMutation,
  useStopVmMutation,
} from "@/app/store/api";
import { CARD_TABLE_VIEW_OPTIONS } from "@/shared/constants/viewOptions";
import { useFeedbackSnackbar } from "@/shared/hooks/useFeedbackSnackbar";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { useStatusSortQuery } from "@/shared/hooks/useStatusSortQuery";
import type { ViewMode } from "@/shared/types/view";
import type {
  ProjectVmsCreateFormState,
  ProjectVmsPageState,
  ProjectVmsSortMode,
  ProjectVmsStatusFilter,
} from "./pageTypes";
import {
  getFilteredVms,
  getProjectVmsErrorMessage,
  getProjectVmsSummary,
  PROJECT_VMS_SORT_OPTIONS,
  PROJECT_VMS_STATUS_OPTIONS,
} from "./projectVmsUtils";

const DEFAULT_CREATE_FORM: ProjectVmsCreateFormState = {
  name: "",
  cpu: "2",
  ram: "4096",
  disk: "40",
};

export function useProjectVmsPageState(): ProjectVmsPageState {
  const { projectId } = useParams();
  const { getEnumParam, getParam, setQueryParam } = useQueryParams();
  const statusSort = useStatusSortQuery({
    statusOptions: PROJECT_VMS_STATUS_OPTIONS,
    defaultStatus: "all",
    sortOptions: PROJECT_VMS_SORT_OPTIONS,
    defaultSort: "name-asc",
  });
  const {
    data: vmsResponse,
    isLoading,
    error,
    refetch,
  } = useGetVmsByProjectQuery(projectId ?? "", { skip: !projectId });
  const [startVm] = useStartVmMutation();
  const [stopVm] = useStopVmMutation();
  const [rebootVm] = useRebootVmMutation();
  const [createVm, { isLoading: isCreating }] = useCreateVmMutation();
  const [deleteVm, { isLoading: isDeleting }] = useDeleteVmMutation();

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<ProjectVmsCreateFormState>(DEFAULT_CREATE_FORM);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<ProjectVmsPageState["pendingAction"]>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuVmId, setMenuVmId] = useState<string | null>(null);
  const { feedback, show: showFeedback, clear: clearFeedback } = useFeedbackSnackbar();

  const query = getParam("q");
  const statusFilter = statusSort.status as ProjectVmsStatusFilter;
  const sortMode = statusSort.sort as ProjectVmsSortMode;
  const viewMode = getEnumParam("view", [...CARD_TABLE_VIEW_OPTIONS] as ViewMode[], "cards");

  const vms = useMemo(() => vmsResponse?.items ?? [], [vmsResponse]);
  const filteredVms = useMemo(
    () => getFilteredVms(vms, query, statusFilter, sortMode),
    [query, sortMode, statusFilter, vms],
  );
  const summary = useMemo(() => getProjectVmsSummary(vms), [vms]);
  const errorMessage = getProjectVmsErrorMessage(error);

  const createName = createForm.name.trim();
  const createFormErrors = {
    name:
      createName.length === 0
        ? "Name is required."
        : createName.length < 3
          ? "Use at least 3 characters."
          : null,
    cpu: Number(createForm.cpu) <= 0 ? "CPU must be greater than 0." : null,
    ram: Number(createForm.ram) < 512 ? "RAM must be at least 512 MB." : null,
    disk: Number(createForm.disk) < 10 ? "Disk must be at least 10 GB." : null,
  };
  const canCreateVm =
    createName.length >= 3 &&
    Number(createForm.cpu) > 0 &&
    Number(createForm.ram) > 0 &&
    Number(createForm.disk) > 0 &&
    !isCreating;

  const refresh = () => {
    void refetch();
  };

  const handleCreateVm = async () => {
    if (!projectId || !canCreateVm) return;
    try {
      await createVm({
        projectId,
        name: createName,
        cpu: Number(createForm.cpu),
        ram: Number(createForm.ram),
        disk: Number(createForm.disk),
      }).unwrap();
      setCreateDialogOpen(false);
      setCreateForm(DEFAULT_CREATE_FORM);
      showFeedback("VM created.", "success");
      refresh();
    } catch (requestError: unknown) {
      showFeedback(requestError instanceof Error ? requestError.message : "Could not create VM.", "error");
    }
  };

  const runAction = async () => {
    if (!pendingAction) return;
    const { vmId, type } = pendingAction;
    setActionLoadingId(`${type}:${vmId}`);

    try {
      if (type === "start") {
        await startVm({ vmId, projectId: projectId ?? "" }).unwrap();
        showFeedback("VM started.", "success");
      } else if (type === "stop") {
        await stopVm({ vmId, projectId: projectId ?? "" }).unwrap();
        showFeedback("VM stopped.", "info");
      } else if (type === "reboot") {
        await rebootVm({ vmId, projectId: projectId ?? "" }).unwrap();
        showFeedback("VM rebooted.", "info");
      } else {
        await deleteVm({ vmId, projectId: projectId ?? "" }).unwrap();
        showFeedback("VM deleted.", "success");
      }
      setConfirmOpen(false);
      setPendingAction(null);
      refresh();
    } catch (requestError: unknown) {
      showFeedback(requestError instanceof Error ? requestError.message : "Action failed.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const askAction = (vmId: string, type: "start" | "stop" | "reboot" | "delete") => {
    setPendingAction({ vmId, type });
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  return {
    projectId,
    query,
    statusFilter,
    sortMode,
    viewMode,
    vms,
    filteredVms,
    summary,
    isLoading,
    isCreating,
    isDeleting,
    actionLoadingId,
    createDialogOpen,
    confirmOpen,
    pendingAction,
    menuVmId,
    menuAnchorEl,
    error,
    errorMessage,
    feedback,
    createForm,
    createFormErrors,
    canCreateVm,
    setCreateDialogOpen,
    setConfirmOpen,
    setCreateForm,
    setMenuAnchorEl,
    setMenuVmId,
    refresh,
    setQueryParam,
    setStatusFilter: statusSort.setStatus as ProjectVmsPageState["setStatusFilter"],
    setSortMode: statusSort.setSort as ProjectVmsPageState["setSortMode"],
    askAction,
    closeConfirm,
    runAction,
    handleCreateVm,
    clearFeedback,
  };
}
