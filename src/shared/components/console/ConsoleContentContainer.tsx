import { Stack } from "@mui/material";
import type { ConsoleContentContainerProps } from "./types";

export default function ConsoleContentContainer({
  children,
  maxWidth = { xs: "100%", sm: 980, lg: 1080 },
  sx,
  ...stackProps
}: ConsoleContentContainerProps) {
  return (
    <Stack
      sx={{
        width: "100%",
        maxWidth,
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 1.25, sm: 1.5 },
        px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
        ...sx,
      }}
      {...stackProps}
    >
      {children}
    </Stack>
  );
}
