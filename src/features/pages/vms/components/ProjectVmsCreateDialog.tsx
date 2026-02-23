import { MenuItem, TextField } from "@mui/material";
import ResourceCreateDialog from "@/shared/components/common/ResourceCreateDialog";
import type { ProjectVmsCreateDialogProps } from "../pageTypes";

export default function ProjectVmsCreateDialog(props: ProjectVmsCreateDialogProps) {
  const { state } = props;

  return (
    <ResourceCreateDialog
      open={state.createDialogOpen}
      title="Create Virtual Machine"
      onClose={() => {
        if (!state.isCreating) {
          state.setCreateDialogOpen(false);
        }
      }}
      onSubmit={() => void state.handleCreateVm()}
      isSubmitting={state.isCreating}
      canSubmit={state.canCreateVm}
      submitLabel="Create VM"
      submittingLabel="Creating..."
    >
      <TextField
        size="small"
        label="VM name"
        value={state.createForm.name}
        onChange={(event) =>
          state.setCreateForm((prev) => ({ ...prev, name: event.target.value }))
        }
        helperText={state.createFormErrors.name ?? "At least 3 characters"}
        error={Boolean(state.createFormErrors.name)}
        disabled={state.isCreating}
        required
      />
      <TextField
        select
        size="small"
        label="CPU (vCPU)"
        value={state.createForm.cpu}
        onChange={(event) =>
          state.setCreateForm((prev) => ({ ...prev, cpu: event.target.value }))
        }
        disabled={state.isCreating}
        helperText={state.createFormErrors.cpu ?? "Number of virtual CPUs"}
        error={Boolean(state.createFormErrors.cpu)}
      >
        <MenuItem value="1">1 vCPU</MenuItem>
        <MenuItem value="2">2 vCPU</MenuItem>
        <MenuItem value="4">4 vCPU</MenuItem>
        <MenuItem value="8">8 vCPU</MenuItem>
      </TextField>
      <TextField
        select
        size="small"
        label="RAM (MB)"
        value={state.createForm.ram}
        onChange={(event) =>
          state.setCreateForm((prev) => ({ ...prev, ram: event.target.value }))
        }
        disabled={state.isCreating}
        helperText={state.createFormErrors.ram ?? "Memory in MB"}
        error={Boolean(state.createFormErrors.ram)}
      >
        <MenuItem value="1024">1 GB</MenuItem>
        <MenuItem value="2048">2 GB</MenuItem>
        <MenuItem value="4096">4 GB</MenuItem>
        <MenuItem value="8192">8 GB</MenuItem>
      </TextField>
      <TextField
        select
        size="small"
        label="Disk (GB)"
        value={state.createForm.disk}
        onChange={(event) =>
          state.setCreateForm((prev) => ({ ...prev, disk: event.target.value }))
        }
        disabled={state.isCreating}
        helperText={state.createFormErrors.disk ?? "Disk size in GB"}
        error={Boolean(state.createFormErrors.disk)}
      >
        <MenuItem value="20">20 GB</MenuItem>
        <MenuItem value="40">40 GB</MenuItem>
        <MenuItem value="80">80 GB</MenuItem>
      </TextField>
    </ResourceCreateDialog>
  );
}
