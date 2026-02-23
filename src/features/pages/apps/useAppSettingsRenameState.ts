import { useMemo, useState } from "react";
import type { AppSettingsActionData } from "./appSettingsData";

type Params = {
  appName: string | undefined;
  hasApp: boolean;
  isRenaming: boolean;
  submitRename: (name: string) => void;
};

export function useAppSettingsRenameState({ appName, hasApp, isRenaming, submitRename }: Params) {
  const [draftName, setDraftName] = useState<string | null>(null);
  const name = draftName ?? appName ?? "";
  const trimmedName = name.trim();
  const canRename = hasApp && trimmedName.length >= 3 && trimmedName.length <= 32 && trimmedName !== appName && !isRenaming;
  const renameHelper = useMemo(() => {
    if (!trimmedName) return "Name is required.";
    if (trimmedName.length < 3) return "Use at least 3 characters.";
    if (trimmedName.length > 32) return "Use at most 32 characters.";
    return "Choose a descriptive service name.";
  }, [trimmedName]);

  const handleRename = async () => {
    if (!canRename) return;
    submitRename(trimmedName);
  };

  return { name, setName: (value: string) => setDraftName(value), canRename, renameHelper, handleRename };
}

export function getRenameError(data: AppSettingsActionData | undefined) {
  return data?.fieldErrors?.name;
}
