import { Box, Button, Stack } from "@mui/material";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { PagePlaceholder } from "../PagePlaceholder";

export default function AppLayoutPage() {
  const { appId } = useParams();
  return (
    <PagePlaceholder title={`App: ${appId ?? "-"}`} description="/console/apps/:appId/*">
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <Button component={NavLink} to="overview" size="small" variant="outlined">Overview</Button>
        <Button component={NavLink} to="deployments" size="small" variant="outlined">Deployments</Button>
        <Button component={NavLink} to="env" size="small" variant="outlined">Env</Button>
        <Button component={NavLink} to="logs" size="small" variant="outlined">Logs</Button>
        <Button component={NavLink} to="settings" size="small" variant="outlined">Settings</Button>
      </Stack>
      <Box>
        <Outlet />
      </Box>
    </PagePlaceholder>
  );
}
