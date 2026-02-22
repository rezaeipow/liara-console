import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import {
  selectUIPreferences,
  setSidebarMode,
  setTableDensity,
  showToast,
  type UIPreferences,
} from "../../../app/store/slices/uiSlice";

type SecurityPreferences = {
  twoFAEnabled: boolean;
  backupCodesEnabled: boolean;
  emailAlertsEnabled: boolean;
};

const SECURITY_STORAGE_KEY = "console-security-preferences";
const UI_STORAGE_KEY = "console-ui-preferences";
const MOCK_2FA_CODE = "123456";
const DEFAULT_UI_PREFERENCES: UIPreferences = {
  sidebarMode: "expanded",
  tableDensity: "standard",
};
const DEFAULT_SECURITY_PREFERENCES: SecurityPreferences = {
  twoFAEnabled: false,
  backupCodesEnabled: false,
  emailAlertsEnabled: true,
};

function loadSecurityPreferences(): SecurityPreferences {
  try {
    const raw = localStorage.getItem(SECURITY_STORAGE_KEY);
    if (!raw) throw new Error("missing");
    const parsed = JSON.parse(raw) as Partial<SecurityPreferences>;
    return {
      twoFAEnabled: parsed.twoFAEnabled === true,
      backupCodesEnabled: parsed.backupCodesEnabled === true,
      emailAlertsEnabled: parsed.emailAlertsEnabled !== false,
    };
  } catch {
    return {
      twoFAEnabled: false,
      backupCodesEnabled: false,
      emailAlertsEnabled: true,
    };
  }
}

function saveSecurityPreferences(prefs: SecurityPreferences) {
  localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(prefs));
}

function loadUiPreferencesFromStorage(): UIPreferences {
  try {
    const raw = localStorage.getItem(UI_STORAGE_KEY);
    if (!raw) return DEFAULT_UI_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<UIPreferences>;
    return {
      sidebarMode: parsed.sidebarMode === "collapsed" ? "collapsed" : "expanded",
      tableDensity:
        parsed.tableDensity === "compact" ||
        parsed.tableDensity === "comfortable" ||
        parsed.tableDensity === "standard"
          ? parsed.tableDensity
          : DEFAULT_UI_PREFERENCES.tableDensity,
    };
  } catch {
    return DEFAULT_UI_PREFERENCES;
  }
}

