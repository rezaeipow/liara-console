import { useTheme } from "@mui/material/styles";
import ConsolePageShell from "@/shared/components/console/ConsolePageShell";
import ProjectsDirectorySection from "./components/ProjectsDirectorySection";
import ProjectsHero from "./components/ProjectsHero";
import { useProjectsPageState } from "./useProjectsPageState";

export default function ProjectsPage() {
  const theme = useTheme();
  const state = useProjectsPageState();

  return (
    <ConsolePageShell spacing={2.5}>
      <ProjectsHero
        theme={theme}
        searchInput={state.searchInput}
        onSearchInputChange={state.onSearchInputChange}
      />

      <ProjectsDirectorySection
        theme={theme}
        isLoading={state.isLoading}
        data={state.data}
        visibleItems={state.visibleItems}
        healthFilter={state.healthFilter}
        sortMode={state.sortMode}
        pageSummary={state.pageSummary}
        dateFormatter={state.dateFormatter}
        onChangeQuery={state.onChangeQuery}
        onChangeHealth={state.onChangeHealth}
        onChangeSort={state.onChangeSort}
        onClearHealth={state.onClearHealth}
        loadMore={state.loadMore}
      />
    </ConsolePageShell>
  );
}
