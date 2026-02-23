import { Box } from "@mui/material";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import { MOCK_2FA_CODE } from "./settingsStateUtils";
import { useSettingsPageState } from "./useSettingsPageState";
import SettingsActionBar from "./components/SettingsActionBar";
import SettingsConfirmDialogs from "./components/SettingsConfirmDialogs";
import SettingsHeaderCard from "./components/SettingsHeaderCard";
import PreferencesSettingsCard from "./components/PreferencesSettingsCard";
import SecuritySettingsCard from "./components/SecuritySettingsCard";
import TwoFADialog from "./components/TwoFADialog";

export default function SettingsPage() {
  const state = useSettingsPageState();

  return (
    <>
      <ConsoleContentContainer spacing={2.2}>
        <SettingsHeaderCard twoFAEnabled={state.draftSecurity.twoFAEnabled} />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 1.5 }}>
          <SecuritySettingsCard
            draftSecurity={state.draftSecurity}
            changedKeys={state.changedKeys}
            recoveryCodes={state.recoveryCodes}
            onTwoFAChange={state.handleTwoFAChange}
            onBackupChange={(checked) => state.setDraftSecurity((prev) => ({ ...prev, backupCodesEnabled: checked }))}
            onAlertsChange={(checked) => state.setDraftSecurity((prev) => ({ ...prev, emailAlertsEnabled: checked }))}
          />
          <PreferencesSettingsCard
            isXs={state.isXs}
            isSmMd={state.isSmMd}
            isLgUp={state.isLgUp}
            draftPreferences={state.draftPreferences}
            changedKeys={state.changedKeys}
            densityPreviewGapPx={state.densityPreviewGapPx}
            densityPreviewRowMinHeight={state.densityPreviewRowMinHeight}
            onSidebarModeChange={(sidebarMode) => state.setDraftPreferences((prev) => ({ ...prev, sidebarMode }))}
            onTableDensityChange={(tableDensity) => state.setDraftPreferences((prev) => ({ ...prev, tableDensity }))}
          />
        </Box>
        <SettingsActionBar
          hasUnsavedChanges={state.hasUnsavedChanges}
          changedCount={state.changedCount}
          twoFAEnabled={state.draftSecurity.twoFAEnabled}
          onDiscard={state.handleDiscard}
          onOpenReset={() => state.setResetDialogOpen(true)}
          onSave={state.handleSave}
        />
      </ConsoleContentContainer>

      <TwoFADialog
        open={state.twoFADialogOpen}
        step={state.twoFAStep}
        verificationCode={state.verificationCode}
        verificationError={state.verificationError}
        mockCode={MOCK_2FA_CODE}
        onClose={state.handleCancelTwoFASetup}
        onStepChange={state.setTwoFAStep}
        onCodeChange={state.setVerificationCode}
        onVerify={state.handleVerifyTwoFA}
      />

      <SettingsConfirmDialogs
        disableTwoFADialogOpen={state.disableTwoFADialogOpen}
        resetDialogOpen={state.resetDialogOpen}
        onCloseDisableTwoFA={() => state.setDisableTwoFADialogOpen(false)}
        onDisableTwoFA={state.handleDisableTwoFA}
        onCloseReset={() => state.setResetDialogOpen(false)}
        onResetDefaults={state.handleResetToDefaults}
      />
    </>
  );
}
