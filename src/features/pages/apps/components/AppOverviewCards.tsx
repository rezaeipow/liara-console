import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DnsIcon from "@mui/icons-material/Dns";
import KeyIcon from "@mui/icons-material/Key";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import type { AppOverviewCardsProps } from "@/shared/types/appsComponents";

export default function AppOverviewCards({ appStatus, deploymentsCount, envCount, theme }: AppOverviewCardsProps) {
  return (
    <>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" }, gap: 1.25 }}>
        <Paper variant="outlined" sx={{ p: 1.5, borderColor: alpha(theme.palette.primary.main, 0.2) }}>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.8} alignItems="center"><ReceiptLongIcon fontSize="small" /><Typography fontWeight={700}>Deployments</Typography></Stack>
            <Typography variant="h6" fontWeight={800}>{deploymentsCount ?? "-"}</Typography>
            <Button component={NavLink} to="../deployments" size="small" variant="outlined">Open deployments</Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 1.5, borderColor: alpha(theme.palette.primary.main, 0.2) }}>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.8} alignItems="center"><KeyIcon fontSize="small" /><Typography fontWeight={700}>Env Variables</Typography></Stack>
            <Typography variant="h6" fontWeight={800}>{envCount ?? "-"}</Typography>
            <Button component={NavLink} to="../env" size="small" variant="outlined">Manage env</Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 1.5, borderColor: alpha(theme.palette.primary.main, 0.2) }}>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.8} alignItems="center"><DnsIcon fontSize="small" /><Typography fontWeight={700}>Runtime</Typography></Stack>
            <Typography variant="h6" fontWeight={800} sx={{ textTransform: "capitalize" }}>{appStatus}</Typography>
            <Button component={NavLink} to="../logs" size="small" variant="outlined">Inspect logs</Button>
          </Stack>
        </Paper>
      </Box>

      <Paper variant="outlined" sx={{ p: 1.5, borderColor: alpha(theme.palette.text.primary, 0.12), backgroundColor: alpha(theme.palette.common.white, 0.5) }}>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.6 }}>
          <AutoAwesomeIcon fontSize="small" />
          <Typography fontWeight={700}>Quick Tip</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Use the <strong>Deployments</strong> tab to track release status and switch to <strong>Env</strong> to update runtime configuration safely.
        </Typography>
      </Paper>
    </>
  );
}
