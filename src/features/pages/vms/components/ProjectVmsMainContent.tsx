import { Paper, Skeleton, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ClearFiltersEmptyState from "@/shared/components/common/ClearFiltersEmptyState";
import EmptyStateAlert from "@/shared/components/common/EmptyStateAlert";
import { ResourceLoadingGrid } from "@/shared/components/common/ResourceListLayouts";
import ResourceViewState from "@/shared/components/common/ResourceViewState";
import type { ProjectVmsContentProps } from "../pageTypes";
import ProjectVmsCardsView from "./ProjectVmsCardsView";
import ProjectVmsTableView from "./ProjectVmsTableView";

export default function ProjectVmsMainContent(props: ProjectVmsContentProps) {
  const { theme, state, onOpenCreate, onClearFilters, onOpenMenu } = props;

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 1.75 },
        borderRadius: { xs: 1.5, sm: 2 },
        border: `1px solid ${alpha(theme.palette.text.secondary, 0.24)}`,
        background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.74)}, ${alpha(theme.palette.background.default, 0.92)})`,
      }}
    >
      <ResourceViewState
        isLoading={state.isLoading}
        hasVisibleItems={state.filteredVms.length > 0}
        hasAnyItems={state.vms.length > 0}
        viewMode={state.viewMode}
        loading={
          <ResourceLoadingGrid
            count={4}
            keyPrefix="vm-skeleton"
            renderItem={() => (
              <Paper variant="outlined" sx={{ p: 1.4 }}>
                <Stack spacing={1}>
                  <Skeleton variant="text" width="58%" height={28} />
                  <Skeleton variant="rounded" width={86} height={24} />
                  <Skeleton variant="rounded" height={42} />
                  <Skeleton variant="rounded" height={36} />
                </Stack>
              </Paper>
            )}
          />
        }
        emptyNoItems={
          <EmptyStateAlert actionLabel="Add VM" onAction={onOpenCreate}>
            No virtual machines yet. Create your first VM to start running workloads.
          </EmptyStateAlert>
        }
        emptyFiltered={
          <ClearFiltersEmptyState onClear={onClearFilters}>
            No VMs match the selected filters.
          </ClearFiltersEmptyState>
        }
        cards={
          <ProjectVmsCardsView
            theme={theme}
            items={state.filteredVms}
            actionLoadingId={state.actionLoadingId}
            onAskAction={state.askAction}
            onOpenMenu={onOpenMenu}
          />
        }
        table={
          <ProjectVmsTableView
            items={state.filteredVms}
            actionLoadingId={state.actionLoadingId}
            onAskAction={state.askAction}
          />
        }
      />
    </Paper>
  );
}
