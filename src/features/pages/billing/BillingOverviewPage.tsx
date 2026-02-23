import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useLoaderData } from "react-router-dom";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import ConsoleHeroCard from "@/shared/components/console/ConsoleHeroCard";
import { useRouteLoading } from "@/shared/hooks/useRouteLoading";
import BillingNavActions from "./components/BillingNavActions";
import BillingOverviewStats from "./components/BillingOverviewStats";
import BillingRecentPaymentsCard from "./components/BillingRecentPaymentsCard";
import type { BillingOverviewLoaderData } from "./billingData";
import { useBillingOverviewDerived } from "./useBillingOverview";

export default function BillingOverviewPage() {
  const data = useLoaderData() as BillingOverviewLoaderData;
  const isRouteLoading = useRouteLoading("/console/billing");
  const {
    successfulCount,
    totalTopup,
    totalInvoices,
    unpaidInvoicesCount,
    recentPayments,
  } = useBillingOverviewDerived(data);

  return (
    <ConsoleContentContainer spacing={2.2} aria-busy={isRouteLoading}>
      <ConsoleHeroCard
        title="Billing Center"
        description="Monitor credit, payments, and invoices in one place."
        icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />}
        loading={isRouteLoading}
        actions={<BillingNavActions active="overview" />}
      />
      <BillingOverviewStats
        credit={data.credit}
        totalTopup={totalTopup}
        successfulCount={successfulCount}
        totalInvoices={totalInvoices}
        invoicesCount={data.invoices.length}
        unpaidInvoicesCount={unpaidInvoicesCount}
      />
      <BillingRecentPaymentsCard
        isRouteLoading={isRouteLoading}
        payments={recentPayments}
      />
    </ConsoleContentContainer>
  );
}
