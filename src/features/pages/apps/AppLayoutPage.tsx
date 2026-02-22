import AppsIcon from "@mui/icons-material/Apps";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Box, Button, Chip, Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { AppsAPI } from "../../../api/appsApi";
import type { AppService } from "../../../api/types";

const appTabs = [
  { label: "Overview", path: "overview" },
  { label: "Deployments", path: "deployments" },
  { label: "Env", path: "env" },
  { label: "Logs", path: "logs" },
  { label: "Settings", path: "settings" },
];

export default function AppLayoutPage() {
  const theme = useTheme();
  const { appId, projectId } = useParams();
  const [app, setApp] = useState<AppService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const projectAppsHref =
    projectId ?? app?.projectId ? `/console/projects/${projectId ?? app?.projectId}/apps` : null;

  useEffect(() => {
    let active = true;

    const loadApp = async () => {
      if (!appId) {
        if (!active) return;
        setError("App id is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await AppsAPI.getById(appId);
        if (!active) return;
        setApp(response);
      } catch (requestError: unknown) {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "Could not load app.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadApp();

    return () => {
      active = false;
    };
  }, [appId]);

  const statusChipSx =
    app?.status === "running"
      ? {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderColor: theme.palette.primary.dark,
          "& .MuiChip-label": { color: theme.palette.primary.contrastText, fontWeight: 700 },
        }
      : app?.status === "deploying"
        ? {
            backgroundColor: theme.palette.warning.dark,
            color: theme.palette.warning.contrastText,
            borderColor: alpha(theme.palette.warning.dark, 0.95),
            "& .MuiChip-label": { color: theme.palette.warning.contrastText, fontWeight: 700 },
          }
        : {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
            borderColor: alpha(theme.palette.error.dark, 0.95),
            "& .MuiChip-label": { color: theme.palette.error.contrastText, fontWeight: 700 },
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
          <Alert severity="error">{error}</Alert>
        ) : (
          <Stack spacing={1}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <AppsIcon />
                <Box>
                  <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography variant="h5" fontWeight={800}>
                      {app?.name}
                    </Typography>
                    <Chip size="small" label="App Console" variant="outlined" />
                  </Stack>
                </Box>
              </Stack>
              {projectAppsHref ? (
                <Button
                  component={NavLink}
                  to={projectAppsHref}
                  variant="outlined"
                  size="small"
                  startIcon={<ArrowBackIcon />}
                >
                  Back to Apps List
                </Button>
              ) : null}
            </Stack>

            <Box
              sx={{
                pt: 0.25,
                display: "grid",
                gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(5, max-content)" },
                gap: 0.8,
                justifyContent: { sm: "flex-start" },
              }}
            >
              {appTabs.map((tab) => (
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
            label={app?.status ?? "unknown"}
            color="default"
            sx={{
              textTransform: "capitalize",
              ...statusChipSx,
            }}
          />
          <Chip size="small" label={app?.region?.toUpperCase() ?? "-"} />
          <Chip
            size="small"
            label={app?.plan ?? "-"}
            sx={{ textTransform: "capitalize" }}
            variant="outlined"
          />
        </Stack>
        <Divider sx={{ mb: 1.5, opacity: 0.55 }} />
        <Outlet context={{ app, isLoading, error, setApp }} />
      </Paper>
    </Stack>
  );
}
