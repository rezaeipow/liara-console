import ResourceActionConfirmDialog from "@/shared/components/common/ResourceActionConfirmDialog";
import TypedConfirmDeleteDialog from "@/shared/components/common/TypedConfirmDeleteDialog";
import type { ResourceSettingsActionDialogsProps } from "./types";

export default function ResourceSettingsActionDialogs({
  restart,
  remove,
}: ResourceSettingsActionDialogsProps) {
  return (
    <>
      <ResourceActionConfirmDialog
        open={restart.open}
        onClose={restart.onClose}
        onConfirm={restart.onConfirm}
        title={restart.title}
        message={restart.message}
        confirmLabel={restart.confirmLabel}
        submittingLabel={restart.submittingLabel}
        confirmColor="warning"
        isSubmitting={restart.isSubmitting}
      />

      <TypedConfirmDeleteDialog
        open={remove.open}
        onClose={remove.onClose}
        onConfirm={remove.onConfirm}
        title={remove.title}
        expectedName={remove.expectedName}
        inputLabel={remove.inputLabel}
        confirmText={remove.confirmText}
        onConfirmTextChange={remove.onConfirmTextChange}
        confirmDisabled={remove.confirmDisabled}
        isSubmitting={remove.isSubmitting}
        error={remove.error}
      />
    </>
  );
}
