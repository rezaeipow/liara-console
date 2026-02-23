import { Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EmptyStateAlert from "@/shared/components/common/EmptyStateAlert";
import ClearFiltersEmptyState from "@/shared/components/common/ClearFiltersEmptyState";
import { ResourceLoadingGrid } from "@/shared/components/common/ResourceListLayouts";
import ResourceViewState from "@/shared/components/common/ResourceViewState";
import type { ProjectAppsDirectoryPanelProps } from "@/shared/types/appsComponents";
import ProjectAppsCardsView from "./ProjectAppsCardsView";
import ProjectAppsTableView from "./ProjectAppsTableView";

export default function ProjectAppsDirectoryPanel(props: ProjectAppsDirectoryPanelProps) {
  const { theme, isLoading, appsCount, visibleApps, metaByAppId, viewMode, projectId, actionLoadingId, onRestart, onOpenDelete, onOpenCreate, onClearFilters } = props;
  return (
    <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: { xs: 1.5, sm: 2 }, border: `1px solid ${alpha(theme.palette.text.secondary, 0.24)}`, background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.74)}, ${alpha(theme.palette.background.default, 0.92)})` }}>
      <Stack spacing={1.25}>
        <Typography variant="h6" fontWeight={800}>App Directory</Typography>
        <Divider sx={{ opacity: 0.45 }} />
        <ResourceViewState
          isLoading={isLoading}
          hasVisibleItems={visibleApps.length > 0}
          hasAnyItems={appsCount > 0}
          viewMode={viewMode}
          loading={<ResourceLoadingGrid count={6} keyPrefix="apps-skeleton" renderItem={() => <Paper variant="outlined" sx={{ p: 1.5 }}><Stack spacing={1}><Skeleton variant="text" width="65%" height={28} /><Skeleton variant="rounded" width={92} height={24} /><Skeleton variant="rounded" height={36} /><Skeleton variant="rounded" height={36} /></Stack></Paper>} />}
          emptyNoItems={<EmptyStateAlert actionLabel="Create App" onAction={onOpenCreate}>No apps yet. Create your first app to start deploying services.</EmptyStateAlert>}
          emptyFiltered={<ClearFiltersEmptyState onClear={onClearFilters}>No apps match the current filter.</ClearFiltersEmptyState>}
          cards={<ProjectAppsCardsView apps={visibleApps} metaByAppId={metaByAppId} projectId={projectId} theme={theme} actionLoadingId={actionLoadingId} onRestart={onRestart} onOpenDelete={onOpenDelete} />}
          table={<ProjectAppsTableView apps={visibleApps} metaByAppId={metaByAppId} projectId={projectId} theme={theme} actionLoadingId={actionLoadingId} onRestart={onRestart} onOpenDelete={onOpenDelete} />}
        />
      </Stack>
    </Paper>
  );
}
