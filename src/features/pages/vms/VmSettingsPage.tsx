import { Alert, Stack, Typography } from "@mui/material";
import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import ResourceSettingsActionDialogs from "@/shared/components/common/ResourceSettingsActionDialogs";
import VmSettingsDangerSection from "./components/VmSettingsDangerSection";
import VmSettingsGeneralSection from "./components/VmSettingsGeneralSection";
import VmSettingsRuntimeSection from "./components/VmSettingsRuntimeSection";
import { useVmSettingsPageState } from "./useVmSettingsPageState";

export default function VmSettingsPage() {
  const state = useVmSettingsPageState();

  return (
    <>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" fontWeight={800}>
            VM Settings
          </Typography>
        </Stack>

        {state.error ? <Alert severity="error">{state.error}</Alert> : null}

        <VmSettingsGeneralSection
          vm={state.vm}
          isLoading={state.isLoading}
          name={state.name}
          onNameChange={state.setName}
          renameHelper={state.renameHelper}
          renameFieldError={state.renameFieldError}
          canRename={state.canRename}
          isRenaming={state.isRenaming}
          onRename={state.onRename}
        />

        <VmSettingsRuntimeSection
          vm={state.vm}
          isLoading={state.isLoading}
          onOpenRestartDialog={() => state.setRestartDialogOpen(true)}
        />

        <VmSettingsDangerSection
          vm={state.vm}
          isLoading={state.isLoading}
          onOpenDeleteDialog={() => state.setDeleteDialogOpen(true)}
        />
      </Stack>

      <ResourceSettingsActionDialogs
        restart={{
          open: state.restartDialogOpen,
          onClose: () => state.setRestartDialogOpen(false),
          onConfirm: () => void state.onRestart(),
          title: "Confirm Reboot",
          message: (
            <>
              Reboot <strong>{state.vm?.name ?? "this VM"}</strong>? This will interrupt running workloads.
            </>
          ),
          confirmLabel: "Reboot",
          submittingLabel: "Rebooting...",
          isSubmitting: state.isRestarting,
        }}
        remove={{
          open: state.deleteDialogOpen,
          onClose: () => {
            if (!state.isDeleting) {
              state.setDeleteDialogOpen(false);
              state.setDeleteError(null);
              state.setDeleteConfirmText("");
            }
          },
          onConfirm: () => void state.onDelete(),
          title: "Delete VM",
          expectedName: state.vm?.name ?? "",
          inputLabel: "Confirm VM name",
          confirmText: state.deleteConfirmText,
          onConfirmTextChange: state.setDeleteConfirmText,
          confirmDisabled: state.deleteDisabled,
          isSubmitting: state.isDeleting,
          error: state.deleteError,
        }}
      />

      <FeedbackSnackbar
        open={state.feedback.open}
        autoHideDuration={2800}
        severity={state.feedback.severity}
        message={state.feedback.message}
        onClose={state.clearFeedback}
      />
    </>
  );
}
