import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import EmptyStateAlert from "@/shared/components/common/EmptyStateAlert";
import type { BillingRecentPaymentsCardProps } from "@/shared/types/billingComponents";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import BillingRecentPaymentRow from "./BillingRecentPaymentRow";

export default function BillingRecentPaymentsCard({
  isRouteLoading,
  payments,
}: BillingRecentPaymentsCardProps) {
  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: { xs: 1.5, sm: 2 },
        border: (theme) =>
          `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.86)}, ${alpha(theme.palette.common.white, 0.74)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.2 }}
      >
        <Typography fontWeight={800}>Recent Payments</Typography>
        <Button
          component={Link}
          to="/console/billing/payments"
          size="small"
          variant="text"
          endIcon={<ArrowOutwardIcon fontSize="small" />}
          aria-label="Open all billing payments"
        >
          Open all
        </Button>
      </Stack>
      {isRouteLoading ? (
        <Stack spacing={0.9}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={`billing-overview-loading-${index}`}
              variant="rounded"
              height={48}
            />
          ))}
        </Stack>
      ) : payments.length === 0 ? (
        <EmptyStateAlert>
          No payments found. Create your first top-up to see payment history.
        </EmptyStateAlert>
      ) : (
        <Stack spacing={0.9} role="list" aria-label="Recent billing payments">
          {payments.map((payment) => (
            <BillingRecentPaymentRow key={payment.id} payment={payment} />
          ))}
        </Stack>
      )}
    </Paper>
  );
}
