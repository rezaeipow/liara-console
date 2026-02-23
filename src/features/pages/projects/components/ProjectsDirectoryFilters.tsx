import StatusSortFilterBar from "@/shared/components/common/StatusSortFilterBar";
import { getStatusChipSx } from "@/shared/ui/statusChipSx";
import type { ProjectsDirectoryFiltersProps } from "../types";

function getHealthTone(status: "all" | "healthy" | "provisioning") {
  return status === "provisioning" ? "warning" : "success";
}

export default function ProjectsDirectoryFilters(props: ProjectsDirectoryFiltersProps) {
  const { theme, healthFilter, sortMode, onChangeHealth, onChangeSort } = props;

  return (
    <StatusSortFilterBar
      chips={[
        {
          key: "all",
          label: "All",
          selected: healthFilter === "all",
          color: "primary",
          onClick: () => onChangeHealth("all"),
          selectedSx: getStatusChipSx(theme, getHealthTone("all"), "solid"),
        },
        {
          key: "healthy",
          label: "Healthy",
          selected: healthFilter === "healthy",
          onClick: () => onChangeHealth("healthy"),
          selectedSx: getStatusChipSx(theme, getHealthTone("healthy"), "solid"),
        },
        {
          key: "provisioning",
          label: "Provisioning",
          selected: healthFilter === "provisioning",
          onClick: () => onChangeHealth("provisioning"),
          selectedSx: getStatusChipSx(theme, getHealthTone("provisioning"), "solid"),
        },
      ]}
      statusLabel="Health"
      statusValue={healthFilter}
      statusOptions={[
        { value: "all", label: "All" },
        { value: "healthy", label: "Healthy" },
        { value: "provisioning", label: "Provisioning" },
      ]}
      onStatusChange={(value) => onChangeHealth(value as "all" | "healthy" | "provisioning")}
      sortValue={sortMode}
      sortOptions={[
        { value: "created-desc", label: "Newest first" },
        { value: "created-asc", label: "Oldest first" },
        { value: "name-asc", label: "Name A-Z" },
        { value: "name-desc", label: "Name Z-A" },
      ]}
      onSortChange={(value) => onChangeSort(value as "created-desc" | "created-asc" | "name-asc" | "name-desc")}
      statusMinWidth={160}
      sortMinWidth={180}
    />
  );
}
