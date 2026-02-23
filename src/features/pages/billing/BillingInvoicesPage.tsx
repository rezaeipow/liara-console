import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { Chip } from "@mui/material";
import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import ConsoleHeroCard from "@/shared/components/console/ConsoleHeroCard";
import BillingInvoicesContent from "./components/BillingInvoicesContent";
import BillingNavActions from "./components/BillingNavActions";
import { useBillingInvoicesState } from "./useBillingInvoicesState";

export default function BillingInvoicesPage() {
  const state = useBillingInvoicesState();

  return (
    <>
      <ConsoleContentContainer spacing={2.2} aria-busy={state.isRouteLoading}>
        <ConsoleHeroCard
          title="Invoices"
          description="Review billing documents and download mock PDFs."
          icon={<ReceiptLongOutlinedIcon fontSize="small" />}
          actions={<BillingNavActions active="invoices" />}
        >
          <Chip
            variant="outlined"
            color={state.unpaidCount > 0 ? "warning" : "success"}
            label={state.unpaidCount > 0 ? `${state.unpaidCount} unpaid invoices` : "All invoices are paid"}
            sx={{ alignSelf: "flex-start", mt: 1 }}
          />
        </ConsoleHeroCard>

        <BillingInvoicesContent state={state} />
      </ConsoleContentContainer>

      <FeedbackSnackbar
        open={Boolean(state.notice)}
        autoHideDuration={3000}
        severity={state.notice?.severity ?? "success"}
        message={state.notice?.message}
        statusCode={state.notice?.status}
        hint={state.notice?.hint}
        onClose={() => state.setNotice(null)}
      />
    </>
  );
}
