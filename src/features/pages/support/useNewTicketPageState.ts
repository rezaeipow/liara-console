import { useEffect, useMemo, useState } from "react";
import { useActionData, useLoaderData, useNavigation } from "react-router-dom";
import { useActionFeedbackSnackbar } from "@/shared/hooks/useActionFeedbackSnackbar";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import { isRouteLoadingByPrefix } from "@/shared/hooks/useRouteLoading";
import { useTableDensity } from "@/shared/hooks/useTableDensity";
import { getStorageJson, removeStorageItem, setStorageJson } from "@/shared/utils/storage";
import type { NewTicketLoaderData, TicketActionData } from "./supportData";
import type { DraftPayload, NewTicketState } from "./types";

const DRAFT_KEY = "support-ticket-draft";

function readDraft(defaultCategory: string): DraftPayload {
  const parsed = getStorageJson<Partial<DraftPayload> | null>(DRAFT_KEY, null);
  if (!parsed) {
    return { subject: "", category: defaultCategory, body: "" };
  }
  return {
    subject: typeof parsed.subject === "string" ? parsed.subject : "",
    category: typeof parsed.category === "string" ? parsed.category : defaultCategory,
    body: typeof parsed.body === "string" ? parsed.body : "",
  };
}

export function useNewTicketPageState(): NewTicketState {
  const { categories } = useLoaderData() as NewTicketLoaderData;
  const actionData = useActionData() as TicketActionData | undefined;
  const navigation = useNavigation();
  const { getParam } = useQueryParams();
  const { isCompact } = useTableDensity();

  const isSubmitting = navigation.state === "submitting";
  const isRouteLoading = isRouteLoadingByPrefix(navigation, "/console/support/tickets/new");
  const actionButtonSize = isCompact ? "small" : "medium";
  const prefilledCategory = getParam("category", "apps");

  const initialDraft = useMemo(() => readDraft(prefilledCategory), [prefilledCategory]);
  const [subject, setSubject] = useState(initialDraft.subject);
  const [category, setCategory] = useState(initialDraft.category);
  const [body, setBody] = useState(initialDraft.body);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);

  useEffect(() => {
    setStorageJson(DRAFT_KEY, { subject, category, body });
  }, [body, category, subject]);

  const feedback = useActionFeedbackSnackbar(actionData, {
    fallbackMessage: "Ticket created successfully.",
  });

  return {
    categories,
    actionData,
    isSubmitting,
    isRouteLoading,
    isCompact,
    actionButtonSize,
    subject,
    category,
    body,
    discardConfirmOpen,
    categoryOptions: categories.map((value) => ({ value, label: value.toUpperCase() })),
    hasError: Boolean(actionData?.formError),
    feedbackOpen: feedback.open,
    feedbackSeverity: feedback.severity,
    feedbackMessage: feedback.message,
    onSubjectChange: setSubject,
    onCategoryChange: setCategory,
    onBodyChange: setBody,
    onOpenDiscardDialog: () => setDiscardConfirmOpen(true),
    onCloseDiscardDialog: () => setDiscardConfirmOpen(false),
    onConfirmDiscard: () => {
      setSubject("");
      setCategory("apps");
      setBody("");
      removeStorageItem(DRAFT_KEY);
      setDiscardConfirmOpen(false);
    },
    onFeedbackClose: feedback.close,
  };
}
