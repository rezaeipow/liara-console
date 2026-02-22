import AppsIcon from "@mui/icons-material/Apps";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import BoltIcon from "@mui/icons-material/Bolt";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StorageIcon from "@mui/icons-material/Storage";
import TimelineIcon from "@mui/icons-material/Timeline";
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
import { useMemo, useState } from "react";
import { Link, useFetcher, useLoaderData } from "react-router-dom";
import type {
  ProjectOverviewActionData,
  ProjectOverviewLoaderData,
} from "./projectsData";

export default function ProjectOverviewPage() {
  const theme = useTheme();
  const { project } = useLoaderData() as ProjectOverviewLoaderData;
  const actionFetcher = useFetcher<ProjectOverviewActionData>();

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [nextProjectName, setNextProjectName] = useState(project.name);
  const [dismissedNoticeKey, setDismissedNoticeKey] = useState<string | null>(null);

  const createdAt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(project.createdAt)),
    [project.createdAt],
  );
  const activityDateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );
  const isHealthy = project.servicesSummary.apps + project.servicesSummary.vms > 0;
  const isSubmitting = actionFetcher.state !== "idle";
  const actionIntent = String(actionFetcher.formData?.get("intent") ?? "");
  const renameError = actionFetcher.data?.fieldErrors?.name;
  const noticeMessage =
    actionFetcher.data?.formError ?? actionFetcher.data?.successMessage ?? "";
  const noticeKey =
    actionFetcher.data?.successAt != null
      ? `success-${actionFetcher.data.successAt}`
      : actionFetcher.data?.formError
        ? `error-${actionFetcher.data.formError}`
        : null;
  const snackbarOpen = Boolean(noticeKey) && noticeKey !== dismissedNoticeKey;

  const handleOpenRenameDialog = () => {
    setNextProjectName(project.name);
    setRenameDialogOpen(true);
  };

  const handleSubmitRename = () => {
    setRenameDialogOpen(false);
    actionFetcher.submit(
      {
        intent: "rename",
        name: nextProjectName,
      },
      { method: "post" },
    );
  };

  const handleSubmitDelete = () => {
    setDeleteDialogOpen(false);
    actionFetcher.submit(
      {
        intent: "delete",
      },
      { method: "post" },
    );
  };

  const deleteDisabled = deleteConfirmText.trim() !== project.name || isSubmitting;

  return (
    <>
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
          <Stack spacing={1.2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Typography variant="h5" fontWeight={800}>
                {project.name}
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                <Chip
                  size="small"
                  icon={<BoltIcon sx={{ fontSize: 16 }} />}
                  label={isHealthy ? "Healthy" : "Provisioning"}
                  color={isHealthy ? "success" : "warning"}
                  variant="outlined"
                />
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DriveFileRenameOutlineIcon fontSize="small" />}
                  onClick={handleOpenRenameDialog}
                >
                  Rename
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon fontSize="small" />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip size="small" label={project.region.toUpperCase()} />
              <Chip size="small" label={project.plan} sx={{ textTransform: "capitalize" }} />
              <Chip size="small" label={`Created ${createdAt}`} variant="outlined" />
            </Stack>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, minmax(0, 1fr))" },
            gap: 1.5,
          }}
        >
          <Paper variant="outlined" sx={{ p: 1.75, borderColor: alpha(theme.palette.primary.main, 0.2) }}>
            <Stack spacing={1.1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AppsIcon fontSize="small" />
                <Typography fontWeight={700}>Apps</Typography>
              </Stack>
              <Typography variant="h6" fontWeight={800}>
                {project.servicesSummary.apps}
              </Typography>
              <Button
                component={Link}
                to={`/console/projects/${project.id}/apps`}
                size="small"
                variant="outlined"
                endIcon={<ArrowOutwardIcon fontSize="small" />}
                sx={{ alignSelf: "flex-start" }}
              >
                Open apps
              </Button>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 1.75, borderColor: alpha(theme.palette.primary.main, 0.2) }}>
            <Stack spacing={1.1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <StorageIcon fontSize="small" />
                <Typography fontWeight={700}>VMs</Typography>
              </Stack>
              <Typography variant="h6" fontWeight={800}>
                {project.servicesSummary.vms}
              </Typography>
              <Button
                component={Link}
                to={`/console/projects/${project.id}/vms`}
                size="small"
                variant="outlined"
                endIcon={<ArrowOutwardIcon fontSize="small" />}
                sx={{ alignSelf: "flex-start" }}
              >
                Open VMs
              </Button>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 1.75, borderColor: alpha(theme.palette.primary.main, 0.2) }}>
            <Stack spacing={1.1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ReceiptLongIcon fontSize="small" />
                <Typography fontWeight={700}>Credit Snapshot</Typography>
              </Stack>
              <Typography variant="h6" fontWeight={800}>
                {project.billingSnapshot.credit.toLocaleString()} IRR
              </Typography>
              <Button
                component={Link}
                to="/console/billing"
                size="small"
                variant="outlined"
                startIcon={<CreditCardIcon fontSize="small" />}
                sx={{ alignSelf: "flex-start" }}
              >
                Open billing
              </Button>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 1.75, borderColor: alpha(theme.palette.primary.main, 0.2) }}>
            <Stack spacing={1.1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TimelineIcon fontSize="small" />
                <Typography fontWeight={700}>Activity</Typography>
              </Stack>
              <Typography variant="h6" fontWeight={800}>
                {project.activity.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent events in this project
              </Typography>
            </Stack>
          </Paper>
        </Box>

        <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: { xs: 1.5, sm: 2 } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
            <TimelineIcon fontSize="small" />
            <Typography fontWeight={800}>Recent Activity</Typography>
          </Stack>
          <Divider sx={{ mb: 1.5, opacity: 0.5 }} />
          {project.activity.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
              No activity yet.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {project.activity.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.1,
                  borderRadius: 1.25,
                    border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                  backgroundColor: alpha(theme.palette.common.white, 0.5),
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activityDateTimeFormatter.format(new Date(item.createdAt))}
                </Typography>
              </Box>
            ))}
          </Stack>
          )}
        </Paper>
      </Stack>

      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Rename project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Project name"
            value={nextProjectName}
            onChange={(event) => setNextProjectName(event.target.value)}
            error={Boolean(renameError)}
            helperText={renameError}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitRename}
            disabled={isSubmitting || nextProjectName.trim().length < 3}
          >
            {isSubmitting && actionIntent === "rename" ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteConfirmText("");
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete project</DialogTitle>
        <DialogContent>
          <Stack spacing={1.1} sx={{ pt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Type <strong>{project.name}</strong> to confirm deletion.
            </Typography>
            <TextField
              size="small"
              label="Confirm project name"
              value={deleteConfirmText}
              onChange={(event) => setDeleteConfirmText(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteConfirmText("");
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmitDelete}
            disabled={deleteDisabled}
          >
            {isSubmitting && actionIntent === "delete" ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3200}
        onClose={() => setDismissedNoticeKey(noticeKey)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={actionFetcher.data?.formError ? "error" : "success"}
          onClose={() => setDismissedNoticeKey(noticeKey)}
          variant="filled"
        >
          {noticeMessage || "Operation completed."}
        </Alert>
      </Snackbar>
    </>
  );
}
