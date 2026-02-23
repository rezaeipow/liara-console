import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import ConsolePageShell from "@/shared/components/console/ConsolePageShell";
import ProjectOverviewActivitySection from "./components/ProjectOverviewActivitySection";
import ProjectOverviewDialogs from "./components/ProjectOverviewDialogs";
import ProjectOverviewHero from "./components/ProjectOverviewHero";
import ProjectOverviewMetricsGrid from "./components/ProjectOverviewMetricsGrid";
import { useProjectOverviewState } from "./useProjectOverviewState";

export default function ProjectOverviewPage() {
  const state = useProjectOverviewState();
  const project = state.data.project;

  return (
    <>
      <ConsolePageShell spacing={2}>
        <ProjectOverviewHero
          projectName={project.name}
          projectRegion={project.region}
          projectPlan={project.plan}
          createdAt={state.createdAt}
          isHealthy={state.isHealthy}
          onRenameClick={state.onOpenRenameDialog}
          onDeleteClick={state.onOpenDeleteDialog}
        />

        <ProjectOverviewMetricsGrid cards={state.overviewCards} />

        <ProjectOverviewActivitySection
          items={project.activity}
          formatDateTime={state.formatActivityDate}
        />
      </ConsolePageShell>

      <ProjectOverviewDialogs
        openRename={state.renameDialogOpen}
        openDelete={state.deleteDialogOpen}
        nextProjectName={state.nextProjectName}
        renameError={state.renameError}
        isSubmitting={state.isSubmitting}
        actionIntent={state.actionIntent}
        deleteConfirmText={state.deleteConfirmText}
        deleteDisabled={state.deleteDisabled}
        projectName={project.name}
        onCloseRename={state.onCloseRenameDialog}
        onSubmitRename={state.onSubmitRename}
        onNameChange={state.onNextProjectNameChange}
        onCloseDelete={state.onCloseDeleteDialog}
        onDeleteConfirmTextChange={state.onDeleteConfirmTextChange}
        onSubmitDelete={state.onSubmitDelete}
      />

      <FeedbackSnackbar
        open={state.feedbackOpen}
        autoHideDuration={3200}
        severity={state.feedbackSeverity}
        message={state.feedbackMessage}
        onClose={state.onFeedbackClose}
      />
    </>
  );
}
