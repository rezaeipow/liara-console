import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Alert, Button, Chip, Divider, Stack, TextField, Typography } from "@mui/material";
import ConsoleToneSection from "@/shared/components/console/ConsoleToneSection";
import type { AppSettingsGeneralSectionProps } from "@/shared/types/appsComponents";

export default function AppSettingsGeneralSection({
  name,
  helperText,
  isRenaming,
  isLoading,
  hasApp,
  canRename,
  renameError,
  region,
  plan,
  onNameChange,
  onRename,
}: AppSettingsGeneralSectionProps) {
  return (
    <ConsoleToneSection tone="primary">
      <Stack spacing={1.2}>
        <Typography fontWeight={800}>General</Typography>
        <Divider sx={{ opacity: 0.5 }} />
        <Stack spacing={1.1}>
          <TextField
            label="App name"
            size="small"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            helperText={helperText}
            error={Boolean(renameError)}
            disabled={isLoading || !hasApp || isRenaming}
            inputProps={{ "aria-label": "App name" }}
          />
          {renameError ? <Alert severity="error">{renameError}</Alert> : null}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip size="small" label={`Region: ${region?.toUpperCase() ?? "-"}`} variant="outlined" />
              <Chip size="small" label={`Plan: ${plan ?? "-"}`} variant="outlined" />
            </Stack>
            <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={onRename} disabled={!canRename}>
              {isRenaming ? "Saving..." : "Save Rename"}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </ConsoleToneSection>
  );
}
