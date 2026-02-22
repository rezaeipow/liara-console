import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Chip, Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { VmsAPI } from "../../../api/vmsApi";
import type { Vm } from "../../../api/types";

export default function VmLayoutPage() {
  const theme = useTheme();
  const { vmId } = useParams();
  const [vm, setVm] = useState<Vm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadVm = async () => {
      if (!vmId) {
        if (!active) return;
        setError("VM id is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await VmsAPI.getById(vmId);
        if (!active) return;
        setVm(response);
      } catch (requestError: unknown) {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "Could not load VM.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadVm();

    return () => {
      active = false;
    };
  }, [vmId]);

  const statusChipSx =
    vm?.status === "running"
      ? {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderColor: theme.palette.primary.dark,
          "& .MuiChip-label": { color: theme.palette.primary.contrastText, fontWeight: 700 },
        }
      : {
          backgroundColor: alpha(theme.palette.text.secondary, 0.9),
          color: theme.palette.common.white,
          borderColor: alpha(theme.palette.text.secondary, 0.98),
          "& .MuiChip-label": { color: theme.palette.common.white, fontWeight: 700 },
        };

  return (
    <Stack
      spacing={2}
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
          border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
          background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
        }}
      >
        {isLoading ? (
          <Stack spacing={0.9}>
            <Skeleton variant="text" width={220} height={36} />
            <Skeleton variant="text" width={180} />
            <Stack direction="row" spacing={0.8}>
              <Skeleton variant="rounded" width={88} height={24} />
              <Skeleton variant="rounded" width={82} height={24} />
              <Skeleton variant="rounded" width={96} height={24} />
            </Stack>
          </Stack>
        ) : error ? (
          <Box>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <Stack spacing={1}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <DnsOutlinedIcon />
                <Box>
                  <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography variant="h5" fontWeight={800}>
                      {vm?.name}
                    </Typography>
                    <Chip size="small" label="VM Console" variant="outlined" />
                  </Stack>
                </Box>
              </Stack>
              {vm?.projectId ? (
                <Button
                  component={NavLink}
                  to={`/console/projects/${vm.projectId}/vms`}
                  variant="outlined"
                  size="small"
                  startIcon={<ArrowBackIcon />}
                >
                  Back to VMs List
                </Button>
              ) : null}
            </Stack>

            <Box
              sx={{
                pt: 0.25,
                display: "grid",
                gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(3, max-content)" },
                gap: 0.8,
                justifyContent: { sm: "flex-start" },
              }}
            >
              {[
                { label: "Overview", path: "overview" },
                { label: "Metrics", path: "metrics" },
                { label: "Settings", path: "settings" },
              ].map((tab) => (
                <Button
                  key={tab.path}
                  component={NavLink}
                  to={tab.path}
                  size="small"
                  variant="outlined"
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: 0, sm: 88 },
                    whiteSpace: "nowrap",
                    "&.active": {
                      borderColor: alpha(theme.palette.primary.main, 0.42),
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Stack>
        )}
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: { xs: 1.5, sm: 2 } }}>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 1.25 }}>
          <Chip
            size="small"
            label={vm?.status ?? "unknown"}
            color="default"
            sx={{ textTransform: "capitalize", ...statusChipSx }}
          />
          <Chip size="small" label={`${vm?.cpu ?? "-"} vCPU`} variant="outlined" />
          <Chip size="small" label={`${vm?.ram ? `${(vm.ram / 1024).toFixed(1)} GB` : "-"}`} variant="outlined" />
          <Chip size="small" label={`${vm?.disk ?? "-"} GB Disk`} variant="outlined" />
        </Stack>
        <Divider sx={{ mb: 1.5, opacity: 0.55 }} />
        <Outlet context={{ vm, isLoading, error, setVm }} />
      </Paper>
    </Stack>
  );
}
