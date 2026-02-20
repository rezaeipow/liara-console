import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PowerOffOutlinedIcon from "@mui/icons-material/PowerOffOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  useCreateVmMutation,
  useDeleteVmMutation,
  useGetVmsByProjectQuery,
  useRebootVmMutation,
  useStartVmMutation,
  useStopVmMutation,
} from "../../../app/store/api";
import type { Vm } from "../../../api/types";

type StatusFilter = "all" | Vm["status"];
type SortMode = "name-asc" | "name-desc" | "cpu-desc" | "ram-desc";
type ViewMode = "cards" | "table";
type ActionType = "start" | "stop" | "reboot" | "delete";

const statusOptions: StatusFilter[] = ["all", "running", "stopped"];
const sortOptions: SortMode[] = ["name-asc", "name-desc", "cpu-desc", "ram-desc"];
const viewOptions: ViewMode[] = ["cards", "table"];

function formatMemory(mb: number) {
  return `${(mb / 1024).toFixed(1)} GB`;
}

export default function ProjectVmsPage() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: vmsResponse,
    isLoading,
    error,
    refetch,
  } = useGetVmsByProjectQuery(projectId ?? "", { skip: !projectId });
  const [startVm] = useStartVmMutation();
  const [stopVm] = useStopVmMutation();
  const [rebootVm] = useRebootVmMutation();
  const [createVm, { isLoading: isCreating }] = useCreateVmMutation();
  const [deleteVm] = useDeleteVmMutation();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createCpu, setCreateCpu] = useState("2");
  const [createRam, setCreateRam] = useState("4096");
  const [createDisk, setCreateDisk] = useState("40");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ vmId: string; type: ActionType } | null>(null);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuVmId, setMenuVmId] = useState<string | null>(null);

  const rawStatus = searchParams.get("status");
  const rawSort = searchParams.get("sort");
  const rawView = searchParams.get("view");
  const query = searchParams.get("q") ?? "";

  const statusFilter: StatusFilter =
    rawStatus && statusOptions.includes(rawStatus as StatusFilter) ? (rawStatus as StatusFilter) : "all";
  const sortMode: SortMode =
    rawSort && sortOptions.includes(rawSort as SortMode) ? (rawSort as SortMode) : "name-asc";
  const viewMode: ViewMode =
    rawView && viewOptions.includes(rawView as ViewMode) ? (rawView as ViewMode) : "cards";

  const updateSearchParam = useCallback(
    (key: string, value: string, removeWhen: string) => {
      const next = new URLSearchParams(searchParams);
      if (!value || value === removeWhen) next.delete(key);
      else next.set(key, value);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const vms = useMemo(() => vmsResponse?.items ?? [], [vmsResponse]);

  const filteredVms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const next = vms.filter((vm) => {
      const matchesQuery = normalized ? vm.name.toLowerCase().includes(normalized) : true;
      const matchesStatus = statusFilter === "all" ? true : vm.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    next.sort((left, right) => {
      if (sortMode === "name-asc") return left.name.localeCompare(right.name);
      if (sortMode === "name-desc") return right.name.localeCompare(left.name);
      if (sortMode === "cpu-desc") return right.cpu - left.cpu;
      return right.ram - left.ram;
    });
    return next;
  }, [query, sortMode, statusFilter, vms]);

  const summary = useMemo(() => {
    const running = vms.filter((vm) => vm.status === "running").length;
    const stopped = vms.filter((vm) => vm.status === "stopped").length;
    const totalCpu = vms.reduce((total, vm) => total + vm.cpu, 0);
    const totalRam = vms.reduce((total, vm) => total + vm.ram, 0);
    return { total: vms.length, running, stopped, totalCpu, totalRam };
  }, [vms]);

  const getVmStatusSx = (status: Vm["status"]) =>
    status === "running"
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

  const canCreateVm =
    createName.trim().length >= 3 &&
    Number(createCpu) > 0 &&
    Number(createRam) > 0 &&
    Number(createDisk) > 0 &&
    !isCreating;

  const createNameError =
    createName.trim().length === 0
      ? "Name is required."
      : createName.trim().length < 3
        ? "Use at least 3 characters."
        : null;
  const createCpuError = Number(createCpu) <= 0 ? "CPU must be greater than 0." : null;
  const createRamError = Number(createRam) < 512 ? "RAM must be at least 512 MB." : null;
  const createDiskError = Number(createDisk) < 10 ? "Disk must be at least 10 GB." : null;

  const handleCreateVm = async () => {
    if (!projectId || !canCreateVm) return;
    try {
      await createVm({
        projectId,
        name: createName.trim(),
        cpu: Number(createCpu),
        ram: Number(createRam),
        disk: Number(createDisk),
      }).unwrap();
      setCreateDialogOpen(false);
      setCreateName("");
      setCreateCpu("2");
      setCreateRam("4096");
      setCreateDisk("40");
      setSnackbarSeverity("success");
      setSnackbarMessage("VM created.");
      void refetch();
    } catch (requestError: unknown) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        requestError instanceof Error ? requestError.message : "Could not create VM.",
      );
    }
  };

  const runAction = async () => {
    if (!pendingAction) return;
    const { vmId, type } = pendingAction;
    setActionLoadingId(`${type}:${vmId}`);

    try {
      if (type === "start") {
        await startVm({ vmId, projectId: projectId ?? "" }).unwrap();
        setSnackbarSeverity("success");
        setSnackbarMessage("VM started.");
      } else if (type === "stop") {
        await stopVm({ vmId, projectId: projectId ?? "" }).unwrap();
        setSnackbarSeverity("info");
        setSnackbarMessage("VM stopped.");
      } else if (type === "reboot") {
        await rebootVm({ vmId, projectId: projectId ?? "" }).unwrap();
        setSnackbarSeverity("info");
        setSnackbarMessage("VM rebooted.");
      } else {
        await deleteVm({ vmId, projectId: projectId ?? "" }).unwrap();
        setConfirmOpen(false);
        setPendingAction(null);
        setSnackbarSeverity("success");
        setSnackbarMessage("VM deleted.");
      }
      void refetch();
    } catch (requestError: unknown) {
      setSnackbarSeverity("error");
      setSnackbarMessage(requestError instanceof Error ? requestError.message : "Action failed.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const askAction = (vmId: string, type: ActionType) => {
    setPendingAction({ vmId, type });
    setConfirmOpen(true);
  };

  const pendingVm = pendingAction ? vms.find((vm) => vm.id === pendingAction.vmId) : null;

  const confirmTitle =
    pendingAction?.type === "start"
      ? "Start VM"
      : pendingAction?.type === "stop"
        ? "Stop VM"
        : pendingAction?.type === "reboot"
          ? "Reboot VM"
          : "Delete VM";

  const confirmMessage =
    pendingAction?.type === "delete"
      ? `Delete ${pendingVm?.name ?? "this VM"}? This action is destructive and cannot be undone.`
      : `${confirmTitle} will change runtime state for ${pendingVm?.name ?? "this VM"}.`;

  return (
    <>
      <Stack
        spacing={2.1}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 1080, xl: 1220 },
          mx: { xs: 0, sm: "auto" },
          mt: { xs: 1.25, sm: 1.5, lg: 1.5 },
          px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: { xs: 1.5, sm: 2 },
            background: "linear-gradient(120deg, rgba(14,116,144,0.2), rgba(31,111,235,0.14))",
            border: "1px solid rgba(14,116,144,0.28)",
          }}
        >
          <Stack spacing={1.25}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <DnsOutlinedIcon />
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    Project Virtual Machines
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compute inventory and operational controls for this project.
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => void refetch()}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Add VM
                </Button>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip size="small" label={`Total: ${summary.total}`} variant="outlined" />
              <Chip size="small" label={`Running: ${summary.running}`} variant="outlined" />
              <Chip size="small" label={`Stopped: ${summary.stopped}`} variant="outlined" />
              <Chip size="small" label={`vCPU: ${summary.totalCpu}`} variant="outlined" />
              <Chip size="small" label={`RAM: ${formatMemory(summary.totalRam)}`} variant="outlined" />
            </Stack>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: "1px solid rgba(148,163,184,0.24)",
            background: "linear-gradient(180deg, rgba(148,163,184,0.08), rgba(255,255,255,0.64))",
          }}
        >
          <Stack direction={{ xs: "column", lg: "row" }} spacing={1} justifyContent="space-between">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ flex: 1 }}>
              <TextField
                size="small"
                label="Search"
                value={query}
                onChange={(event) => updateSearchParam("q", event.target.value, "")}
                sx={{ minWidth: { xs: "100%", sm: 240 } }}
              />
              <Stack direction="row" spacing={0.6} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip
                  label="All"
                  clickable
                  variant={statusFilter === "all" ? "filled" : "outlined"}
                  color={statusFilter === "all" ? "primary" : "default"}
                  onClick={() => updateSearchParam("status", "all", "all")}
                />
                <Chip
                  label="Running"
                  clickable
                  variant={statusFilter === "running" ? "filled" : "outlined"}
                  color="default"
                  onClick={() => updateSearchParam("status", "running", "all")}
                  sx={
                    statusFilter === "running"
                      ? {
                          backgroundColor: "#1d4ed8",
                          color: "#ffffff",
                          borderColor: "#1e40af",
                          "& .MuiChip-label": { color: "#ffffff", fontWeight: 700 },
                        }
                      : undefined
                  }
                />
                <Chip
                  label="Stopped"
                  clickable
                  variant={statusFilter === "stopped" ? "filled" : "outlined"}
                  color="default"
                  onClick={() => updateSearchParam("status", "stopped", "all")}
                  sx={
                    statusFilter === "stopped"
                      ? {
                          backgroundColor: "#6b7280",
                          color: "#ffffff",
                          borderColor: "#4b5563",
                          "& .MuiChip-label": { color: "#ffffff", fontWeight: 700 },
                        }
                      : undefined
                  }
                />
              </Stack>
              <TextField
                select
                size="small"
                label="Sort"
                value={sortMode}
                onChange={(event) => updateSearchParam("sort", event.target.value, "name-asc")}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="name-asc">Name A-Z</MenuItem>
                <MenuItem value="name-desc">Name Z-A</MenuItem>
                <MenuItem value="cpu-desc">CPU (desc)</MenuItem>
                <MenuItem value="ram-desc">RAM (desc)</MenuItem>
              </TextField>
            </Stack>

            <ToggleButtonGroup
              size="small"
              value={viewMode}
              exclusive
              onChange={(_, value: ViewMode | null) => {
                if (value) updateSearchParam("view", value, "cards");
              }}
            >
              <ToggleButton value="cards">Cards</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Paper>

        {error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => void refetch()}>
                Retry
              </Button>
            }
          >
            {error && "data" in error
              ? (error.data as { message?: string }).message ?? "Could not load virtual machines."
              : "Could not load virtual machines."}
          </Alert>
        ) : null}

        <Paper
          sx={{
            p: { xs: 1.5, sm: 1.75 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: "1px solid rgba(148,163,184,0.24)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.74), rgba(248,250,252,0.92))",
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
                gap: 1.25,
              }}
            >
              {Array.from({ length: 4 }).map((_, idx) => (
                <Paper key={`vm-skeleton-${idx}`} variant="outlined" sx={{ p: 1.4 }}>
                  <Stack spacing={1}>
                    <Skeleton variant="text" width="58%" height={28} />
                    <Skeleton variant="rounded" width={86} height={24} />
                    <Skeleton variant="rounded" height={42} />
                    <Skeleton variant="rounded" height={36} />
                  </Stack>
                </Paper>
              ))}
            </Box>
          ) : filteredVms.length === 0 ? (
            vms.length === 0 ? (
              <Alert
                severity="info"
                action={
                  <Button size="small" color="inherit" onClick={() => setCreateDialogOpen(true)}>
                    Add VM
                  </Button>
                }
              >
                No virtual machines yet. Create your first VM to start running workloads.
              </Alert>
            ) : (
              <Alert
                severity="info"
                action={
                  <Button size="small" color="inherit" onClick={() => updateSearchParam("status", "all", "all")}>
                    Clear filters
                  </Button>
                }
              >
                No VMs match the selected filters.
              </Alert>
            )
          ) : viewMode === "cards" ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
                gap: 1.25,
              }}
            >
              {filteredVms.map((vm) => (
                <Paper
                  key={vm.id}
                  variant="outlined"
                  sx={{
                    p: 1.35,
                    borderRadius: 1.5,
                    borderColor: alpha("#1f6feb", 0.16),
                    transition: "transform 160ms ease, border-color 160ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: alpha("#1f6feb", 0.34),
                    },
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={800} noWrap title={vm.name}>
                          {vm.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {vm.id}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Chip
                          size="small"
                          label={vm.status}
                          color="default"
                          sx={{ textTransform: "capitalize", ...getVmStatusSx(vm.status) }}
                        />
                        <IconButton
                          size="small"
                          aria-label={`More actions for ${vm.name}`}
                          onClick={(event) => {
                            setMenuAnchorEl(event.currentTarget);
                            setMenuVmId(vm.id);
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                      <Chip size="small" variant="outlined" label={`CPU: ${vm.cpu} vCPU`} />
                      <Chip size="small" variant="outlined" label={`RAM: ${formatMemory(vm.ram)}`} />
                      <Chip size="small" variant="outlined" label={`Disk: ${vm.disk} GB`} />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={0.65} useFlexGap>
                      <Button
                        component={Link}
                        to={`/console/vms/${vm.id}/overview`}
                        variant="contained"
                        size="small"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        Open
                      </Button>
                      <Button
                        component={Link}
                        to={`/console/vms/${vm.id}/settings`}
                        variant="outlined"
                        size="small"
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        Settings
                      </Button>
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={0.65} useFlexGap>
                      {vm.status === "stopped" ? (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PowerSettingsNewOutlinedIcon fontSize="small" />}
                          onClick={() => askAction(vm.id, "start")}
                          disabled={actionLoadingId === `start:${vm.id}`}
                          sx={{ width: { xs: "100%", sm: "auto" } }}
                        >
                          Start
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PowerOffOutlinedIcon fontSize="small" />}
                          onClick={() => askAction(vm.id, "stop")}
                          disabled={actionLoadingId === `stop:${vm.id}`}
                          sx={{ width: { xs: "100%", sm: "auto" } }}
                        >
                          Stop
                        </Button>
                      )}

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<RestartAltOutlinedIcon fontSize="small" />}
                        onClick={() => askAction(vm.id, "reboot")}
                        disabled={actionLoadingId === `reboot:${vm.id}`}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        Reboot
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Box>
          ) : (
            <TableContainer>
              <Table size="small" aria-label="vms table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>CPU</TableCell>
                    <TableCell>RAM</TableCell>
                    <TableCell>Disk</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVms.map((vm) => (
                    <TableRow key={vm.id} hover>
                      <TableCell>{vm.name}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={vm.status}
                          color="default"
                          sx={{ textTransform: "capitalize", ...getVmStatusSx(vm.status) }}
                        />
                      </TableCell>
                      <TableCell>{vm.cpu} vCPU</TableCell>
                      <TableCell>{formatMemory(vm.ram)}</TableCell>
                      <TableCell>{vm.disk} GB</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.6} justifyContent="flex-end">
                          <Button component={Link} to={`/console/vms/${vm.id}/overview`} size="small">
                            Open
                          </Button>
                          {vm.status === "stopped" ? (
                            <Button
                              size="small"
                              onClick={() => askAction(vm.id, "start")}
                              disabled={actionLoadingId === `start:${vm.id}`}
                            >
                              Start
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              onClick={() => askAction(vm.id, "stop")}
                              disabled={actionLoadingId === `stop:${vm.id}`}
                            >
                              Stop
                            </Button>
                          )}
                          <Button
                            size="small"
                            onClick={() => askAction(vm.id, "reboot")}
                            disabled={actionLoadingId === `reboot:${vm.id}`}
                          >
                            Reboot
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => askAction(vm.id, "delete")}
                            disabled={actionLoadingId === `delete:${vm.id}`}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Stack>

      <Dialog
        open={createDialogOpen}
        onClose={() => {
          if (!isCreating) {
            setCreateDialogOpen(false);
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Create Virtual Machine</DialogTitle>
        <DialogContent>
          <Stack spacing={1.1} sx={{ pt: 1 }}>
            <TextField
              size="small"
              label="VM name"
              value={createName}
              onChange={(event) => setCreateName(event.target.value)}
              helperText={createNameError ?? "At least 3 characters"}
              error={Boolean(createNameError)}
              disabled={isCreating}
              required
            />
            <TextField
              select
              size="small"
              label="CPU (vCPU)"
              value={createCpu}
              onChange={(event) => setCreateCpu(event.target.value)}
              disabled={isCreating}
              helperText={createCpuError ?? "Number of virtual CPUs"}
              error={Boolean(createCpuError)}
            >
              <MenuItem value="1">1 vCPU</MenuItem>
              <MenuItem value="2">2 vCPU</MenuItem>
              <MenuItem value="4">4 vCPU</MenuItem>
              <MenuItem value="8">8 vCPU</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="RAM (MB)"
              value={createRam}
              onChange={(event) => setCreateRam(event.target.value)}
              disabled={isCreating}
              helperText={createRamError ?? "Memory in MB"}
              error={Boolean(createRamError)}
            >
              <MenuItem value="1024">1 GB</MenuItem>
              <MenuItem value="2048">2 GB</MenuItem>
              <MenuItem value="4096">4 GB</MenuItem>
              <MenuItem value="8192">8 GB</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Disk (GB)"
              value={createDisk}
              onChange={(event) => setCreateDisk(event.target.value)}
              disabled={isCreating}
              helperText={createDiskError ?? "Disk size in GB"}
              error={Boolean(createDiskError)}
            >
              <MenuItem value="20">20 GB</MenuItem>
              <MenuItem value="40">40 GB</MenuItem>
              <MenuItem value="80">80 GB</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateDialogOpen(false);
            }}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={() => void handleCreateVm()} disabled={!canCreateVm}>
            {isCreating ? "Creating..." : "Create VM"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmOpen}
        onClose={() => {
          if (!actionLoadingId) {
            setConfirmOpen(false);
            setPendingAction(null);
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{confirmTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ pt: 0.25 }}>
            {pendingAction?.type === "delete" ? <WarningAmberIcon color="error" /> : null}
            <Typography variant="body2" color="text.secondary">
              {confirmMessage}
            </Typography>
            <Divider />
            <Typography variant="caption" color="text.secondary">
              VM ID: {pendingAction?.vmId ?? "-"}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              setPendingAction(null);
            }}
            disabled={Boolean(actionLoadingId)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={pendingAction?.type === "delete" ? "error" : "primary"}
            onClick={() => void runAction()}
            disabled={Boolean(actionLoadingId)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl) && Boolean(menuVmId)}
        onClose={() => {
          setMenuAnchorEl(null);
          setMenuVmId(null);
        }}
      >
        <MenuItem
          component={Link}
          to={`/console/vms/${menuVmId ?? ""}/overview`}
          onClick={() => {
            setMenuAnchorEl(null);
            setMenuVmId(null);
          }}
        >
          Open Overview
        </MenuItem>
        <MenuItem
          component={Link}
          to={`/console/vms/${menuVmId ?? ""}/settings`}
          onClick={() => {
            setMenuAnchorEl(null);
            setMenuVmId(null);
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            if (menuVmId) {
              askAction(menuVmId, "delete");
            }
            setMenuAnchorEl(null);
            setMenuVmId(null);
          }}
          disabled={menuVmId ? actionLoadingId === `delete:${menuVmId}` : false}
        >
          Delete
        </MenuItem>
      </Menu>

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={2800}
        onClose={() => setSnackbarMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbarSeverity} variant="filled" onClose={() => setSnackbarMessage("")}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
