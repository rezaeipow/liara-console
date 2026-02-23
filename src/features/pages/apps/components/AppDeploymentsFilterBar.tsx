import StatusSortFilterBar from "@/shared/components/common/StatusSortFilterBar";
import { getStatusChipSx } from "@/shared/ui/statusChipSx";
import { getDeploymentFilterTone } from "@/shared/ui/statusTones";
import type { AppDeploymentsFilterBarProps } from "@/shared/types/appsComponents";

export default function AppDeploymentsFilterBar({ theme, statusFilter, sortOrder, onStatusChange, onSortChange }: AppDeploymentsFilterBarProps) {
  return (
    <StatusSortFilterBar
      chips={[
        { key: "all", label: "All", selected: statusFilter === "all", onClick: () => onStatusChange("all"), selectedSx: getStatusChipSx(theme, getDeploymentFilterTone("all"), "solid") },
        { key: "success", label: "Success", selected: statusFilter === "success", onClick: () => onStatusChange("success"), selectedSx: getStatusChipSx(theme, getDeploymentFilterTone("success"), "solid") },
        { key: "running", label: "Running", selected: statusFilter === "running", onClick: () => onStatusChange("running"), selectedSx: getStatusChipSx(theme, getDeploymentFilterTone("running"), "solid") },
        { key: "failed", label: "Failed", selected: statusFilter === "failed", onClick: () => onStatusChange("failed"), selectedSx: getStatusChipSx(theme, getDeploymentFilterTone("failed"), "solid") },
      ]}
      statusValue={statusFilter}
      statusOptions={[{ value: "all", label: "All" }, { value: "success", label: "Success" }, { value: "running", label: "Running" }, { value: "failed", label: "Failed" }]}
      onStatusChange={(value) => onStatusChange(value as typeof statusFilter)}
      sortValue={sortOrder}
      sortOptions={[{ value: "newest", label: "Newest" }, { value: "oldest", label: "Oldest" }]}
      onSortChange={(value) => onSortChange(value as typeof sortOrder)}
    />
  );
}
