import ResourceActionConfirmDialog from "@/shared/components/common/ResourceActionConfirmDialog";
import type { SettingsConfirmDialogsProps } from "@/shared/types/settingsComponents";

export default function SettingsConfirmDialogs(props: SettingsConfirmDialogsProps) {
  const { disableTwoFADialogOpen, resetDialogOpen, onCloseDisableTwoFA, onDisableTwoFA, onCloseReset, onResetDefaults } = props;
  return (
    <>
      <ResourceActionConfirmDialog open={disableTwoFADialogOpen} onClose={onCloseDisableTwoFA} onConfirm={onDisableTwoFA} title="Disable 2FA?" message="This will remove the extra verification step and backup codes." confirmLabel="Disable" confirmColor="error" />
      <ResourceActionConfirmDialog open={resetDialogOpen} onClose={onCloseReset} onConfirm={onResetDefaults} title="Reset to defaults?" message="Sidebar mode, density, and security toggles will be reset to default values." confirmLabel="Reset" confirmColor="warning" />
    </>
  );
}
