import { Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getStatusChipSx } from "@/shared/ui/statusChipSx";
import type { ConsoleStatusChipProps } from "./types";

export default function ConsoleStatusChip({
  label,
  tone,
  variant = "solid",
  size = "small",
  capitalize = true,
  sx,
}: ConsoleStatusChipProps) {
  const theme = useTheme();

  return (
    <Chip
      size={size}
      label={label}
      color="default"
      sx={{
        ...(capitalize ? { textTransform: "capitalize" } : null),
        ...getStatusChipSx(theme, tone, variant),
        ...sx,
      }}
    />
  );
}
