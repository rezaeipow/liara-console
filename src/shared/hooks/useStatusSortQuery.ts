import { useMemo } from "react";
import { useQueryParams } from "@/shared/hooks/useQueryParams";

export function useStatusSortQuery<Status extends string, Sort extends string>(params: {
  statusOptions: readonly Status[];
  defaultStatus: Status;
  sortOptions: readonly Sort[];
  defaultSort: Sort;
  statusKey?: string;
  sortKey?: string;
  resetPageKey?: string;
}) {
  const { getEnumParam, setQueryParam } = useQueryParams();
  const statusKey = params.statusKey ?? "status";
  const sortKey = params.sortKey ?? "sort";

  const status = getEnumParam(statusKey, params.statusOptions, params.defaultStatus);
  const sort = getEnumParam(sortKey, params.sortOptions, params.defaultSort);

  return useMemo(
    () => ({
      status,
      sort,
      setStatus: (value: Status) =>
        setQueryParam(statusKey, value, params.defaultStatus, params.resetPageKey ? { resetPageKey: params.resetPageKey } : undefined),
      setSort: (value: Sort) =>
        setQueryParam(sortKey, value, params.defaultSort, params.resetPageKey ? { resetPageKey: params.resetPageKey } : undefined),
    }),
    [params.defaultSort, params.defaultStatus, params.resetPageKey, setQueryParam, sort, sortKey, status, statusKey],
  );
}
