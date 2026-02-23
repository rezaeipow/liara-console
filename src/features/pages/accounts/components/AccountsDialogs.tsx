import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Alert, InputAdornment, TextField } from "@mui/material";
import ResourceActionConfirmDialog from "@/shared/components/common/ResourceActionConfirmDialog";
import ResourceCreateDialog from "@/shared/components/common/ResourceCreateDialog";
import type { AccountsDialogsProps } from "../types";

export default function AccountsDialogs(props: AccountsDialogsProps) {
  const { state } = props;

  return (
    <>
      <ResourceActionConfirmDialog
        open={Boolean(state.accountIdToDelete)}
        onClose={state.closeDeleteDialog}
        onConfirm={state.confirmDelete}
        title="Delete account"
        confirmColor="error"
        confirmLabel="Delete"
        isSubmitting={state.isMutatingRow}
        message="This action cannot be undone."
        metaLabel="Account"
        metaValue={state.accountToDelete?.name ?? "this account"}
      />
      <ResourceCreateDialog
        open={state.isCreateDialogOpen}
        title="Create account"
        onClose={() => {
          if (!state.isCreating) state.setIsCreateDialogOpen(false);
        }}
        onSubmit={state.handleCreateSubmit}
        isSubmitting={state.isCreating}
        canSubmit={state.newAccountName.trim().length >= 2}
        submitLabel="Create"
        submittingLabel="Creating..."
      >
        <TextField
          label="Account name"
          size="small"
          fullWidth
          autoFocus
          value={state.newAccountName}
          onChange={(event) => state.setNewAccountName(event.target.value)}
          disabled={state.isCreating}
          error={Boolean(state.createFieldNameError)}
          helperText={state.createFieldNameError}
          slotProps={{
            input: {
              onKeyDown: (event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  state.handleCreateSubmit();
                }
              },
              startAdornment: (
                <InputAdornment position="start">
                  <AddCircleOutlineIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        {state.createFormError ? <Alert severity="error">{state.createFormError}</Alert> : null}
      </ResourceCreateDialog>
    </>
  );
}
