import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyIcon from "@mui/icons-material/Key";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { AppEnvHeaderProps } from "@/shared/types/appsComponents";

export default function AppEnvHeader({ isSaving, hasValidationError, onAddRow, onSave }: AppEnvHeaderProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <KeyIcon />
        <Box>
          <Typography variant="h6" fontWeight={800}>Environment Variables</Typography>
          <Typography variant="body2" color="text.secondary">Configure runtime keys for this app and mark sensitive values as secret.</Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={onAddRow}>Add Variable</Button>
        <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={onSave} disabled={isSaving || hasValidationError}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>
    </Stack>
  );
}
