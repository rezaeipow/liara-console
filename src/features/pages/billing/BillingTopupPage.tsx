import { Box } from "@mui/material";
import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import BillingTopupFormCard from "./components/BillingTopupFormCard";
import BillingTopupHero from "./components/BillingTopupHero";
import BillingTopupRecentPaymentsCard from "./components/BillingTopupRecentPaymentsCard";
import { useBillingTopupState } from "./useBillingTopupState";

export default function BillingTopupPage() {
  const state = useBillingTopupState();

  return (
    <>
      <ConsoleContentContainer spacing={2.2} aria-busy={state.isRouteLoading}>
        <BillingTopupHero
          displayedCredit={state.displayedCredit}
          projectedCredit={state.projectedCredit}
          parsedAmount={state.parsedAmount}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "1.2fr 0.8fr",
              lg: "minmax(0, 1.5fr) minmax(0, 1fr)",
            },
            gap: 1.5,
          }}
        >
          <BillingTopupFormCard
            actionData={state.actionData}
            amountInput={state.amountInput}
            parsedAmount={state.parsedAmount}
            isSubmitting={state.isSubmitting}
            isRouteLoading={state.isRouteLoading}
            amountInvalid={state.amountInvalid}
            suggestions={state.suggestions}
            minimumTopup={state.minimumTopup}
            onAmountInputChange={state.onAmountInputChange}
            onSelectAmount={state.onSelectAmount}
          />
          <BillingTopupRecentPaymentsCard
            recentPayments={state.recentPayments}
            isRouteLoading={state.isRouteLoading}
          />
        </Box>
      </ConsoleContentContainer>

      <FeedbackSnackbar
        open={state.feedbackOpen}
        autoHideDuration={3000}
        severity={state.feedbackSeverity}
        message={state.feedbackMessage}
        onClose={state.onFeedbackClose}
      />
    </>
  );
}
