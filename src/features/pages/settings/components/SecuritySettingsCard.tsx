import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { Chip, IconButton, Paper, Stack, Switch, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { SecuritySettingsCardProps } from "@/shared/types/settingsComponents";
import SettingRow from "./SettingRow";

export default function SecuritySettingsCard(props: SecuritySettingsCardProps) {
  const { draftSecurity, changedKeys, recoveryCodes, onTwoFAChange, onBackupChange, onAlertsChange } = props;
  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: { xs: 1.5, sm: 2 }, border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`, background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`, backdropFilter: glassBackdrop.card, transition: "transform .2s ease", "&:hover": { transform: "translateY(-1px)" } }}>
      <Stack spacing={1.4}>
        <Stack direction="row" spacing={0.9} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={0.9} alignItems="center"><SecurityOutlinedIcon fontSize="small" /><Typography fontWeight={800}>Security</Typography></Stack>
          <Tooltip title="Manage 2FA, backup codes, and alerting preferences."><IconButton size="small" aria-label="Security help"><InfoOutlinedIcon fontSize="small" /></IconButton></Tooltip>
        </Stack>
        <SettingRow icon={<LockOutlinedIcon fontSize="small" />} title="Two-factor authentication" description="Add an extra verification step to protect your account." control={<Switch checked={draftSecurity.twoFAEnabled} onChange={(_, checked) => onTwoFAChange(checked)} inputProps={{ "aria-label": "Toggle two-factor authentication" }} />} />
        {changedKeys.twoFA ? <Chip size="small" variant="outlined" color="info" label="Changed" /> : null}
        <SettingRow icon={<VerifiedUserOutlinedIcon fontSize="small" />} title="Backup recovery codes" description="Generate one-time recovery codes for emergency access." control={<Switch checked={draftSecurity.backupCodesEnabled} onChange={(_, checked) => onBackupChange(checked)} disabled={!draftSecurity.twoFAEnabled} inputProps={{ "aria-label": "Toggle backup recovery codes" }} />} />
        {changedKeys.backup ? <Chip size="small" variant="outlined" color="info" label="Changed" /> : null}
        <SettingRow icon={<SecurityOutlinedIcon fontSize="small" />} title="Critical email alerts" description="Receive security notifications about login and credential changes." control={<Switch checked={draftSecurity.emailAlertsEnabled} onChange={(_, checked) => onAlertsChange(checked)} inputProps={{ "aria-label": "Toggle critical email alerts" }} />} />
        {changedKeys.alerts ? <Chip size="small" variant="outlined" color="info" label="Changed" /> : null}
        {recoveryCodes.length > 0 ? (
          <Paper variant="outlined" sx={{ p: 1.1, borderRadius: 1.2, borderColor: (theme) => alpha(theme.palette.success.main, 0.3), backgroundColor: (theme) => alpha(theme.palette.success.light, 0.35) }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.6 }}>Recovery codes (mock)</Typography>
            <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>{recoveryCodes.map((code) => <Chip key={code} size="small" label={code} variant="outlined" />)}</Stack>
          </Paper>
        ) : null}
      </Stack>
    </Paper>
  );
}
