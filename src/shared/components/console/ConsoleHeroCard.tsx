import { Box, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { ConsoleHeroCardProps } from "./types";

export default function ConsoleHeroCard({
  title,
  description,
  icon,
  actions,
  children,
  loading = false,
  compact = false,
  gradient,
  sx,
}: ConsoleHeroCardProps) {
  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: compact ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.32)}`,
        background: (theme) =>
          gradient ??
          `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.14)})`,
        backdropFilter: glassBackdrop.hero,
        ...sx,
      }}
    >
      {loading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
      <Stack spacing={children ? 1.1 : 0}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={1.5}
        >
          <Stack spacing={0.6}>
            <Stack direction="row" spacing={1} alignItems="center">
              {icon ? <Box sx={{ display: "inline-flex" }}>{icon}</Box> : null}
              <Typography variant="h5" fontWeight={800}>
                {title}
              </Typography>
            </Stack>
            {description ? (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            ) : null}
          </Stack>
          {actions ? (
            <Box sx={{ width: { xs: "100%", md: "auto" } }}>
              {actions}
            </Box>
          ) : null}
        </Stack>
        {children ? <Box>{children}</Box> : null}
      </Stack>
    </Paper>
  );
}
