import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { Box } from "@mui/material";
import ConsoleStatCard from "@/shared/components/console/ConsoleStatCard";
import type { BillingOverviewStatsProps } from "@/shared/types/billingComponents";
import { formatIrr } from "../billingFormat";

export default function BillingOverviewStats(props: BillingOverviewStatsProps) {
  const { credit, totalTopup, successfulCount, totalInvoices, invoicesCount, unpaidInvoicesCount } = props;
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" }, gap: 1.5 }}>
      <ConsoleStatCard label="Available Credit" value={formatIrr(credit)} hint="Current usable balance" icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />} />
      <ConsoleStatCard label="Total Top-ups" value={formatIrr(totalTopup)} hint={`${successfulCount} successful payments`} icon={<TrendingUpOutlinedIcon fontSize="small" />} tone="success" />
      <ConsoleStatCard label="Invoices Total" value={formatIrr(totalInvoices)} hint={`${invoicesCount} issued invoices`} icon={<ReceiptLongOutlinedIcon fontSize="small" />} />
      <ConsoleStatCard label="Unpaid Invoices" value={String(unpaidInvoicesCount)} hint={unpaidInvoicesCount > 0 ? "Action recommended" : "All invoices are paid"} icon={<ReceiptLongOutlinedIcon fontSize="small" />} tone={unpaidInvoicesCount > 0 ? "warning" : "success"} />
    </Box>
  );
}
