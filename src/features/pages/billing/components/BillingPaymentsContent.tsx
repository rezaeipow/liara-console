import { Alert, Box, LinearProgress, Paper, Skeleton, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ClearFiltersEmptyState from "@/shared/components/common/ClearFiltersEmptyState";
import StatusSortFilterBar from "@/shared/components/common/StatusSortFilterBar";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import BillingPaymentsMobileList from "./BillingPaymentsMobileList";
import BillingPaymentsTable from "./BillingPaymentsTable";
import type { BillingPaymentsContentProps } from "../types";

export default function BillingPaymentsContent(props: BillingPaymentsContentProps) {
  const { state } = props;

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      {state.isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
      <Stack spacing={1.4}>
        <StatusSortFilterBar
          chips={[
            { key: "all", label: "All", selected: state.status === "all", color: "primary", onClick: () => state.setStatus("all"), ariaLabel: "Show all payments" },
            { key: "success", label: "Success", selected: state.status === "success", color: "success", onClick: () => state.setStatus("success"), ariaLabel: "Filter successful payments" },
            { key: "failed", label: "Failed", selected: state.status === "failed", color: "error", onClick: () => state.setStatus("failed"), ariaLabel: "Filter failed payments" },
          ]}
          statusValue={state.status}
          onStatusChange={(value) => state.setStatus(value as "all" | "success" | "failed")}
          statusOptions={[{ value: "all", label: "All" }, { value: "success", label: "Success" }, { value: "failed", label: "Failed" }]}
          statusAriaLabel="Payment status filter"
          sortValue={state.sort}
          onSortChange={(value) => state.setSort(value as "newest" | "oldest" | "amount")}
          sortOptions={[{ value: "newest", label: "Newest" }, { value: "oldest", label: "Oldest" }, { value: "amount", label: "Highest amount" }]}
          sortAriaLabel="Payment sort"
        />

        {state.isRouteLoading ? (
          <Stack spacing={1}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`payment-loading-${index}`} variant="rounded" height={52} />
            ))}
          </Stack>
        ) : state.items.length === 0 ? (
          <ClearFiltersEmptyState onClear={() => { state.setStatus("all"); state.setSort("newest"); }}>
            No payments match the current filters.
          </ClearFiltersEmptyState>
        ) : (
          <>
            <Box sx={{ display: { xs: "block", lg: "none" } }}>
              <BillingPaymentsMobileList items={state.items} densityLayout={state.densityLayout} />
            </Box>
            <BillingPaymentsTable items={state.items} />
          </>
        )}

        {state.summary.failedCount > 0 ? (
          <Alert severity="warning">
            {state.summary.failedCount} failed payment(s) detected. Review retry behavior or input validation.
          </Alert>
        ) : null}
      </Stack>
    </Paper>
  );
}
