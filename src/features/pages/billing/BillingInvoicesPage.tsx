import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  Snackbar,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { useLoaderData, useNavigation, useSearchParams } from "react-router-dom";
import { BillingAPI } from "../../../api/billingApi";
import { ApiError } from "../../../api/httpClient";
import type { BillingInvoicesLoaderData } from "./billingData";
import { formatDateTime, formatIrr } from "./billingFormat";

type InvoiceNotice = {
  message: string;
  severity: "success" | "error";
  hint?: string;
  status?: number;
};

function getStatusHint(status: number): string {
  if (status === 401) return "Please login again and retry.";
  if (status === 403) return "You do not have permission to download this invoice.";
  if (status === 404) return "Invoice file was not found. Try refreshing the list.";
  if (status >= 500) return "Server error occurred. Please retry in a few moments.";
  return "Please retry.";
}

export default function BillingInvoicesPage() {
  const { items } = useLoaderData() as BillingInvoicesLoaderData;
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notice, setNotice] = useState<InvoiceNotice | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const isRouteLoading =
    navigation.state === "loading" &&
    (navigation.location?.pathname ?? "").startsWith("/console/billing/invoices");

  const status = searchParams.get("status") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";

  const unpaidCount = useMemo(
    () => items.filter((item) => item.status === "unpaid").length,
    [items],
  );

  const updateParam = (key: string, value: string, defaultValue: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === defaultValue) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const handleDownload = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    try {
      const payload = await BillingAPI.downloadInvoice(invoiceId);
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

  return (
    <>
    <Stack
      spacing={2.2}
      aria-busy={isRouteLoading}
      sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 980, lg: 1080 },
          mx: { xs: 0, sm: "auto" },
          mt: { xs: 1.25, sm: 1.5 },
          px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: "1px solid rgba(31,111,235,0.24)",
            background:
              "linear-gradient(120deg, rgba(31,111,235,0.16), rgba(14,165,164,0.10))",
            backdropFilter: "blur(14px)",
          }}
        >
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ReceiptLongOutlinedIcon fontSize="small" />
              <Typography variant="h5" fontWeight={800}>Invoices</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Review billing documents and download mock PDFs.
            </Typography>
            <Chip
              variant="outlined"
              color={unpaidCount > 0 ? "warning" : "success"}
              label={unpaidCount > 0 ? `${unpaidCount} unpaid invoices` : "All invoices are paid"}
              sx={{ alignSelf: "flex-start" }}
            />
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: { xs: 1.5, sm: 2 },
            border: `1px solid ${alpha("#1f6feb", 0.18)}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.74), rgba(255,255,255,0.56))",
            backdropFilter: "blur(10px)",
          }}
        >
          {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
          <Stack spacing={1.3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <Typography fontWeight={800}>Invoice List</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  select
                  size="small"
                  label="Status"
                  value={status}
                  onChange={(event) => updateParam("status", event.target.value, "all")}
                  sx={{ minWidth: { xs: "100%", sm: 150 } }}
                  slotProps={{ htmlInput: { "aria-label": "Invoice status filter" } }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                </TextField>
                <TextField
                  select
                  size="small"
                  label="Sort"
                  value={sort}
                  onChange={(event) => updateParam("sort", event.target.value, "newest")}
                  sx={{ minWidth: { xs: "100%", sm: 150 } }}
                  slotProps={{ htmlInput: { "aria-label": "Invoice sort" } }}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="amount">Highest amount</MenuItem>
                </TextField>
              </Stack>
            </Stack>

            {isRouteLoading ? (
              <Stack spacing={1}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={`invoice-loading-${index}`} variant="rounded" height={64} />
                ))}
              </Stack>
            ) : items.length === 0 ? (
              <Alert severity="info">No invoices match current filters.</Alert>
            ) : (
              <Box
                role="list"
                aria-label="Invoices list"
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
                  gap: 1,
                }}
              >
                {items.map((invoice) => (
                  <Paper
                    key={invoice.id}
                    role="listitem"
                    variant="outlined"
                    sx={{
                      p: 1.25,
                      borderRadius: 1.4,
                      borderColor: alpha("#0f172a", 0.12),
                      backgroundColor: alpha("#ffffff", 0.62),
                    }}
                  >
                    <Stack spacing={0.8}>
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
                        onClick={() => {
                          void handleDownload(invoice.id);
                        }}
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
            )}
          </Stack>
        </Paper>
      </Stack>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notice?.severity ?? "success"}
          variant="filled"
          onClose={() => setNotice(null)}
          aria-live="assertive"
        >
          <Stack spacing={0.25}>
            <Typography variant="body2">{notice?.message}</Typography>
            {notice?.status ? (
              <Typography variant="caption">Error code: {notice.status}</Typography>
            ) : null}
            {notice?.hint ? <Typography variant="caption">{notice.hint}</Typography> : null}
          </Stack>
        </Alert>
      </Snackbar>
    </>
  );
}
