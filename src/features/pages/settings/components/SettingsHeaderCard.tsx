import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { SettingsHeaderCardProps } from "@/shared/types/settingsComponents";
import { glassBackdrop } from "@/shared/ui/glassTokens";

export default function SettingsHeaderCard({ twoFAEnabled }: SettingsHeaderCardProps) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: { xs: 1.5, sm: 2 }, border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.32)}`, background: (theme) => `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.14)})`, backdropFilter: glassBackdrop.hero }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between">
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <SettingsOutlinedIcon fontSize="small" />
            <Typography variant="h5" fontWeight={800}>Settings</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">Manage security and personalize your console experience.</Typography>
        </Stack>
        <Chip icon={<VerifiedUserOutlinedIcon fontSize="small" />} label={twoFAEnabled ? "2FA enabled" : "2FA disabled"} color={twoFAEnabled ? "success" : "warning"} variant="outlined" />
      </Stack>
    </Paper>
  );
}
