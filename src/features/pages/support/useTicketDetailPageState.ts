import { useMemo, useState } from "react";
import { useActionData, useLoaderData, useNavigation } from "react-router-dom";
import { useActionFeedbackSnackbar } from "@/shared/hooks/useActionFeedbackSnackbar";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { isRouteLoadingByPrefix } from "@/shared/hooks/useRouteLoading";
import { useTableDensity } from "@/shared/hooks/useTableDensity";
import type { TicketActionData, TicketDetailLoaderData } from "./supportData";
import type { TicketDetailState, TimelineMessage } from "./types";

export function useTicketDetailPageState(): TicketDetailState {
  const { ticket } = useLoaderData() as TicketDetailLoaderData;
  const actionData = useActionData() as TicketActionData | undefined;
  const navigation = useNavigation();
  const { getBooleanParam } = useQueryParams();
  const { tableDensity, isCompact } = useTableDensity();
  const [replyBody, setReplyBody] = useState("");

  const messages = useMemo<TimelineMessage[]>(() => {
    const base: TimelineMessage[] = [
      {
        id: `${ticket.id}-body`,
        label: "You",
        body: ticket.body,
        timestamp: ticket.createdAt,
        tone: "user",
      },
      ...ticket.replies.map((reply) => ({
        id: reply.id,
        label: reply.author === "support" ? "Support" : "You",
        body: reply.body,
        timestamp: reply.createdAt,
        tone: reply.author,
      })),
    ];

    return base.sort(
      (left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime(),
    );
  }, [ticket.body, ticket.createdAt, ticket.id, ticket.replies]);

  const createdNotice = getBooleanParam("created");
  const isSubmitting = navigation.state === "submitting";
  const isRouteLoading = isRouteLoadingByPrefix(navigation, `/console/support/tickets/${ticket.id}`);
  const pendingReply = isSubmitting && replyBody.trim().length > 0 ? replyBody.trim() : "";

  const feedback = useActionFeedbackSnackbar(actionData, {
    extraNotice: createdNotice ? { key: "created-ticket", message: "Ticket created successfully." } : null,
    fallbackMessage: "Reply sent successfully.",
  });

  return {
    ticket,
    actionData,
    isSubmitting,
    isRouteLoading,
    replyBody,
    pendingReply,
    messages,
    tableDensity,
    isCompact,
    actionButtonSize: isCompact ? "small" : "medium",
    createdNotice,
    feedbackOpen: feedback.open,
    feedbackSeverity: feedback.severity,
    feedbackMessage: feedback.message,
    onReplyBodyChange: setReplyBody,
    onFeedbackClose: feedback.close,
  };
}
