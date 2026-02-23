import ArticleIcon from "@mui/icons-material/Article";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { AppLogsHeaderProps } from "@/shared/types/appsComponents";

export default function AppLogsHeader({ isLoading, isRefreshing, onRefresh, onClear }: AppLogsHeaderProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <ArticleIcon />
        <Box>
          <Typography variant="h6" fontWeight={800}>Logs</Typography>
          <Typography variant="body2" color="text.secondary">Stream app logs and filter by severity level.</Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh} disabled={isLoading || isRefreshing}>
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
        <Button size="small" variant="outlined" color="error" startIcon={<DeleteSweepIcon />} onClick={onClear}>Clear</Button>
      </Stack>
    </Stack>
  );
}
