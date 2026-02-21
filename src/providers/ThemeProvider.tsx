import { type ReactNode, useMemo } from "react";
import { CssBaseline, ThemeProvider as MUIThemeProvider, useMediaQuery } from "@mui/material";
import { useAppSelector } from "../app/store/hooks";
import { selectTableDensity, selectThemeMode } from "../app/store/slices/uiSlice";
import { buildTheme } from "./theme";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const preferredMode = useMediaQuery("(prefers-color-scheme: dark)");
  const themeMode = useAppSelector(selectThemeMode);
  const tableDensity = useAppSelector(selectTableDensity);
  const resolvedMode = themeMode === "system" ? (preferredMode ? "dark" : "light") : themeMode;
  const theme = useMemo(() => buildTheme(resolvedMode, tableDensity), [resolvedMode, tableDensity]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
