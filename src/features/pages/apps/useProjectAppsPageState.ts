import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateAppMutation,
  useDeleteAppMutation,
  useGetAppsByProjectQuery,
  useGetDeploymentsByProjectQuery,
  useRestartAppMutation,
} from "@/app/store/api";
import { CARD_TABLE_VIEW_OPTIONS } from "@/shared/constants/viewOptions";
import { useFeedbackSnackbar } from "@/shared/hooks/useFeedbackSnackbar";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { useStatusSortQuery } from "@/shared/hooks/useStatusSortQuery";
import type { ViewMode } from "@/shared/types/view";
import {
  buildMetaByAppId,
  buildProjectAppsActivity,
  buildProjectAppsSummary,
  getProjectAppsErrorMessage,
} from "./projectAppsStateUtils";
import {
  getVisibleApps,
  planOptions,
  regionOptions,
  sortOptions,
  statusOptions,
} from "./projectAppsUtils";

export function useProjectAppsPageState() {
  const { projectId } = useParams();
  const { getEnumParam, getParam, setQueryParam } = useQueryParams();
  const [createDialogOpen, setCreateDialogOpen] = useState(false),
    [name, setName] = useState(""),
    [region, setRegion] = useState(regionOptions[0]),
    [plan, setPlan] = useState(planOptions[0]),
    [deleteDialogOpen, setDeleteDialogOpen] = useState(false),
    [deleteTargetId, setDeleteTargetId] = useState<string | null>(null),
    [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const {
    feedback,
    show: showFeedback,
    clear: clearFeedback,
  } = useFeedbackSnackbar();
  const statusSort = useStatusSortQuery({
    statusOptions,
    defaultStatus: "all",
    sortOptions,
    defaultSort: "latest",
  });
  const q = getParam("q"),
    statusFilter = statusSort.status,
    sortMode = statusSort.sort,
    viewMode = getEnumParam(
      "view",
      [...CARD_TABLE_VIEW_OPTIONS] as ViewMode[],
      "cards",
    );

  const {
    data: appsResponse,
    isLoading: isLoadingApps,
    error: appsError,
    refetch: refetchApps,
  } = useGetAppsByProjectQuery(projectId ?? "", { skip: !projectId });

  const {
    data: deploymentsResponse,
    isLoading: isLoadingDeployments,
    error: deploymentsError,
    refetch: refetchDeployments,
  } = useGetDeploymentsByProjectQuery(projectId ?? "", { skip: !projectId });
  const [restartApp] = useRestartAppMutation();
  const [createApp, { isLoading: isCreating }] = useCreateAppMutation();
  const [deleteApp, { isLoading: isDeleting }] = useDeleteAppMutation();
  const apps = useMemo(() => appsResponse?.items ?? [], [appsResponse]),
    deployments = useMemo(
      () => deploymentsResponse?.items ?? [],
      [deploymentsResponse],
    ),
    metaByAppId = useMemo(
      () => buildMetaByAppId(apps, deployments),
      [apps, deployments],
    ),
    visibleApps = useMemo(
      () => getVisibleApps(apps, metaByAppId, q, statusFilter, sortMode),
      [apps, metaByAppId, q, sortMode, statusFilter],
    ),
    summary = useMemo(() => buildProjectAppsSummary(apps), [apps]),
    activity = useMemo(
      () => buildProjectAppsActivity(apps, metaByAppId),
      [apps, metaByAppId],
    );
  const canCreate = name.trim().length >= 3 && !isCreating,
    isLoading = isLoadingApps || isLoadingDeployments,
    errorMessage = getProjectAppsErrorMessage(appsError || deploymentsError);
  const refreshAll = () => {
    void refetchApps();
    void refetchDeployments();
  };

  const handleCreate = async () => {
    if (!projectId || !canCreate) return;
    try {
      await createApp({ projectId, name: name.trim(), region, plan }).unwrap();
      setCreateDialogOpen(false);
      setName("");
      setRegion(regionOptions[0]);
      setPlan(planOptions[0]);
      showFeedback("App created successfully.", "success");
      refreshAll();
    } catch (e: unknown) {
      showFeedback(
        e instanceof Error ? e.message : "Could not create app.",
        "error",
      );
    }
  };

  const handleRestart = async (appId: string) => {
    setActionLoadingId(`restart:${appId}`);
    try {
      await restartApp(appId).unwrap();
      void refetchApps();
      showFeedback("Restart queued.", "info");
    } catch (e: unknown) {
      showFeedback(
        e instanceof Error ? e.message : "Could not restart app.",
        "error",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId || !projectId) return;
    try {
      await deleteApp({ appId: deleteTargetId, projectId }).unwrap();
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
      showFeedback("App deleted.", "success");
      refreshAll();
    } catch (e: unknown) {
      showFeedback(
        e instanceof Error ? e.message : "Could not delete app.",
        "error",
      );
    }
  };

  return {
    projectId,
    q,
    statusFilter,
    sortMode,
    viewMode,
    setQueryParam,
    statusSort,
    apps,
    visibleApps,
    metaByAppId,
    isLoading,
    errorMessage,
    summary,
    activity,
    createDialogOpen,
    setCreateDialogOpen,
    name,
    setName,
    region,
    setRegion,
    plan,
    setPlan,
    canCreate,
    isCreating,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteTargetId,
    setDeleteTargetId,
    actionLoadingId,
    isDeleting,
    feedback,
    clearFeedback,
    refreshAll,
    handleCreate,
    handleRestart,
    handleDelete,
    regionOptions,
    planOptions,
  };
}
