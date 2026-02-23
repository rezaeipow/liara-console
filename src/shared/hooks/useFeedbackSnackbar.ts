import { useCallback, useMemo, useState } from "react";

export type FeedbackSeverity = "success" | "error" | "info";

type FeedbackState = {
  message: string;
  severity: FeedbackSeverity;
};

export function useFeedbackSnackbar(defaultSeverity: FeedbackSeverity = "success") {
  const [state, setState] = useState<FeedbackState | null>(null);

  const show = useCallback((message: string, severity: FeedbackSeverity = defaultSeverity) => {
    setState({ message, severity });
  }, [defaultSeverity]);

  const clear = useCallback(() => {
    setState(null);
  }, []);

  const feedback = useMemo(
    () => ({
      open: Boolean(state?.message),
      severity: state?.severity ?? defaultSeverity,
      message: state?.message ?? "",
    }),
    [defaultSeverity, state],
  );

  return { feedback, show, clear };
}

