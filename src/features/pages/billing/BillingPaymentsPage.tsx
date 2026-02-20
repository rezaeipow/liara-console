import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import {
  Alert,
  Box,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import type { BillingPaymentsLoaderData } from "./billingData";
import { formatDateTime, formatIrr } from "./billingFormat";

export default function BillingPaymentsPage() {
  const { items } = useLoaderData() as BillingPaymentsLoaderData;
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get("status") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";

  const summary = useMemo(() => {
    const successCount = items.filter((item) => item.status === "success").length;
    const failedCount = items.filter((item) => item.status === "failed").length;
    const totalSuccessAmount = items
      .filter((item) => item.status === "success")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      successCount,
      failedCount,
      totalSuccessAmount,
    };
  }, [items]);

  const updateParam = (key: string, value: string, defaultValue: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === defaultValue) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <Stack
      spacing={2.2}
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
        <Stack spacing={1.1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PaymentsOutlinedIcon fontSize="small" />
            <Typography variant="h5" fontWeight={800}>
              Payment History
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Monitor every top-up transaction with status, amount, and timeline.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1,
            }}
          >
            <SummaryCard label="Transactions" value={String(items.length)} />
            <SummaryCard label="Successful" value={String(summary.successCount)} tone="success" />
            <SummaryCard label="Successful Total" value={formatIrr(summary.totalSuccessAmount)} tone="primary" />
          </Box>
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
        <Stack spacing={1.4}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip
                label="All"
                clickable
                color={status === "all" ? "primary" : "default"}
                variant={status === "all" ? "filled" : "outlined"}
                onClick={() => updateParam("status", "all", "all")}
              />
              <Chip
                label="Success"
                clickable
                color={status === "success" ? "success" : "default"}
                variant={status === "success" ? "filled" : "outlined"}
                onClick={() => updateParam("status", "success", "all")}
              />
              <Chip
                label="Failed"
                clickable
                color={status === "failed" ? "error" : "default"}
                variant={status === "failed" ? "filled" : "outlined"}
                onClick={() => updateParam("status", "failed", "all")}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                select
                size="small"
                label="Status"
                value={status}
                onChange={(event) => updateParam("status", event.target.value, "all")}
                sx={{ minWidth: { xs: "100%", sm: 150 } }}
                slotProps={{ htmlInput: { "aria-label": "Payment status filter" } }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                label="Sort"
                value={sort}
                onChange={(event) => updateParam("sort", event.target.value, "newest")}
                sx={{ minWidth: { xs: "100%", sm: 170 } }}
                slotProps={{ htmlInput: { "aria-label": "Payment sort" } }}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="oldest">Oldest</MenuItem>
                <MenuItem value="amount">Highest amount</MenuItem>
              </TextField>
            </Stack>
          </Stack>

          {items.length === 0 ? (
            <Alert severity="info">No payments match the current filters.</Alert>
          ) : (
            <>
              <Box sx={{ display: { xs: "block", lg: "none" } }}>
                <Stack spacing={1}>
                  {items.map((payment) => (
                    <Paper
                      key={payment.id}
                      variant="outlined"
                      sx={{
                        p: 1.25,
                        borderRadius: 1.4,
                        borderColor: alpha("#0f172a", 0.12),
                        backgroundColor: alpha("#ffffff", 0.6),
                      }}
                    >
                      <Stack spacing={0.8}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                          <Typography fontWeight={700}>{formatIrr(payment.amount)}</Typography>
                          <Chip
                            size="small"
                            icon={
                              payment.status === "success" ? (
                                <CheckCircleOutlineIcon />
                              ) : (
                                <ErrorOutlineIcon />
                              )
                            }
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
              </Box>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  display: { xs: "none", lg: "block" },
                  borderRadius: 1.6,
                  borderColor: alpha("#0f172a", 0.12),
                  backgroundColor: alpha("#ffffff", 0.66),
                }}
              >
                <Table size="small" aria-label="Payments table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((payment) => (
                      <TableRow key={payment.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{formatIrr(payment.amount)}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            icon={
                              payment.status === "success" ? (
                                <CheckCircleOutlineIcon />
                              ) : (
                                <ErrorOutlineIcon />
                              )
                            }
                            color={payment.status === "success" ? "success" : "error"}
                            variant="outlined"
                            label={payment.status === "success" ? "Success" : "Failed"}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: "text.secondary" }}>
                          {formatDateTime(payment.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {summary.failedCount > 0 ? (
            <Alert severity="warning">
              {summary.failedCount} failed payment(s) detected. Review retry behavior or input validation.
            </Alert>
          ) : null}
        </Stack>
      </Paper>
    </Stack>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  tone?: "default" | "primary" | "success";
};

function SummaryCard({ label, value, tone = "default" }: SummaryCardProps) {
  const color =
    tone === "success" ? "#16a34a" : tone === "primary" ? "#2563eb" : "#475569";

  return (
    <Paper
      variant="outlined"
      sx={{
        px: 1.2,
        py: 1,
        borderRadius: 1.3,
        borderColor: alpha(color, 0.25),
        backgroundColor: alpha("#ffffff", 0.58),
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={800} sx={{ mt: 0.3 }}>
        {value}
      </Typography>
    </Paper>
  );
}
