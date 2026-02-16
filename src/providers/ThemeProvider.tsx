import { type ReactNode } from "react";
import { CssBaseline, ThemeProvider as MUIThemeProvider } from "@mui/material";
import { Theme } from "./theme";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  return (
    <MUIThemeProvider theme={Theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
