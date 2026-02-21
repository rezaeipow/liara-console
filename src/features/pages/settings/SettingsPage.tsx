import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import {
  Box,
  Button,
  Chip,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import type { ReactNode } from "react";

type ThemeMode = "system" | "light" | "dark";
type SidebarMode = "expanded" | "collapsed";
type Density = "comfortable" | "standard" | "compact";

export default function SettingsPage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("expanded");
  const [density, setDensity] = useState<Density>("standard");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [backupCodesEnabled, setBackupCodesEnabled] = useState(false);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);

  return (
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
            label={twoFAEnabled ? "2FA enabled" : "2FA disabled"}
            color={twoFAEnabled ? "success" : "warning"}
            variant="outlined"
          />
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
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
          }}
        >
          <Stack spacing={1.4}>
            <Stack direction="row" spacing={0.9} alignItems="center">
              <SecurityOutlinedIcon fontSize="small" />
              <Typography fontWeight={800}>Security</Typography>
            </Stack>

            <SettingRow
              icon={<LockOutlinedIcon fontSize="small" />}
              title="Two-factor authentication"
              description="Add an extra verification step to protect your account."
              control={
                <Switch
                  checked={twoFAEnabled}
                  onChange={(_, checked) => setTwoFAEnabled(checked)}
                  inputProps={{ "aria-label": "Toggle two-factor authentication" }}
                />
              }
            />

            <SettingRow
              icon={<VerifiedUserOutlinedIcon fontSize="small" />}
              title="Backup recovery codes"
              description="Generate one-time recovery codes for emergency access."
              control={
                <Switch
                  checked={backupCodesEnabled}
                  onChange={(_, checked) => setBackupCodesEnabled(checked)}
                  inputProps={{ "aria-label": "Toggle backup recovery codes" }}
                />
              }
            />

            <SettingRow
              icon={<SecurityOutlinedIcon fontSize="small" />}
              title="Critical email alerts"
              description="Receive security notifications about login and credential changes."
              control={
                <Switch
                  checked={emailAlertsEnabled}
                  onChange={(_, checked) => setEmailAlertsEnabled(checked)}
                  inputProps={{ "aria-label": "Toggle critical email alerts" }}
                />
              }
            />
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
          }}
        >
          <Stack spacing={1.4}>
            <Stack direction="row" spacing={0.9} alignItems="center">
              <TuneOutlinedIcon fontSize="small" />
              <Typography fontWeight={800}>Preferences</Typography>
            </Stack>

            <PreferenceField
              icon={<PaletteOutlinedIcon fontSize="small" />}
              title="Theme"
              description="Choose how the console appears across your devices."
            >
              <FormControl size="small" sx={{ minWidth: 168 }}>
                <Select
                  value={themeMode}
                  onChange={(event) => setThemeMode(event.target.value as ThemeMode)}
                  inputProps={{ "aria-label": "Select theme mode" }}
                >
                  <MenuItem value="system">System default</MenuItem>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
            </PreferenceField>

            <PreferenceField
              icon={<TuneOutlinedIcon fontSize="small" />}
              title="Sidebar mode"
              description="Control navigation density in medium layouts."
            >
              <FormControl size="small" sx={{ minWidth: 168 }}>
                <Select
                  value={sidebarMode}
                  onChange={(event) =>
                    setSidebarMode(event.target.value as SidebarMode)
                  }
                  inputProps={{ "aria-label": "Select sidebar mode" }}
                >
                  <MenuItem value="expanded">Expanded</MenuItem>
                  <MenuItem value="collapsed">Collapsed</MenuItem>
                </Select>
              </FormControl>
            </PreferenceField>

            <PreferenceField
              icon={<TuneOutlinedIcon fontSize="small" />}
              title="Table density"
              description="Adjust row spacing for data-heavy pages."
            >
              <FormControl size="small" sx={{ minWidth: 168 }}>
                <Select
                  value={density}
                  onChange={(event) => setDensity(event.target.value as Density)}
                  inputProps={{ "aria-label": "Select table density" }}
                >
                  <MenuItem value="comfortable">Comfortable</MenuItem>
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="compact">Compact</MenuItem>
                </Select>
              </FormControl>
            </PreferenceField>
          </Stack>
        </Paper>
      </Box>

      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: { xs: 1.5, sm: 2 },
          border: `1px solid ${alpha("#1f6feb", 0.2)}`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.7))",
          backdropFilter: "blur(8px)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            UI preview applied. Save action and persistence can be wired next.
          </Typography>
          <Button variant="contained" aria-label="Save settings changes">
            Save changes
          </Button>
        </Stack>
      </Paper>
    </Stack>
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
