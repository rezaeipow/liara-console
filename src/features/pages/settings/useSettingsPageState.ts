import { useEffect, useMemo, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { selectUIPreferences, setSidebarMode, setTableDensity, showToast, type UIPreferences } from "@/app/store/slices/uiSlice";
import type { SecurityPreferences } from "./types";
import { MOCK_2FA_CODE, DEFAULT_SECURITY_PREFERENCES, DEFAULT_UI_PREFERENCES, UI_STORAGE_KEY, SECURITY_STORAGE_KEY, arePreferenceEqual, areSecurityEqual, createMockRecoveryCodes, loadSecurityPreferences, loadUiPreferencesFromStorage, saveSecurityPreferences } from "./settingsStateUtils";

export function useSettingsPageState() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmMd = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const persistedPreferences = useAppSelector(selectUIPreferences);
  const [draftPreferences, setDraftPreferences] = useState<UIPreferences>(persistedPreferences);
  const [persistedSecurity, setPersistedSecurity] = useState<SecurityPreferences>(() => loadSecurityPreferences());
  const [draftSecurity, setDraftSecurity] = useState<SecurityPreferences>(() => loadSecurityPreferences());
  const [twoFADialogOpen, setTwoFADialogOpen] = useState(false);
  const [disableTwoFADialogOpen, setDisableTwoFADialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<"instructions" | "verify">("instructions");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === UI_STORAGE_KEY) { const incoming = loadUiPreferencesFromStorage(); dispatch(setSidebarMode(incoming.sidebarMode)); dispatch(setTableDensity(incoming.tableDensity)); setDraftPreferences(incoming); }
      if (event.key === SECURITY_STORAGE_KEY) { const incomingSecurity = loadSecurityPreferences(); setPersistedSecurity(incomingSecurity); setDraftSecurity(incomingSecurity); }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);
  const hasUnsavedChanges = useMemo(() => !arePreferenceEqual(draftPreferences, persistedPreferences) || !areSecurityEqual(draftSecurity, persistedSecurity), [draftPreferences, persistedPreferences, draftSecurity, persistedSecurity]);
  const densityPreviewGapPx = draftPreferences.tableDensity === "comfortable" ? 18 : draftPreferences.tableDensity === "compact" ? 9 : 10;
  const densityPreviewRowMinHeight = draftPreferences.tableDensity === "comfortable" ? 56 : draftPreferences.tableDensity === "compact" ? 28 : 40;
  const changedKeys = useMemo(() => ({ sidebarMode: draftPreferences.sidebarMode !== persistedPreferences.sidebarMode, tableDensity: draftPreferences.tableDensity !== persistedPreferences.tableDensity, twoFA: draftSecurity.twoFAEnabled !== persistedSecurity.twoFAEnabled, backup: draftSecurity.backupCodesEnabled !== persistedSecurity.backupCodesEnabled, alerts: draftSecurity.emailAlertsEnabled !== persistedSecurity.emailAlertsEnabled }), [draftPreferences, draftSecurity, persistedPreferences, persistedSecurity]);
  const changedCount = Object.values(changedKeys).filter(Boolean).length;
  const handleTwoFAChange = (checked: boolean) => { if (checked && !draftSecurity.twoFAEnabled) { setVerificationCode(""); setVerificationError(null); setTwoFAStep("instructions"); setTwoFADialogOpen(true); return; } if (!checked && draftSecurity.twoFAEnabled) setDisableTwoFADialogOpen(true); };
  const handleVerifyTwoFA = () => { if (verificationCode.trim() !== MOCK_2FA_CODE) { setVerificationError("Verification code is invalid. Use 123456 for the mock flow."); return; } setDraftSecurity((prev) => ({ ...prev, twoFAEnabled: true, backupCodesEnabled: true })); setRecoveryCodes(createMockRecoveryCodes()); setTwoFADialogOpen(false); setVerificationCode(""); setVerificationError(null); setTwoFAStep("instructions"); };
  const handleDisableTwoFA = () => { setDraftSecurity((prev) => ({ ...prev, twoFAEnabled: false, backupCodesEnabled: false })); setDisableTwoFADialogOpen(false); setRecoveryCodes([]); };
  const handleResetToDefaults = () => { dispatch(setSidebarMode(DEFAULT_UI_PREFERENCES.sidebarMode)); dispatch(setTableDensity(DEFAULT_UI_PREFERENCES.tableDensity)); saveSecurityPreferences(DEFAULT_SECURITY_PREFERENCES); setPersistedSecurity(DEFAULT_SECURITY_PREFERENCES); setDraftPreferences(DEFAULT_UI_PREFERENCES); setDraftSecurity(DEFAULT_SECURITY_PREFERENCES); setVerificationCode(""); setVerificationError(null); setRecoveryCodes([]); setResetDialogOpen(false); dispatch(showToast({ message: "Defaults restored and applied.", severity: "success" })); };
  const handleCancelTwoFASetup = () => { setTwoFADialogOpen(false); setTwoFAStep("instructions"); setVerificationCode(""); setVerificationError(null); };
  const handleSave = () => { dispatch(setSidebarMode(draftPreferences.sidebarMode)); dispatch(setTableDensity(draftPreferences.tableDensity)); saveSecurityPreferences(draftSecurity); setPersistedSecurity(draftSecurity); dispatch(showToast({ message: "Settings saved successfully.", severity: "success" })); };
  const handleDiscard = () => { setDraftPreferences(persistedPreferences); setDraftSecurity(persistedSecurity); setTwoFADialogOpen(false); setVerificationCode(""); setVerificationError(null); };
  return { isXs, isSmMd, isLgUp, draftPreferences, setDraftPreferences, draftSecurity, setDraftSecurity, recoveryCodes, twoFADialogOpen, setTwoFADialogOpen, disableTwoFADialogOpen, setDisableTwoFADialogOpen, resetDialogOpen, setResetDialogOpen, twoFAStep, setTwoFAStep, verificationCode, setVerificationCode, verificationError, hasUnsavedChanges, densityPreviewGapPx, densityPreviewRowMinHeight, changedKeys, changedCount, handleTwoFAChange, handleVerifyTwoFA, handleDisableTwoFA, handleResetToDefaults, handleCancelTwoFASetup, handleSave, handleDiscard };
}
