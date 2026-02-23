import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { BillingAPI } from "@/api/billingApi";
import { ApiError } from "@/api/httpClient";
import { useRouteLoading } from "@/shared/hooks/useRouteLoading";
import { useStatusSortQuery } from "@/shared/hooks/useStatusSortQuery";
import { useTableDensity } from "@/shared/hooks/useTableDensity";
import { NEWEST_OLDEST_AMOUNT_SORT_OPTIONS } from "@/shared/constants/sortOptions";
import type { BillingInvoicesLoaderData } from "./billingData";
import type { BillingInvoicesState, InvoiceSortMode, InvoiceStatusFilter } from "./types";

const statusOptions: InvoiceStatusFilter[] = ["all", "paid", "unpaid"];
const sortOptions: readonly InvoiceSortMode[] = NEWEST_OLDEST_AMOUNT_SORT_OPTIONS;

function getStatusHint(status: number): string {
  if (status === 408) return "Request timed out. Please retry.";
  if (status === 401) return "Please login again and retry.";
  if (status === 403) return "You do not have permission to download this invoice.";
  if (status === 404) return "Invoice file was not found. Try refreshing the list.";
  if (status >= 500) return "Server error occurred. Please retry in a few moments.";
  return "Please retry.";
}

export function useBillingInvoicesState(): BillingInvoicesState {
  const { items } = useLoaderData() as BillingInvoicesLoaderData;
  const statusSort = useStatusSortQuery({
    statusOptions,
    defaultStatus: "all",
    sortOptions,
    defaultSort: "newest",
  });
  const [notice, setNotice] = useState<BillingInvoicesState["notice"]>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { tableDensity } = useTableDensity();
  const isRouteLoading = useRouteLoading("/console/billing/invoices");

  const densityLayout = useMemo(() => {
    return {
      gridColumnGap: tableDensity === "comfortable" ? 1.8 : tableDensity === "compact" ? 0.9 : 1,
      gridRowGap: tableDensity === "comfortable" ? 1.8 : tableDensity === "compact" ? 0.9 : 1,
      itemPaddingX: tableDensity === "comfortable" ? 2 : tableDensity === "compact" ? 1 : 1.25,
      itemPaddingY: tableDensity === "comfortable" ? 2 : tableDensity === "compact" ? 1 : 1.25,
      itemInnerSpacing: tableDensity === "comfortable" ? 1.25 : tableDensity === "compact" ? 0.625 : 0.8,
    };
  }, [tableDensity]);

  const unpaidCount = useMemo(
    () => items.filter((item) => item.status === "unpaid").length,
    [items],
  );

  const handleDownload = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    try {
      const payload = await BillingAPI.downloadInvoice(invoiceId);
      const link = document.createElement("a");
      link.href = payload.url;
      link.download = payload.filename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.append(link);
      link.click();
      link.remove();

      setNotice({
        message: `Mock download ready: ${payload.filename}`,
        severity: "success",
      });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setNotice({
          message: error.message,
          severity: "error",
          hint: getStatusHint(error.status),
          status: error.status,
        });
      } else {
        setNotice({
          message: error instanceof Error ? error.message : "Could not download invoice.",
          severity: "error",
          hint: getStatusHint(500),
          status: 500,
        });
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return {
    items,
    status: statusSort.status as InvoiceStatusFilter,
    sort: statusSort.sort as InvoiceSortMode,
    notice,
    downloadingId,
    isRouteLoading,
    densityLayout,
    unpaidCount,
    setStatus: statusSort.setStatus as BillingInvoicesState["setStatus"],
    setSort: statusSort.setSort as BillingInvoicesState["setSort"],
    setNotice,
    handleDownload,
  };
}
