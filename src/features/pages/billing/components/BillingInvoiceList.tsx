import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { BillingInvoiceListProps } from "../types";
import { formatDateTime, formatIrr } from "../billingFormat";

export default function BillingInvoiceList(props: BillingInvoiceListProps) {
  const {
    items,
    downloadingId,
    gridColumnGap,
    gridRowGap,
    itemPaddingX,
    itemPaddingY,
    itemInnerSpacing,
    onDownload,
  } = props;

  return (
    <Box
      role="list"
      aria-label="Invoices list"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
        columnGap: gridColumnGap,
        rowGap: gridRowGap,
      }}
    >
      {items.map((invoice) => (
        <Paper
          key={invoice.id}
          role="listitem"
          variant="outlined"
          sx={{
            px: itemPaddingX,
            py: itemPaddingY,
            borderRadius: 1.4,
            borderColor: (theme) => alpha(theme.palette.text.primary, 0.12),
            backgroundColor: (theme) => alpha(theme.palette.common.white, 0.62),
          }}
        >
          <Stack spacing={itemInnerSpacing}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Stack spacing={0.2}>
                <Typography fontWeight={700}>{formatIrr(invoice.amount)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDateTime(invoice.createdAt)}
                </Typography>
              </Stack>
              <Chip
                size="small"
                color={invoice.status === "paid" ? "success" : "warning"}
                variant="outlined"
                label={invoice.status === "paid" ? "Paid" : "Unpaid"}
              />
            </Stack>
            <Button
              type="button"
              variant="outlined"
              size="small"
              startIcon={<DownloadOutlinedIcon fontSize="small" />}
              onClick={() => onDownload(invoice.id)}
              disabled={downloadingId === invoice.id}
              sx={{ alignSelf: "flex-start" }}
              aria-label={`Download invoice ${invoice.id}`}
            >
              {downloadingId === invoice.id ? "Preparing..." : "Download mock"}
            </Button>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
