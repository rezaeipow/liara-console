import { Paper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ConsoleToneSectionProps, Tone } from "./types";

const toneMap: Record<Tone, { borderAlpha: number; lightAlpha: number; mainAlpha: number }> = {
  primary: { borderAlpha: 0.16, lightAlpha: 0.16, mainAlpha: 0.08 },
  secondary: { borderAlpha: 0.2, lightAlpha: 0.26, mainAlpha: 0.2 },
  error: { borderAlpha: 0.24, lightAlpha: 0.3, mainAlpha: 0.2 },
};

export default function ConsoleToneSection({
  children,
  tone = "primary",
  padding = { xs: 1.5, sm: 1.8 },
}: ConsoleToneSectionProps) {
  return (
    <Paper
      sx={{
        p: padding,
        borderRadius: 1.75,
        border: (theme) => `1px solid ${alpha(theme.palette[tone].main, toneMap[tone].borderAlpha)}`,
        background: (theme) =>
          `linear-gradient(170deg, ${alpha(theme.palette[tone].light, toneMap[tone].lightAlpha)}, ${alpha(theme.palette[tone].main, toneMap[tone].mainAlpha)})`,
      }}
    >
      {children}
    </Paper>
  );
}
