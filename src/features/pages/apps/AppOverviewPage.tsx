import { Alert, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useOutletContext } from "react-router-dom";
import AppOverviewCards from "./components/AppOverviewCards";
import AppOverviewLoading from "./components/AppOverviewLoading";
import type { AppLayoutContext } from "./pageTypes";
import { useAppOverviewStats } from "./useAppOverviewStats";

export default function AppOverviewPage() {
  const theme = useTheme();
  const { app, isLoading, error } = useOutletContext<AppLayoutContext>();
  const { deploymentsCount, envCount } = useAppOverviewStats();

  if (isLoading) return <AppOverviewLoading isLoading={isLoading} />;

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!app) return <Alert severity="warning">App data is not available.</Alert>;

  return (
    <Stack spacing={1.4}>
      <Typography variant="h6" fontWeight={800}>
        Overview
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Monitor deployment state, environment variables, and quick health
        actions.
      </Typography>
      <AppOverviewCards
        appStatus={app.status}
        deploymentsCount={deploymentsCount}
        envCount={envCount}
        theme={theme}
      />
    </Stack>
  );
}