function createMockRecoveryCodes(): string[] {
  return Array.from({ length: 6 }).map((_, index) =>
    `LR-${String(index + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
  );
}

function arePreferenceEqual(left: UIPreferences, right: UIPreferences): boolean {
  return (
    left.sidebarMode === right.sidebarMode &&
    left.tableDensity === right.tableDensity
  );
}

function areSecurityEqual(left: SecurityPreferences, right: SecurityPreferences): boolean {
  return (
    left.twoFAEnabled === right.twoFAEnabled &&
    left.backupCodesEnabled === right.backupCodesEnabled &&
    left.emailAlertsEnabled === right.emailAlertsEnabled
  );
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmMd = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const persistedPreferences = useAppSelector(selectUIPreferences);
  const [draftPreferences, setDraftPreferences] = useState<UIPreferences>(persistedPreferences);
  const [persistedSecurity, setPersistedSecurity] = useState<SecurityPreferences>(() =>
    loadSecurityPreferences(),
  );
  const [draftSecurity, setDraftSecurity] = useState<SecurityPreferences>(() =>
    loadSecurityPreferences(),
  );
  const [twoFADialogOpen, setTwoFADialogOpen] = useState(false);
  const [disableTwoFADialogOpen, setDisableTwoFADialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<"instructions" | "verify">("instructions");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  useEffect(() => {
    setDraftPreferences(persistedPreferences);
  }, [persistedPreferences]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === UI_STORAGE_KEY) {
        const incoming = loadUiPreferencesFromStorage();
        dispatch(setSidebarMode(incoming.sidebarMode));
        dispatch(setTableDensity(incoming.tableDensity));
      }

      if (event.key === SECURITY_STORAGE_KEY) {
        const incomingSecurity = loadSecurityPreferences();
        setPersistedSecurity(incomingSecurity);
        setDraftSecurity(incomingSecurity);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  const hasUnsavedChanges = useMemo(
    () =>
      !arePreferenceEqual(draftPreferences, persistedPreferences) ||
      !areSecurityEqual(draftSecurity, persistedSecurity),
    [draftPreferences, persistedPreferences, draftSecurity, persistedSecurity],
  );
  const densityPreviewGapPx =
    draftPreferences.tableDensity === "comfortable"
      ? 18
      : draftPreferences.tableDensity === "compact"
        ? 9
        : 10;
  const densityPreviewRowMinHeight =
    draftPreferences.tableDensity === "comfortable"
      ? 56
      : draftPreferences.tableDensity === "compact"
        ? 28
        : 40;

  const handleTwoFAChange = (checked: boolean) => {
    if (checked && !draftSecurity.twoFAEnabled) {
      setVerificationCode("");
      setVerificationError(null);
      setTwoFAStep("instructions");
      setTwoFADialogOpen(true);
      return;
    }

    if (!checked && draftSecurity.twoFAEnabled) {
      setDisableTwoFADialogOpen(true);
    }
  };

  const handleVerifyTwoFA = () => {
    if (verificationCode.trim() !== MOCK_2FA_CODE) {
      setVerificationError("Verification code is invalid. Use 123456 for the mock flow.");
      return;
    }

    setDraftSecurity((prev) => ({
      ...prev,
      twoFAEnabled: true,
      backupCodesEnabled: true,
    }));
    setRecoveryCodes(createMockRecoveryCodes());
    setTwoFADialogOpen(false);
    setVerificationCode("");
    setVerificationError(null);
    setTwoFAStep("instructions");
  };

  const handleDisableTwoFA = () => {
    setDraftSecurity((prev) => ({
      ...prev,
      twoFAEnabled: false,
      backupCodesEnabled: false,
    }));
    setDisableTwoFADialogOpen(false);
    setRecoveryCodes([]);
  };

  const handleResetToDefaults = () => {
    setDraftPreferences(DEFAULT_UI_PREFERENCES);
    setDraftSecurity(DEFAULT_SECURITY_PREFERENCES);
    setVerificationCode("");
    setVerificationError(null);
    setRecoveryCodes([]);
    setResetDialogOpen(false);
  };

  const changedKeys = useMemo(
    () => ({
      sidebarMode: draftPreferences.sidebarMode !== persistedPreferences.sidebarMode,
      tableDensity: draftPreferences.tableDensity !== persistedPreferences.tableDensity,
      twoFA: draftSecurity.twoFAEnabled !== persistedSecurity.twoFAEnabled,
      backup: draftSecurity.backupCodesEnabled !== persistedSecurity.backupCodesEnabled,
      alerts: draftSecurity.emailAlertsEnabled !== persistedSecurity.emailAlertsEnabled,
    }),
    [draftPreferences, draftSecurity, persistedPreferences, persistedSecurity],
  );

  const changedCount = Object.values(changedKeys).filter(Boolean).length;

  const handleCancelTwoFASetup = () => {
    setTwoFADialogOpen(false);
    setTwoFAStep("instructions");
    setVerificationCode("");
    setVerificationError(null);
  };

  const handleSave = () => {
    dispatch(setSidebarMode(draftPreferences.sidebarMode));
    dispatch(setTableDensity(draftPreferences.tableDensity));
    saveSecurityPreferences(draftSecurity);
    setPersistedSecurity(draftSecurity);
    dispatch(showToast({ message: "Settings saved successfully.", severity: "success" }));
  };

  const handleDiscard = () => {
    setDraftPreferences(persistedPreferences);
    setDraftSecurity(persistedSecurity);
    setTwoFADialogOpen(false);
    setVerificationCode("");
    setVerificationError(null);
  };

  return (
    <>
      <Stack
        spacing={2.2}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 980, lg: 1080 },
          mx: { xs: 0, sm: "auto" },
          mt: { xs: 1.25, sm: 1.5 },
          px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: "1px solid rgba(31,111,235,0.32)",
            background:
              "linear-gradient(120deg, rgba(31,111,235,0.20), rgba(14,165,164,0.14))",
            backdropFilter: "blur(14px)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={800}>
                Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage security and personalize your console experience.
              </Typography>
            </Stack>
            <Chip
              icon={<VerifiedUserOutlinedIcon fontSize="small" />}
              label={draftSecurity.twoFAEnabled ? "2FA enabled" : "2FA disabled"}
              color={draftSecurity.twoFAEnabled ? "success" : "warning"}
              variant="outlined"
            />
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 1.5,
          }}
        >
          <Paper
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: { xs: 1.5, sm: 2 },
              border: `1px solid ${alpha("#1f6feb", 0.24)}`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.76))",
              backdropFilter: "blur(10px)",
              transition: "transform .2s ease",
              "&:hover": { transform: "translateY(-1px)" },
            }}
          >
            <Stack spacing={1.4}>
              <Stack direction="row" spacing={0.9} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={0.9} alignItems="center">
                  <SecurityOutlinedIcon fontSize="small" />
                  <Typography fontWeight={800}>Security</Typography>
                </Stack>
                <Tooltip title="Manage 2FA, backup codes, and alerting preferences.">
                  <IconButton size="small" aria-label="Security help">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              <SettingRow
                icon={<LockOutlinedIcon fontSize="small" />}
                title="Two-factor authentication"
                description="Add an extra verification step to protect your account."
                control={
                  <Switch
                    checked={draftSecurity.twoFAEnabled}
                    onChange={(_, checked) => handleTwoFAChange(checked)}
                    inputProps={{ "aria-label": "Toggle two-factor authentication" }}
                  />
                }
              />
              {changedKeys.twoFA ? <Chip size="small" variant="outlined" color="info" label="Changed" /> : null}

              <SettingRow
                icon={<VerifiedUserOutlinedIcon fontSize="small" />}
                title="Backup recovery codes"
                description="Generate one-time recovery codes for emergency access."
                control={
                  <Switch
                    checked={draftSecurity.backupCodesEnabled}
                    onChange={(_, checked) =>
                      setDraftSecurity((prev) => ({ ...prev, backupCodesEnabled: checked }))
                    }
                    disabled={!draftSecurity.twoFAEnabled}
                    inputProps={{ "aria-label": "Toggle backup recovery codes" }}
                  />
                }
              />
              {changedKeys.backup ? <Chip size="small" variant="outlined" color="info" label="Changed" /> : null}

              <SettingRow
                icon={<SecurityOutlinedIcon fontSize="small" />}
                title="Critical email alerts"
                description="Receive security notifications about login and credential changes."
                control={
                  <Switch
                    checked={draftSecurity.emailAlertsEnabled}
                    onChange={(_, checked) =>
                      setDraftSecurity((prev) => ({ ...prev, emailAlertsEnabled: checked }))
                    }
                    inputProps={{ "aria-label": "Toggle critical email alerts" }}
                  />
                }
              />
              {changedKeys.alerts ? <Chip size="small" variant="outlined" color="info" label="Changed" /> : null}
              {recoveryCodes.length > 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.1,
                    borderRadius: 1.2,
                    borderColor: alpha("#16a34a", 0.3),
                    backgroundColor: alpha("#ecfdf5", 0.7),
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.6 }}>
                    Recovery codes (mock)
                  </Typography>
                  <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                    {recoveryCodes.map((code) => (
                      <Chip key={code} size="small" label={code} variant="outlined" />
                    ))}
                  </Stack>
                </Paper>
              ) : null}
            </Stack>
          </Paper>
          <Paper
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: { xs: 1.5, sm: 2 },
              border: `1px solid ${alpha("#1f6feb", 0.24)}`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.76))",
              backdropFilter: "blur(10px)",
              transition: "transform .2s ease",
              "&:hover": { transform: "translateY(-1px)" },
            }}
          >
            <Stack spacing={1.4}>
              <Stack direction="row" spacing={0.9} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={0.9} alignItems="center">
                  <TuneOutlinedIcon fontSize="small" />
                  <Typography fontWeight={800}>Preferences</Typography>
                </Stack>
                <Tooltip title="Sidebar behavior and data density settings.">
                  <IconButton size="small" aria-label="Preferences help">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              {!isLgUp ? (
                <PreferenceField
                  icon={<ViewSidebarOutlinedIcon fontSize="small" />}
                  title="Sidebar mode"
                  description={
                    isXs
                      ? "Visible for reference. This setting applies to tablet layouts only."
                      : "Control navigation density in medium layouts."
                  }
                >
                  <FormControl size="small" sx={{ minWidth: 168 }}>
                    <Select
                      value={draftPreferences.sidebarMode}
                      onChange={(event) =>
                        setDraftPreferences((prev) => ({
                          ...prev,
                          sidebarMode: event.target.value as UIPreferences["sidebarMode"],
                        }))
                      }
                      disabled={!isSmMd}
                      sx={
                        !isSmMd
                          ? {
                              opacity: 0.72,
                              "& .MuiSelect-select": { color: "text.secondary" },
                            }
                          : undefined
                      }
                      inputProps={{ "aria-label": "Select sidebar mode" }}
                    >
                      <MenuItem value="expanded">Expanded</MenuItem>
                      <MenuItem value="collapsed">Collapsed</MenuItem>
                    </Select>
                  </FormControl>
                </PreferenceField>
              ) : null}
              {changedKeys.sidebarMode && !isLgUp ? (
                <Chip size="small" variant="outlined" color="info" label="Changed" />
              ) : null}

              <PreferenceField
                icon={<TuneOutlinedIcon fontSize="small" />}
                title="Table density"
                description="Adjust row spacing for data-heavy pages."
              >
                <Stack spacing={1} sx={{ minWidth: { xs: "100%", sm: 220 } }}>
                  <FormControl size="small" sx={{ minWidth: 168 }}>
                    <Select
                      value={draftPreferences.tableDensity}
                      onChange={(event) =>
                        setDraftPreferences((prev) => ({
                          ...prev,
                          tableDensity: event.target.value as UIPreferences["tableDensity"],
                        }))
                      }
                      inputProps={{ "aria-label": "Select table density" }}
                    >
                      <MenuItem value="comfortable">Comfortable</MenuItem>
                      <MenuItem value="standard">Standard</MenuItem>
                      <MenuItem value="compact">Compact</MenuItem>
                    </Select>
                  </FormControl>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1,
                      borderRadius: 1.2,
                      borderColor: alpha("#0f172a", 0.12),
                      backgroundColor: alpha("#ffffff", 0.55),
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
                      <Typography variant="caption" color="text.secondary">
                        Density preview
                      </Typography>
                      <Chip
                        size="small"
                        variant="outlined"
                        color="primary"
                        label={draftPreferences.tableDensity}
                      />
                    </Stack>
                    <Stack sx={{ gap: `${densityPreviewGapPx}px` }}>
                      {["Row 1", "Row 2", "Row 3"].map((row) => (
                        <Paper
                          key={row}
                          variant="outlined"
                          sx={{
                            minHeight: `${densityPreviewRowMinHeight}px`,
                            px: 1.2,
                            borderRadius: 1,
                            borderColor: alpha("#0f172a", 0.1),
                            backgroundColor: alpha("#ffffff", 0.72),
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {row}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Paper>
                </Stack>
              </PreferenceField>
              {changedKeys.tableDensity ? (
                <Chip size="small" variant="outlined" color="info" label="Changed" />
              ) : null}
            </Stack>
          </Paper>
        </Box>

        <Paper
          sx={{
            p: { xs: 1.2, sm: 1.4 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: `1px solid ${alpha("#1f6feb", 0.2)}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))",
            backdropFilter: "blur(8px)",
            position: "sticky",
            bottom: 10,
            zIndex: 12,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                color={hasUnsavedChanges ? "warning" : "success"}
                label={hasUnsavedChanges ? `${changedCount} pending` : "Synced"}
              />
              <Chip
                size="small"
                color={draftSecurity.twoFAEnabled ? "success" : "warning"}
                label={draftSecurity.twoFAEnabled ? "Security hardened" : "Security recommended"}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                variant="outlined"
                onClick={handleDiscard}
                disabled={!hasUnsavedChanges}
                aria-label="Discard settings changes"
              >
                Discard
              </Button>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => setResetDialogOpen(true)}
                aria-label="Reset settings to defaults"
              >
                Reset defaults
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                aria-label="Save settings changes"
              >
                Save changes
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>

      <Dialog
        open={twoFADialogOpen}
        onClose={handleCancelTwoFASetup}
        fullWidth
        maxWidth="xs"
        aria-labelledby="two-fa-dialog-title"
      >
        <DialogTitle id="two-fa-dialog-title">Enable 2FA</DialogTitle>
        <DialogContent>
          <Stack spacing={1.4} sx={{ mt: 0.5 }}>
            {twoFAStep === "instructions" ? (
              <Alert severity="info" variant="outlined">
                Step 1: Setup completed (mock). Continue to verification.
              </Alert>
            ) : null}
            {twoFAStep === "verify" ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  Step 2: enter <strong>{MOCK_2FA_CODE}</strong> to verify and enable.
                </Typography>
                <TextField
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  label="Verification code"
                  placeholder="123456"
                  inputProps={{ "aria-label": "Enter 2FA verification code", maxLength: 6 }}
                  error={Boolean(verificationError)}
                  helperText={verificationError ?? " "}
                  autoFocus
                />
              </>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelTwoFASetup}>
            Cancel
          </Button>
          {twoFAStep === "instructions" ? (
            <Button variant="contained" onClick={() => setTwoFAStep("verify")}>
              Continue
            </Button>
          ) : (
            <Button variant="contained" onClick={handleVerifyTwoFA}>
              Verify & Enable
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={disableTwoFADialogOpen}
        onClose={() => setDisableTwoFADialogOpen(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="disable-two-fa-title"
      >
        <DialogTitle id="disable-two-fa-title">Disable 2FA?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            This will remove the extra verification step and backup codes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisableTwoFADialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDisableTwoFA}>
            Disable
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="reset-settings-title"
      >
        <DialogTitle id="reset-settings-title">Reset to defaults?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sidebar mode, density, and security toggles will be reset to default values.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button color="warning" variant="contained" onClick={handleResetToDefaults}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

type SettingRowProps = {
  icon: ReactNode;
  title: string;
  description: string;
  control: ReactNode;
};

function SettingRow({ icon, title, description, control }: SettingRowProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.2,
        borderRadius: 1.4,
        borderColor: alpha("#0f172a", 0.12),
        backgroundColor: alpha("#ffffff", 0.7),
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
        <Stack direction="row" spacing={0.9} alignItems="flex-start" sx={{ minWidth: 0 }}>
          {icon}
          <Stack spacing={0.3}>
            <Typography variant="body2" fontWeight={700}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              {description}
            </Typography>
          </Stack>
        </Stack>
        <Box sx={{ pt: 0.1 }}>{control}</Box>
      </Stack>
    </Paper>
  );
}

type PreferenceFieldProps = {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};

function PreferenceField({ icon, title, description, children }: PreferenceFieldProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.2,
        borderRadius: 1.4,
        borderColor: alpha("#0f172a", 0.12),
        backgroundColor: alpha("#ffffff", 0.7),
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between">
        <Stack direction="row" spacing={0.9} alignItems="flex-start" sx={{ minWidth: 0 }}>
          {icon}
          <Stack spacing={0.3}>
            <Typography variant="body2" fontWeight={700}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              {description}
            </Typography>
          </Stack>
        </Stack>
        <Box>{children}</Box>
      </Stack>
    </Paper>
  );
}
