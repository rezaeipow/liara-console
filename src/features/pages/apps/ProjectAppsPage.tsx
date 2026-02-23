import AppsIcon from "@mui/icons-material/Apps";
import { useTheme } from "@mui/material/styles";
import ServiceListShell from "@/shared/components/common/ServiceListShell";
import ViewModeToggle from "@/shared/components/common/ViewModeToggle";
import { createPrimaryHeroGradient } from "@/shared/ui/heroStyles";
import { useProjectAppsPageState } from "./useProjectAppsPageState";
import ProjectAppsDialogs from "./components/ProjectAppsDialogs";
import ProjectAppsFilterBar from "./components/ProjectAppsFilterBar";
import ProjectAppsHeaderActions from "./components/ProjectAppsHeaderActions";
import ProjectAppsMainContent from "./components/ProjectAppsMainContent";
import ProjectAppsSummary from "./components/ProjectAppsSummary";

export default function ProjectAppsPage() {
  const theme = useTheme();
  const state = useProjectAppsPageState();
  const openCreate = () => state.setCreateDialogOpen(true);
  const openDelete = (appId: string) => {
    state.setDeleteTargetId(appId);
    state.setDeleteDialogOpen(true);
  };
  const clearFilters = () => {
    state.statusSort.setStatus("all");
    state.setQueryParam("q", "", "");
  };
  const closeDelete = () => {
    state.setDeleteDialogOpen(false);
    state.setDeleteTargetId(null);
  };
  const targetName = state.apps.find((app) => app.id === state.deleteTargetId)?.name ?? "-";

  return (
    <>
      <ServiceListShell
        title="Project Apps"
        description="Manage app services with runtime status, deployments, and quick operations."
        icon={<AppsIcon />}
        gradient={createPrimaryHeroGradient(theme, { startAlpha: 0.2, endAlpha: 0.14 })}
        actions={<ProjectAppsHeaderActions projectId={state.projectId} isLoading={state.isLoading} onRefresh={state.refreshAll} onOpenCreate={openCreate} />}
        summary={<ProjectAppsSummary theme={theme} summary={state.summary} />}
        filterStart={<ProjectAppsFilterBar theme={theme} q={state.q} statusFilter={state.statusFilter} sortMode={state.sortMode} onSearchChange={(value) => state.setQueryParam("q", value, "")} onStatusChange={state.statusSort.setStatus} onSortChange={state.statusSort.setSort} />}
        filterEnd={<ViewModeToggle value={state.viewMode} onChange={(value) => state.setQueryParam("view", value, "cards")} />}
        errorMessage={state.errorMessage}
        onRetry={state.refreshAll}
        spacing={2.25}
      >
        <ProjectAppsMainContent
          viewMode={state.viewMode}
          theme={theme}
          isLoading={state.isLoading}
          appsCount={state.apps.length}
          visibleApps={state.visibleApps}
          metaByAppId={state.metaByAppId}
          projectId={state.projectId}
          actionLoadingId={state.actionLoadingId}
          onRestart={(appId) => void state.handleRestart(appId)}
          onOpenDelete={openDelete}
          onOpenCreate={openCreate}
          onClearFilters={clearFilters}
          activity={state.activity}
        />
      </ServiceListShell>
      <ProjectAppsDialogs
        createDialogOpen={state.createDialogOpen}
        isCreating={state.isCreating}
        canCreate={state.canCreate}
        name={state.name}
        region={state.region}
        plan={state.plan}
        regionOptions={state.regionOptions}
        planOptions={state.planOptions}
        onCloseCreate={() => {
          if (!state.isCreating) state.setCreateDialogOpen(false);
        }}
        onSubmitCreate={() => void state.handleCreate()}
        onNameChange={state.setName}
        onRegionChange={state.setRegion}
        onPlanChange={state.setPlan}
        deleteDialogOpen={state.deleteDialogOpen}
        isDeleting={state.isDeleting}
        targetName={targetName}
        onCloseDelete={closeDelete}
        onConfirmDelete={() => void state.handleDelete()}
        feedback={state.feedback}
        onCloseFeedback={state.clearFeedback}
      />
    </>
  );
}
