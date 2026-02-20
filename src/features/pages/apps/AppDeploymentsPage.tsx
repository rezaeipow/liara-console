import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Skeleton,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AppsAPI } from "../../../api/appsApi";
import type { Deployment } from "../../../api/types";

type StatusFilter = "all" | Deployment["status"];
type SortOrder = "newest" | "oldest";
type ViewMode = "cards" | "table";

const statusOptions: StatusFilter[] = ["all", "success", "running", "failed"];
const sortOptions: SortOrder[] = ["newest", "oldest"];
const viewOptions: ViewMode[] = ["cards", "table"];

export default function AppDeploymentsPage() {
  const { appId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rawStatus = searchParams.get("status");
  const rawSort = searchParams.get("sort");
  const rawView = searchParams.get("view");

  const statusFilter: StatusFilter =
    rawStatus && statusOptions.includes(rawStatus as StatusFilter)
      ? (rawStatus as StatusFilter)
      : "all";
  const sortOrder: SortOrder =
    rawSort && sortOptions.includes(rawSort as SortOrder)
      ? (rawSort as SortOrder)
      : "newest";
  const viewMode: ViewMode =
    rawView && viewOptions.includes(rawView as ViewMode)
      ? (rawView as ViewMode)
      : "cards";

  const updateSearchParam = useCallback(
    (key: string, value: string, removeWhen: string) => {
      const next = new URLSearchParams(searchParams);
      if (!value || value === removeWhen) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  const loadDeployments = useCallback(async () => {
    if (!appId) {
      setError("App id is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AppsAPI.getDeployments(appId);
      setItems(response.items);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load deployments.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    void loadDeployments();
  }, [loadDeployments]);

  const getStatusChipSx = (status: Deployment["status"], tone: "soft" | "solid" = "soft") => {
    if (tone === "solid") {
      if (status === "success") {
        return {
          backgroundColor: "#1d4ed8",
          color: "#ffffff",
          borderColor: "#1e40af",
          "& .MuiChip-label": { color: "#ffffff", fontWeight: 700 },
        };
      }
      if (status === "running") {
        return {
          backgroundColor: "#92400e",
          color: "#ffffff",
          borderColor: "#78350f",
          "& .MuiChip-label": { color: "#ffffff", fontWeight: 700 },
        };
      }
      return {
        backgroundColor: "#b91c1c",
        color: "#ffffff",
        borderColor: "#991b1b",
        "& .MuiChip-label": { color: "#ffffff", fontWeight: 700 },
      };
    }

    if (status === "success") {
      return {
        backgroundColor: alpha("#1f6feb", 0.18),
        color: "#1e3a8a",
        borderColor: alpha("#1d4ed8", 0.4),
        "& .MuiChip-label": { color: "#1e3a8a", fontWeight: 700 },
      };
    }
    if (status === "running") {
      return {
        backgroundColor: alpha("#f59e0b", 0.22),
        color: "#78350f",
        borderColor: alpha("#92400e", 0.35),
        "& .MuiChip-label": { color: "#78350f", fontWeight: 700 },
      };
    }
    return {
      backgroundColor: alpha("#ef4444", 0.18),
      color: "#7f1d1d",
      borderColor: alpha("#b91c1c", 0.35),
      "& .MuiChip-label": { color: "#7f1d1d", fontWeight: 700 },
    };
  };

  const deploymentStats = useMemo(
    () => ({
      total: items.length,
      success: items.filter((item) => item.status === "success").length,
      failed: items.filter((item) => item.status === "failed").length,
      running: items.filter((item) => item.status === "running").length,
    }),
    [items],
  );

  const filteredItems = useMemo(() => {
    const next =
      statusFilter === "all"
        ? items
        : items.filter((item) => item.status === statusFilter);
    const sorted = [...next].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });
    return sorted;
  }, [items, sortOrder, statusFilter]);

  const latestDeployment = useMemo(() => {
    if (items.length === 0) return null;
    return [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  }, [items]);

  const getDeploymentDetail = (item: Deployment) => {
    const idSeed = item.id.slice(-4);
    return {
      commit: `${item.version.replace(/\./g, "")}${idSeed}`.slice(0, 7),
      trigger: item.status === "running" ? "Auto deploy pipeline" : "Manual release",
      actor: item.status === "failed" ? "Release Engineer" : "CI Bot",
    };
  };

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <RocketLaunchIcon />
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Deployments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track release history and status changes for this app.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={(_, value: ViewMode | null) => {
              if (value) {
                updateSearchParam("view", value, "cards");
              }
            }}
          >
            <ToggleButton value="cards">Cards</ToggleButton>
            <ToggleButton value="table">Table</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => void loadDeployments()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      {!isLoading ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1,
          }}
        >
          <Paper variant="outlined" sx={{ p: 1.2 }}>
            <Typography variant="caption" color="text.secondary">Total</Typography>
            <Typography fontWeight={800}>{deploymentStats.total}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1.2 }}>
            <Typography variant="caption" color="text.secondary">Success</Typography>
            <Typography fontWeight={800}>{deploymentStats.success}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1.2 }}>
            <Typography variant="caption" color="text.secondary">Running</Typography>
            <Typography fontWeight={800}>{deploymentStats.running}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1.2 }}>
            <Typography variant="caption" color="text.secondary">Failed</Typography>
            <Typography fontWeight={800}>{deploymentStats.failed}</Typography>
          </Paper>
        </Box>
      ) : null}

      {!isLoading && latestDeployment ? (
        <Paper
          sx={{
            p: 1.25,
            borderRadius: 1.5,
            border: `1px solid ${alpha("#1f6feb", 0.2)}`,
            background:
              "linear-gradient(115deg, rgba(31,111,235,0.12), rgba(14,165,164,0.08))",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography fontWeight={800}>Latest deployment: v{latestDeployment.version}</Typography>
              <Typography variant="body2" color="text.secondary">
                {dateTimeFormatter.format(new Date(latestDeployment.createdAt))}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Chip
                size="small"
                label={latestDeployment.status}
                color="default"
                sx={{ textTransform: "capitalize", ...getStatusChipSx(latestDeployment.status, "solid") }}
              />
            </Stack>
          </Stack>
        </Paper>
      ) : null}

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Chip
            label="All"
            clickable
            color={statusFilter === "all" ? "primary" : "default"}
            variant={statusFilter === "all" ? "filled" : "outlined"}
            onClick={() => updateSearchParam("status", "all", "all")}
            sx={
              statusFilter === "all"
                ? {
                    backgroundColor: "#1d4ed8",
                    color: "#ffffff",
                    borderColor: "#1e40af",
                    "& .MuiChip-label": { fontWeight: 700 },
                  }
                : undefined
            }
          />
          <Chip
            label="Success"
            clickable
            color="default"
            variant={statusFilter === "success" ? "filled" : "outlined"}
            onClick={() => updateSearchParam("status", "success", "all")}
            sx={{
              ...(statusFilter === "success"
                ? {
                    backgroundColor: "#1d4ed8 !important",
                    color: "#ffffff !important",
                    borderColor: "#1e40af !important",
                    "& .MuiChip-label": {
                      fontWeight: 700,
                      color: "#ffffff",
                    },
                  }
                : undefined),
            }}
          />
          <Chip
            label="Running"
            clickable
            color="default"
            variant={statusFilter === "running" ? "filled" : "outlined"}
            onClick={() => updateSearchParam("status", "running", "all")}
            sx={{
              ...(statusFilter === "running"
                ? {
                    backgroundColor: "#92400e !important",
                    color: "#ffffff !important",
                    borderColor: "#78350f !important",
                    "& .MuiChip-label": {
                      fontWeight: 700,
                      color: "#ffffff",
                    },
                  }
                : undefined),
            }}
          />
          <Chip
            label="Failed"
            clickable
            color={statusFilter === "failed" ? "error" : "default"}
            variant={statusFilter === "failed" ? "filled" : "outlined"}
            onClick={() => updateSearchParam("status", "failed", "all")}
          />
        </Stack>
        <TextField
          select
          size="small"
          label="Sort"
          value={sortOrder}
          onChange={(event) =>
            updateSearchParam("sort", event.target.value as SortOrder, "newest")
          }
          sx={{ minWidth: { xs: "100%", md: 150 } }}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </TextField>
      </Stack>

      {error ? (
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => void loadDeployments()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : null}

      {isLoading ? (
        <Stack spacing={1}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Paper
              key={`deployment-skeleton-${idx}`}
              variant="outlined"
              sx={{ p: 1.4, borderRadius: 1.5 }}
            >
              <Stack spacing={0.8}>
                <Stack direction="row" justifyContent="space-between">
                  <Skeleton variant="text" width="36%" />
                  <Skeleton variant="rounded" width={82} height={24} />
                </Stack>
                <Skeleton variant="text" width="52%" />
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : items.length === 0 ? (
        <Alert
          severity="info"
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => void loadDeployments()}
            >
              Check again
            </Button>
          }
        >
          No deployments found for this app yet. Trigger your first release to populate this list.
        </Alert>
      ) : filteredItems.length === 0 ? (
        <Alert severity="info">
          No deployments match the selected filter.
        </Alert>
      ) : (
        <>
          {viewMode === "cards" ? (
            <Stack spacing={1}>
              {filteredItems.map((item) => {
                const detail = getDeploymentDetail(item);
                return (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{
                      p: 1.4,
                      borderRadius: 1.5,
                      borderColor: alpha("#1f6feb", 0.14),
                      transition: "border-color 140ms ease, transform 140ms ease",
                      "&:hover": {
                        borderColor: alpha("#1f6feb", 0.3),
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Stack spacing={0.85}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight={700}>Version {item.version}</Typography>
                        <Chip
                          size="small"
                          label={item.status}
                          color="default"
                          sx={{ textTransform: "capitalize", ...getStatusChipSx(item.status) }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Deployment ID: {item.id}
                      </Typography>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={0.6}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Typography variant="caption" color="text.secondary">
                          Commit: {detail.commit}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Trigger: {detail.trigger}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Actor: {detail.actor}
                        </Typography>
                      </Stack>
                      <Divider sx={{ opacity: 0.55 }} />
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={0.75}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {dateTimeFormatter.format(new Date(item.createdAt))}
                        </Typography>
                        <Stack direction="row" spacing={0.75}>
                          <Button component={Link} to="../logs" size="small" variant="outlined">
                            Logs
                          </Button>
                          <Button component={Link} to="../overview" size="small" variant="contained">
                            Overview
                          </Button>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small" aria-label="deployments table">
                <TableHead>
                  <TableRow>
                    <TableCell>Version</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Commit</TableCell>
                    <TableCell>Trigger</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((item) => {
                    const detail = getDeploymentDetail(item);
                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.version}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={item.status}
                            color="default"
                            sx={{ textTransform: "capitalize", ...getStatusChipSx(item.status) }}
                          />
                        </TableCell>
                        <TableCell>{detail.commit}</TableCell>
                        <TableCell>{detail.trigger}</TableCell>
                        <TableCell>{dateTimeFormatter.format(new Date(item.createdAt))}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                            <Button component={Link} to="../logs" size="small" variant="outlined">
                              Logs
                            </Button>
                            <Button component={Link} to="../overview" size="small" variant="contained">
                              Overview
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Stack>
  );
}
