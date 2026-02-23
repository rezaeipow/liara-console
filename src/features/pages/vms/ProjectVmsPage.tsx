import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import { useTheme } from "@mui/material/styles";
import ServiceListShell from "@/shared/components/common/ServiceListShell";
import ViewModeToggle from "@/shared/components/common/ViewModeToggle";
import { createPrimaryHeroGradient } from "@/shared/ui/heroStyles";
import { getConfirmDialogContent } from "./projectVmsUtils";
import ProjectVmsDialogs from "./components/ProjectVmsDialogs";
import ProjectVmsFilterBar from "./components/ProjectVmsFilterBar";
import ProjectVmsHeaderActions from "./components/ProjectVmsHeaderActions";
import ProjectVmsMainContent from "./components/ProjectVmsMainContent";
import ProjectVmsSummary from "./components/ProjectVmsSummary";
import { useProjectVmsPageState } from "./useProjectVmsPageState";

export default function ProjectVmsPage() {
  const theme = useTheme();
  const state = useProjectVmsPageState();
  const pendingVmName = state.pendingAction
    ? (state.vms.find((vm) => vm.id === state.pendingAction?.vmId)?.name ??
      "this VM")
    : "this VM";
  const confirmContent = getConfirmDialogContent(
    state.pendingAction?.type,
    pendingVmName,
  );

  return (
    <>
      <ServiceListShell
        title="Project Virtual Machines"
        description="Compute inventory and operational controls for this project."
        icon={<DnsOutlinedIcon />}
        gradient={createPrimaryHeroGradient(theme, {
          startAlpha: 0.2,
          endAlpha: 0.14,
        })}
        actions={
          <ProjectVmsHeaderActions
            projectId={state.projectId}
            isLoading={state.isLoading}
            onRefresh={state.refresh}
            onOpenCreate={() => state.setCreateDialogOpen(true)}
          />
        }
        summary={<ProjectVmsSummary summary={state.summary} />}
        filterStart={
          <ProjectVmsFilterBar
            theme={theme}
            query={state.query}
            statusFilter={state.statusFilter}
            sortMode={state.sortMode}
            onSearchChange={(value) => state.setQueryParam("q", value, "")}
            onStatusChange={state.setStatusFilter}
            onSortChange={state.setSortMode}
          />
        }
        filterEnd={
          <ViewModeToggle
            value={state.viewMode}
            onChange={(value) => state.setQueryParam("view", value, "cards")}
          />
        }
        errorMessage={state.errorMessage}
        onRetry={state.refresh}
        spacing={2.1}
      >
        <ProjectVmsMainContent
          theme={theme}
          state={state}
          onOpenCreate={() => state.setCreateDialogOpen(true)}
          onClearFilters={() => {
            state.setStatusFilter("all");
            state.setQueryParam("q", "", "");
          }}
          onOpenMenu={(event, vmId) => {
            state.setMenuAnchorEl(event.currentTarget);
            state.setMenuVmId(vmId);
          }}
        />
      </ServiceListShell>

      <ProjectVmsDialogs
        state={state}
        pendingVmName={pendingVmName}
        confirmTitle={confirmContent.title}
        confirmMessage={confirmContent.message}
      />
    </>
  );
}
