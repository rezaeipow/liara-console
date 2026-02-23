import { Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { BillingRecentPaymentRowProps } from "@/shared/types/billingComponents";
import { formatDateTime, formatIrr } from "../billingFormat";

export default function BillingRecentPaymentRow({ payment }: BillingRecentPaymentRowProps) {
  return (
    <Stack role="listitem" direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={0.6} sx={{ p: 1.1, borderRadius: 1.2, border: (theme) => `1px solid ${alpha(theme.palette.text.primary, 0.1)}`, backgroundColor: (theme) => alpha(theme.palette.common.white, 0.52) }}>
      <Stack spacing={0.2}>
        <Typography variant="body2" fontWeight={700}>{formatIrr(payment.amount)}</Typography>
        <Typography variant="caption" color="text.secondary">{formatDateTime(payment.createdAt)}</Typography>
      </Stack>
      <Chip size="small" label={payment.status === "success" ? "Success" : "Failed"} color={payment.status === "success" ? "success" : "error"} variant="outlined" />
    </Stack>
  );
}
