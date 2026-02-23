import StatusSortFilterBar from "@/shared/components/common/StatusSortFilterBar";
import type { BillingInvoicesFilterBarProps } from "../types";

export default function BillingInvoicesFilterBar(props: BillingInvoicesFilterBarProps) {
  const { status, sort, setStatus, setSort } = props;

  return (
    <StatusSortFilterBar
      chips={[
        { key: "all", label: "All", selected: status === "all", color: "primary", onClick: () => setStatus("all"), ariaLabel: "Show all invoices" },
        { key: "paid", label: "Paid", selected: status === "paid", color: "success", onClick: () => setStatus("paid"), ariaLabel: "Filter paid invoices" },
        { key: "unpaid", label: "Unpaid", selected: status === "unpaid", color: "warning", onClick: () => setStatus("unpaid"), ariaLabel: "Filter unpaid invoices" },
      ]}
      statusValue={status}
      onStatusChange={(value) => setStatus(value as "all" | "paid" | "unpaid")}
      statusOptions={[
        { value: "all", label: "All" },
        { value: "paid", label: "Paid" },
        { value: "unpaid", label: "Unpaid" },
      ]}
      statusAriaLabel="Invoice status filter"
      sortValue={sort}
      onSortChange={(value) => setSort(value as "newest" | "oldest" | "amount")}
      sortOptions={[
        { value: "newest", label: "Newest" },
        { value: "oldest", label: "Oldest" },
        { value: "amount", label: "Highest amount" },
      ]}
      sortAriaLabel="Invoice sort"
    />
  );
}
