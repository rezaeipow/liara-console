import { useFetcher, useOutletContext, useParams } from "react-router-dom";
import { useFeedbackSnackbar } from "@/shared/hooks/useFeedbackSnackbar";
import type { AppSettingsState } from "@/shared/types/appsComponents";
import type { AppSettingsActionData } from "./appSettingsData";
import type { AppLayoutContext } from "./pageTypes";
import { useAppSettingsRenameFeedback } from "./useAppSettingsRenameFeedback";
import { useAppSettingsRenameState } from "./useAppSettingsRenameState";
import { useAppSettingsDangerState } from "./useAppSettingsDangerState";

export function useAppSettingsPageState(): AppSettingsState {
  const { app, isLoading, error, setApp } = useOutletContext<AppLayoutContext>();
  const { projectId, appId } = useParams();
  const renameFetcher = useFetcher<AppSettingsActionData>();
  const { feedback, show: showFeedback, clear: clearFeedback } = useFeedbackSnackbar();
  const isRenaming = renameFetcher.state !== "idle";
  const rename = useAppSettingsRenameState({
    appName: app?.name,
    hasApp: Boolean(app),
    isRenaming,
    submitRename: (name) => renameFetcher.submit({ intent: "rename", name }, { method: "post" }),
  });
  const danger = useAppSettingsDangerState({
    appId,
    appName: app?.name ?? "",
    appResourceId: app?.id,
    appProjectId: app?.projectId,
    routeProjectId: projectId,
    showFeedback,
  });

  useAppSettingsRenameFeedback({ data: renameFetcher.data, setApp, showFeedback });

  return {
    appName: app?.name ?? "this app",
    appRegion: app?.region,
    appPlan: app?.plan,
    hasApp: Boolean(app),
    isLoading,
    error,
    name: rename.name,
    renameHelper: rename.renameHelper,
    canRename: rename.canRename,
    renameData: renameFetcher.data,
    isRenaming,
    restartDialogOpen: danger.restartDialogOpen,
    isRestarting: danger.isRestarting,
    deleteDialogOpen: danger.deleteDialogOpen,
    deleteConfirmText: danger.deleteConfirmText,
    isDeleting: danger.isDeleting,
    deleteError: danger.deleteError,
    deleteDisabled: danger.deleteDisabled,
    feedback,
    setName: rename.setName,
    setRestartDialogOpen: danger.setRestartDialogOpen,
    setDeleteDialogOpen: danger.setDeleteDialogOpen,
    setDeleteConfirmText: danger.setDeleteConfirmText,
    clearFeedback,
    closeDeleteDialog: danger.closeDeleteDialog,
    handleRename: rename.handleRename,
    handleRestart: danger.handleRestart,
    handleDelete: danger.handleDelete,
  };
}
