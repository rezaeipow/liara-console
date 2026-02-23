import ResourceSettingsActionDialogs from "@/shared/components/common/ResourceSettingsActionDialogs";
import type { AppSettingsDialogsProps } from "@/shared/types/appsComponents";

export default function AppSettingsDialogs({
  appName,
  restartDialogOpen,
  isRestarting,
  onCloseRestart,
  onConfirmRestart,
  deleteDialogOpen,
  deleteConfirmText,
  isDeleting,
  deleteDisabled,
  deleteError,
  onCloseDelete,
  onConfirmDelete,
  onDeleteConfirmTextChange,
}: AppSettingsDialogsProps) {
  return (
    <ResourceSettingsActionDialogs
      restart={{
        open: restartDialogOpen,
        onClose: onCloseRestart,
        onConfirm: onConfirmRestart,
        title: "Confirm Restart",
        message: (
          <>
            Restart <strong>{appName}</strong>? The service will be temporarily unavailable.
          </>
        ),
        confirmLabel: "Restart",
        submittingLabel: "Restarting...",
        isSubmitting: isRestarting,
      }}
      remove={{
        open: deleteDialogOpen,
        onClose: onCloseDelete,
        onConfirm: onConfirmDelete,
        title: "Delete App",
        expectedName: appName,
        inputLabel: "Confirm app name",
        confirmText: deleteConfirmText,
        onConfirmTextChange: onDeleteConfirmTextChange,
        confirmDisabled: deleteDisabled,
        isSubmitting: isDeleting,
        error: deleteError,
      }}
    />
  );
}
