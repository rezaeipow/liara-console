import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AppsIcon from "@mui/icons-material/Apps";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import SearchIcon from "@mui/icons-material/Search";
import StorageIcon from "@mui/icons-material/Storage";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLoaderData, useNavigation, useSearchParams } from "react-router-dom";
import type { ProjectsLoaderData } from "./projectsData";

const planSummary: Record<string, string> = {
  starter: "Starter capacity",
  basic: "Balanced capacity",
  pro: "Production-ready capacity",
  business: "Business-grade capacity",
  enterprise: "Enterprise-scale capacity",
};

type SortMode = "created-desc" | "created-asc" | "name-asc" | "name-desc";
type HealthFilter = "all" | "healthy" | "provisioning";

const sortOptions: SortMode[] = ["created-desc", "created-asc", "name-asc", "name-desc"];
const healthOptions: HealthFilter[] = ["all", "healthy", "provisioning"];

export default function ProjectsPage() {
  const theme = useTheme();
  const data = useLoaderData() as ProjectsLoaderData;
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoading = navigation.state !== "idle";
  const [searchInput, setSearchInput] = useState(data.query);
  const searchDebounceRef = useRef<number | null>(null);
  const rawSort = searchParams.get("sort");
  const rawHealth = searchParams.get("health");

  const pageSummary = useMemo(() => {
    return `Showing ${data.items.length} of ${data.total}`;
  }, [data.items.length, data.total]);
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [],
  );

  const onChangeQuery = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value.trim()) {
      next.set("q", value);
    } else {
      next.delete("q");
    }
    next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  const updateSearchParam = (key: string, value: string, removeWhen: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === removeWhen) next.delete(key);
    else next.set(key, value);
    next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  const loadMore = () => {
    const next = new URLSearchParams(searchParams);
    next.set("page", "1");
    next.set("pageSize", String(data.pageSize + 8));
    setSearchParams(next);
  };

  const getProjectSummary = (plan: string, region: string) => {
    const normalizedPlan = plan.trim().toLowerCase();
    const planText = planSummary[normalizedPlan] ?? "Configured capacity";
    return `${planText} in ${region.toUpperCase()}`;
  };
  const getHealthLabel = (status: string) =>
    status === "healthy" ? "Healthy" : "Provisioning";

  const onSearchInputChange = (value: string) => {
    setSearchInput(value);
    if (searchDebounceRef.current !== null) {
      window.clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = window.setTimeout(() => {
      onChangeQuery(value);
    }, 320);
  };

  useEffect(
    () => () => {
      if (searchDebounceRef.current !== null) {
        window.clearTimeout(searchDebounceRef.current);
      }
    },
    [],
  );

  const sortMode: SortMode =
    rawSort && sortOptions.includes(rawSort as SortMode) ? (rawSort as SortMode) : "created-desc";
  const healthFilter: HealthFilter =
    rawHealth && healthOptions.includes(rawHealth as HealthFilter)
      ? (rawHealth as HealthFilter)
      : "all";

  const visibleItems = useMemo(() => {
    const next = data.items.filter((project) => {
      if (healthFilter === "all") return true;
      return project.healthStatus === healthFilter;
    });

    next.sort((left, right) => {
      if (sortMode === "name-asc") return left.name.localeCompare(right.name);
      if (sortMode === "name-desc") return right.name.localeCompare(left.name);
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();
      return sortMode === "created-asc" ? leftTime - rightTime : rightTime - leftTime;
    });

    return next;
  }, [data.items, healthFilter, sortMode]);

  return (
    <Stack
      spacing={2.5}
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
          background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <FolderOpenOutlinedIcon />
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Projects
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                Manage and explore your project workspaces.
              </Typography>
            </Box>
          </Stack>

          <TextField
            size="small"
            label="Search projects"
            placeholder="Search Projects"
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            slotProps={{
              htmlInput: {
                "aria-label": "Search projects",
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ minWidth: { sm: 260 } }}
          />
        </Stack>
      </Paper>

      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: { xs: 1.5, sm: 2 },
          border: `1px solid ${alpha(theme.palette.text.secondary, 0.24)}`,
          background: `linear-gradient(180deg, ${alpha(theme.palette.text.secondary, 0.06)}, ${alpha(theme.palette.common.white, 0.52)})`,
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={0.75}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <DashboardCustomizeOutlinedIcon />
              <Typography variant="h6" fontWeight={800}>
                Project Directory
              </Typography>
            </Stack>
            <Button
              component={Link}
              to="/console/projects/new"
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Create Project
            </Button>
          </Stack>

          <Divider sx={{ opacity: 0.4 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
              <Chip
                label="All"
                clickable
                variant={healthFilter === "all" ? "filled" : "outlined"}
                color={healthFilter === "all" ? "primary" : "default"}
                onClick={() => updateSearchParam("health", "all", "all")}
                sx={
                  healthFilter === "all"
                    ? {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderColor: theme.palette.primary.dark,
                        "& .MuiChip-label": {
                          color: theme.palette.primary.contrastText,
                          fontWeight: 700,
                        },
                      }
                    : undefined
                }
              />
              <Chip
                label="Healthy"
                clickable
                variant={healthFilter === "healthy" ? "filled" : "outlined"}
                color="default"
                onClick={() => updateSearchParam("health", "healthy", "all")}
                sx={
                  healthFilter === "healthy"
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
                label="Provisioning"
                clickable
                variant={healthFilter === "provisioning" ? "filled" : "outlined"}
                color="default"
                onClick={() => updateSearchParam("health", "provisioning", "all")}
                sx={
                  healthFilter === "provisioning"
                    ? {
                        backgroundColor: theme.palette.warning.dark,
                        color: theme.palette.warning.contrastText,
                        borderColor: alpha(theme.palette.warning.dark, 0.95),
                        "& .MuiChip-label": { color: theme.palette.warning.contrastText, fontWeight: 700 },
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
              onChange={(event) => updateSearchParam("sort", event.target.value, "created-desc")}
              sx={{ minWidth: { xs: "100%", sm: 180 } }}
            >
              <MenuItem value="created-desc">Newest first</MenuItem>
              <MenuItem value="created-asc">Oldest first</MenuItem>
              <MenuItem value="name-asc">Name A-Z</MenuItem>
              <MenuItem value="name-desc">Name Z-A</MenuItem>
            </TextField>
          </Stack>

          {isLoading ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              {Array.from({ length: 3 }).map((_, idx) => (
                <Paper
                  key={`projects-skeleton-${idx}`}
                  variant="outlined"
                  sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: { xs: 1.25, sm: 1.75 } }}
                >
                  <Stack spacing={1.1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Skeleton variant="text" width="62%" height={28} />
                      <Skeleton variant="rounded" width={64} height={24} />
                    </Stack>
                    <Skeleton variant="rounded" height={62} />
                    <Stack direction="row" spacing={1}>
                      <Skeleton variant="rounded" height={46} sx={{ flex: 1 }} />
                      <Skeleton variant="rounded" height={46} sx={{ flex: 1 }} />
                    </Stack>
                    <Skeleton variant="rounded" height={36} />
                  </Stack>
                </Paper>
              ))}
            </Box>
          ) : data.items.length === 0 ? (
            <Alert
              severity="info"
              action={
                data.query ? (
                  <Button size="small" color="inherit" onClick={() => onChangeQuery("")}>
                    Clear search
                  </Button>
                ) : (
                  <Button size="small" color="inherit" component={Link} to="/console/projects/new">
                    Create Project
                  </Button>
                )
              }
            >
              {data.query
                ? "No project matches this search."
                : "No projects yet. Create your first project to get started."}
            </Alert>
          ) : visibleItems.length === 0 ? (
            <Alert
              severity="info"
              action={
                <Button size="small" color="inherit" onClick={() => updateSearchParam("health", "all", "all")}>
                  Clear filters
                </Button>
              }
            >
              No projects match the selected filters.
            </Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
                gap: 1.5,
              }}
            >
              {visibleItems.map((project) => (
                <Paper
                  key={project.id}
                  variant="outlined"
                  sx={{
                    p: { xs: 1.5, sm: 1.75 },
                    borderRadius: { xs: 1.25, sm: 1.75 },
                    width: "100%",
                    minHeight: 196,
                    display: "flex",
                    flexDirection: "column",
                    borderColor: alpha(theme.palette.primary.main, 0.12),
                    background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.72)}, ${alpha(theme.palette.common.white, 0.52)})`,
                    transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: alpha(theme.palette.primary.main, 0.32),
                      boxShadow: `0 16px 30px ${alpha(theme.palette.text.primary, 0.14)}`,
                    },
                  }}
                >
                  <Stack
                    direction="column"
                    spacing={1.1}
                    alignItems="stretch"
                    sx={{ width: "100%", flex: 1 }}
                  >
                    <Stack direction="row" justifyContent="space-between" spacing={1.25} alignItems="flex-start">
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          fontWeight={800}
                          title={project.name}
                          sx={{
                            lineHeight: 1.25,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {project.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.4 }}
                        >
                          Created {dateFormatter.format(new Date(project.createdAt))}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={project.plan}
                        sx={{
                          textTransform: "capitalize",
                          alignSelf: "flex-start",
                          backgroundColor: alpha(theme.palette.text.primary, 0.9),
                          color: theme.palette.common.white,
                          border: `1px solid ${alpha(theme.palette.text.primary, 0.95)}`,
                          height: 26,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          "& .MuiChip-label": {
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            lineHeight: 1,
                            fontWeight: 700,
                            px: 1,
                          },
                        }}
                      />
                    </Stack>

                    <Box
                      sx={{
                        px: 1.2,
                        py: 1,
                        borderRadius: 1.4,
                        border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                        backgroundColor: alpha(theme.palette.common.white, 0.52),
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Deployment profile
                      </Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ mt: 0.35, lineHeight: 1.45 }}>
                        {getProjectSummary(project.plan, project.region)}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.9}>
                      <Box
                        sx={{
                          flex: 1,
                          px: 1,
                          py: 0.75,
                          borderRadius: 1.2,
                          border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                          backgroundColor: alpha(theme.palette.common.white, 0.48),
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <AppsIcon sx={{ fontSize: 15 }} />
                          <Typography variant="caption" color="text.secondary">
                            Apps
                          </Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={800} sx={{ mt: 0.35 }}>
                          {project.servicesSummary.apps}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          px: 1,
                          py: 0.75,
                          borderRadius: 1.2,
                          border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                          backgroundColor: alpha(theme.palette.common.white, 0.48),
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <StorageIcon sx={{ fontSize: 15 }} />
                          <Typography variant="caption" color="text.secondary">
                            VMs
                          </Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={800} sx={{ mt: 0.35 }}>
                          {project.servicesSummary.vms}
                        </Typography>
                      </Box>
                    </Stack>

                    <Chip
                      size="small"
                      label={getHealthLabel(project.healthStatus)}
                      color={project.healthStatus === "healthy" ? "success" : "warning"}
                      variant="outlined"
                      sx={{ alignSelf: "flex-start" }}
                    />

                    <Stack direction="row" spacing={0.75}>
                      <Button
                        component={Link}
                        to={`/console/projects/${project.id}/apps`}
                        size="small"
                        variant="outlined"
                        sx={{ flex: 1, minHeight: 34 }}
                      >
                        Apps
                      </Button>
                      <Button
                        component={Link}
                        to={`/console/projects/${project.id}/vms`}
                        size="small"
                        variant="outlined"
                        sx={{ flex: 1, minHeight: 34 }}
                      >
                        VMs
                      </Button>
                    </Stack>

                    <Button
                      component={Link}
                      to={`/console/projects/${project.id}`}
                      size="small"
                      variant="contained"
                      sx={{
                        mt: 0,
                        alignSelf: "stretch",
                        minHeight: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 1.2,
                        fontWeight: 700,
                      }}
                    >
                      Open overview
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Box>
          )}

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              {pageSummary}
            </Typography>
            {data.items.length < data.total && !data.query ? (
              <Button
                size="small"
                variant="outlined"
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load more"}
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
