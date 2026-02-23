import { useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { useRouteLoading } from "@/shared/hooks/useRouteLoading";
import { useStatusSortQuery } from "@/shared/hooks/useStatusSortQuery";
import { useTableDensity } from "@/shared/hooks/useTableDensity";
import { NEWEST_OLDEST_SORT_OPTIONS } from "@/shared/constants/sortOptions";
import type { TicketsLoaderData } from "./supportData";
import type { TicketSortMode, TicketStatusFilter, TicketsPageState } from "./types";

const statusOptions: TicketStatusFilter[] = ["all", "open", "pending", "closed"];
const sortOptions: readonly TicketSortMode[] = NEWEST_OLDEST_SORT_OPTIONS;

export function useTicketsPageState(): TicketsPageState {
  const { items } = useLoaderData() as TicketsLoaderData;
  const { clearQueryParams, getBooleanParam, getParam, setQueryParam } = useQueryParams();
  const statusSort = useStatusSortQuery({
    statusOptions,
    defaultStatus: "all",
    sortOptions,
    defaultSort: "newest",
  });
  const { tableDensity } = useTableDensity();
  const isRouteLoading = useRouteLoading("/console/support/tickets");

  const status = statusSort.status as TicketStatusFilter;
  const category = getParam("category", "all");
  const sort = statusSort.sort as TicketSortMode;
  const unresolved = getBooleanParam("unresolved");
  const query = getParam("q");

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))).sort(),
    [items],
  );

  const summary = useMemo(() => {
    const open = items.filter((item) => item.status === "open").length;
    const pending = items.filter((item) => item.status === "pending").length;
    const closed = items.filter((item) => item.status === "closed").length;
    return { open, pending, closed };
  }, [items]);

  const densityLayout = useMemo(() => {
    return {
      listSpacing: tableDensity === "comfortable" ? 1.8 : tableDensity === "compact" ? 0.18 : 1,
      itemPaddingX: tableDensity === "comfortable" ? 2.2 : tableDensity === "compact" ? 0.5 : 1.2,
      itemPaddingY: tableDensity === "comfortable" ? 2.2 : tableDensity === "compact" ? 0.35 : 1.2,
      itemInnerSpacing: tableDensity === "comfortable" ? 1.4 : tableDensity === "compact" ? 0.12 : 0.8,
    };
  }, [tableDensity]);

  return {
    items,
    status,
    category,
    sort,
    unresolved,
    query,
    categories,
    summary,
    tableDensity,
    isRouteLoading,
    densityLayout,
    setStatus: statusSort.setStatus as TicketsPageState["setStatus"],
    setSort: statusSort.setSort as TicketsPageState["setSort"],
    setQueryParam,
    clearQueryParams,
  };
}
