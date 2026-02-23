import type { UIPreferences } from "@/app/store/slices/uiSlice";

export type SettingsHeaderCardProps = {
  twoFAEnabled: boolean;
};

export type SecuritySettingsCardProps = {
  draftSecurity: {
    twoFAEnabled: boolean;
    backupCodesEnabled: boolean;
    emailAlertsEnabled: boolean;
  };
  changedKeys: {
    twoFA: boolean;
    backup: boolean;
    alerts: boolean;
  };
  recoveryCodes: string[];
  onTwoFAChange: (checked: boolean) => void;
  onBackupChange: (checked: boolean) => void;
  onAlertsChange: (checked: boolean) => void;
};

export type PreferencesSettingsCardProps = {
  isXs: boolean;
  isSmMd: boolean;
  isLgUp: boolean;
  draftPreferences: UIPreferences;
  changedKeys: {
    sidebarMode: boolean;
    tableDensity: boolean;
  };
  densityPreviewGapPx: number;
  densityPreviewRowMinHeight: number;
  onSidebarModeChange: (value: UIPreferences["sidebarMode"]) => void;
  onTableDensityChange: (value: UIPreferences["tableDensity"]) => void;
};

export type SettingsActionBarProps = {
  hasUnsavedChanges: boolean;
  changedCount: number;
  twoFAEnabled: boolean;
  onDiscard: () => void;
  onOpenReset: () => void;
  onSave: () => void;
};

export type TwoFADialogProps = {
  open: boolean;
  step: "instructions" | "verify";
  verificationCode: string;
  verificationError: string | null;
  mockCode: string;
  onClose: () => void;
  onStepChange: (step: "instructions" | "verify") => void;
  onCodeChange: (value: string) => void;
  onVerify: () => void;
};

export type SettingsConfirmDialogsProps = {
  disableTwoFADialogOpen: boolean;
  resetDialogOpen: boolean;
  onCloseDisableTwoFA: () => void;
  onDisableTwoFA: () => void;
  onCloseReset: () => void;
  onResetDefaults: () => void;
};
