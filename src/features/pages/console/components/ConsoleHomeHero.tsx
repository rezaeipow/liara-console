import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { ConsoleHomeHeroProps } from "../types";

export default function ConsoleHomeHero(props: ConsoleHomeHeroProps) {
  const { activeAccountName, hasActiveAccount, unreadNotifications, tableDensity, isCompact } = props;

  return (
    <Paper
      sx={{
        p: isCompact ? { xs: 1.2, sm: 1.4 } : { xs: 2.1, sm: 2.6 },
        borderRadius: isCompact ? { xs: 0.9, sm: 1.1 } : { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.34)}`,
        background: (theme) =>
          `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.24)}, ${alpha(theme.palette.secondary.main, 0.16)})`,
        backdropFilter: glassBackdrop.hero,
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} justifyContent="space-between" spacing={isCompact ? 1 : 1.8}>
        <Stack spacing={isCompact ? 0.45 : 0.7}>
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <BoltOutlinedIcon fontSize="small" />
            <Typography variant={isCompact ? "h6" : "h5"} fontWeight={800}>Console Overview</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {hasActiveAccount ? `Active account: ${activeAccountName}` : "No active account selected. Please switch or create an account."}
          </Typography>
          <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
            <Chip size="small" color="primary" variant="outlined" label={`Density: ${tableDensity}`} />
            <Chip size="small" color={unreadNotifications > 0 ? "warning" : "success"} variant="outlined" label={`${unreadNotifications} unread notifications`} />
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} sx={{ width: { xs: "100%", md: "auto" } }}>
          <Button component={Link} to="/console/projects/new" variant="contained" startIcon={<RocketLaunchOutlinedIcon />} aria-label="Create a new project">
            New project
          </Button>
          <Button component={Link} to="/console/notifications" variant="outlined" endIcon={<ArrowOutwardIcon />} aria-label="Open notifications center">
            Notifications
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
