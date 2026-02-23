import StatusSortFilterBar from "@/shared/components/common/StatusSortFilterBar";
import { alpha } from "@mui/material/styles";
import type { ProjectAppsFilterBarProps } from "@/shared/types/appsComponents";

export default function ProjectAppsFilterBar({
  theme,
  q,
  statusFilter,
  sortMode,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: ProjectAppsFilterBarProps) {
  return (
    <StatusSortFilterBar
      searchValue={q}
      onSearchChange={onSearchChange}
      searchAriaLabel="Search apps"
      chips={[
        { key: "all", label: "All", selected: statusFilter === "all", color: "primary", onClick: () => onStatusChange("all"), selectedSx: { backgroundColor: theme.palette.primary.main, borderColor: theme.palette.primary.dark, color: theme.palette.primary.contrastText, "& .MuiChip-label": { color: theme.palette.primary.contrastText, fontWeight: 700 } }, unselectedSx: { color: theme.palette.primary.main, borderColor: alpha(theme.palette.primary.main, 0.48), backgroundColor: alpha(theme.palette.primary.main, 0.1), "& .MuiChip-label": { color: theme.palette.primary.main, fontWeight: 600 } } },
        { key: "running", label: "Running", selected: statusFilter === "running", onClick: () => onStatusChange("running"), selectedSx: { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, borderColor: theme.palette.primary.dark, "& .MuiChip-label": { color: theme.palette.primary.contrastText, fontWeight: 700 } } },
        { key: "deploying", label: "Deploying", selected: statusFilter === "deploying", onClick: () => onStatusChange("deploying"), selectedSx: { backgroundColor: theme.palette.warning.dark, color: theme.palette.warning.contrastText, borderColor: alpha(theme.palette.warning.dark, 0.95), "& .MuiChip-label": { color: theme.palette.warning.contrastText, fontWeight: 700 } } },
        { key: "failed", label: "Failed", selected: statusFilter === "failed", onClick: () => onStatusChange("failed"), selectedSx: { backgroundColor: theme.palette.error.main, color: theme.palette.error.contrastText, borderColor: alpha(theme.palette.error.dark, 0.95), "& .MuiChip-label": { color: theme.palette.error.contrastText, fontWeight: 700 } } },
      ]}
      statusLabel="Status"
      statusValue={statusFilter}
      statusOptions={[{ value: "all", label: "All" }, { value: "running", label: "Running" }, { value: "deploying", label: "Deploying" }, { value: "failed", label: "Failed" }]}
      onStatusChange={(value) => onStatusChange(value as typeof statusFilter)}
      sortValue={sortMode}
      sortOptions={[{ value: "latest", label: "Latest deployment" }, { value: "status", label: "Status" }, { value: "name-asc", label: "Name A-Z" }, { value: "name-desc", label: "Name Z-A" }]}
      onSortChange={(value) => onSortChange(value as typeof sortMode)}
      searchMinWidth={220}
      statusMinWidth={130}
      sortMinWidth={170}
    />
  );
}
