
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
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
import { alpha, useTheme } from "@mui/material/styles";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { AppService, Deployment } from "../../../api/types";
import {
  useCreateAppMutation,
  useDeleteAppMutation,
  useGetAppsByProjectQuery,
  useGetDeploymentsByProjectQuery,
  useRestartAppMutation,
} from "../../../app/store/api";

const regionOptions = ["ir-thr", "tr-ist", "de-fra", "us-nyc"];
const planOptions = ["starter", "basic", "pro", "business"];

type StatusFilter = "all" | AppService["status"];
type ViewMode = "cards" | "table";
type SortMode = "latest" | "name-asc" | "name-desc" | "status";

type AppMeta = {
  totalDeployments: number;
  lastDeploymentAt: string | null;
  lastDeploymentStatus: Deployment["status"] | null;
};

const statusOptions: StatusFilter[] = ["all", "running", "deploying", "failed"];
const sortOptions: SortMode[] = ["latest", "name-asc", "name-desc", "status"];
const viewOptions: ViewMode[] = ["cards", "table"];

function formatDate(value: string | null) {
  if (!value) return "No deployments";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusRank(status: AppService["status"]) {
  if (status === "failed") return 0;
  if (status === "deploying") return 1;
  return 2;
}

export default function ProjectAppsPage() {
  const theme = useTheme();
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [metaByAppId, setMetaByAppId] = useState<Record<string, AppMeta>>({});
  const {
    data: appsResponse,
    isLoading: isLoadingApps,
    error: appsError,
    refetch: refetchApps,
  } = useGetAppsByProjectQuery(projectId ?? "", { skip: !projectId });
  const {
    data: deploymentsResponse,
    isLoading: isLoadingDeployments,
    error: deploymentsError,
    refetch: refetchDeployments,
  } = useGetDeploymentsByProjectQuery(projectId ?? "", { skip: !projectId });
  const [restartApp] = useRestartAppMutation();
  const [createApp, { isLoading: isCreating }] = useCreateAppMutation();
  const [deleteApp, { isLoading: isDeleting }] = useDeleteAppMutation();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [region, setRegion] = useState(regionOptions[0]);
  const [plan, setPlan] = useState(planOptions[0]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");

  const rawStatus = searchParams.get("status");
  const rawSort = searchParams.get("sort");
  const rawView = searchParams.get("view");
  const q = searchParams.get("q") ?? "";

  const statusFilter: StatusFilter =
    rawStatus && statusOptions.includes(rawStatus as StatusFilter) ? (rawStatus as StatusFilter) : "all";
  const sortMode: SortMode =
    rawSort && sortOptions.includes(rawSort as SortMode) ? (rawSort as SortMode) : "latest";
  const viewMode: ViewMode =
    rawView && viewOptions.includes(rawView as ViewMode) ? (rawView as ViewMode) : "cards";

  const canCreate = name.trim().length >= 3 && !isCreating;

  const updateSearchParam = useCallback(
    (key: string, value: string, removeWhen: string) => {
      const next = new URLSearchParams(searchParams);
      if (!value || value === removeWhen) next.delete(key);
      else next.set(key, value);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const getStatusChipSx = useMemo(
    () => (status: AppService["status"] | Deployment["status"]) => {
      if (status === "running" || status === "success") {
        return {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderColor: theme.palette.primary.dark,
          "& .MuiChip-label": { color: theme.palette.primary.contrastText, fontWeight: 700 },
        };
      }
      if (status === "deploying") {
        return {
          backgroundColor: theme.palette.warning.dark,
          color: theme.palette.warning.contrastText,
          borderColor: alpha(theme.palette.warning.dark, 0.95),
          "& .MuiChip-label": { color: theme.palette.warning.contrastText, fontWeight: 700 },
        };
      }
      return {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        borderColor: alpha(theme.palette.error.dark, 0.95),
        "& .MuiChip-label": { color: theme.palette.error.contrastText, fontWeight: 700 },
      };
    },
    [theme.palette.error.contrastText, theme.palette.error.dark, theme.palette.error.main, theme.palette.primary.contrastText, theme.palette.primary.dark, theme.palette.primary.main, theme.palette.warning.contrastText, theme.palette.warning.dark],
  );

  const apps = useMemo(() => appsResponse?.items ?? [], [appsResponse]);
  const isLoading = isLoadingApps || isLoadingDeployments;
  const error = appsError || deploymentsError;

  useEffect(() => {
    const apps = appsResponse?.items ?? [];
    const deployments = deploymentsResponse?.items ?? [];
    const grouped = deployments.reduce<Record<string, Deployment[]>>((acc, item) => {
      if (!acc[item.appId]) acc[item.appId] = [];
      acc[item.appId].push(item);
      return acc;
    }, {});

    const entries = apps.map((app) => {
      const items = grouped[app.id] ?? [];
      const sorted = [...items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const latest = sorted[0];
      return [
        app.id,
        {
          totalDeployments: sorted.length,
          lastDeploymentAt: latest?.createdAt ?? null,
          lastDeploymentStatus: latest?.status ?? null,
        } satisfies AppMeta,
      ] as const;
    });

    setMetaByAppId(Object.fromEntries(entries));
  }, [appsResponse, deploymentsResponse]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectId || !canCreate) return;

    try {
      await createApp({ projectId, name: name.trim(), region, plan }).unwrap();
      setCreateDialogOpen(false);
      setName("");
      setRegion(regionOptions[0]);
      setPlan(planOptions[0]);
      setSnackbarSeverity("success");
      setSnackbarMessage("App created successfully.");
      void refetchApps();
      void refetchDeployments();
    } catch (requestError: unknown) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        requestError instanceof Error ? requestError.message : "Could not create app.",
      );
    }
  };

  const handleRestart = async (appId: string) => {
    setActionLoadingId(`restart:${appId}`);
    try {
      await restartApp(appId).unwrap();
      void refetchApps();
      setSnackbarSeverity("info");
      setSnackbarMessage("Restart queued.");
    } catch (requestError: unknown) {
      setSnackbarSeverity("error");
      setSnackbarMessage(requestError instanceof Error ? requestError.message : "Could not restart app.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId || !projectId) return;
    try {
      await deleteApp({ appId: deleteTargetId, projectId }).unwrap();
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
      setSnackbarSeverity("success");
      setSnackbarMessage("App deleted.");
      void refetchApps();
      void refetchDeployments();
    } catch (requestError: unknown) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        requestError instanceof Error ? requestError.message : "Could not delete app.",
      );
    }
  };

  const visibleApps = useMemo(() => {
    const query = q.trim().toLowerCase();
    const next = apps.filter((app) => {
      const matchesQuery = query ? app.name.toLowerCase().includes(query) : true;
      const matchesStatus = statusFilter === "all" ? true : app.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    next.sort((left, right) => {
      if (sortMode === "name-asc") return left.name.localeCompare(right.name);
      if (sortMode === "name-desc") return right.name.localeCompare(left.name);
      if (sortMode === "status") return statusRank(left.status) - statusRank(right.status);
      const leftTime = new Date(metaByAppId[left.id]?.lastDeploymentAt ?? 0).getTime();
      const rightTime = new Date(metaByAppId[right.id]?.lastDeploymentAt ?? 0).getTime();
      return rightTime - leftTime;
    });

    return next;
  }, [apps, metaByAppId, q, sortMode, statusFilter]);

  const summary = useMemo(() => {
    const running = apps.filter((app) => app.status === "running").length;
    const deploying = apps.filter((app) => app.status === "deploying").length;
    const failed = apps.filter((app) => app.status === "failed").length;
    const attention = apps.filter((app) => app.status !== "running").length;
    return { total: apps.length, running, deploying, failed, attention };
  }, [apps]);

  const activity = useMemo(() => {
    return apps
      .map((app) => ({
        appId: app.id,
        appName: app.name,
        status: metaByAppId[app.id]?.lastDeploymentStatus ?? "running",
        createdAt: metaByAppId[app.id]?.lastDeploymentAt,
      }))
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .slice(0, 5);
  }, [apps, metaByAppId]);

  return (
    <>
      <Stack
        spacing={2.25}
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
            background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.14)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
          }}
        >
          <Stack spacing={1.25}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <AppsIcon />
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    Project Apps
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage app services with runtime status, deployments, and quick operations.
                  </Typography>
                </Box>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
                {projectId ? (
                  <Button
                    component={Link}
                    to={`/console/projects/${projectId}`}
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                  >
                    Back to Project
                  </Button>
                ) : null}
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    void refetchApps();
                    void refetchDeployments();
                  }}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Create App
                </Button>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip size="small" label={`Total: ${summary.total}`} variant="outlined" />
              <Chip size="small" label={`Running: ${summary.running}`} variant="outlined" />
              <Chip size="small" label={`Deploying: ${summary.deploying}`} variant="outlined" />
              <Chip size="small" label={`Failed: ${summary.failed}`} variant="outlined" />
              <Chip
                size="small"
                label={`Needs attention: ${summary.attention}`}
                color={summary.attention > 0 ? "warning" : "default"}
                variant="outlined"
                sx={
                  summary.attention > 0
                    ? {
                        backgroundColor: alpha(theme.palette.warning.main, 0.18),
                        borderColor: alpha(theme.palette.warning.main, 0.5),
                        color: theme.palette.warning.dark,
                        "& .MuiChip-label": {
                          color: theme.palette.warning.dark,
                          fontWeight: 700,
                        },
                      }
                    : undefined
                }
              />
            </Stack>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: `1px solid ${alpha(theme.palette.text.secondary, 0.24)}`,
            background: `linear-gradient(180deg, ${alpha(theme.palette.text.secondary, 0.08)}, ${alpha(theme.palette.common.white, 0.64)})`,
          }}
        >
          <Stack direction={{ xs: "column", lg: "row" }} spacing={1} justifyContent="space-between">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ flex: 1 }}>
              <TextField
                size="small"
                label="Search"
                value={q}
                onChange={(event) => updateSearchParam("q", event.target.value, "")}
                sx={{ minWidth: { xs: "100%", sm: 220 } }}
              />
              <Stack direction="row" spacing={0.6} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip
                  label="All"
                  clickable
                  variant={statusFilter === "all" ? "filled" : "outlined"}
                  color="primary"
                  onClick={() => updateSearchParam("status", "all", "all")}
                  sx={
                    statusFilter === "all"
                      ? {
                          backgroundColor: theme.palette.primary.main,
                          borderColor: theme.palette.primary.dark,
                          color: theme.palette.primary.contrastText,
                          "& .MuiChip-label": {
                            color: theme.palette.primary.contrastText,
                            fontWeight: 700,
                          },
                        }
                      : {
                          color: theme.palette.primary.main,
                          borderColor: alpha(theme.palette.primary.main, 0.48),
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          "& .MuiChip-label": {
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                          },
                        }
                  }
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
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          borderColor: theme.palette.primary.dark,
                          "& .MuiChip-label": { color: theme.palette.primary.contrastText, fontWeight: 700 },
                        }
                      : undefined
                  }
                />
                <Chip
                  label="Deploying"
                  clickable
                  variant={statusFilter === "deploying" ? "filled" : "outlined"}
                  color="default"
                  onClick={() => updateSearchParam("status", "deploying", "all")}
                  sx={
                    statusFilter === "deploying"
                      ? {
                          backgroundColor: theme.palette.warning.dark,
                          color: theme.palette.warning.contrastText,
                          borderColor: alpha(theme.palette.warning.dark, 0.95),
                          "& .MuiChip-label": { color: theme.palette.warning.contrastText, fontWeight: 700 },
                        }
                      : undefined
                  }
                />
                <Chip
                  label="Failed"
                  clickable
                  variant={statusFilter === "failed" ? "filled" : "outlined"}
                  color="default"
                  onClick={() => updateSearchParam("status", "failed", "all")}
                  sx={
                    statusFilter === "failed"
                      ? {
                          backgroundColor: theme.palette.error.main,
                          color: theme.palette.error.contrastText,
                          borderColor: alpha(theme.palette.error.dark, 0.95),
                          "& .MuiChip-label": { color: theme.palette.error.contrastText, fontWeight: 700 },
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
                onChange={(event) => updateSearchParam("sort", event.target.value, "latest")}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="latest">Latest deployment</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="name-asc">Name A-Z</MenuItem>
                <MenuItem value="name-desc">Name Z-A</MenuItem>
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
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  void refetchApps();
                  void refetchDeployments();
                }}
              >
                Retry
              </Button>
            }
          >
            {error && "data" in error
              ? (error.data as { message?: string }).message ?? "Could not load apps."
              : "Could not load apps."}
          </Alert>
        ) : null}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: viewMode === "cards" ? "minmax(0, 1fr) 300px" : "1fr" },
            gap: 1.5,
          }}
        >
          <Paper
            sx={{
              p: { xs: 1.5, sm: 1.75 },
              borderRadius: { xs: 1.5, sm: 2 },
              border: `1px solid ${alpha(theme.palette.text.secondary, 0.24)}`,
              background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.74)}, ${alpha(theme.palette.background.default, 0.92)})`,
            }}
          >
            <Stack spacing={1.25}>
              <Typography variant="h6" fontWeight={800}>
                App Directory
              </Typography>
              <Divider sx={{ opacity: 0.45 }} />

              {isLoading ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
                    gap: 1.25,
                  }}
                >
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Paper key={`apps-skeleton-${idx}`} variant="outlined" sx={{ p: 1.5 }}>
                      <Stack spacing={1}>
                        <Skeleton variant="text" width="65%" height={28} />
                        <Skeleton variant="rounded" width={92} height={24} />
                        <Skeleton variant="rounded" height={36} />
                        <Skeleton variant="rounded" height={36} />
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              ) : visibleApps.length === 0 ? (
                apps.length === 0 ? (
                  <Alert
                    severity="info"
                    action={
                      <Button size="small" color="inherit" onClick={() => setCreateDialogOpen(true)}>
                        Create App
                      </Button>
                    }
                  >
                    No apps yet. Create your first app to start deploying services.
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
                    No apps match the current filter.
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
                  {visibleApps.map((app) => (
                    <Paper
                      key={app.id}
                      variant="outlined"
                      sx={{
                    p: 1.35,
                    borderRadius: 1.5,
                    borderColor: alpha(theme.palette.primary.main, 0.16),
                    transition: "transform 160ms ease, border-color 160ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: alpha(theme.palette.primary.main, 0.34),
                    },
                  }}
                >
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              fontWeight={800}
                              title={app.name}
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {app.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {app.region.toUpperCase()} | {app.plan}
                            </Typography>
                          </Box>
                          <Chip
                            size="small"
                            label={app.status}
                            color="default"
                            sx={{ textTransform: "capitalize", ...getStatusChipSx(app.status) }}
                          />
                        </Stack>
                        <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`Deploys: ${metaByAppId[app.id]?.totalDeployments ?? 0}`}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`Last: ${formatDate(metaByAppId[app.id]?.lastDeploymentAt ?? null)}`}
                          />
                        </Stack>
                        <Stack direction="row" spacing={0.65} flexWrap="wrap" useFlexGap>
                          <Button
                            component={Link}
                            to={`/console/projects/${projectId ?? app.projectId}/apps/${app.id}/overview`}
                            variant="contained"
                            size="small"
                            endIcon={<OpenInNewIcon fontSize="small" />}
                          >
                            Open
                          </Button>
                          <Button
                            component={Link}
                            to={`/console/projects/${projectId ?? app.projectId}/apps/${app.id}/logs`}
                            variant="outlined"
                            size="small"
                            startIcon={<SubjectOutlinedIcon fontSize="small" />}
                          >
                            Logs
                          </Button>
                          <Button
                            component={Link}
                            to={`/console/projects/${projectId ?? app.projectId}/apps/${app.id}/settings`}
                            variant="outlined"
                            size="small"
                            startIcon={<SettingsOutlinedIcon fontSize="small" />}
                          >
                            Settings
                          </Button>
                        </Stack>
                        <Stack direction="row" spacing={0.65}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<RestartAltIcon fontSize="small" />}
                            onClick={() => void handleRestart(app.id)}
                            disabled={actionLoadingId === `restart:${app.id}`}
                          >
                            Restart
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteOutlineIcon fontSize="small" />}
                            onClick={() => {
                              setDeleteTargetId(app.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <TableContainer
                  sx={{
                    borderRadius: 1.75,
                    overflow: "hidden",
                    border: `1px solid ${alpha(theme.palette.text.secondary, 0.22)}`,
                  }}
                >
                  <Table size="small" aria-label="apps table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Region</TableCell>
                        <TableCell>Plan</TableCell>
                        <TableCell>Last deployment</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {visibleApps.map((app) => (
                        <TableRow key={app.id} hover>
                          <TableCell>{app.name}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={app.status}
                              color="default"
                              sx={{ textTransform: "capitalize", ...getStatusChipSx(app.status) }}
                            />
                          </TableCell>
                          <TableCell>{app.region.toUpperCase()}</TableCell>
                          <TableCell>{app.plan}</TableCell>
                          <TableCell>{formatDate(metaByAppId[app.id]?.lastDeploymentAt ?? null)}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.6} justifyContent="flex-end">
                              <Button
                                component={Link}
                                to={`/console/projects/${projectId ?? app.projectId}/apps/${app.id}/overview`}
                                size="small"
                              >
                                Open
                              </Button>
                              <Button
                                size="small"
                                onClick={() => void handleRestart(app.id)}
                                disabled={actionLoadingId === `restart:${app.id}`}
                              >
                                Restart
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => {
                                  setDeleteTargetId(app.id);
                                  setDeleteDialogOpen(true);
                                }}
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
            </Stack>
          </Paper>

          {viewMode === "cards" ? (
            <Paper
              sx={{
                p: 1.4,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.text.secondary, 0.24)}`,
                background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.78)}, ${alpha(theme.palette.background.default, 0.9)})`,
              }}
            >
              <Stack spacing={1}>
                <Typography fontWeight={800}>Recent Activity</Typography>
                <Divider />
                {activity.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No activity available.
                  </Typography>
                ) : (
                  activity.map((item) => (
                    <Paper
                      key={`${item.appId}-${item.createdAt ?? "na"}`}
                      variant="outlined"
                      sx={{ p: 1, borderRadius: 1.3, borderColor: alpha(theme.palette.primary.main, 0.16) }}
                    >
                      <Stack spacing={0.4}>
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                          <Typography fontWeight={700} noWrap>
                            {item.appName}
                          </Typography>
                          <Chip
                            size="small"
                            label={item.status}
                            color="default"
                            sx={{ textTransform: "capitalize", ...getStatusChipSx(item.status) }}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Last deployment: {formatDate(item.createdAt ?? null)}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))
                )}
              </Stack>
            </Paper>
          ) : null}
        </Box>
      </Stack>

      <Dialog
        open={createDialogOpen}
        onClose={() => {
          if (!isCreating) {
            setCreateDialogOpen(false);
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create App</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={(event) => void handleCreate(event)} sx={{ pt: 1 }}>
            <Stack spacing={1.25}>
              <TextField
                label="App name"
                size="small"
                value={name}
                onChange={(event) => setName(event.target.value)}
                helperText="At least 3 characters"
                disabled={isCreating}
                required
              />
              <TextField
                select
                label="Region"
                size="small"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                disabled={isCreating}
              >
                {regionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Plan"
                size="small"
                value={plan}
                onChange={(event) => setPlan(event.target.value)}
                disabled={isCreating}
              >
                {planOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <DialogActions sx={{ px: 0, pb: 0 }}>
                <Button
                  onClick={() => {
                    setCreateDialogOpen(false);
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={!canCreate}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </DialogActions>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteDialogOpen(false);
            setDeleteTargetId(null);
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete App</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ pt: 0.25 }}>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              App: {apps.find((app) => app.id === deleteTargetId)?.name ?? "-"}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteTargetId(null);
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={() => void handleDelete()} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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
