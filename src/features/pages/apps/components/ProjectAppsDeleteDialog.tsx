import ResourceActionConfirmDialog from "@/shared/components/common/ResourceActionConfirmDialog";
import type { ProjectAppsDeleteDialogProps } from "@/shared/types/appsComponents";

export default function ProjectAppsDeleteDialog({ open, isDeleting, targetName, onClose, onConfirm }: ProjectAppsDeleteDialogProps) {
  return (
    <ResourceActionConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete App"
      confirmColor="error"
      confirmLabel="Delete"
      submittingLabel="Deleting..."
      isSubmitting={isDeleting}
      message="This action cannot be undone."
      metaLabel="App"
      metaValue={targetName}
    />
  );
}
