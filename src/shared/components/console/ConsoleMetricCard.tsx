import { Paper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ConsoleMetricCardProps } from "./types";

export default function ConsoleMetricCard({ children, padding = 1.75 }: ConsoleMetricCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: padding, borderColor: (theme) => alpha(theme.palette.primary.main, 0.2) }}>
      {children}
    </Paper>
  );
}
