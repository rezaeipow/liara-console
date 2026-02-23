import { MenuItem, Stack, TextField } from "@mui/material";
import FilterChipGroup from "@/shared/components/common/FilterChipGroup";
import FilterToolbar from "@/shared/components/common/FilterToolbar";
import type { StatusSortFilterBarProps } from "./types";

export default function StatusSortFilterBar({
  chips,
  searchLabel = "Search",
  searchValue,
  searchPlaceholder,
  onSearchChange,
  searchMinWidth = 220,
  searchAriaLabel,
  showStatusSelect = true,
  statusLabel = "Status",
  statusValue,
  statusOptions = [],
  onStatusChange,
  statusMinWidth = 150,
  showSortSelect = true,
  sortLabel = "Sort",
  sortValue,
  sortOptions = [],
  onSortChange,
  sortMinWidth = 170,
  statusAriaLabel,
  sortAriaLabel,
}: StatusSortFilterBarProps) {
  return (
    <FilterToolbar
      start={
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ flex: 1 }}>
          {typeof searchValue === "string" && onSearchChange ? (
            <TextField
              size="small"
              label={searchLabel}
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={(event) => onSearchChange(event.target.value)}
              sx={{ minWidth: { xs: "100%", sm: searchMinWidth } }}
              slotProps={searchAriaLabel ? { htmlInput: { "aria-label": searchAriaLabel } } : undefined}
            />
          ) : null}
          <FilterChipGroup spacing={0.75} options={chips} />
        </Stack>
      }
      end={
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          {showStatusSelect && statusValue && onStatusChange ? (
            <TextField
              select
              size="small"
              label={statusLabel}
              value={statusValue}
              onChange={(event) => onStatusChange(event.target.value)}
              sx={{ minWidth: { xs: "100%", sm: statusMinWidth } }}
              slotProps={statusAriaLabel ? { htmlInput: { "aria-label": statusAriaLabel } } : undefined}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : null}
          {showSortSelect && sortValue && onSortChange ? (
            <TextField
              select
              size="small"
              label={sortLabel}
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value)}
              sx={{ minWidth: { xs: "100%", sm: sortMinWidth } }}
              slotProps={sortAriaLabel ? { htmlInput: { "aria-label": sortAriaLabel } } : undefined}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : null}
        </Stack>
      }
    />
  );
}
