import ClearFiltersEmptyState from "@/shared/components/common/ClearFiltersEmptyState";
import EmptyStateAlert from "@/shared/components/common/EmptyStateAlert";
import ResourceViewState from "@/shared/components/common/ResourceViewState";
import type { AppDeploymentsViewStateProps } from "@/shared/types/appsComponents";
import AppDeploymentsCards from "./AppDeploymentsCards";
import AppDeploymentsLoading from "./AppDeploymentsLoading";
import AppDeploymentsTable from "./AppDeploymentsTable";

export default function AppDeploymentsViewState({
  isLoading,
  hasAnyItems,
  filteredItems,
  viewMode,
  onRetry,
  onClearFilters,
  theme,
  formatDate,
}: AppDeploymentsViewStateProps) {
  return (
    <ResourceViewState
      isLoading={isLoading}
      hasVisibleItems={filteredItems.length > 0}
      hasAnyItems={hasAnyItems}
      viewMode={viewMode}
      loading={<AppDeploymentsLoading />}
      emptyNoItems={
        <EmptyStateAlert actionLabel="Check again" onAction={onRetry}>
          No deployments found for this app yet. Trigger your first release to populate this list.
        </EmptyStateAlert>
      }
      emptyFiltered={
        <ClearFiltersEmptyState onClear={onClearFilters}>
          No deployments match the selected filter.
        </ClearFiltersEmptyState>
      }
      cards={<AppDeploymentsCards items={filteredItems} theme={theme} formatDate={formatDate} />}
      table={<AppDeploymentsTable items={filteredItems} formatDate={formatDate} />}
    />
  );
}
