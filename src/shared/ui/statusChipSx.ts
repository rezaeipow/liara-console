import { alpha, type Theme } from "@mui/material/styles";

export type StatusChipTone = "success" | "warning" | "error" | "neutral";
export type StatusChipVariant = "solid" | "soft";

export function getStatusChipSx(
  theme: Theme,
  tone: StatusChipTone,
  variant: StatusChipVariant = "solid",
) {
  if (variant === "solid") {
    if (tone === "success") {
      return {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderColor: theme.palette.primary.dark,
        "& .MuiChip-label": { color: theme.palette.primary.contrastText, fontWeight: 700 },
      };
    }
    if (tone === "warning") {
      return {
        backgroundColor: theme.palette.warning.dark,
        color: theme.palette.warning.contrastText,
        borderColor: alpha(theme.palette.warning.dark, 0.95),
        "& .MuiChip-label": { color: theme.palette.warning.contrastText, fontWeight: 700 },
      };
    }
    if (tone === "error") {
      return {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        borderColor: alpha(theme.palette.error.dark, 0.95),
        "& .MuiChip-label": { color: theme.palette.error.contrastText, fontWeight: 700 },
      };
    }
    return {
      backgroundColor: alpha(theme.palette.text.secondary, 0.9),
      color: theme.palette.common.white,
      borderColor: alpha(theme.palette.text.secondary, 0.98),
      "& .MuiChip-label": { color: theme.palette.common.white, fontWeight: 700 },
    };
  }

  if (tone === "success") {
    return {
      backgroundColor: alpha(theme.palette.primary.main, 0.18),
      color: theme.palette.primary.dark,
      borderColor: alpha(theme.palette.primary.main, 0.4),
      "& .MuiChip-label": { color: theme.palette.primary.dark, fontWeight: 700 },
    };
  }
  if (tone === "warning") {
    return {
      backgroundColor: alpha(theme.palette.warning.main, 0.22),
      color: theme.palette.warning.dark,
      borderColor: alpha(theme.palette.warning.dark, 0.35),
      "& .MuiChip-label": { color: theme.palette.warning.dark, fontWeight: 700 },
    };
  }
  if (tone === "error") {
    return {
      backgroundColor: alpha(theme.palette.error.main, 0.18),
      color: theme.palette.error.dark,
      borderColor: alpha(theme.palette.error.main, 0.35),
      "& .MuiChip-label": { color: theme.palette.error.dark, fontWeight: 700 },
    };
  }
  return {
    backgroundColor: alpha(theme.palette.text.secondary, 0.14),
    color: theme.palette.text.secondary,
    borderColor: alpha(theme.palette.text.secondary, 0.32),
    "& .MuiChip-label": { color: theme.palette.text.secondary, fontWeight: 700 },
  };
}
