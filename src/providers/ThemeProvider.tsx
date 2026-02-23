import { useMemo } from "react";
import { CssBaseline, ThemeProvider as MUIThemeProvider } from "@mui/material";
import { useAppSelector } from "@/app/store/hooks";
import { selectTableDensity } from "@/app/store/slices/uiSlice";
import { buildTheme } from "./theme";
import type { ThemeProviderProps } from "./types";

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const tableDensity = useAppSelector(selectTableDensity);
  const theme = useMemo(() => buildTheme(tableDensity), [tableDensity]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
