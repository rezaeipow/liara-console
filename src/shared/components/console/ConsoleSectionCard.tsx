import { Paper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { ConsoleSectionCardProps } from "./types";

export default function ConsoleSectionCard({
  children,
  compact = false,
  soft = false,
  padding = { xs: 2, sm: 2.5 },
}: ConsoleSectionCardProps) {
  return (
    <Paper
      sx={{
        p: padding,
        borderRadius: compact ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          soft
            ? `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`
            : `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.86)}, ${alpha(theme.palette.common.white, 0.74)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      {children}
    </Paper>
  );
}
