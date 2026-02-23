import StatusSortFilterBar from "@/shared/components/common/StatusSortFilterBar";
import type { ProjectVmsFilterBarProps } from "../pageTypes";
import { getVmStatusChipSelectedSx } from "../projectVmsUtils";

export default function ProjectVmsFilterBar(props: ProjectVmsFilterBarProps) {
  const { theme, query, statusFilter, sortMode, onSearchChange, onStatusChange, onSortChange } = props;

  return (
    <StatusSortFilterBar
      searchValue={query}
      onSearchChange={onSearchChange}
      searchAriaLabel="Search VMs"
      searchMinWidth={240}
      chips={[
        {
          key: "all",
          label: "All",
          selected: statusFilter === "all",
          color: "primary",
          onClick: () => onStatusChange("all"),
          selectedSx: getVmStatusChipSelectedSx(theme, "all"),
        },
        {
          key: "running",
          label: "Running",
          selected: statusFilter === "running",
          onClick: () => onStatusChange("running"),
          selectedSx: getVmStatusChipSelectedSx(theme, "running"),
        },
        {
          key: "stopped",
          label: "Stopped",
          selected: statusFilter === "stopped",
          onClick: () => onStatusChange("stopped"),
          selectedSx: getVmStatusChipSelectedSx(theme, "stopped"),
        },
      ]}
      statusValue={statusFilter}
      statusOptions={[
        { value: "all", label: "All" },
        { value: "running", label: "Running" },
        { value: "stopped", label: "Stopped" },
      ]}
      onStatusChange={(value) => onStatusChange(value as "all" | "running" | "stopped")}
      sortValue={sortMode}
      sortOptions={[
        { value: "name-asc", label: "Name A-Z" },
        { value: "name-desc", label: "Name Z-A" },
        { value: "cpu-desc", label: "CPU (desc)" },
        { value: "ram-desc", label: "RAM (desc)" },
      ]}
      onSortChange={(value) => onSortChange(value as "name-asc" | "name-desc" | "cpu-desc" | "ram-desc")}
    />
  );
}
