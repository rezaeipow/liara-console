import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import ResourceActionConfirmDialog from "@/shared/components/common/ResourceActionConfirmDialog";
import type { ProjectVmsDialogsProps } from "../pageTypes";
import ProjectVmsActionsMenu from "./ProjectVmsActionsMenu";
import ProjectVmsCreateDialog from "./ProjectVmsCreateDialog";

export default function ProjectVmsDialogs(props: ProjectVmsDialogsProps) {
  const { state, pendingVmName, confirmTitle, confirmMessage } = props;

  return (
    <>
      <ProjectVmsCreateDialog state={state} />

      <ResourceActionConfirmDialog
        open={state.confirmOpen}
        onClose={state.closeConfirm}
        onConfirm={() => void state.runAction()}
        title={confirmTitle}
        confirmColor={state.pendingAction?.type === "delete" ? "error" : "primary"}
        confirmLabel={state.pendingAction?.type === "delete" ? "Delete" : "Confirm"}
        submittingLabel="Processing..."
        isSubmitting={Boolean(state.actionLoadingId)}
        message={confirmMessage}
        showWarningIcon={state.pendingAction?.type === "delete"}
        metaLabel="VM"
        metaValue={pendingVmName}
      />

      <ProjectVmsActionsMenu
        menuAnchorEl={state.menuAnchorEl}
        menuVmId={state.menuVmId}
        actionLoadingId={state.actionLoadingId}
        onClose={() => {
          state.setMenuAnchorEl(null);
          state.setMenuVmId(null);
        }}
        onDelete={(vmId) => state.askAction(vmId, "delete")}
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
