import { type ReactNode, useMemo } from "react";
import { CssBaseline, ThemeProvider as MUIThemeProvider } from "@mui/material";
import { useAppSelector } from "../app/store/hooks";
import { selectTableDensity } from "../app/store/slices/uiSlice";
import { buildTheme } from "./theme";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const tableDensity = useAppSelector(selectTableDensity);
  const theme = useMemo(() => buildTheme(tableDensity), [tableDensity]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
