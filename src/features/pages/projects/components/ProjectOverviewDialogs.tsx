import { TextField } from "@mui/material";
import ResourceFormDialog from "@/shared/components/common/ResourceFormDialog";
import TypedConfirmDeleteDialog from "@/shared/components/common/TypedConfirmDeleteDialog";
import type { ProjectOverviewDialogsProps } from "../types";

export default function ProjectOverviewDialogs(props: ProjectOverviewDialogsProps) {
  const {
    openRename,
    openDelete,
    nextProjectName,
    renameError,
    isSubmitting,
    actionIntent,
    deleteConfirmText,
    deleteDisabled,
    projectName,
    onCloseRename,
    onSubmitRename,
    onNameChange,
    onCloseDelete,
    onDeleteConfirmTextChange,
    onSubmitDelete,
  } = props;

  return (
    <>
      <ResourceFormDialog
        open={openRename}
        title="Rename project"
        onClose={onCloseRename}
        onSubmit={onSubmitRename}
        submitLabel="Save"
        submittingLabel="Saving..."
        isSubmitting={isSubmitting && actionIntent === "rename"}
        submitDisabled={isSubmitting || nextProjectName.trim().length < 3}
      >
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Project name"
          value={nextProjectName}
          onChange={(event) => onNameChange(event.target.value)}
          error={Boolean(renameError)}
          helperText={renameError}
        />
      </ResourceFormDialog>

      <TypedConfirmDeleteDialog
        open={openDelete}
        onClose={onCloseDelete}
        onConfirm={onSubmitDelete}
        title="Delete project"
        expectedName={projectName}
        inputLabel="Confirm project name"
        confirmText={deleteConfirmText}
        onConfirmTextChange={onDeleteConfirmTextChange}
        confirmDisabled={deleteDisabled}
        confirmLabel="Delete"
        submittingLabel="Deleting..."
        isSubmitting={isSubmitting && actionIntent === "delete"}
      />
    </>
  );
}
