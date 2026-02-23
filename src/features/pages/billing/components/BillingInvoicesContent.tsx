import { LinearProgress, Paper, Skeleton, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ClearFiltersEmptyState from "@/shared/components/common/ClearFiltersEmptyState";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import BillingInvoiceList from "./BillingInvoiceList";
import BillingInvoicesFilterBar from "./BillingInvoicesFilterBar";
import type { BillingInvoicesContentProps } from "../types";

export default function BillingInvoicesContent(props: BillingInvoicesContentProps) {
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
      <Stack spacing={1.3}>
        <BillingInvoicesFilterBar
          status={state.status}
          sort={state.sort}
          setStatus={state.setStatus}
          setSort={state.setSort}
        />

        {state.isRouteLoading ? (
          <Stack spacing={1}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`invoice-loading-${index}`} variant="rounded" height={64} />
            ))}
          </Stack>
        ) : state.items.length === 0 ? (
          <ClearFiltersEmptyState
            onClear={() => {
              state.setStatus("all");
              state.setSort("newest");
            }}
          >
            No invoices match current filters.
          </ClearFiltersEmptyState>
        ) : (
          <BillingInvoiceList
            items={state.items}
            downloadingId={state.downloadingId}
            gridColumnGap={state.densityLayout.gridColumnGap}
            gridRowGap={state.densityLayout.gridRowGap}
            itemPaddingX={state.densityLayout.itemPaddingX}
            itemPaddingY={state.densityLayout.itemPaddingY}
            itemInnerSpacing={state.densityLayout.itemInnerSpacing}
            onDownload={(invoiceId) => {
              void state.handleDownload(invoiceId);
            }}
          />
        )}
      </Stack>
    </Paper>
  );
}
