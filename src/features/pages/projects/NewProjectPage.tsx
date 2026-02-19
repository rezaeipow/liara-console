import {
  Alert,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import type { ProjectCreateActionData, ProjectCreateLoaderData } from "./projectsData";

export default function NewProjectPage() {
  const actionData = useActionData() as ProjectCreateActionData | undefined;
  const loaderData = useLoaderData() as ProjectCreateLoaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const defaultRegion = loaderData.meta.regions[0] ?? "";
  const defaultPlan = loaderData.meta.plans[0] ?? "";

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography variant="h5" fontWeight={800}>
          Create Project
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Set the project name, region, and plan.
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 2.5 }, maxWidth: 620 }}>
        <Form method="post">
          <Stack spacing={1.25}>
            {actionData?.formError ? <Alert severity="error">{actionData.formError}</Alert> : null}

            <TextField
              name="name"
              label="Project name"
              size="small"
              required
              disabled={isSubmitting}
              error={Boolean(actionData?.fieldErrors?.name)}
              helperText={actionData?.fieldErrors?.name}
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
              helperText={actionData?.fieldErrors?.region}
            >
              {loaderData.meta.regions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
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
              helperText={actionData?.fieldErrors?.plan}
            >
              {loaderData.meta.plans.map((plan) => (
                <MenuItem key={plan} value={plan}>
                  {plan}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
              <Button component={Link} to="/console/projects" variant="outlined">
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Form>
      </Paper>
    </Stack>
  );
}
