import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
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
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useFetcher, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { AppsAPI } from "../../../api/appsApi";
import type { AppService } from "../../../api/types";
import type React from "react";
import type { AppSettingsActionData } from "./appSettingsData";

type AppLayoutContext = {
  app: AppService | null;
  isLoading: boolean;
  error: string | null;
  setApp: React.Dispatch<React.SetStateAction<AppService | null>>;
};

export default function AppSettingsPage() {
  const theme = useTheme();
  const { app, isLoading, error, setApp } = useOutletContext<AppLayoutContext>();
  const { projectId, appId } = useParams();
  const navigate = useNavigate();
  const renameFetcher = useFetcher<AppSettingsActionData>();

  const [name, setName] = useState("");
  const isRenaming = renameFetcher.state !== "idle";

  const [restartDialogOpen, setRestartDialogOpen] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error" | "info">("success");

  useEffect(() => {
    if (app?.name) {
      setName(app.name);
    }
  }, [app?.name]);

  const trimmedName = name.trim();
  const canRename =
    Boolean(app) &&
    trimmedName.length >= 3 &&
    trimmedName.length <= 32 &&
    trimmedName !== app?.name &&
    !isRenaming;

  const renameHelper = useMemo(() => {
    if (!trimmedName) return "Name is required.";
    if (trimmedName.length < 3) return "Use at least 3 characters.";
    if (trimmedName.length > 32) return "Use at most 32 characters.";
    return "Choose a descriptive service name.";
  }, [trimmedName]);

  const deleteDisabled = deleteConfirmText.trim() !== (app?.name ?? "") || isDeleting;

  const handleRename = async () => {
    if (!canRename) return;

    renameFetcher.submit(
      {
        intent: "rename",
        name: trimmedName,
      },
      { method: "post" },
    );
  };

  const handleRestart = async () => {
    if (!appId) return;
    setIsRestarting(true);
    try {
      await AppsAPI.restart(appId);
      setRestartDialogOpen(false);
      setToastSeverity("info");
      setToastMessage("Restart queued. App status will update shortly.");
    } catch (requestError: unknown) {
      setToastSeverity("error");
      setToastMessage(requestError instanceof Error ? requestError.message : "Restart failed.");
    } finally {
      setIsRestarting(false);
    }
  };

  const handleDelete = async () => {
    if (!app?.id || deleteDisabled) {
      if (!app?.id) {
        setDeleteError("App id is missing.");
      }
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await AppsAPI.remove(app.id);
      setDeleteDialogOpen(false);
      setToastSeverity("success");
      setToastMessage("App deleted successfully.");
      const targetProject = app?.projectId ?? projectId ?? "prj-1";
      navigate(`/console/projects/${targetProject}/apps`, { replace: true });
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Could not delete app.";
      setDeleteError(message);
      setToastSeverity("error");
      setToastMessage(message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!renameFetcher.data) return;
    if (renameFetcher.data.ok) {
      setToastSeverity("success");
      setToastMessage(renameFetcher.data.message ?? "App renamed.");
      const updatedName = renameFetcher.data.updatedName;
      if (updatedName) {
        setApp((current) => (current ? { ...current, name: updatedName } : current));
      }
    } else if (renameFetcher.data.fieldErrors?.name) {
      setToastSeverity("error");
      setToastMessage(renameFetcher.data.fieldErrors.name);
    } else if (renameFetcher.data.formError) {
      setToastSeverity("error");
      setToastMessage(renameFetcher.data.formError);
    }
  }, [renameFetcher.data, setApp]);

  return (
    <>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SettingsSuggestIcon />
          <Box>
            <Typography variant="h6" fontWeight={800}>
              App Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage service identity, runtime operations, and destructive actions.
            </Typography>
          </Box>
        </Stack>

        {error ? (
          <Alert severity="error">
            {error}
          </Alert>
        ) : null}

        <Paper
          sx={{
            p: { xs: 1.5, sm: 1.8 },
            borderRadius: 1.75,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
            background: `linear-gradient(170deg, ${alpha(theme.palette.common.white, 0.72)}, ${alpha(theme.palette.background.default, 0.9)})`,
          }}
        >
          <Stack spacing={1.2}>
            <Typography fontWeight={800}>General</Typography>
            <Divider sx={{ opacity: 0.5 }} />
            <Stack spacing={1.1}>
              <TextField
                label="App name"
                size="small"
                value={name}
                onChange={(event) => setName(event.target.value)}
                helperText={renameHelper}
                error={Boolean(renameFetcher.data?.fieldErrors?.name)}
                disabled={isLoading || !app || isRenaming}
                inputProps={{ "aria-label": "App name" }}
              />
              {renameFetcher.data?.fieldErrors?.name ? (
                <Alert severity="error">{renameFetcher.data.fieldErrors.name}</Alert>
              ) : null}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  <Chip size="small" label={`Region: ${app?.region?.toUpperCase() ?? "-"}`} variant="outlined" />
                  <Chip size="small" label={`Plan: ${app?.plan ?? "-"}`} variant="outlined" />
                </Stack>
                <Button
                  variant="contained"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={() => void handleRename()}
                  disabled={!canRename}
                >
                  {isRenaming ? "Saving..." : "Save Rename"}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 1.5, sm: 1.8 },
            borderRadius: 1.75,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
            background: `linear-gradient(170deg, ${alpha(theme.palette.secondary.light, 0.26)}, ${alpha(theme.palette.secondary.main, 0.2)})`,
          }}
        >
          <Stack spacing={1.2}>
            <Typography fontWeight={800}>Runtime Operations</Typography>
            <Divider sx={{ opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Restart schedules a new boot cycle for this service. Existing in-flight requests may be interrupted.
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<RestartAltIcon />}
              sx={{ alignSelf: "flex-start" }}
              onClick={() => setRestartDialogOpen(true)}
              disabled={isLoading || !app}
            >
              Restart App
            </Button>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 1.5, sm: 1.8 },
            borderRadius: 1.75,
            border: `1px solid ${alpha(theme.palette.error.main, 0.24)}`,
            background: `linear-gradient(170deg, ${alpha(theme.palette.error.light, 0.3)}, ${alpha(theme.palette.error.main, 0.2)})`,
          }}
        >
          <Stack spacing={1.2}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <WarningAmberIcon color="error" />
              <Typography fontWeight={800} color="error.main">
                Danger Zone
              </Typography>
            </Stack>
            <Divider sx={{ opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Deleting this app permanently removes all related runtime resources in this mock flow.
            </Typography>
            <Button
              variant="contained"
              color="error"
              sx={{ alignSelf: "flex-start" }}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isLoading || !app}
            >
              Delete App
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <Dialog
        open={restartDialogOpen}
        onClose={() => {
          if (!isRestarting) setRestartDialogOpen(false);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Restart</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Restart <strong>{app?.name ?? "this app"}</strong>? The service will be temporarily unavailable.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestartDialogOpen(false)} disabled={isRestarting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => void handleRestart()}
            disabled={isRestarting}
          >
            {isRestarting ? "Restarting..." : "Restart"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteDialogOpen(false);
            setDeleteError(null);
            setDeleteConfirmText("");
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete App</DialogTitle>
        <DialogContent>
          <Stack spacing={1.2} sx={{ pt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Type <strong>{app?.name ?? "-"}</strong> to confirm permanent deletion.
            </Typography>
            <TextField
              size="small"
              label="Confirm app name"
              value={deleteConfirmText}
              onChange={(event) => setDeleteConfirmText(event.target.value)}
              inputProps={{ "aria-label": "Confirm app name to delete" }}
              disabled={isDeleting}
            />
            {deleteError ? <Alert severity="error">{deleteError}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteError(null);
              setDeleteConfirmText("");
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={() => void handleDelete()} disabled={deleteDisabled}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3200}
        onClose={() => setToastMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toastSeverity} variant="filled" onClose={() => setToastMessage("")}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
