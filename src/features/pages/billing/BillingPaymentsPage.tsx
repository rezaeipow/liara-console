import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  Skeleton,
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
import { Link, useLoaderData, useNavigation, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../app/store/hooks";
import { selectTableDensity } from "../../../app/store/slices/uiSlice";
import { glassBackdrop } from "../../../shared/ui/glassTokens";
import type { BillingPaymentsLoaderData } from "./billingData";
import { formatDateTime, formatIrr } from "./billingFormat";

export default function BillingPaymentsPage() {
  const { items } = useLoaderData() as BillingPaymentsLoaderData;
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tableDensity = useAppSelector(selectTableDensity);
  const listSpacing = tableDensity === "comfortable" ? 1.6 : tableDensity === "compact" ? 0.8 : 1;
  const itemPaddingX = tableDensity === "comfortable" ? 2 : tableDensity === "compact" ? 1 : 1.25;
  const itemPaddingY = tableDensity === "comfortable" ? 2 : tableDensity === "compact" ? 1 : 1.25;
  const itemInnerSpacing =
    tableDensity === "comfortable" ? 1.25 : tableDensity === "compact" ? 0.625 : 0.8;
  const isRouteLoading =
    navigation.state === "loading" &&
    (navigation.location?.pathname ?? "").startsWith("/console/billing/payments");

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
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.32)}`,
          background: (theme) =>
            `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.14)})`,
          backdropFilter: glassBackdrop.hero,
        }}
      >
        <Stack spacing={1.1}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PaymentsOutlinedIcon fontSize="small" />
                <Typography variant="h5" fontWeight={800}>
                  Payment History
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Monitor every top-up transaction with status, amount, and timeline.
              </Typography>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", md: "auto" } }}>
              <Button component={Link} to="/console/billing" variant="outlined">
                Overview
              </Button>
              <Button component={Link} to="/console/billing/topup" variant="outlined">
                Top up
              </Button>
              <Button component={Link} to="/console/billing/payments" variant="contained">
                Payments
              </Button>
              <Button component={Link} to="/console/billing/invoices" variant="outlined">
                Invoices
              </Button>
            </Stack>
          </Stack>

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
            <SummaryCard label="Transactions" value={String(items.length)} density={tableDensity} />
            <SummaryCard
              label="Successful"
              value={String(summary.successCount)}
              tone="success"
              density={tableDensity}
            />
            <SummaryCard
              label="Successful Total"
              value={formatIrr(summary.totalSuccessAmount)}
              tone="primary"
              density={tableDensity}
            />
          </Box>
        </Stack>
      </Paper>

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
        {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
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
                aria-label="Show all payments"
              />
              <Chip
                label="Success"
                clickable
                color={status === "success" ? "success" : "default"}
                variant={status === "success" ? "filled" : "outlined"}
                onClick={() => updateParam("status", "success", "all")}
                aria-label="Filter successful payments"
              />
              <Chip
                label="Failed"
                clickable
                color={status === "failed" ? "error" : "default"}
                variant={status === "failed" ? "filled" : "outlined"}
                onClick={() => updateParam("status", "failed", "all")}
                aria-label="Filter failed payments"
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

          {isRouteLoading ? (
            <Stack spacing={1}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`payment-loading-${index}`} variant="rounded" height={52} />
              ))}
            </Stack>
          ) : items.length === 0 ? (
            <Alert severity="info">No payments match the current filters.</Alert>
          ) : (
            <>
              <Box sx={{ display: { xs: "block", lg: "none" } }}>
                <Stack spacing={listSpacing} role="list" aria-label="Payments list">
                  {items.map((payment) => (
                    <Paper
                      key={payment.id}
                      role="listitem"
                      variant="outlined"
                      sx={{
                        px: itemPaddingX,
                        py: itemPaddingY,
                        borderRadius: 1.4,
                        borderColor: (theme) => alpha(theme.palette.text.primary, 0.12),
                        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.6),
                      }}
                    >
                      <Stack spacing={itemInnerSpacing}>
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
                  borderColor: (theme) => alpha(theme.palette.text.primary, 0.12),
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.66),
                }}
              >
                <Table size="medium" aria-label="Payments table">
                  <caption style={{ textAlign: "left", padding: "8px 16px" }}>
                    Billing payments with amount, status, and creation time
                  </caption>
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
  density: "compact" | "standard" | "comfortable";
};

function SummaryCard({ label, value, tone = "default", density }: SummaryCardProps) {
  const paddingX = density === "comfortable" ? 1.6 : density === "compact" ? 0.8 : 1.2;
  const paddingY = density === "comfortable" ? 1.6 : density === "compact" ? 0.8 : 1;

  return (
    <Paper
      variant="outlined"
      role="status"
      aria-live="polite"
      aria-label={`${label}: ${value}`}
      sx={{
        px: paddingX,
        py: paddingY,
        borderRadius: 1.3,
        borderColor: (theme) => {
          const base =
            tone === "success"
              ? theme.palette.success.main
              : tone === "primary"
                ? theme.palette.primary.main
                : theme.palette.text.secondary;
          return alpha(base, 0.25);
        },
        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.82),
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

