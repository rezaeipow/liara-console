import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { Button, Divider, Paper, Stack, Switch, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { ProfileSecurityCardProps } from "../types";

export default function ProfileSecurityCard(props: ProfileSecurityCardProps) {
  const { twoFAEnabled, onToggle2FA, onLogoutSessions } = props;

  return (
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
            <Typography variant="body2" fontWeight={700}>Two-factor authentication</Typography>
            <Typography variant="caption" color="text.secondary">Add an extra verification step for sign-in.</Typography>
          </Stack>
          <Switch checked={twoFAEnabled} onChange={(event) => onToggle2FA(event.target.checked)} />
        </Stack>
        <Divider />
        <Button variant="outlined" color="warning" onClick={onLogoutSessions}>
          Logout from other sessions
        </Button>
      </Stack>
    </Paper>
  );
}
