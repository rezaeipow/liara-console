import { Alert, Divider, MenuItem, Stack, TextField } from "@mui/material";
import { Form } from "react-router-dom";
import ResourceCreatePageActions from "@/shared/components/common/ResourceCreatePageActions";
import ConsoleSectionCard from "@/shared/components/console/ConsoleSectionCard";
import type { NewProjectFormProps } from "./types";

export default function NewProjectForm({
  actionData,
  loaderData,
  defaultRegion,
  defaultPlan,
  isSubmitting,
}: NewProjectFormProps) {
  return (
    <ConsoleSectionCard>
      <Form method="post">
        <Stack spacing={1.4}>
          {actionData?.formError ? <Alert severity="error">{actionData.formError}</Alert> : null}
          <TextField
            name="name"
            label="Project name"
            placeholder="e.g. storefront-api"
            size="small"
            required
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.name)}
            helperText={actionData?.fieldErrors?.name ?? "At least 3 characters."}
          />
          <TextField
            select
            name="region"
            label="Region"
            size="small"
            required
            defaultValue={defaultRegion}
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.region)}
            helperText={actionData?.fieldErrors?.region ?? "Choose the nearest region to users."}
          >
            {loaderData.meta.regions.map((region) => (
              <MenuItem key={region} value={region}>{region.toUpperCase()}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            name="plan"
            label="Plan"
            size="small"
            required
            defaultValue={defaultPlan}
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.plan)}
            helperText={actionData?.fieldErrors?.plan ?? "You can change this later in settings."}
          >
            {loaderData.meta.plans.map((plan) => (
              <MenuItem key={plan} value={plan}>{plan}</MenuItem>
            ))}
          </TextField>
          <Divider sx={{ opacity: 0.5 }} />
          <ResourceCreatePageActions backTo="/console/projects" backLabel="Back to Projects" submitLabel="Create Project" isSubmitting={isSubmitting} />
        </Stack>
      </Form>
    </ConsoleSectionCard>
  );
}
