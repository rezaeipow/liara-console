import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import PowerOffOutlinedIcon from "@mui/icons-material/PowerOffOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { VmsAPI } from "../../../api/vmsApi";
import type { Vm } from "../../../api/types";

function formatMemory(mb: number) {
  return `${(mb / 1024).toFixed(1)} GB`;
}

function deriveMockUsage(vmId: string, maxCpu: number, maxRam: number, maxDisk: number) {
  const hash = [...vmId].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const cpuUsed = Math.max(1, Math.min(maxCpu, Math.round((hash % maxCpu) + 1)));
  const ramUsed = Math.max(256, Math.min(maxRam, Math.round((hash * 97) % maxRam)));
  const diskUsed = Math.max(4, Math.min(maxDisk, Math.round((hash * 13) % maxDisk)));
  return { cpuUsed, ramUsed, diskUsed };
}

export default function VmOverviewPage() {
  const { vmId } = useParams();

  const [vm, setVm] = useState<Vm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"start" | "stop" | "reboot" | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" | "info" } | null>(null);

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

  const usage = useMemo(() => {
    if (!vm) return null;
    return deriveMockUsage(vm.id, vm.cpu, vm.ram, vm.disk);
  }, [vm]);

  const statusChipSx =
    vm?.status === "running"
      ? {
          backgroundColor: "#1d4ed8",
          color: "#ffffff",
          borderColor: "#1e40af",
          "& .MuiChip-label": { color: "#ffffff", fontWeight: 700 },
        }
      : {
          backgroundColor: "#6b7280",
          color: "#ffffff",
          borderColor: "#4b5563",
          "& .MuiChip-label": { color: "#ffffff", fontWeight: 700 },
        };

  const runAction = async (type: "start" | "stop" | "reboot") => {
    if (!vm) return;
    setActionLoading(type);
    try {
      if (type === "start") {
        await VmsAPI.start(vm.id);
        setVm((prev) => (prev ? { ...prev, status: "running" } : prev));
        setToast({ severity: "success", message: "VM started." });
      } else if (type === "stop") {
        await VmsAPI.stop(vm.id);
        setVm((prev) => (prev ? { ...prev, status: "stopped" } : prev));
        setToast({ severity: "info", message: "VM stopped." });
      } else {
        await VmsAPI.reboot(vm.id);
        setVm((prev) => (prev ? { ...prev, status: "running" } : prev));
        setToast({ severity: "info", message: "VM rebooted." });
      }
    } catch (requestError: unknown) {
      setToast({
        severity: "error",
        message: requestError instanceof Error ? requestError.message : "Action failed.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <Stack spacing={1.25}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Paper key={`vm-overview-skeleton-${idx}`} variant="outlined" sx={{ p: 1.4 }}>
            <Stack spacing={1}>
              <Skeleton variant="text" width="45%" height={28} />
              <Skeleton variant="rounded" height={36} />
              <Skeleton variant="rounded" height={36} />
            </Stack>
          </Paper>
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button size="small" color="inherit" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (!vm || !usage) {
    return <Alert severity="warning">VM data is not available.</Alert>;
  }

  const cpuPercent = Math.round((usage.cpuUsed / vm.cpu) * 100);
  const ramPercent = Math.round((usage.ramUsed / vm.ram) * 100);
  const diskPercent = Math.round((usage.diskUsed / vm.disk) * 100);

  return (
    <>
      <Stack spacing={1.4}>
        <Paper
          sx={{
            p: { xs: 1.5, sm: 1.8 },
            borderRadius: 1.75,
            border: `1px solid ${alpha("#1f6feb", 0.18)}`,
            background: "linear-gradient(160deg, rgba(31,111,235,0.14), rgba(14,116,144,0.1))",
          }}
        >
          <Stack spacing={1.1}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <StorageOutlinedIcon />
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    VM Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Runtime and resource snapshot for {vm.name}.
                  </Typography>
                </Box>
              </Stack>
              <Chip size="small" label={vm.status} color="default" sx={{ textTransform: "capitalize", ...statusChipSx }} />
            </Stack>
            <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
              <Chip size="small" variant="outlined" label={`vCPU: ${vm.cpu}`} />
              <Chip size="small" variant="outlined" label={`RAM: ${formatMemory(vm.ram)}`} />
              <Chip size="small" variant="outlined" label={`Disk: ${vm.disk} GB`} />
            </Stack>
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: 1.75 }}>
          <Stack spacing={1.15}>
            <Typography fontWeight={800}>Actions</Typography>
            <Divider />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} useFlexGap>
              {vm.status === "stopped" ? (
                <Button
                  variant="outlined"
                  startIcon={<PowerSettingsNewOutlinedIcon />}
                  onClick={() => void runAction("start")}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === "start" ? "Starting..." : "Start"}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<PowerOffOutlinedIcon />}
                  onClick={() => void runAction("stop")}
                  disabled={actionLoading !== null}
                >
                  {actionLoading === "stop" ? "Stopping..." : "Stop"}
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<RestartAltOutlinedIcon />}
                onClick={() => void runAction("reboot")}
                disabled={actionLoading !== null}
              >
                {actionLoading === "reboot" ? "Rebooting..." : "Reboot"}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: 1.75 }}>
          <Stack spacing={1.1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <MemoryOutlinedIcon />
              <Typography fontWeight={800}>Resource Snapshot</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Usage values are mock telemetry generated deterministically for this demo.
            </Typography>
            <Divider />

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">CPU</Typography>
                <Typography variant="caption" color="text.secondary">
                  {usage.cpuUsed}/{vm.cpu} vCPU ({cpuPercent}%)
                </Typography>
              </Stack>
              <LinearProgress value={cpuPercent} variant="determinate" sx={{ mt: 0.5, height: 8, borderRadius: 999 }} />
            </Box>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">RAM</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatMemory(usage.ramUsed)}/{formatMemory(vm.ram)} ({ramPercent}%)
                </Typography>
              </Stack>
              <LinearProgress
                value={ramPercent}
                variant="determinate"
                sx={{ mt: 0.5, height: 8, borderRadius: 999 }}
                color="secondary"
              />
            </Box>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Disk</Typography>
                <Typography variant="caption" color="text.secondary">
                  {usage.diskUsed}/{vm.disk} GB ({diskPercent}%)
                </Typography>
              </Stack>
              <LinearProgress
                value={diskPercent}
                variant="determinate"
                sx={{ mt: 0.5, height: 8, borderRadius: 999 }}
                color="warning"
              />
            </Box>
          </Stack>
        </Paper>
      </Stack>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2800}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast?.severity ?? "success"} variant="filled" onClose={() => setToast(null)}>
          {toast?.message ?? ""}
        </Alert>
      </Snackbar>
    </>
  );
}
