import type { ReactNode } from "react";

export type SecurityPreferences = {
  twoFAEnabled: boolean;
  backupCodesEnabled: boolean;
  emailAlertsEnabled: boolean;
};

export type SettingRowProps = {
  icon: ReactNode;
  title: string;
  description: string;
  control: ReactNode;
};

export type PreferenceFieldProps = {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};
