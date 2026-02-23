import { useState } from "react";

type ActionFeedbackInput = {
  formError?: string;
  successMessage?: string;
  successAt?: number;
};

type UseActionFeedbackOptions = {
  fallbackMessage?: string;
  extraNotice?: {
    key: string;
    message: string;
  } | null;
};

export function useActionFeedbackSnackbar(
  actionData: ActionFeedbackInput | undefined,
  options?: UseActionFeedbackOptions,
) {
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  const formError = actionData?.formError;
  const successMessage = actionData?.successMessage;
  const successAt = actionData?.successAt;
  const extraNotice = options?.extraNotice;
  const fallbackMessage = options?.fallbackMessage ?? "Operation completed.";

  const notice =
    typeof successAt === "number"
      ? {
          key: `success-${successAt}`,
          message: successMessage ?? fallbackMessage,
          severity: "success" as const,
        }
      : formError
        ? {
            key: `error-${formError}`,
            message: formError,
            severity: "error" as const,
          }
        : extraNotice
          ? {
              key: extraNotice.key,
              message: extraNotice.message,
              severity: "success" as const,
            }
          : null;

  return {
    open: Boolean(notice) && notice?.key !== dismissedKey,
    severity: notice?.severity ?? "success",
    message: notice?.message ?? "",
    close: () => {
      if (notice) setDismissedKey(notice.key);
    },
  };
}
