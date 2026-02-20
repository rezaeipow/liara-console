import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyIcon from "@mui/icons-material/Key";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppsAPI } from "../../../api/appsApi";

type EnvRow = {
  id: string;
  key: string;
  value: string;
  secret: boolean;
};

type RowErrors = {
  key?: string;
  value?: string;
};

const KEY_PATTERN = /^[A-Z_][A-Z0-9_]*$/;

const createLocalId = () => `env-${Math.random().toString(36).slice(2, 9)}`;

export default function AppEnvPage() {
  const { appId } = useParams();
  const [rows, setRows] = useState<EnvRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [revealSecrets, setRevealSecrets] = useState(false);

  const loadEnvVars = useCallback(async () => {
    if (!appId) {
      setError("App id is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await AppsAPI.getEnvVars(appId);
      setRows(
        response.items.map((item) => ({
          id: createLocalId(),
          key: item.key,
          value: item.value,
          secret: Boolean(item.secret),
        })),
      );
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Could not load env vars.");
    } finally {
      setIsLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    void loadEnvVars();
  }, [loadEnvVars]);

  const rowErrors = useMemo<Record<string, RowErrors>>(() => {
    const errors: Record<string, RowErrors> = {};
    const duplicateMap = new Map<string, number>();

    rows.forEach((row) => {
      const normalizedKey = row.key.trim().toUpperCase();
      if (!normalizedKey) return;
      duplicateMap.set(normalizedKey, (duplicateMap.get(normalizedKey) ?? 0) + 1);
    });

    rows.forEach((row) => {
      const rowError: RowErrors = {};
      const normalizedKey = row.key.trim().toUpperCase();

      if (!normalizedKey) {
        rowError.key = "Key is required.";
      } else if (!KEY_PATTERN.test(normalizedKey)) {
        rowError.key = "Use A-Z, 0-9, underscore; start with letter/underscore.";
      } else if ((duplicateMap.get(normalizedKey) ?? 0) > 1) {
        rowError.key = "Duplicate key.";
      }

      if (!row.value.trim()) {
        rowError.value = "Value is required.";
      }

      if (rowError.key || rowError.value) {
        errors[row.id] = rowError;
      }
    });

    return errors;
  }, [rows]);

  const hasValidationError = Object.keys(rowErrors).length > 0;
  const hasSecretRows = rows.some((row) => row.secret);

  const updateRow = (rowId: string, patch: Partial<EnvRow>) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, { id: createLocalId(), key: "", value: "", secret: false }]);
  };

  const removeRow = (rowId: string) => {
    setRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleSave = async () => {
    if (!appId || hasValidationError) return;
    setIsSaving(true);
    setError(null);
    setNotice(null);

    try {
      await AppsAPI.updateEnvVars(
        appId,
        rows.map((row) => ({
          key: row.key.trim().toUpperCase(),
          value: row.value,
          secret: row.secret,
        })),
      );
      setNotice("Environment variables saved.");
      await loadEnvVars();
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Could not save env vars.");
    } finally {
      setIsSaving(false);
    }
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
          <KeyIcon />
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Environment Variables
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure runtime keys for this app and mark sensitive values as secret.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addRow}
          >
            Add Variable
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={() => void handleSave()}
            disabled={isSaving || hasValidationError}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Stack>

      <FormControlLabel
        control={
          <Switch
            checked={revealSecrets}
            disabled={!hasSecretRows}
            onChange={(event) => setRevealSecrets(event.target.checked)}
          />
        }
        label={hasSecretRows ? "Reveal secret values" : "No secret values to reveal"}
      />

      {notice ? <Alert severity="success">{notice}</Alert> : null}
      {error ? (
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => void loadEnvVars()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : null}

      {hasValidationError && !isLoading ? (
        <Alert severity="warning">
          Fix validation errors before saving.
        </Alert>
      ) : null}

      <Paper
        sx={{
          p: { xs: 1.5, sm: 1.75 },
          borderRadius: 1.5,
          border: `1px solid ${alpha("#1f6feb", 0.14)}`,
        }}
      >
        {isLoading ? (
          <Stack spacing={1}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Paper key={`env-skeleton-${idx}`} variant="outlined" sx={{ p: 1.2 }}>
                <Stack spacing={0.8}>
                  <Skeleton variant="rounded" height={36} />
                  <Skeleton variant="rounded" height={36} />
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : rows.length === 0 ? (
          <Alert severity="info">
            No environment variables yet. Add your first key.
          </Alert>
        ) : (
          <Stack spacing={1.1}>
            {rows.map((row, index) => {
              const errors = rowErrors[row.id];
              const isMasked = row.secret && !revealSecrets;
              return (
                <Paper
                  key={row.id}
                  variant="outlined"
                  sx={{
                    p: 1.2,
                    borderRadius: 1.25,
                    borderColor: alpha("#0f172a", 0.12),
                    backgroundColor: alpha("#ffffff", 0.46),
                  }}
                >
                  <Stack spacing={0.8}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      alignItems={{ xs: "stretch", sm: "center" }}
                    >
                      <TextField
                        size="small"
                        label="Key"
                        value={row.key}
                        onChange={(event) => updateRow(row.id, { key: event.target.value })}
                        error={Boolean(errors?.key)}
                        helperText={errors?.key}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        size="small"
                        label="Value"
                        type={isMasked ? "password" : "text"}
                        value={row.value}
                        onChange={(event) => updateRow(row.id, { value: event.target.value })}
                        error={Boolean(errors?.value)}
                        helperText={errors?.value}
                        sx={{ flex: 1 }}
                        slotProps={{
                          input: {
                            endAdornment: row.secret ? (
                              <InputAdornment position="end">
                                {revealSecrets ? (
                                  <VisibilityOffIcon fontSize="small" />
                                ) : (
                                  <VisibilityIcon fontSize="small" />
                                )}
                              </InputAdornment>
                            ) : undefined,
                          },
                        }}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Chip size="small" label={`Var ${index + 1}`} variant="outlined" />
                        <FormControlLabel
                          sx={{ m: 0 }}
                          control={
                            <Switch
                              size="small"
                              checked={row.secret}
                              onChange={(event) =>
                                updateRow(row.id, { secret: event.target.checked })
                              }
                            />
                          }
                          label={
                            <Typography variant="caption" color="text.secondary">
                              Secret
                            </Typography>
                          }
                        />
                      </Stack>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeRow(row.id)}
                        aria-label="Delete environment variable"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Paper>

      <Divider sx={{ opacity: 0.5 }} />
      <Typography variant="caption" color="text.secondary">
        Keys are automatically normalized to uppercase when saving.
      </Typography>
    </Stack>
  );
}
