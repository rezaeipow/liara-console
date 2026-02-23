import { Chip, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import { formatDateTime, formatIrr } from "../billingFormat";
import type { BillingTopupRecentPaymentsCardProps } from "../types";

export default function BillingTopupRecentPaymentsCard(props: BillingTopupRecentPaymentsCardProps) {
  const { recentPayments, isRouteLoading } = props;

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.86)}, ${alpha(theme.palette.common.white, 0.74)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      <Stack spacing={1.2}>
        <Typography fontWeight={800}>Recent Payments</Typography>
        {isRouteLoading ? (
          <Stack spacing={1} role="list" aria-label="Recent top-up payments">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={`topup-loading-${index}`} variant="rounded" height={52} />
            ))}
          </Stack>
        ) : recentPayments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            You do not have recent payments yet.
          </Typography>
        ) : (
          <Stack spacing={1} role="list" aria-label="Recent top-up payments">
            {recentPayments.map((payment) => (
              <Stack
                key={payment.id}
                role="listitem"
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
                sx={{
                  p: 1,
                  borderRadius: 1.2,
                  border: (theme) => `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.56),
                }}
              >
                <Stack spacing={0.15}>
                  <Typography variant="body2" fontWeight={700}>
                    {formatIrr(payment.amount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(payment.createdAt)}
                  </Typography>
                </Stack>
                <Chip
                  size="small"
                  color={payment.status === "success" ? "success" : "error"}
                  variant="outlined"
                  label={payment.status === "success" ? "Success" : "Failed"}
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
