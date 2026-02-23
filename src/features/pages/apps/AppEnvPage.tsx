import { Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AppEnvAlerts from "./components/AppEnvAlerts";
import AppEnvContent from "./components/AppEnvContent";
import AppEnvHeader from "./components/AppEnvHeader";
import AppEnvVisibilityToggle from "./components/AppEnvVisibilityToggle";
import { useAppEnvPageState } from "./useAppEnvPageState";

export default function AppEnvPage() {
  const theme = useTheme();
  const state = useAppEnvPageState();

  return (
    <Stack spacing={1.5}>
      <AppEnvHeader
        isSaving={state.isSaving}
        hasValidationError={state.hasValidationError}
        onAddRow={state.addRow}
        onSave={() => void state.save()}
      />
      <AppEnvVisibilityToggle
        hasSecretRows={state.hasSecretRows}
        revealSecrets={state.revealSecrets}
        onToggle={state.setRevealSecrets}
      />
      <AppEnvAlerts
        notice={state.notice}
        error={state.error}
        hasValidationError={state.hasValidationError}
        isLoading={state.isLoading}
        onRetry={() => void state.loadEnvVars()}
      />
      <AppEnvContent
        isLoading={state.isLoading}
        rows={state.rows}
        rowErrors={state.rowErrors}
        revealSecrets={state.revealSecrets}
        onUpdate={state.updateRow}
        onRemove={state.removeRow}
        theme={theme}
      />
      <Divider sx={{ opacity: 0.5 }} />
      <Typography variant="caption" color="text.secondary">
        Keys are automatically normalized to uppercase when saving.
      </Typography>
    </Stack>
  );
}
