import { Box, Button, Stack } from "@mui/material";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { PagePlaceholder } from "../PagePlaceholder";

export default function VmLayoutPage() {
  const { vmId } = useParams();
  return (
    <PagePlaceholder title={`VM: ${vmId ?? "-"}`} description="/console/vms/:vmId/*">
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <Button component={NavLink} to="overview" size="small" variant="outlined">Overview</Button>
        <Button component={NavLink} to="metrics" size="small" variant="outlined">Metrics</Button>
        <Button component={NavLink} to="settings" size="small" variant="outlined">Settings</Button>
      </Stack>
      <Box>
        <Outlet />
      </Box>
    </PagePlaceholder>
  );
}
