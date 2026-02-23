import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import ConsoleHeroCard from "@/shared/components/console/ConsoleHeroCard";
import BillingNavActions from "./components/BillingNavActions";
import BillingPaymentsContent from "./components/BillingPaymentsContent";
import BillingPaymentsSummary from "./components/BillingPaymentsSummary";
import { useBillingPaymentsState } from "./useBillingPaymentsState";

export default function BillingPaymentsPage() {
  const state = useBillingPaymentsState();

  return (
    <ConsoleContentContainer spacing={2.2} aria-busy={state.isRouteLoading}>
      <ConsoleHeroCard
        title="Payment History"
        description="Monitor every top-up transaction with status, amount, and timeline."
        icon={<PaymentsOutlinedIcon fontSize="small" />}
        actions={<BillingNavActions active="payments" />}
      >
        <BillingPaymentsSummary
          itemsCount={state.items.length}
          summary={state.summary}
          tableDensity={state.tableDensity}
        />
      </ConsoleHeroCard>

      <BillingPaymentsContent state={state} />
    </ConsoleContentContainer>
  );
}
