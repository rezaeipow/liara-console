import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { ViewMode } from "@/shared/types/view";
import type { ViewModeToggleProps } from "./types";

export default function ViewModeToggle({
  value,
  onChange,
  cardsLabel = "Cards",
  tableLabel = "Table",
  size = "small",
}: ViewModeToggleProps) {
  return (
    <ToggleButtonGroup
      size={size}
      value={value}
      exclusive
      onChange={(_, next: ViewMode | null) => {
        if (next) onChange(next);
      }}
    >
      <ToggleButton value="cards">{cardsLabel}</ToggleButton>
      <ToggleButton value="table">{tableLabel}</ToggleButton>
    </ToggleButtonGroup>
  );
}

