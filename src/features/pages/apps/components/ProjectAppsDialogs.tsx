import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import ProjectAppsCreateDialog from "./ProjectAppsCreateDialog";
import ProjectAppsDeleteDialog from "./ProjectAppsDeleteDialog";
import type { ProjectAppsDialogsWithFeedbackProps } from "@/shared/types/appsComponents";

export default function ProjectAppsDialogs(props: ProjectAppsDialogsWithFeedbackProps) {
  const {
    createDialogOpen,
    isCreating,
    canCreate,
    name,
    region,
    plan,
    regionOptions,
    planOptions,
    onCloseCreate,
    onSubmitCreate,
    onNameChange,
    onRegionChange,
    onPlanChange,
    deleteDialogOpen,
    isDeleting,
    targetName,
    onCloseDelete,
    onConfirmDelete,
    feedback,
    onCloseFeedback,
  } = props;

  return (
    <>
      <ProjectAppsCreateDialog
        open={createDialogOpen}
        isCreating={isCreating}
        canCreate={canCreate}
        name={name}
        region={region}
        plan={plan}
        regionOptions={regionOptions}
        planOptions={planOptions}
        onClose={onCloseCreate}
        onSubmit={onSubmitCreate}
        onNameChange={onNameChange}
        onRegionChange={onRegionChange}
        onPlanChange={onPlanChange}
      />

      <ProjectAppsDeleteDialog
        open={deleteDialogOpen}
        isDeleting={isDeleting}
        targetName={targetName}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
      />

      <FeedbackSnackbar
        open={feedback.open}
        autoHideDuration={2800}
        severity={feedback.severity}
        message={feedback.message}
        onClose={onCloseFeedback}
      />
    </>
  );
}
