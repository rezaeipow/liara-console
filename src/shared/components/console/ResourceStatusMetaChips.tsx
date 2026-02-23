import { Stack } from "@mui/material";
import ConsoleStatusChip from "@/shared/components/console/ConsoleStatusChip";
import type { ResourceStatusMetaChipsProps } from "./types";

export default function ResourceStatusMetaChips({
  statusLabel,
  statusTone,
  children,
}: ResourceStatusMetaChipsProps) {
  return (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
      <ConsoleStatusChip label={statusLabel} tone={statusTone} />
      {children}
    </Stack>
  );
}
