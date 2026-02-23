import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import TicketDetailConversationCard from "./components/TicketDetailConversationCard";
import TicketDetailHero from "./components/TicketDetailHero";
import TicketDetailReplyFormCard from "./components/TicketDetailReplyFormCard";
import { useTicketDetailPageState } from "./useTicketDetailPageState";

export default function TicketDetailPage() {
  const state = useTicketDetailPageState();

  return (
    <>
      <ConsoleContentContainer
        spacing={state.isCompact ? 1.2 : 2.2}
        aria-busy={state.isRouteLoading}
        maxWidth={{ xs: "100%", sm: 900, lg: 1040 }}
      >
        <TicketDetailHero ticket={state.ticket} isCompact={state.isCompact} />

        <TicketDetailConversationCard
          messages={state.messages}
          pendingReply={state.pendingReply}
          tableDensity={state.tableDensity}
          isRouteLoading={state.isRouteLoading}
          isCompact={state.isCompact}
        />

        <TicketDetailReplyFormCard
          actionData={state.actionData}
          replyBody={state.replyBody}
          isSubmitting={state.isSubmitting}
          isCompact={state.isCompact}
          actionButtonSize={state.actionButtonSize}
          onReplyBodyChange={state.onReplyBodyChange}
        />
      </ConsoleContentContainer>

      <FeedbackSnackbar
        open={state.feedbackOpen}
        autoHideDuration={3200}
        severity={state.feedbackSeverity}
        message={state.feedbackMessage}
        onClose={state.onFeedbackClose}
      />
    </>
  );
}
