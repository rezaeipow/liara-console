import { Box } from "@mui/material";
import ProjectAppsActivityPanel from "./ProjectAppsActivityPanel";
import ProjectAppsDirectoryPanel from "./ProjectAppsDirectoryPanel";
import type { ProjectAppsMainContentProps } from "@/shared/types/appsComponents";

export default function ProjectAppsMainContent(props: ProjectAppsMainContentProps) {
  const {
    viewMode,
    theme,
    isLoading,
    appsCount,
    visibleApps,
    metaByAppId,
    projectId,
    actionLoadingId,
    onRestart,
    onOpenDelete,
    onOpenCreate,
    onClearFilters,
    activity,
  } = props;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: viewMode === "cards" ? "minmax(0, 1fr) 300px" : "1fr" },
        gap: 1.5,
      }}
    >
      <ProjectAppsDirectoryPanel
        theme={theme}
        isLoading={isLoading}
        appsCount={appsCount}
        visibleApps={visibleApps}
        metaByAppId={metaByAppId}
        viewMode={viewMode}
        projectId={projectId}
        actionLoadingId={actionLoadingId}
        onRestart={onRestart}
        onOpenDelete={onOpenDelete}
        onOpenCreate={onOpenCreate}
        onClearFilters={onClearFilters}
      />
      <ProjectAppsActivityPanel theme={theme} activity={activity} visible={viewMode === "cards"} />
    </Box>
  );
}
