import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Button, Stack, Typography } from "@mui/material";
import ViewModeToggle from "@/shared/components/common/ViewModeToggle";
import type { AppDeploymentsHeaderProps } from "@/shared/types/appsComponents";

export default function AppDeploymentsHeader({ viewMode, onViewChange, onRefresh, isLoading }: AppDeploymentsHeaderProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <RocketLaunchIcon />
        <Box>
          <Typography variant="h6" fontWeight={800}>Deployments</Typography>
          <Typography variant="body2" color="text.secondary">Track release history and status changes for this app.</Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <ViewModeToggle value={viewMode} onChange={onViewChange} />
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={onRefresh} disabled={isLoading}>Refresh</Button>
      </Stack>
    </Stack>
  );
}
