import { LinearProgress, Stack } from "@mui/material";
import StatusSortFilterBar from "@/shared/components/common/StatusSortFilterBar";
import type { TicketsFilterPanelProps } from "../types";

export default function TicketsFilterPanel(props: TicketsFilterPanelProps) {
  const {
    isRouteLoading,
    query,
    unresolved,
    category,
    status,
    sort,
    onSearchChange,
    onToggleUnresolved,
    onCategoryChange,
    onStatusChange,
    onSortChange,
    categoryChips,
  } = props;

  return (
    <>
      {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
      <Stack spacing={1.3}>
        <StatusSortFilterBar
          searchValue={query}
          searchPlaceholder="Search by subject, category, body"
          searchAriaLabel="Search tickets"
          onSearchChange={onSearchChange}
          chips={[
            {
              key: "unresolved",
              label: "Unresolved only",
              selected: unresolved,
              color: "warning",
              onClick: onToggleUnresolved,
              ariaLabel: "Toggle unresolved tickets only",
            },
            {
              key: "category-all",
              label: "All categories",
              selected: category === "all",
              color: "primary",
              onClick: () => onCategoryChange("all"),
            },
            ...categoryChips,
          ]}
          statusLabel="Status"
          statusValue={status}
          statusOptions={[
            { value: "all", label: "All" },
            { value: "open", label: "Open" },
            { value: "pending", label: "Pending" },
            { value: "closed", label: "Closed" },
          ]}
          onStatusChange={(value) => onStatusChange(value as "all" | "open" | "pending" | "closed")}
          sortValue={sort}
          sortOptions={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
          ]}
          onSortChange={(value) => onSortChange(value as "newest" | "oldest")}
          searchMinWidth={280}
          statusMinWidth={150}
          sortMinWidth={150}
        />
      </Stack>
    </>
  );
}
