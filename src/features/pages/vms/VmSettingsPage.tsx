import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Alert,
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
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useFetcher, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { VmsAPI } from "../../../api/vmsApi";
import type { Vm } from "../../../api/types";
import type React from "react";
import type { VmSettingsActionData } from "./vmSettingsData";

type VmLayoutContext = {
  vm: Vm | null;
  isLoading: boolean;
  error: string | null;
  setVm: React.Dispatch<React.SetStateAction<Vm | null>>;
};

export default function VmSettingsPage() {
  const { vm, isLoading, error, setVm } = useOutletContext<VmLayoutContext>();
  const { vmId } = useParams();
  const navigate = useNavigate();
  const renameFetcher = useFetcher<VmSettingsActionData>();

  const [name, setName] = useState("");
  const isRenaming = renameFetcher.state !== "idle";

  const [restartDialogOpen, setRestartDialogOpen] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    if (vm?.name) {
      setName(vm.name);
    }
  }, [vm?.name]);

  const trimmedName = name.trim();
  const canRename =
    Boolean(vm) &&
    trimmedName.length >= 3 &&
    trimmedName.length <= 32 &&
    trimmedName !== vm?.name &&
    !isRenaming;

  const renameHelper = useMemo(() => {
    if (!trimmedName) return "Name is required.";
    if (trimmedName.length < 3) return "Use at least 3 characters.";
    if (trimmedName.length > 32) return "Use at most 32 characters.";
    return "Choose a descriptive VM name.";
  }, [trimmedName]);

  const deleteDisabled = deleteConfirmText.trim() !== (vm?.name ?? "") || isDeleting;

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
    if (!vmId) return;
    setIsRestarting(true);
    try {
      await VmsAPI.reboot(vmId);
      setRestartDialogOpen(false);
      setToast({ severity: "info", message: "VM reboot queued." });
    } catch (requestError: unknown) {
      setToast({ severity: "error", message: requestError instanceof Error ? requestError.message : "Restart failed." });
    } finally {
      setIsRestarting(false);
    }
  };

  const handleDelete = async () => {
    if (!vm?.id || deleteDisabled) {
      if (!vm?.id) {
        setDeleteError("VM id is missing.");
      }
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await VmsAPI.remove(vm.id);
      setDeleteDialogOpen(false);
      setToast({ severity: "success", message: "VM deleted successfully." });
      const targetProject = vm?.projectId ?? "prj-1";
      navigate(`/console/projects/${targetProject}/vms`, { replace: true });
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Could not delete VM.";
      setDeleteError(message);
      setToast({ severity: "error", message });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!renameFetcher.data) return;
    if (renameFetcher.data.ok) {
      setToast({ severity: "success", message: renameFetcher.data.message ?? "VM renamed." });
      const updatedName = renameFetcher.data.updatedName;
      if (updatedName) {
        setVm((current) => (current ? { ...current, name: updatedName } : current));
      }
    } else if (renameFetcher.data.fieldErrors?.name) {
      setToast({ severity: "error", message: renameFetcher.data.fieldErrors.name });
    } else if (renameFetcher.data.formError) {
      setToast({ severity: "error", message: renameFetcher.data.formError });
    }
  }, [renameFetcher.data, setVm]);

  return (
    <>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" fontWeight={800}>
            VM Settings
          </Typography>
        </Stack>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Paper
          sx={{
            p: { xs: 1.5, sm: 1.8 },
            borderRadius: 1.75,
            border: `1px solid ${alpha("#1f6feb", 0.16)}`,
            background: "linear-gradient(170deg, rgba(255,255,255,0.72), rgba(248,250,252,0.9))",
          }}
        >
          <Stack spacing={1.2}>
            <Typography fontWeight={800}>General</Typography>
            <Divider sx={{ opacity: 0.5 }} />
            <Stack spacing={1.1}>
              <TextField
                label="VM name"
                size="small"
                value={name}
                onChange={(event) => setName(event.target.value)}
                helperText={renameHelper}
                error={Boolean(renameFetcher.data?.fieldErrors?.name)}
                disabled={isLoading || !vm || isRenaming}
                inputProps={{ "aria-label": "VM name" }}
              />
              {renameFetcher.data?.fieldErrors?.name ? (
                <Alert severity="error">{renameFetcher.data.fieldErrors.name}</Alert>
              ) : null}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  <Chip size="small" label={`Status: ${vm?.status ?? "-"}`} variant="outlined" />
                  <Chip size="small" label={`vCPU: ${vm?.cpu ?? "-"}`} variant="outlined" />
                  <Chip
                    size="small"
                    label={`RAM: ${vm?.ram ? `${(vm.ram / 1024).toFixed(1)} GB` : "-"}`}
                    variant="outlined"
                  />
                  <Chip size="small" label={`Disk: ${vm?.disk ?? "-"} GB`} variant="outlined" />
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
            border: `1px solid ${alpha("#0ea5a4", 0.2)}`,
            background: "linear-gradient(170deg, rgba(240,253,250,0.56), rgba(236,253,245,0.75))",
          }}
        >
          <Stack spacing={1.2}>
            <Typography fontWeight={800}>Runtime Operations</Typography>
            <Divider sx={{ opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Reboot schedules a fresh boot cycle for this VM. Running sessions may be interrupted.
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<RestartAltOutlinedIcon />}
              sx={{ alignSelf: "flex-start" }}
              onClick={() => setRestartDialogOpen(true)}
              disabled={isLoading || !vm}
            >
              Reboot VM
            </Button>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 1.5, sm: 1.8 },
            borderRadius: 1.75,
            border: `1px solid ${alpha("#dc2626", 0.24)}`,
            background: "linear-gradient(170deg, rgba(254,242,242,0.74), rgba(254,226,226,0.86))",
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
              Deleting this VM permanently removes its resources.
            </Typography>
            <Button
              variant="contained"
              color="error"
              sx={{ alignSelf: "flex-start" }}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isLoading || !vm}
            >
              Delete VM
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
        <DialogTitle>Confirm Reboot</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Reboot <strong>{vm?.name ?? "this VM"}</strong>? This will interrupt running workloads.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestartDialogOpen(false)} disabled={isRestarting}>
            Cancel
          </Button>
          <Button variant="contained" color="warning" onClick={() => void handleRestart()} disabled={isRestarting}>
            {isRestarting ? "Rebooting..." : "Reboot"}
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
        <DialogTitle>Delete VM</DialogTitle>
        <DialogContent>
          <Stack spacing={1.2} sx={{ pt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Type <strong>{vm?.name ?? "-"}</strong> to confirm permanent deletion.
            </Typography>
            <TextField
              size="small"
              label="Confirm VM name"
              value={deleteConfirmText}
              onChange={(event) => setDeleteConfirmText(event.target.value)}
              inputProps={{ "aria-label": "Confirm VM name to delete" }}
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
