import { Stack } from "@mui/material";
import type { FilterToolbarProps } from "./types";

export default function FilterToolbar({
  start,
  end,
  compact = false,
}: FilterToolbarProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={compact ? 0.8 : 1}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "center" }}
    >
      {start}
      {end}
    </Stack>
  );
}


