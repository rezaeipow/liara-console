import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import ResourceActionConfirmDialog from "@/shared/components/common/ResourceActionConfirmDialog";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import NewTicketFormCard from "./components/NewTicketFormCard";
import NewTicketHero from "./components/NewTicketHero";
import { useNewTicketPageState } from "./useNewTicketPageState";

export default function NewTicketPage() {
  const state = useNewTicketPageState();

  return (
    <>
      <ConsoleContentContainer
        spacing={state.isCompact ? 1.2 : 2.2}
        aria-busy={state.isRouteLoading}
        maxWidth={{ xs: "100%", sm: 860, lg: 980 }}
      >
        <NewTicketHero
          isCompact={state.isCompact}
          actionButtonSize={state.actionButtonSize}
          onOpenDiscardDialog={state.onOpenDiscardDialog}
        />

        <NewTicketFormCard
          categories={state.categoryOptions}
          actionData={state.actionData}
          hasError={state.hasError}
          subject={state.subject}
          category={state.category}
          body={state.body}
          isSubmitting={state.isSubmitting}
          isRouteLoading={state.isRouteLoading}
          isCompact={state.isCompact}
          actionButtonSize={state.actionButtonSize}
          onSubjectChange={state.onSubjectChange}
          onCategoryChange={state.onCategoryChange}
          onBodyChange={state.onBodyChange}
        />
      </ConsoleContentContainer>

      <FeedbackSnackbar
        open={state.feedbackOpen}
        autoHideDuration={3000}
        severity={state.feedbackSeverity}
        message={state.feedbackMessage}
        onClose={state.onFeedbackClose}
      />

      <ResourceActionConfirmDialog
        open={state.discardConfirmOpen}
        onClose={state.onCloseDiscardDialog}
        onConfirm={state.onConfirmDiscard}
        title="Discard draft?"
        message="Subject, category, and description draft data will be cleared."
        confirmLabel="Discard"
        confirmColor="error"
      />
    </>
  );
}
