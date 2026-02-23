import { MenuItem, TextField } from "@mui/material";
import ResourceCreateDialog from "@/shared/components/common/ResourceCreateDialog";
import type { ProjectAppsCreateDialogProps } from "@/shared/types/appsComponents";

export default function ProjectAppsCreateDialog(props: ProjectAppsCreateDialogProps) {
  const { open, isCreating, canCreate, name, region, plan, regionOptions, planOptions, onClose, onSubmit, onNameChange, onRegionChange, onPlanChange } = props;
  return (
    <ResourceCreateDialog open={open} title="Create App" onClose={onClose} onSubmit={onSubmit} isSubmitting={isCreating} canSubmit={canCreate} submitLabel="Create" submittingLabel="Creating...">
      <TextField label="App name" size="small" value={name} onChange={(event) => onNameChange(event.target.value)} helperText="At least 3 characters" disabled={isCreating} required />
      <TextField select label="Region" size="small" value={region} onChange={(event) => onRegionChange(event.target.value)} disabled={isCreating}>
        {regionOptions.map((option) => <MenuItem key={option} value={option}>{option.toUpperCase()}</MenuItem>)}
      </TextField>
      <TextField select label="Plan" size="small" value={plan} onChange={(event) => onPlanChange(event.target.value)} disabled={isCreating}>
        {planOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
      </TextField>
    </ResourceCreateDialog>
  );
}
