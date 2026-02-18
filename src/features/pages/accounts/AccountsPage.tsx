import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import { type MouseEvent, useEffect, useMemo, useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import { useAppSelector } from "../../../app/store/hooks";
import {
  selectAccounts,
  selectActiveAccountId,
} from "../../../app/store/slices/accountSlice";
import type { AccountsLoaderData } from "./accountsData";

type AccountsActionData = {
  successMessage?: string;
  successAt?: number;
  formError?: string;
  fieldErrors?: {
    name?: string;
    accountId?: string;
  };
};

export default function AccountsPage() {
  useLoaderData() as AccountsLoaderData;
  const createFetcher = useFetcher<AccountsActionData>();
  const rowFetcher = useFetcher<AccountsActionData>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const accounts = useAppSelector(selectAccounts);
  const activeAccountId = useAppSelector(selectActiveAccountId);

  const [query, setQuery] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [accountIdToDelete, setAccountIdToDelete] = useState<string | null>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileMenuAccountId, setMobileMenuAccountId] = useState<string | null>(null);
  const [dismissedSuccessAt, setDismissedSuccessAt] = useState<number | null>(null);

  const isCreating = createFetcher.state !== "idle";
  const isMutatingRow = rowFetcher.state !== "idle";
  const rowIntent = String(rowFetcher.formData?.get("intent") ?? "");
  const rowAccountId = String(rowFetcher.formData?.get("accountId") ?? "");
  const isSwitching = isMutatingRow && rowIntent === "switch";
  const accountToDelete =
    accountIdToDelete == null
      ? null
      : accounts.find((item) => item.id === accountIdToDelete) ?? null;

  const filteredAccounts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return accounts.filter((account) =>
      account.name.toLowerCase().includes(normalizedQuery),
    );
  }, [accounts, query]);
  const mobileMenuOpen = Boolean(mobileMenuAnchorEl);

  const latestSuccess = useMemo(() => {
    const createAt = createFetcher.data?.successAt ?? 0;
    const rowAt = rowFetcher.data?.successAt ?? 0;
    if (createAt === 0 && rowAt === 0) return null;

    if (rowAt >= createAt) {
      return {
        at: rowAt,
        message: rowFetcher.data?.successMessage ?? "",
      };
    }

    return {
      at: createAt,
      message: createFetcher.data?.successMessage ?? "",
    };
  }, [
    createFetcher.data?.successAt,
    createFetcher.data?.successMessage,
    rowFetcher.data?.successAt,
    rowFetcher.data?.successMessage,
  ]);

  const showSuccessInline =
    Boolean(latestSuccess?.message) && latestSuccess?.at !== dismissedSuccessAt;

  useEffect(() => {
    if (!showSuccessInline || !latestSuccess?.at) return;
    const timerId = window.setTimeout(() => setDismissedSuccessAt(latestSuccess.at), 3000);
    return () => window.clearTimeout(timerId);
  }, [latestSuccess?.at, showSuccessInline]);

  const startEditing = (accountId: string, name: string) => {
    setEditingAccountId(accountId);
    setEditingName(name);
  };

  const cancelEditing = () => {
    setEditingAccountId(null);
    setEditingName("");
  };

  const submitEdit = () => {
    if (!editingAccountId) return;
    rowFetcher.submit(
      { intent: "edit", accountId: editingAccountId, name: editingName },
      { method: "post" },
    );
    cancelEditing();
  };

  const submitSwitch = (accountId: string) => {
    rowFetcher.submit({ intent: "switch", accountId }, { method: "post" });
  };

  const openDeleteDialog = (accountId: string) => {
    setAccountIdToDelete(accountId);
  };

  const closeDeleteDialog = () => {
    if (isMutatingRow) return;
    setAccountIdToDelete(null);
  };

  const confirmDelete = () => {
    if (!accountIdToDelete) return;
    rowFetcher.submit({ intent: "delete", accountId: accountIdToDelete }, { method: "post" });
    if (editingAccountId === accountIdToDelete) {
      cancelEditing();
    }
    setAccountIdToDelete(null);
  };

  const openMobileMenu = (event: MouseEvent<HTMLButtonElement>, accountId: string) => {
    setMobileMenuAnchorEl(event.currentTarget);
    setMobileMenuAccountId(accountId);
  };

  const closeMobileMenu = () => {
    setMobileMenuAnchorEl(null);
    setMobileMenuAccountId(null);
  };

  const handleCreateSubmit = () => {
    const trimmed = newAccountName.trim();
    if (trimmed.length < 2 || isCreating) return;
    createFetcher.submit({ intent: "create", name: trimmed }, { method: "post" });
    setNewAccountName("");
  };

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
          background:
            "linear-gradient(120deg, rgba(31,111,235,0.14), rgba(14,165,164,0.10))",
          border: "1px solid rgba(31,111,235,0.22)",
          borderRadius: { xs: 1.5, sm: 2 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <ManageAccountsOutlinedIcon />
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Accounts
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                Manage and switch between your console accounts.
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      <Box>
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            border: "1px solid rgba(148,163,184,0.24)",
            background:
              "linear-gradient(180deg, rgba(148,163,184,0.06), rgba(255,255,255,0.52))",
            borderRadius: { xs: 1.5, sm: 2 },
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Stack spacing={1.5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <ViewListOutlinedIcon />
                <Typography variant="h6" fontWeight={800}>
                  Accounts
                </Typography>
              </Stack>

              <TextField
                size="small"
                placeholder="Search by Account name"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                sx={{
                  minWidth: { sm: 260 },
                  "& .MuiOutlinedInput-root": {
                    minHeight: 40,
                    alignItems: "center",
                  },
                  "& .MuiOutlinedInput-input": {
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    lineHeight: "20px",
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    lineHeight: "20px",
                    opacity: 0.78,
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          alignSelf: "center",
                          display: "flex",
                          alignItems: "center",
                          m: 0,
                          mr: 1,
                          "& .MuiSvgIcon-root": {
                            transform: "translateY(1px)",
                          },
                        }}
                      >
                        <SearchIcon fontSize="small" sx={{ display: "block" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>

            <Divider sx={{ opacity: 0.4 }} />

            <Collapse in={showSuccessInline}>
              <Alert
                severity="success"
                onClose={() => {
                  if (latestSuccess?.at) {
                    setDismissedSuccessAt(latestSuccess.at);
                  }
                }}
              >
                {latestSuccess?.message}
              </Alert>
            </Collapse>

            {createFetcher.data?.formError ? (
              <Alert severity="error">{createFetcher.data.formError}</Alert>
            ) : null}

            <Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <TextField
                  label="Account name"
                  placeholder="Account name"
                  size="small"
                  fullWidth
                  value={newAccountName}
                  onChange={(event) => setNewAccountName(event.target.value)}
                  disabled={isCreating}
                  error={Boolean(createFetcher.data?.fieldErrors?.name)}
                  helperText={createFetcher.data?.fieldErrors?.name}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      minHeight: 40,
                    },
                  }}
                  slotProps={{
                    input: {
                      onKeyDown: (event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleCreateSubmit();
                        }
                      },
                      startAdornment: (
                        <InputAdornment position="start">
                          <AddCircleOutlineIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  disabled={isCreating || newAccountName.trim().length < 2}
                  onClick={handleCreateSubmit}
                  sx={{
                    height: 40,
                    minWidth: { sm: 124 },
                    fontSize: "0.9rem",
                    fontWeight: 700,
                  }}
                >
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </Stack>
            </Stack>

            <Divider sx={{ opacity: 0.4 }} />

          {rowFetcher.data?.formError ? (
            <Alert severity="error">
              {rowFetcher.data.formError}
            </Alert>
          ) : null}

          {filteredAccounts.length === 0 ? (
            <Alert severity="info">
              {accounts.length === 0
                ? "No accounts found. Create your first account."
                : "No account matches your search."}
            </Alert>
          ) : (
            <Stack spacing={1.25}>
              {filteredAccounts.map((account) => {
                const isActive = account.id === activeAccountId;
                return (
                  <Box
                    key={account.id}
                    sx={{
                      p: 1.6,
                      borderRadius: { xs: 1.5, sm: 2 },
                      border: "1px solid",
                      borderColor: isActive ? "rgba(31,111,235,0.45)" : "divider",
                      backgroundColor: isActive
                        ? "rgba(31,111,235,0.10)"
                        : "rgba(255,255,255,0.35)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1.25,
                      transition: "border-color 140ms ease, background-color 140ms ease",
                      "&:hover": {
                        borderColor: isActive ? "rgba(31,111,235,0.52)" : "rgba(100,116,139,0.45)",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                      {editingAccountId === account.id ? (
                        <TextField
                          size="small"
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                          sx={{ minWidth: { xs: 120, sm: 200 } }}
                        />
                      ) : (
                        <Typography
                          fontWeight={700}
                          noWrap
                          sx={{ maxWidth: { xs: 160, sm: 260 } }}
                          title={account.name}
                        >
                          {account.name}
                        </Typography>
                      )}
                      {isActive ? (
                        <Chip
                          label={
                            <Box
                              component="span"
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                lineHeight: 1,
                                transform: "translateY(-0.5px)",
                              }}
                            >
                              Active
                            </Box>
                          }
                          size="small"
                          sx={{
                            bgcolor: "#1e3a8a",
                            color: "#ffffff",
                            fontWeight: 700,
                            height: 24,
                            border: "1px solid rgba(255,255,255,0.25)",
                            display: "inline-flex",
                            alignItems: "center",
                            "& .MuiChip-label": {
                              display: "inline-flex",
                              alignItems: "center",
                              height: "100%",
                              px: 1,
                            },
                          }}
                        />
                      ) : null}
                      {isMutatingRow && rowAccountId === account.id ? (
                        <Chip
                          icon={<CircularProgress size={12} />}
                          label={
                            rowIntent === "switch"
                              ? "Switching"
                              : rowIntent === "edit"
                                ? "Saving"
                                : "Updating"
                          }
                          size="small"
                          variant="outlined"
                          sx={{ height: 24 }}
                        />
                      ) : null}
                    </Stack>

                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {editingAccountId === account.id ? (
                        <>
                          <Tooltip title="Save">
                            <span>
                              <IconButton
                                size="small"
                                color="primary"
                                aria-label="Save account name"
                                onClick={submitEdit}
                                disabled={isMutatingRow || editingName.trim().length < 2}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <span>
                              <IconButton
                                size="small"
                                aria-label="Cancel editing account name"
                                onClick={cancelEditing}
                                disabled={isMutatingRow}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            sx={{ display: { xs: "none", sm: "flex" } }}
                          >
                            {!isActive ? (
                              <Button
                                type="button"
                                size="small"
                                variant="contained"
                                disabled={isMutatingRow}
                                onClick={() => submitSwitch(account.id)}
                                sx={{ minWidth: 88 }}
                              >
                                {isSwitching && rowAccountId === account.id
                                  ? "Switching..."
                                  : "Switch"}
                              </Button>
                            ) : null}

                            <Tooltip title="Edit account">
                              <span>
                                <IconButton
                                  size="small"
                                  aria-label={`Edit ${account.name}`}
                                  onClick={() => startEditing(account.id, account.name)}
                                  disabled={isMutatingRow}
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>

                            <Tooltip title="Delete account">
                              <span>
                                <IconButton
                                  size="small"
                                  aria-label={`Delete ${account.name}`}
                                  onClick={() => openDeleteDialog(account.id)}
                                  disabled={isMutatingRow || accounts.length <= 1}
                                  sx={{
                                    color: "text.secondary",
                                    "&:hover": { color: "error.main" },
                                  }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>

                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            sx={{ display: { xs: "inline-flex", sm: "none" } }}
                          >
                            {!isActive ? (
                              <Button
                                type="button"
                                size="small"
                                variant="outlined"
                                onClick={() => submitSwitch(account.id)}
                                disabled={isMutatingRow}
                              >
                                {isSwitching && rowAccountId === account.id
                                  ? "Switching..."
                                  : "Switch"}
                              </Button>
                            ) : null}
                            <IconButton
                              size="small"
                              aria-label={`More actions for ${account.name}`}
                              onClick={(event) => openMobileMenu(event, account.id)}
                              disabled={isMutatingRow}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </>
                      )}
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
          </Stack>
        </Paper>
      </Box>

      <Dialog
        open={Boolean(accountIdToDelete)}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
        slots={{ transition: Fade }}
        slotProps={{
          transition: {
            timeout: { enter: 180, exit: 130 },
          },
          backdrop: {
            timeout: { enter: 160, exit: 120 },
          },
        }}
      >
        <DialogTitle>Delete account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. Are you sure you want to delete{" "}
            <strong>{accountToDelete?.name ?? "this account"}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={isMutatingRow}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={isMutatingRow}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {!isMobile || !mobileMenuAccountId ? null : (
          <>
            {mobileMenuAccountId !== activeAccountId ? (
              <MenuItem
                onClick={() => {
                  submitSwitch(mobileMenuAccountId);
                  closeMobileMenu();
                }}
              >
                <SwapHorizIcon fontSize="small" sx={{ mr: 1 }} />
                Switch
              </MenuItem>
            ) : null}

            <MenuItem
              onClick={() => {
                const account = accounts.find((item) => item.id === mobileMenuAccountId);
                if (account) {
                  startEditing(account.id, account.name);
                }
                closeMobileMenu();
              }}
            >
              <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                openDeleteDialog(mobileMenuAccountId);
                closeMobileMenu();
              }}
              disabled={accounts.length <= 1}
            >
              <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Stack>
  );
}
