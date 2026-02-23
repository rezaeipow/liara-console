import { Stack, useTheme } from "@mui/material";
import AppDeploymentsFilterBar from "./components/AppDeploymentsFilterBar";
import AppDeploymentsHeader from "./components/AppDeploymentsHeader";
import AppDeploymentsLatest from "./components/AppDeploymentsLatest";
import AppDeploymentsStats from "./components/AppDeploymentsStats";
import AppDeploymentsViewState from "./components/AppDeploymentsViewState";
import AppDeploymentsError from "./components/AppDeploymentsError";
import { formatDeploymentDateTime } from "./appDeploymentsUtils";
import { useAppDeploymentsPageState } from "./useAppDeploymentsPageState";

export default function AppDeploymentsPage() {
  const theme = useTheme();
  const state = useAppDeploymentsPageState();

  return (
    <Stack spacing={1.5}>
      <AppDeploymentsHeader
        viewMode={state.viewMode}
        onViewChange={(value) => state.setQueryParam("view", value, "cards")}
        onRefresh={() => void state.loadDeployments()}
        isLoading={state.isLoading}
      />
      <AppDeploymentsStats stats={state.stats} isLoading={state.isLoading} />
      <AppDeploymentsLatest
        latest={state.latestDeployment}
        isLoading={state.isLoading}
        theme={theme}
        formatDate={formatDeploymentDateTime}
      />
      <AppDeploymentsFilterBar
        theme={theme}
        statusFilter={state.statusFilter}
        sortOrder={state.sortOrder}
        onStatusChange={(value) => state.setQueryParam("status", value, "all")}
        onSortChange={(value) => state.setQueryParam("sort", value, "newest")}
      />
      <AppDeploymentsError
        error={state.error}
        onRetry={() => void state.loadDeployments()}
      />
      <AppDeploymentsViewState
        isLoading={state.isLoading}
        hasAnyItems={state.items.length > 0}
        filteredItems={state.filteredItems}
        viewMode={state.viewMode}
        onRetry={() => void state.loadDeployments()}
        onClearFilters={() => state.setQueryParam("status", "all", "all")}
        theme={theme}
        formatDate={formatDeploymentDateTime}
      />
    </Stack>
  );
}
