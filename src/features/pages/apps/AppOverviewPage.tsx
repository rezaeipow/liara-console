import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DnsIcon from "@mui/icons-material/Dns";
import KeyIcon from "@mui/icons-material/Key";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import {
  Alert,
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { NavLink, useOutletContext, useParams } from "react-router-dom";
import { AppsAPI } from "../../../api/appsApi";
import type { AppService } from "../../../api/types";

type AppLayoutContext = {
  app: AppService | null;
  isLoading: boolean;
  error: string | null;
};

export default function AppOverviewPage() {
  const { appId } = useParams();
  const { app, isLoading, error } = useOutletContext<AppLayoutContext>();

  const [deploymentsCount, setDeploymentsCount] = useState<number | null>(null);
  const [envCount, setEnvCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const loadOverviewStats = async () => {
      if (!appId) return;
      try {
        const [deploymentsResponse, envResponse] = await Promise.all([
          AppsAPI.getDeployments(appId),
          AppsAPI.getEnvVars(appId),
        ]);
        if (!active) return;
        setDeploymentsCount(deploymentsResponse.items.length);
        setEnvCount(envResponse.items.length);
      } catch {
        if (!active) return;
        setDeploymentsCount(null);
        setEnvCount(null);
      }
    };

    void loadOverviewStats();

    return () => {
      active = false;
    };
  }, [appId]);

  if (isLoading) {
    return (
      <Stack spacing={1.2}>
        <Skeleton variant="text" width={220} height={30} />
        <Skeleton variant="rounded" height={86} />
        <Skeleton variant="rounded" height={86} />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!app) {
    return <Alert severity="warning">App data is not available.</Alert>;
  }

  return (
    <Stack spacing={1.4}>
      <Typography variant="h6" fontWeight={800}>
        Overview
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Monitor deployment state, environment variables, and quick health actions.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
          gap: 1.25,
        }}
      >
        <Paper variant="outlined" sx={{ p: 1.5, borderColor: alpha("#1f6feb", 0.2) }}>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <ReceiptLongIcon fontSize="small" />
              <Typography fontWeight={700}>Deployments</Typography>
            </Stack>
            <Typography variant="h6" fontWeight={800}>
              {deploymentsCount ?? "-"}
            </Typography>
            <Button component={NavLink} to="../deployments" size="small" variant="outlined">
              Open deployments
            </Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 1.5, borderColor: alpha("#1f6feb", 0.2) }}>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <KeyIcon fontSize="small" />
              <Typography fontWeight={700}>Env Variables</Typography>
            </Stack>
            <Typography variant="h6" fontWeight={800}>
              {envCount ?? "-"}
            </Typography>
            <Button component={NavLink} to="../env" size="small" variant="outlined">
              Manage env
            </Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 1.5, borderColor: alpha("#1f6feb", 0.2) }}>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <DnsIcon fontSize="small" />
              <Typography fontWeight={700}>Runtime</Typography>
            </Stack>
            <Typography variant="h6" fontWeight={800} sx={{ textTransform: "capitalize" }}>
              {app.status}
            </Typography>
            <Button component={NavLink} to="../logs" size="small" variant="outlined">
              Inspect logs
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          borderColor: alpha("#0f172a", 0.12),
          backgroundColor: alpha("#ffffff", 0.5),
        }}
      >
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.6 }}>
          <AutoAwesomeIcon fontSize="small" />
          <Typography fontWeight={700}>Quick Tip</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Use the <strong>Deployments</strong> tab to track release status and switch to{" "}
          <strong>Env</strong> to update runtime configuration safely.
        </Typography>
      </Paper>
    </Stack>
  );
}
