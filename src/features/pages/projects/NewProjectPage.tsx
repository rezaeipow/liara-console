import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import ConsoleHeroCard from "@/shared/components/console/ConsoleHeroCard";
import ConsolePageShell from "@/shared/components/console/ConsolePageShell";
import {
  createPrimaryHeroGradient,
  createPrimaryHeroSx,
} from "@/shared/ui/heroStyles";
import NewProjectForm from "./components/NewProjectForm";
import NewProjectSetupPreview from "./components/NewProjectSetupPreview";
import type {
  ProjectCreateActionData,
  ProjectCreateLoaderData,
} from "./projectsData";

export default function NewProjectPage() {
  const theme = useTheme();
  const actionData = useActionData() as ProjectCreateActionData | undefined;
  const loaderData = useLoaderData() as ProjectCreateLoaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const defaultRegion = loaderData.meta.regions[0] ?? "";
  const defaultPlan = loaderData.meta.plans[0] ?? "";

  return (
    <ConsolePageShell spacing={2.25}>
      <ConsoleHeroCard
        title="Create Project"
        description="Set the project name, region, and plan to launch your workspace."
        gradient={createPrimaryHeroGradient(theme)}
        sx={createPrimaryHeroSx(theme, { disableBackdrop: true })}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1.35fr) minmax(0, 1fr)",
          },
          gap: 1.5,
          alignItems: "start",
        }}
      >
        <NewProjectForm actionData={actionData} loaderData={loaderData} defaultRegion={defaultRegion} defaultPlan={defaultPlan} isSubmitting={isSubmitting} />
        <NewProjectSetupPreview defaultRegion={defaultRegion} defaultPlan={defaultPlan} />
      </Box>
    </ConsolePageShell>
  );
}
