import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteApp, restartApp } from "./appSettingsHandlers";

type Params = {
  appId: string | undefined;
  appName: string;
  appResourceId: string | undefined;
  appProjectId: string | undefined;
  routeProjectId: string | undefined;
  showFeedback: (
    message: string,
    severity: "success" | "error" | "info",
  ) => void;
};

export function useAppSettingsDangerState({
  appId,
  appResourceId,
  appProjectId,
  routeProjectId,
  appName,
  showFeedback,
}: Params) {
  const navigate = useNavigate();
  const [restartDialogOpen, setRestartDialogOpen] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteDisabled = deleteConfirmText.trim() !== appName || isDeleting;

  const handleRestart = async () => {
    if (!appId) return;
    setIsRestarting(true);
    try {
      await restartApp(appId);
      setRestartDialogOpen(false);
      showFeedback("Restart queued. App status will update shortly.", "info");
    } catch (requestError: unknown) {
      showFeedback(
        requestError instanceof Error
          ? requestError.message
          : "Restart failed.",
        "error",
      );
    } finally {
      setIsRestarting(false);
    }
  };

  const handleDelete = async () => {
    if (!appResourceId) {
      setDeleteError("App id is missing.");
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteApp(appResourceId);
      setDeleteDialogOpen(false);
      showFeedback("App deleted successfully.", "success");
      const targetProject = appProjectId ?? routeProjectId ?? "prj-1";
      void navigate(`/console/projects/${targetProject}/apps`, { replace: true });
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Could not delete app.";
      setDeleteError(message);
      showFeedback(message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setDeleteError(null);
    setDeleteConfirmText("");
  };

  return {
    restartDialogOpen,
    setRestartDialogOpen,
    isRestarting,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteConfirmText,
    setDeleteConfirmText,
    isDeleting,
    deleteError,
    deleteDisabled,
    handleRestart,
    handleDelete,
    closeDeleteDialog,
  };
}
