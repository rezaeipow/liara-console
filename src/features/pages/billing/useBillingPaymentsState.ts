import { useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { useRouteLoading } from "@/shared/hooks/useRouteLoading";
import { useStatusSortQuery } from "@/shared/hooks/useStatusSortQuery";
import { useTableDensity } from "@/shared/hooks/useTableDensity";
import { NEWEST_OLDEST_AMOUNT_SORT_OPTIONS } from "@/shared/constants/sortOptions";
import type { BillingPaymentsLoaderData } from "./billingData";
import type { BillingPaymentsState, PaymentSortMode, PaymentStatusFilter } from "./types";

const statusOptions: PaymentStatusFilter[] = ["all", "success", "failed"];
const sortOptions: readonly PaymentSortMode[] = NEWEST_OLDEST_AMOUNT_SORT_OPTIONS;

export function useBillingPaymentsState(): BillingPaymentsState {
  const { items } = useLoaderData() as BillingPaymentsLoaderData;
  const statusSort = useStatusSortQuery({
    statusOptions,
    defaultStatus: "all",
    sortOptions,
    defaultSort: "newest",
  });
  const { tableDensity } = useTableDensity();
  const isRouteLoading = useRouteLoading("/console/billing/payments");

  const densityLayout = useMemo(() => {
    return {
      listSpacing: tableDensity === "comfortable" ? 1.6 : tableDensity === "compact" ? 0.8 : 1,
      itemPaddingX: tableDensity === "comfortable" ? 2 : tableDensity === "compact" ? 1 : 1.25,
      itemPaddingY: tableDensity === "comfortable" ? 2 : tableDensity === "compact" ? 1 : 1.25,
      itemInnerSpacing: tableDensity === "comfortable" ? 1.25 : tableDensity === "compact" ? 0.625 : 0.8,
    };
  }, [tableDensity]);

  const summary = useMemo(() => {
    const successCount = items.filter((item) => item.status === "success").length;
    const failedCount = items.filter((item) => item.status === "failed").length;
    const totalSuccessAmount = items
      .filter((item) => item.status === "success")
      .reduce((sum, item) => sum + item.amount, 0);
    return { successCount, failedCount, totalSuccessAmount };
  }, [items]);

  return {
    items,
    status: statusSort.status as PaymentStatusFilter,
    sort: statusSort.sort as PaymentSortMode,
    isRouteLoading,
    summary,
    densityLayout,
    tableDensity,
    setStatus: statusSort.setStatus as BillingPaymentsState["setStatus"],
    setSort: statusSort.setSort as BillingPaymentsState["setSort"],
  };
}
