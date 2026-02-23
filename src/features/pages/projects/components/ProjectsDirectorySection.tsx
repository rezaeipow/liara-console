import { Divider, Stack } from "@mui/material";
import ConsoleSectionCard from "@/shared/components/console/ConsoleSectionCard";
import type { ProjectsDirectorySectionProps } from "../types";
import ProjectsDirectoryContent from "./ProjectsDirectoryContent";
import ProjectsDirectoryFilters from "./ProjectsDirectoryFilters";
import ProjectsDirectoryFooter from "./ProjectsDirectoryFooter";
import ProjectsDirectoryHeader from "./ProjectsDirectoryHeader";

export default function ProjectsDirectorySection(props: ProjectsDirectorySectionProps) {
  return (
    <ConsoleSectionCard soft>
      <Stack spacing={1.5}>
        <ProjectsDirectoryHeader
          title="Project Directory"
          createProjectLabel="Create Project"
        />
        <Divider sx={{ opacity: 0.4 }} />
        <ProjectsDirectoryFilters
          theme={props.theme}
          healthFilter={props.healthFilter}
          sortMode={props.sortMode}
          onChangeHealth={props.onChangeHealth}
          onChangeSort={props.onChangeSort}
        />
        <ProjectsDirectoryContent
          theme={props.theme}
          isLoading={props.isLoading}
          data={props.data}
          visibleItems={props.visibleItems}
          dateFormatter={props.dateFormatter}
          onChangeQuery={props.onChangeQuery}
          onClearHealth={props.onClearHealth}
        />
        <ProjectsDirectoryFooter
          pageSummary={props.pageSummary}
          isLoading={props.isLoading}
          hasMore={props.data.items.length < props.data.total}
          hasQuery={Boolean(props.data.query)}
          onLoadMore={props.loadMore}
        />
      </Stack>
    </ConsoleSectionCard>
  );
}
