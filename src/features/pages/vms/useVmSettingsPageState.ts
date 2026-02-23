import { useEffect, useMemo, useState } from "react";
import { useFetcher, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { VmsAPI } from "@/api/vmsApi";
import { useFeedbackSnackbar } from "@/shared/hooks/useFeedbackSnackbar";
import type { VmLayoutContext, VmSettingsPageState } from "./pageTypes";
import type { VmSettingsActionData } from "./vmSettingsData";

export function useVmSettingsPageState(): VmSettingsPageState {
  const { vm, isLoading, error, setVm } = useOutletContext<VmLayoutContext>();
  const { vmId } = useParams();
  const navigate = useNavigate();
  const renameFetcher = useFetcher<VmSettingsActionData>();

  const [name, setName] = useState("");
  const isRenaming = renameFetcher.state !== "idle";

  const [restartDialogOpen, setRestartDialogOpen] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { feedback, show: showFeedback, clear: clearFeedback } = useFeedbackSnackbar();

  useEffect(() => {
    if (vm?.name) {
      setName(vm.name);
    }
  }, [vm?.name]);

  const trimmedName = name.trim();
  const canRename =
    Boolean(vm) &&
    trimmedName.length >= 3 &&
    trimmedName.length <= 32 &&
    trimmedName !== vm?.name &&
    !isRenaming;

  const renameHelper = useMemo(() => {
    if (!trimmedName) return "Name is required.";
    if (trimmedName.length < 3) return "Use at least 3 characters.";
    if (trimmedName.length > 32) return "Use at most 32 characters.";
    return "Choose a descriptive VM name.";
  }, [trimmedName]);

  const renameFieldError = renameFetcher.data?.fieldErrors?.name ?? null;
  const deleteDisabled = deleteConfirmText.trim() !== (vm?.name ?? "") || isDeleting;

  const onRename = () => {
    if (!canRename) return;
    void renameFetcher.submit(
      {
        intent: "rename",
        name: trimmedName,
      },
      { method: "post" },
    );
  };

  const onRestart = async () => {
    if (!vmId) return;
    setIsRestarting(true);
    try {
      await VmsAPI.reboot(vmId);
      setRestartDialogOpen(false);
      showFeedback("VM reboot queued.", "info");
    } catch (requestError: unknown) {
      showFeedback(requestError instanceof Error ? requestError.message : "Restart failed.", "error");
    } finally {
      setIsRestarting(false);
    }
  };

  const onDelete = async () => {
    if (!vm?.id) {
      setDeleteError("VM id is missing.");
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await VmsAPI.remove(vm.id);
      setDeleteDialogOpen(false);
      showFeedback("VM deleted successfully.", "success");
      const targetProject = vm.projectId ?? "prj-1";
      void navigate(`/console/projects/${targetProject}/vms`, { replace: true });
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Could not delete VM.";
      setDeleteError(message);
      showFeedback(message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!renameFetcher.data) return;
    if (renameFetcher.data.ok) {
      showFeedback(renameFetcher.data.message ?? "VM renamed.", "success");
      const updatedName = renameFetcher.data.updatedName;
      if (updatedName) {
        setVm((current) => (current ? { ...current, name: updatedName } : current));
      }
    } else if (renameFetcher.data.fieldErrors?.name) {
      showFeedback(renameFetcher.data.fieldErrors.name, "error");
    } else if (renameFetcher.data.formError) {
      showFeedback(renameFetcher.data.formError, "error");
    }
  }, [renameFetcher.data, setVm, showFeedback]);

  return {
    vm,
    isLoading,
    error,
    name,
    setName,
    isRenaming,
    canRename,
    renameHelper,
    renameFieldError,
    onRename,
    restartDialogOpen,
    setRestartDialogOpen,
    isRestarting,
    onRestart,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteConfirmText,
    setDeleteConfirmText,
    deleteDisabled,
    isDeleting,
    deleteError,
    setDeleteError,
    onDelete,
    feedback,
    clearFeedback,
  };
}
