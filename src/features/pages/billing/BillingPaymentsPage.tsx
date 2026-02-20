import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Alert,
  Box,
  Chip,
  MenuItem,
  Paper,
  Stack,
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

  const totalSuccessAmount = useMemo(
    () => items.filter((item) => item.status === "success").reduce((sum, item) => sum + item.amount, 0),
    [items],
  );

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
        <Stack spacing={1}>
          <Typography variant="h5" fontWeight={800}>Payment History</Typography>
          <Typography variant="body2" color="text.secondary">
            Track all payment attempts with status and timestamps.
          </Typography>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <Chip label={`${items.length} payments`} />
            <Chip color="success" variant="outlined" label={`Successful total: ${formatIrr(totalSuccessAmount)}`} />
          </Stack>
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
        <Stack spacing={1.3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Typography fontWeight={800}>Transactions</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                select
                size="small"
                label="Status"
                value={status}
                onChange={(event) => updateParam("status", event.target.value, "all")}
                sx={{ minWidth: { xs: "100%", sm: 150 } }}
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
                sx={{ minWidth: { xs: "100%", sm: 150 } }}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="oldest">Oldest</MenuItem>
                <MenuItem value="amount">Highest amount</MenuItem>
              </TextField>
            </Stack>
          </Stack>

          {items.length === 0 ? (
            <Alert severity="info">No payments match current filters.</Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
                gap: 1,
              }}
            >
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
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Stack spacing={0.25}>
                      <Typography fontWeight={700}>{formatIrr(payment.amount)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(payment.createdAt)}
                      </Typography>
                    </Stack>
                    <Chip
                      size="small"
                      icon={payment.status === "success" ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
                      color={payment.status === "success" ? "success" : "error"}
                      variant="outlined"
                      label={payment.status === "success" ? "Success" : "Failed"}
                    />
                  </Stack>
                </Paper>
              ))}
            </Box>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
