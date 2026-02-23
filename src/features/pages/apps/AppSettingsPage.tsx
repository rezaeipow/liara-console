import { Stack } from "@mui/material";
import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import AppSettingsDangerSection from "./components/AppSettingsDangerSection";
import AppSettingsDialogs from "./components/AppSettingsDialogs";
import AppSettingsGeneralSection from "./components/AppSettingsGeneralSection";
import AppSettingsHeader from "./components/AppSettingsHeader";
import AppSettingsRuntimeSection from "./components/AppSettingsRuntimeSection";
import { useAppSettingsPageState } from "./useAppSettingsPageState";

export default function AppSettingsPage() {
  const state = useAppSettingsPageState();

  return (
    <>
      <Stack spacing={1.5}>
        <AppSettingsHeader error={state.error} />
        <AppSettingsGeneralSection
          name={state.name}
          helperText={state.renameHelper}
          isRenaming={state.isRenaming}
          isLoading={state.isLoading}
          hasApp={state.hasApp}
          canRename={state.canRename}
          renameError={state.renameData?.fieldErrors?.name}
          region={state.appRegion}
          plan={state.appPlan}
          onNameChange={state.setName}
          onRename={() => void state.handleRename()}
        />
        <AppSettingsRuntimeSection
          disabled={state.isLoading || !state.hasApp}
          onOpenRestart={() => state.setRestartDialogOpen(true)}
        />
        <AppSettingsDangerSection
          disabled={state.isLoading || !state.hasApp}
          onOpenDelete={() => state.setDeleteDialogOpen(true)}
        />
      </Stack>

      <AppSettingsDialogs
        appName={state.appName}
        restartDialogOpen={state.restartDialogOpen}
        isRestarting={state.isRestarting}
        onCloseRestart={() => state.setRestartDialogOpen(false)}
        onConfirmRestart={() => void state.handleRestart()}
        deleteDialogOpen={state.deleteDialogOpen}
        deleteConfirmText={state.deleteConfirmText}
        isDeleting={state.isDeleting}
        deleteDisabled={state.deleteDisabled}
        deleteError={state.deleteError}
        onCloseDelete={state.closeDeleteDialog}
        onConfirmDelete={() => void state.handleDelete()}
        onDeleteConfirmTextChange={state.setDeleteConfirmText}
      />

      <FeedbackSnackbar
        open={state.feedback.open}
        autoHideDuration={3200}
        severity={state.feedback.severity}
        message={state.feedback.message}
        onClose={state.clearFeedback}
      />
    </>
  );
}
