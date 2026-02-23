import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { formatDateTime, formatIrr } from "../billingFormat";
import type { BillingPaymentsMobileListProps } from "../types";

export default function BillingPaymentsMobileList(props: BillingPaymentsMobileListProps) {
  const { items, densityLayout } = props;

  return (
    <Stack spacing={densityLayout.listSpacing} role="list" aria-label="Payments list">
      {items.map((payment) => (
        <Paper
          key={payment.id}
          role="listitem"
          variant="outlined"
          sx={{
            px: densityLayout.itemPaddingX,
            py: densityLayout.itemPaddingY,
            borderRadius: 1.4,
            borderColor: (theme) => alpha(theme.palette.text.primary, 0.12),
            backgroundColor: (theme) => alpha(theme.palette.common.white, 0.6),
          }}
        >
          <Stack spacing={densityLayout.itemInnerSpacing}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Typography fontWeight={700}>{formatIrr(payment.amount)}</Typography>
              <Chip
                size="small"
                icon={payment.status === "success" ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
                color={payment.status === "success" ? "success" : "error"}
                variant="outlined"
                label={payment.status === "success" ? "Success" : "Failed"}
              />
            </Stack>
            <Stack direction="row" spacing={0.7} alignItems="center">
              <TimelineOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(payment.createdAt)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
