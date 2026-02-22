import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import {
  Alert,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  LinearProgress,
  OutlinedInput,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { glassBackdrop } from "../../../shared/ui/glassTokens";
import {
  disable2FA,
  enable2FA,
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
  updateProfile,
} from "../../../app/store/slices/authSlice";
import { selectActiveAccount } from "../../../app/store/slices/accountSlice";
import { showToast } from "../../../app/store/slices/uiSlice";

const PHONE_STORAGE_KEY = "console-profile-phone";
const LAST_LOGIN_STORAGE_KEY = "console-profile-last-login";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

function readStorage(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage failures
  }
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const authLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const activeAccount = useAppSelector(selectActiveAccount);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarDraft, setAvatarDraft] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [removeAvatarOpen, setRemoveAvatarOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [lastLoginAt, setLastLoginAt] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setAvatarDraft(user.avatar ?? "");
  }, [user]);

  useEffect(() => {
    const storedPhone = readStorage(PHONE_STORAGE_KEY);
    setPhone(storedPhone);

    const storedLogin = readStorage(LAST_LOGIN_STORAGE_KEY);
    if (storedLogin) {
      setLastLoginAt(storedLogin);
      return;
    }
    const now = new Date().toISOString();
    setLastLoginAt(now);
    writeStorage(LAST_LOGIN_STORAGE_KEY, now);
  }, []);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedAvatarDraft = avatarDraft.trim();
  const trimmedPhone = phone.trim();

  const nameError =
    trimmedName.length === 0
      ? "Name is required."
      : trimmedName.length < 2
        ? "Name must be at least 2 characters."
        : "";
  const emailError =
    trimmedEmail.length === 0
      ? "Email is required."
      : !EMAIL_REGEX.test(trimmedEmail)
        ? "Enter a valid email address."
        : "";
  const phoneError =
    trimmedPhone.length > 0 && !/^[0-9+\-()\s]{8,20}$/.test(trimmedPhone)
      ? "Phone must contain valid digits and symbols."
      : "";

  const hasValidationError = Boolean(nameError || emailError || avatarError || phoneError);
  const hasChanges = Boolean(
    user &&
      (trimmedName !== (user.name ?? "") ||
        trimmedEmail !== (user.email ?? "") ||
        trimmedAvatarDraft !== (user.avatar ?? "") ||
        trimmedPhone !== readStorage(PHONE_STORAGE_KEY)),
  );

  const securityTone = user?.twoFAEnabled ? "success" : "warning";
  const securityLabel = user?.twoFAEnabled ? "2FA Enabled" : "2FA Disabled";

  const saveDisabled = !user || !hasChanges || hasValidationError;

  const identityRows = useMemo(
    () => [
      { label: "User ID", value: user?.id ?? "-" },
      { label: "Last Login", value: formatDateTime(lastLoginAt) },
      { label: "Active Account", value: activeAccount?.name ?? "No active account" },
    ],
    [activeAccount?.name, lastLoginAt, user?.id],
  );

  const handleSaveChanges = () => {
    if (!user || saveDisabled) return;

    dispatch(
      updateProfile({
        name: trimmedName,
        email: trimmedEmail,
        avatar: trimmedAvatarDraft || undefined,
      }),
    );
    writeStorage(PHONE_STORAGE_KEY, trimmedPhone);
    dispatch(showToast({ message: "Profile updated successfully.", severity: "success" }));
  };

  const handleToggle2FA = (checked: boolean) => {
    if (!user) return;
    if (checked) {
      dispatch(enable2FA());
      dispatch(showToast({ message: "2FA has been enabled.", severity: "success" }));
      return;
    }
    dispatch(disable2FA());
    dispatch(showToast({ message: "2FA has been disabled.", severity: "warning" }));
  };

  const handleLogoutSessions = () => {
    dispatch(
      showToast({
        message: "Logged out from other sessions (mock).",
        severity: "info",
      }),
    );
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Only image files are allowed.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        setAvatarError("Could not read selected image.");
        return;
      }
      setAvatarDraft(result);
      setAvatarError("");
    };
    reader.onerror = () => {
      setAvatarError("Could not read selected image.");
    };
    reader.readAsDataURL(file);
  };

  if (authLoading) {
    return (
      <Stack
        spacing={1.2}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 920, lg: 1040 },
          mx: { xs: 0, sm: "auto" },
          mt: { xs: 1.25, sm: 1.5 },
          px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
        }}
      >
        <Paper sx={{ p: { xs: 1.8, sm: 2.2 } }}>
          <LinearProgress sx={{ mb: 1.2 }} />
          <Stack spacing={0.8}>
            <Skeleton variant="rounded" height={30} width={220} />
            <Skeleton variant="rounded" height={18} width={300} />
            <Skeleton variant="rounded" height={18} width={280} />
          </Stack>
        </Paper>
      </Stack>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Stack
        spacing={1.2}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 920, lg: 1040 },
          mx: { xs: 0, sm: "auto" },
          mt: { xs: 1.25, sm: 1.5 },
          px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
        }}
      >
        <Alert severity="warning" variant="outlined">
          Session not available. Please login again.
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 920, lg: 1040 },
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 1.25, sm: 1.5 },
        px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 2.4 },
          borderRadius: { xs: 1.5, sm: 2 },
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.32)}`,
          background: (theme) =>
            `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.14)})`,
          backdropFilter: glassBackdrop.hero,
        }}
      >
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <AccountCircleOutlinedIcon fontSize="small" />
            <Typography variant="h5" fontWeight={800}>
              Profile
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Manage your personal information, security preferences, and account context.
          </Typography>
          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
            <Chip size="small" variant="outlined" color={securityTone} label={securityLabel} />
            <Chip
              size="small"
              variant="outlined"
              color="primary"
              label={`Account: ${activeAccount?.name ?? "N/A"}`}
            />
          </Stack>
        </Stack>
      </Paper>

      {authError ? <Alert severity="error">{authError}</Alert> : null}

      <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5} alignItems="stretch">
        <Paper
          sx={{
            flex: 1.3,
            p: { xs: 1.8, sm: 2.2 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
            background: (theme) =>
              `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
            backdropFilter: glassBackdrop.card,
          }}
        >
          <Stack spacing={1}>
            <Typography fontWeight={800}>Personal Info</Typography>

            <Typography variant="caption" color="text.secondary">
              Profile photo
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{
                p: 1,
                borderRadius: 1.2,
                border: (theme) => `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.5),
              }}
            >
              <Avatar
                src={trimmedAvatarDraft || undefined}
                sx={{
                  width: 52,
                  height: 52,
                  border: (theme) => `1px solid ${alpha(theme.palette.text.primary, 0.14)}`,
                }}
              >
                {(trimmedName[0] ?? "U").toUpperCase()}
              </Avatar>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={0.7}>
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
                  aria-label="Upload avatar image"
                >
                  {trimmedAvatarDraft ? "Upload new image" : "Upload image"}
                  <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
                </Button>
                <Button
                  variant="text"
                  size="small"
                  color="inherit"
                  onClick={() => setRemoveAvatarOpen(true)}
                  disabled={!trimmedAvatarDraft}
                  aria-label="Remove avatar image"
                >
                  Remove
                </Button>
              </Stack>
            </Stack>
            {avatarError ? (
              <Typography variant="caption" color="error">
                {avatarError}
              </Typography>
            ) : null}

            <Typography variant="caption" color="text.secondary">
              Full name
            </Typography>
            <OutlinedInput
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              aria-label="Profile full name"
              error={Boolean(nameError)}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <AccountCircleOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              }
            />
            {nameError ? (
              <Typography variant="caption" color="error">
                {nameError}
              </Typography>
            ) : null}

            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3 }}>
              Email address
            </Typography>
            <OutlinedInput
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-label="Profile email address"
              error={Boolean(emailError)}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <EmailOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              }
            />
            {emailError ? (
              <Typography variant="caption" color="error">
                {emailError}
              </Typography>
            ) : null}

            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3 }}>
              Phone (optional)
            </Typography>
            <OutlinedInput
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+98..."
              aria-label="Profile phone number"
              error={Boolean(phoneError)}
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <PhoneIphoneOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              }
            />
            {phoneError ? (
              <Typography variant="caption" color="error">
                {phoneError}
              </Typography>
            ) : null}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} sx={{ pt: 0.4 }}>
              <Button
                variant="contained"
                disabled={saveDisabled}
                onClick={handleSaveChanges}
                aria-label="Save profile changes"
              >
                Save changes
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Stack sx={{ flex: 1 }} spacing={1.5}>
          <Paper
            sx={{
              p: { xs: 1.6, sm: 2 },
              borderRadius: { xs: 1.4, sm: 1.8 },
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
              background: (theme) =>
                `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.86)}, ${alpha(theme.palette.common.white, 0.74)})`,
              backdropFilter: glassBackdrop.card,
            }}
          >
            <Stack spacing={0.9}>
              <Stack direction="row" spacing={0.7} alignItems="center">
                <SecurityOutlinedIcon fontSize="small" />
                <Typography fontWeight={800}>Security</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack spacing={0.15}>
                  <Typography variant="body2" fontWeight={700}>
                    Two-factor authentication
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Add an extra verification step for sign-in.
                  </Typography>
                </Stack>
                <Switch
                  checked={Boolean(user.twoFAEnabled)}
                  onChange={(event) => handleToggle2FA(event.target.checked)}
                  inputProps={{ "aria-label": "Toggle two-factor authentication" }}
                />
              </Stack>
              <Divider />
              <Button
                variant="outlined"
                color="warning"
                onClick={handleLogoutSessions}
                aria-label="Logout from all sessions"
              >
                Logout from other sessions
              </Button>
            </Stack>
          </Paper>

          <Paper
            sx={{
              p: { xs: 1.6, sm: 2 },
              borderRadius: { xs: 1.4, sm: 1.8 },
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
              background: (theme) =>
                `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.86)}, ${alpha(theme.palette.common.white, 0.74)})`,
              backdropFilter: glassBackdrop.card,
            }}
          >
            <Stack spacing={0.9}>
              <Stack direction="row" spacing={0.7} alignItems="center">
                <ManageAccountsOutlinedIcon fontSize="small" />
                <Typography fontWeight={800}>Identity & Context</Typography>
              </Stack>
              {identityRows.map((item) => (
                <Stack key={item.label} direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="caption" fontWeight={700}>
                    {item.value}
                  </Typography>
                </Stack>
              ))}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} sx={{ pt: 0.2 }}>
                <Button
                  component={Link}
                  to="/console/accounts"
                  variant="outlined"
                  size="small"
                  aria-label="Open accounts page"
                >
                  Manage accounts
                </Button>
                <Button
                  component={Link}
                  to="/console/settings"
                  variant="text"
                  size="small"
                  startIcon={<ShieldOutlinedIcon fontSize="small" />}
                  aria-label="Open settings page"
                >
                  Open settings
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
      <Dialog
        open={removeAvatarOpen}
        onClose={() => setRemoveAvatarOpen(false)}
        aria-labelledby="remove-avatar-title"
      >
        <DialogTitle id="remove-avatar-title">Remove profile image?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Your avatar will be cleared and replaced with the default profile placeholder.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveAvatarOpen(false)} variant="text">
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setAvatarDraft("");
              setAvatarError("");
              setRemoveAvatarOpen(false);
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

