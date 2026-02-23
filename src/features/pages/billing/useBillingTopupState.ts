import { useMemo, useState } from "react";
import { useActionData, useLoaderData, useNavigation } from "react-router-dom";
import { useActionFeedbackSnackbar } from "@/shared/hooks/useActionFeedbackSnackbar";
import { isRouteLoadingByPrefix } from "@/shared/hooks/useRouteLoading";
import type { BillingTopupActionData, BillingTopupLoaderData } from "./billingData";
import type { BillingTopupState } from "./types";

const topupSuggestions = [100000, 300000, 500000, 1000000];
const minimumTopup = 10000;

export function useBillingTopupState(): BillingTopupState {
  const { credit, recentPayments } = useLoaderData() as BillingTopupLoaderData;
  const actionData = useActionData() as BillingTopupActionData | undefined;
  const navigation = useNavigation();
  const [amountInput, setAmountInput] = useState(String(topupSuggestions[1]));

  const isSubmitting = navigation.state === "submitting";
  const isRouteLoading = isRouteLoadingByPrefix(navigation, "/console/billing/topup");

  const feedback = useActionFeedbackSnackbar(actionData, {
    fallbackMessage: "Top-up processed successfully.",
  });

  const displayedCredit = useMemo(() => {
    if (actionData?.nextCredit != null) {
      return actionData.nextCredit;
    }
    return credit;
  }, [actionData?.nextCredit, credit]);

  const parsedAmount = useMemo(() => {
    const next = Number(amountInput);
    if (!Number.isFinite(next) || next <= 0) {
      return 0;
    }
    return Math.floor(next);
  }, [amountInput]);

  return {
    credit,
    recentPayments,
    actionData,
    amountInput,
    isSubmitting,
    isRouteLoading,
    displayedCredit,
    parsedAmount,
    projectedCredit: displayedCredit + parsedAmount,
    amountInvalid: parsedAmount > 0 && parsedAmount < minimumTopup,
    suggestions: topupSuggestions,
    minimumTopup,
    feedbackOpen: feedback.open,
    feedbackSeverity: feedback.severity,
    feedbackMessage: feedback.message,
    onAmountInputChange: setAmountInput,
    onSelectAmount: (value: number) => setAmountInput(String(value)),
    onFeedbackClose: feedback.close,
  };
}
