import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { ProfileHeroProps } from "../types";

export default function ProfileHero(props: ProfileHeroProps) {
  const { securityTone, securityLabel, activeAccountName } = props;

  return (
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
          <Chip size="small" variant="outlined" color="primary" label={`Account: ${activeAccountName}`} />
        </Stack>
      </Stack>
    </Paper>
  );
}
