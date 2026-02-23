import { Stack } from "@mui/material";
import ResourceFormDialog from "@/shared/components/common/ResourceFormDialog";
import type { ResourceCreateDialogProps } from "./types";

export default function ResourceCreateDialog({
  open,
  title,
  onClose,
  onSubmit,
  isSubmitting,
  canSubmit,
  submitLabel = "Create",
  submittingLabel = "Creating...",
  children,
}: ResourceCreateDialogProps) {
  return (
    <ResourceFormDialog
      open={open}
      title={title}
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel={submitLabel}
      submittingLabel={submittingLabel}
      isSubmitting={isSubmitting}
      submitDisabled={!canSubmit}
      compactContent
    >
      <Stack spacing={1.25}>{children}</Stack>
    </ResourceFormDialog>
  );
}
