import { Chip, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { FilterChipGroupProps } from "./types";

export default function FilterChipGroup({ options, spacing = 0.8 }: FilterChipGroupProps) {
  return (
    <Stack direction="row" spacing={spacing} flexWrap="wrap" useFlexGap>
      {options.map((option) => (
        <Chip
          key={option.key}
          label={option.label}
          clickable
          color={option.selected ? option.color ?? "default" : "default"}
          variant={option.selected ? "filled" : "outlined"}
          onClick={option.onClick}
          aria-label={option.ariaLabel}
          sx={
            option.selected
              ? option.selectedSx
              : (option.unselectedSx ?? {
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.72),
                  borderColor: (theme) => alpha(theme.palette.text.primary, 0.22),
                })
          }
        />
      ))}
    </Stack>
  );
}
