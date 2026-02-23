import { getStorageJson, setStorageJson } from "@/shared/utils/storage";
import type { UIPreferences } from "@/app/store/slices/uiSlice";
import type { SecurityPreferences } from "./types";

export const SECURITY_STORAGE_KEY = "console-security-preferences";
export const UI_STORAGE_KEY = "console-ui-preferences";
export const MOCK_2FA_CODE = "123456";
export const DEFAULT_UI_PREFERENCES: UIPreferences = { sidebarMode: "expanded", tableDensity: "standard" };
export const DEFAULT_SECURITY_PREFERENCES: SecurityPreferences = { twoFAEnabled: false, backupCodesEnabled: false, emailAlertsEnabled: true };

export function loadSecurityPreferences(): SecurityPreferences {
  const parsed = getStorageJson<Partial<SecurityPreferences> | null>(SECURITY_STORAGE_KEY, null);
  if (!parsed) return { ...DEFAULT_SECURITY_PREFERENCES };
  return {
    twoFAEnabled: parsed.twoFAEnabled === true,
    backupCodesEnabled: parsed.backupCodesEnabled === true,
    emailAlertsEnabled: parsed.emailAlertsEnabled !== false,
  };
}

export function saveSecurityPreferences(prefs: SecurityPreferences) {
  setStorageJson(SECURITY_STORAGE_KEY, prefs);
}

export function loadUiPreferencesFromStorage(): UIPreferences {
  const parsed = getStorageJson<Partial<UIPreferences> | null>(UI_STORAGE_KEY, null);
  if (!parsed) return DEFAULT_UI_PREFERENCES;
  return {
    sidebarMode: parsed.sidebarMode === "collapsed" ? "collapsed" : "expanded",
    tableDensity: parsed.tableDensity === "compact" || parsed.tableDensity === "comfortable" || parsed.tableDensity === "standard" ? parsed.tableDensity : DEFAULT_UI_PREFERENCES.tableDensity,
  };
}

export function createMockRecoveryCodes(): string[] {
  return Array.from({ length: 6 }).map((_, index) => `LR-${String(index + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`);
}

export function arePreferenceEqual(left: UIPreferences, right: UIPreferences): boolean {
  return left.sidebarMode === right.sidebarMode && left.tableDensity === right.tableDensity;
}

export function areSecurityEqual(left: SecurityPreferences, right: SecurityPreferences): boolean {
  return left.twoFAEnabled === right.twoFAEnabled && left.backupCodesEnabled === right.backupCodesEnabled && left.emailAlertsEnabled === right.emailAlertsEnabled;
}
