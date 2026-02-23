import { Button, Chip, Paper, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { SettingsActionBarProps } from "@/shared/types/settingsComponents";
import { glassBackdrop } from "@/shared/ui/glassTokens";

export default function SettingsActionBar(props: SettingsActionBarProps) {
  const { hasUnsavedChanges, changedCount, twoFAEnabled, onDiscard, onOpenReset, onSave } = props;
  return (
    <Paper sx={{ p: { xs: 1.2, sm: 1.4 }, borderRadius: { xs: 1.5, sm: 2 }, border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.9)}, ${alpha(theme.palette.common.white, 0.8)})`, backdropFilter: glassBackdrop.subtle, position: "sticky", bottom: 10, zIndex: 12 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }}>
        <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
          <Chip size="small" color={hasUnsavedChanges ? "warning" : "success"} label={hasUnsavedChanges ? `${changedCount} pending` : "Synced"} />
          <Chip size="small" color={twoFAEnabled ? "success" : "warning"} label={twoFAEnabled ? "Security hardened" : "Security recommended"} />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Button variant="outlined" onClick={onDiscard} disabled={!hasUnsavedChanges} aria-label="Discard settings changes">Discard</Button>
          <Button variant="outlined" color="warning" onClick={onOpenReset} aria-label="Reset settings to defaults">Reset defaults</Button>
          <Button variant="contained" onClick={onSave} disabled={!hasUnsavedChanges} aria-label="Save settings changes">Save changes</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
