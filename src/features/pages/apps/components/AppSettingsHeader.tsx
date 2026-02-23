import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { Alert, Box, Stack, Typography } from "@mui/material";
import type { AppSettingsHeaderProps } from "@/shared/types/appsComponents";

export default function AppSettingsHeader({ error }: AppSettingsHeaderProps) {
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <SettingsSuggestIcon />
        <Box>
          <Typography variant="h6" fontWeight={800}>App Settings</Typography>
          <Typography variant="body2" color="text.secondary">Manage service identity, runtime operations, and destructive actions.</Typography>
        </Box>
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
    </>
  );
}
