import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";
import { Link, useLoaderData, useNavigation } from "react-router-dom";
import { glassBackdrop } from "../../../shared/ui/glassTokens";
import type { BillingOverviewLoaderData } from "./billingData";
import { formatDateTime, formatIrr } from "./billingFormat";

export default function BillingOverviewPage() {
  const { credit, payments, invoices } = useLoaderData() as BillingOverviewLoaderData;
  const navigation = useNavigation();
  const isRouteLoading =
    navigation.state === "loading" &&
    (navigation.location?.pathname ?? "").startsWith("/console/billing");
  const successfulPayments = payments.filter((item) => item.status === "success");
  const totalTopup = successfulPayments.reduce((sum, item) => sum + item.amount, 0);
  const unpaidInvoices = invoices.filter((item) => item.status === "unpaid");
  const totalInvoices = invoices.reduce((sum, item) => sum + item.amount, 0);
  const recentPayments = payments.slice(0, 4);

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
        {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={1.5}
        >
          <Stack spacing={0.6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccountBalanceWalletOutlinedIcon fontSize="small" />
              <Typography variant="h5" fontWeight={800}>
                Billing Center
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Monitor credit, payments, and invoices in one place.
            </Typography>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", md: "auto" } }}>
            <Button component={Link} to="/console/billing" variant="contained">
              Overview
            </Button>
            <Button component={Link} to="/console/billing/topup" variant="outlined" startIcon={<CreditCardOutlinedIcon />}>
              Top up
            </Button>
            <Button
              component={Link}
              to="/console/billing/payments"
              variant="outlined"
              endIcon={<ArrowOutwardIcon />}
              aria-label="View full payment history"
            >
              Payments
            </Button>
            <Button
              component={Link}
              to="/console/billing/invoices"
              variant="outlined"
              endIcon={<ArrowOutwardIcon />}
              aria-label="View full invoices list"
            >
              Invoices
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        <GlassStatCard
          title="Available Credit"
          value={formatIrr(credit)}
          hint="Current usable balance"
          icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />}
        />
        <GlassStatCard
          title="Total Top-ups"
          value={formatIrr(totalTopup)}
          hint={`${successfulPayments.length} successful payments`}
          icon={<TrendingUpOutlinedIcon fontSize="small" />}
        />
        <GlassStatCard
          title="Invoices Total"
          value={formatIrr(totalInvoices)}
          hint={`${invoices.length} issued invoices`}
          icon={<ReceiptLongOutlinedIcon fontSize="small" />}
        />
        <GlassStatCard
          title="Unpaid Invoices"
          value={String(unpaidInvoices.length)}
          hint={unpaidInvoices.length > 0 ? "Action recommended" : "All invoices are paid"}
          icon={<ReceiptLongOutlinedIcon fontSize="small" />}
        />
      </Box>

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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.2 }}>
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
              <Skeleton key={`billing-overview-loading-${index}`} variant="rounded" height={48} />
            ))}
          </Stack>
        ) : recentPayments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No payments found. Create your first top-up to see payment history.
          </Typography>
        ) : (
          <Stack spacing={0.9} role="list" aria-label="Recent billing payments">
            {recentPayments.map((payment) => (
              <Stack
                key={payment.id}
                role="listitem"
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={0.6}
                sx={{
                  p: 1.1,
                  borderRadius: 1.2,
                  border: (theme) => `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.52),
                }}
              >
                <Stack spacing={0.2}>
                  <Typography variant="body2" fontWeight={700}>
                    {formatIrr(payment.amount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(payment.createdAt)}
                  </Typography>
                </Stack>
                <Chip
                  size="small"
                  label={payment.status === "success" ? "Success" : "Failed"}
                  color={payment.status === "success" ? "success" : "error"}
                  variant="outlined"
                />
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}

type GlassStatCardProps = {
  title: string;
  value: string;
  hint: string;
  icon: ReactNode;
};

function GlassStatCard({ title, value, hint, icon }: GlassStatCardProps) {
  return (
    <Paper
      variant="outlined"
      role="group"
      aria-label={`${title}: ${value}`}
      sx={{
        p: 1.65,
        borderRadius: 1.5,
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.24),
        background: (theme) =>
          `linear-gradient(165deg, ${alpha(theme.palette.common.white, 0.9)}, ${alpha(theme.palette.common.white, 0.78)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      <Stack spacing={0.8}>
        <Stack direction="row" spacing={0.8} alignItems="center">
          {icon}
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Stack>
        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      </Stack>
    </Paper>
  );
}

