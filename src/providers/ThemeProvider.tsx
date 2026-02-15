import { type ReactNode, useMemo } from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { themes } from "./theme";
import { type RootState } from "../app/store";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme);

  const theme = useMemo(
    () => (themeMode === "light" ? themes.light : themes.dark),
    [themeMode],
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline /> {/* ریست و normalize MUI */}
      {children}
    </MUIThemeProvider>
  );
};
