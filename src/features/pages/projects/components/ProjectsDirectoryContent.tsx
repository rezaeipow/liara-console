import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import ClearFiltersEmptyState from "@/shared/components/common/ClearFiltersEmptyState";
import EmptyStateAlert from "@/shared/components/common/EmptyStateAlert";
import ProjectSummaryCard, { ProjectSummaryCardSkeleton } from "./ProjectSummaryCard";
import type { ProjectsDirectoryContentProps } from "../types";

export default function ProjectsDirectoryContent(props: ProjectsDirectoryContentProps) {
  const { theme, isLoading, data, visibleItems, dateFormatter, onChangeQuery, onClearHealth } = props;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
          gap: 1.5,
        }}
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <ProjectSummaryCardSkeleton key={`projects-skeleton-${idx}`} />
        ))}
      </Box>
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyStateAlert
        action={
          data.query ? (
            <Button size="small" color="inherit" onClick={() => onChangeQuery("")}>
              Clear search
            </Button>
          ) : (
            <Button size="small" color="inherit" component={Link} to="/console/projects/new">
              Create Project
            </Button>
          )
        }
      >
        {data.query ? "No project matches this search." : "No projects yet. Create your first project to get started."}
      </EmptyStateAlert>
    );
  }

  if (visibleItems.length === 0) {
    return <ClearFiltersEmptyState onClear={onClearHealth}>No projects match the selected filters.</ClearFiltersEmptyState>;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
        gap: 1.5,
      }}
    >
      {visibleItems.map((project) => (
        <ProjectSummaryCard key={project.id} project={project} theme={theme} dateFormatter={dateFormatter} />
      ))}
    </Box>
  );
}
