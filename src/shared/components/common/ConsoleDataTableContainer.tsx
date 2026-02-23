import { Paper, TableContainer } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ConsoleDataTableContainerProps } from "./types";

export default function ConsoleDataTableContainer({ children, sx }: ConsoleDataTableContainerProps) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={[
        {
          borderRadius: 1.6,
          borderColor: (theme) => alpha(theme.palette.text.primary, 0.12),
          backgroundColor: (theme) => alpha(theme.palette.common.white, 0.66),
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </TableContainer>
  );
}
