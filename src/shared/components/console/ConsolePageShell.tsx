import { Stack } from "@mui/material";
import type { ConsolePageShellProps } from "./types";

export default function ConsolePageShell({
  children,
  spacing = 2.2,
  maxWidth = { xs: "100%", sm: 980, lg: 1080 },
  busy = false,
}: ConsolePageShellProps) {
  return (
    <Stack
      spacing={spacing}
      aria-busy={busy}
      sx={{
        width: "100%",
        maxWidth,
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 1.25, sm: 1.5 },
        px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
      }}
    >
      {children}
    </Stack>
  );
}
