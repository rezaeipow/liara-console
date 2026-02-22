import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PublicIcon from "@mui/icons-material/Public";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import type { ProjectCreateActionData, ProjectCreateLoaderData } from "./projectsData";

export default function NewProjectPage() {
  const theme = useTheme();
  const actionData = useActionData() as ProjectCreateActionData | undefined;
  const loaderData = useLoaderData() as ProjectCreateLoaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const defaultRegion = loaderData.meta.regions[0] ?? "";
  const defaultPlan = loaderData.meta.plans[0] ?? "";

  return (
    <Stack
      spacing={2.25}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 980, lg: 1080 },
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 1.25, sm: 1.5, lg: 1.5 },
        px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: { xs: 1.5, sm: 2 },
          background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
        }}
      >
        <Stack spacing={0.75}>
          <Typography variant="h5" fontWeight={800}>
            Create Project
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set the project name, region, and plan to launch your workspace.
          </Typography>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.35fr) minmax(0, 1fr)" },
          gap: 1.5,
          alignItems: "start",
        }}
      >
        <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: { xs: 1.5, sm: 2 } }}>
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
                  <MenuItem key={region} value={region}>
                    {region.toUpperCase()}
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
                helperText={actionData?.fieldErrors?.plan ?? "You can change this later in settings."}
              >
                {loaderData.meta.plans.map((plan) => (
                  <MenuItem key={plan} value={plan}>
                    {plan}
                  </MenuItem>
                ))}
              </TextField>

              <Divider sx={{ opacity: 0.5 }} />

              <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={1}>
                <Button
                  component={Link}
                  to="/console/projects"
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Back to Projects
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              </Stack>
            </Stack>
          </Form>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 2.25 }, borderRadius: { xs: 1.5, sm: 2 } }}>
          <Stack spacing={1.3}>
            <Typography variant="subtitle1" fontWeight={800}>
              Setup Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Default options are preselected so you can create and start quickly.
            </Typography>
            <Divider sx={{ opacity: 0.45 }} />
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<PublicIcon sx={{ fontSize: 16 }} />}
                label={`Region: ${defaultRegion.toUpperCase()}`}
                size="small"
              />
              <Chip
                icon={<WorkspacePremiumIcon sx={{ fontSize: 16 }} />}
                label={`Plan: ${defaultPlan}`}
                size="small"
                sx={{ textTransform: "capitalize" }}
              />
              <Chip label="Apps enabled" size="small" variant="outlined" />
              <Chip label="VMs enabled" size="small" variant="outlined" />
              <Chip label="Billing linked" size="small" variant="outlined" />
            </Stack>
            <Divider sx={{ opacity: 0.45 }} />
            <Typography variant="subtitle2" fontWeight={700}>
              Next steps after creation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1. Create your first app or VM from the project overview.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              2. Review billing snapshot and add credit if needed.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              After creation, you can immediately add apps, VMs, and billing settings from
              the project overview page.
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
