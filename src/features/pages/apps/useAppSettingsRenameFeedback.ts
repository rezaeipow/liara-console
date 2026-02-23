import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AppSettingsActionData } from "./appSettingsData";
import type { AppService } from "@/api/types";

type Params = {
  data: AppSettingsActionData | undefined;
  showFeedback: (message: string, severity: "success" | "error" | "info") => void;
  setApp: Dispatch<SetStateAction<AppService | null>>;
};

export function useAppSettingsRenameFeedback({ data, showFeedback, setApp }: Params) {
  useEffect(() => {
    if (!data) return;
    if (data.ok) {
      showFeedback(data.message ?? "App renamed.", "success");
      if (data.updatedName) setApp((current) => (current ? { ...current, name: data.updatedName ?? current.name } : current));
      return;
    }
    if (data.fieldErrors?.name) showFeedback(data.fieldErrors.name, "error");
    else if (data.formError) showFeedback(data.formError, "error");
  }, [data, setApp, showFeedback]);
}
