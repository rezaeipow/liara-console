import { alpha, type Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";

type HeroStyleOptions = {
  startAlpha?: number;
  endAlpha?: number;
  borderAlpha?: number;
  disableBackdrop?: boolean;
};

export function createPrimaryHeroGradient(theme: Theme, options?: HeroStyleOptions): string {
  const startAlpha = options?.startAlpha ?? 0.14;
  const endAlpha = options?.endAlpha ?? 0.1;
  return `linear-gradient(120deg, ${alpha(theme.palette.primary.main, startAlpha)}, ${alpha(theme.palette.secondary.main, endAlpha)})`;
}

export function createPrimaryHeroSx(theme: Theme, options?: HeroStyleOptions): SxProps<Theme> {
  const borderAlpha = options?.borderAlpha ?? 0.22;
  return {
    border: `1px solid ${alpha(theme.palette.primary.main, borderAlpha)}`,
    ...(options?.disableBackdrop ? { backdropFilter: "none" } : {}),
  };
}

