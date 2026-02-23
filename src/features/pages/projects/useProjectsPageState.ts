import { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { PROJECT_HEALTH_OPTIONS, PROJECT_SORT_OPTIONS } from "@/shared/constants/projectsOptions";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { useStatusSortQuery } from "@/shared/hooks/useStatusSortQuery";
import { createDateFormatter } from "@/shared/utils/dateTime";
import type { ProjectsLoaderData } from "./projectsData";
import type { ProjectHealthFilter, ProjectsPageState, ProjectSortMode } from "./types";

const SEARCH_DEBOUNCE_MS = 320;

export function useProjectsPageState(): ProjectsPageState {
  const data = useLoaderData() as ProjectsLoaderData;
  const navigation = useNavigation();
  const { setQueryParams, setQueryParam } = useQueryParams();
  const isLoading = navigation.state !== "idle";
  const [searchInput, setSearchInput] = useState(data.query);
  const searchDebounceRef = useRef<number | null>(null);

  const pageSummary = useMemo(() => `Showing ${data.items.length} of ${data.total}`, [data.items.length, data.total]);
  const dateFormatter = useMemo(() => createDateFormatter(), []);

  const statusSort = useStatusSortQuery({
    statusOptions: PROJECT_HEALTH_OPTIONS,
    defaultStatus: "all",
    sortOptions: PROJECT_SORT_OPTIONS,
    defaultSort: "created-desc",
    statusKey: "health",
    resetPageKey: "page",
  });

  const sortMode = statusSort.sort as ProjectSortMode;
  const healthFilter = statusSort.status as ProjectHealthFilter;

  const onChangeQuery = (value: string) => {
    setQueryParam("q", value, "", { resetPageKey: "page" });
  };

  const onSearchInputChange = (value: string) => {
    setSearchInput(value);
    if (searchDebounceRef.current !== null) {
      window.clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = window.setTimeout(() => {
      onChangeQuery(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  const loadMore = () => {
    setQueryParams(
      {
        page: 1,
        pageSize: data.pageSize + 8,
      },
      { replace: false },
    );
  };

  const onChangeHealth = (value: ProjectHealthFilter) => {
    statusSort.setStatus(value);
  };

  const onChangeSort = (value: ProjectSortMode) => {
    statusSort.setSort(value);
  };

  const onClearHealth = () => {
    setQueryParam("health", "all", "all", { resetPageKey: "page" });
  };

  const visibleItems = useMemo(() => {
    const next = data.items.filter((project) => {
      if (healthFilter === "all") return true;
      return project.healthStatus === healthFilter;
    });

    next.sort((left, right) => {
      if (sortMode === "name-asc") return left.name.localeCompare(right.name);
      if (sortMode === "name-desc") return right.name.localeCompare(left.name);
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();
      return sortMode === "created-asc" ? leftTime - rightTime : rightTime - leftTime;
    });

    return next;
  }, [data.items, healthFilter, sortMode]);

  useEffect(
    () => () => {
      if (searchDebounceRef.current !== null) {
        window.clearTimeout(searchDebounceRef.current);
      }
    },
    [],
  );

  return {
    data,
    isLoading,
    searchInput,
    healthFilter,
    sortMode,
    visibleItems,
    pageSummary,
    dateFormatter,
    onSearchInputChange,
    onChangeQuery,
    onChangeHealth,
    onChangeSort,
    onClearHealth,
    loadMore,
  };
}
