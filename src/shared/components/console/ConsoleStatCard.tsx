import { Paper, Stack, Typography } from "@mui/material";
import { alpha, type Palette } from "@mui/material/styles";
import type { ConsoleStatCardProps, StatTone } from "./types";

function getToneColor(tone: StatTone, palette: Palette) {
  if (tone === "warning") return palette.warning.main;
  if (tone === "info") return palette.info.main;
  if (tone === "success") return palette.success.main;
  if (tone === "primary") return palette.primary.main;
  return palette.text.secondary;
}

export default function ConsoleStatCard({
  label,
  value,
  hint,
  icon,
  action,
  tone = "default",
  density = "standard",
}: ConsoleStatCardProps) {
  const px = density === "comfortable" ? 2.1 : density === "compact" ? 0.4 : 1.3;
  const py = density === "comfortable" ? 2 : density === "compact" ? 0.4 : 1.2;
  const radius = density === "compact" ? 0.7 : 1.4;

  return (
    <Paper
      variant="outlined"
      role="status"
      aria-live="polite"
      aria-label={`${label}: ${value}`}
      sx={{
        px,
        py,
        borderRadius: radius,
        borderColor: (theme) => alpha(getToneColor(tone, theme.palette), 0.24),
        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.82),
      }}
    >
      <Stack spacing={density === "compact" ? 0.35 : 0.8}>
        <Stack direction="row" spacing={0.7} alignItems="center">
          {icon}
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Stack>
        <Typography variant="h6" fontWeight={800}>
          {value}
        </Typography>
        {hint ? (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        ) : null}
        {action}
      </Stack>
    </Paper>
  );
}
