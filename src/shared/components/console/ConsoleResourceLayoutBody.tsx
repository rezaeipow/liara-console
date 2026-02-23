import { Divider, Paper, Stack } from "@mui/material";
import type { ConsoleResourceLayoutBodyProps } from "./types";

export default function ConsoleResourceLayoutBody({ chips, children }: ConsoleResourceLayoutBodyProps) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: { xs: 1.5, sm: 2 } }}>
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 1.25 }}>
        {chips}
      </Stack>
      <Divider sx={{ mb: 1.5, opacity: 0.55 }} />
      {children}
    </Paper>
  );
}
