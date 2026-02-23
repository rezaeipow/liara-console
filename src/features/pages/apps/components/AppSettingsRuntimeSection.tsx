import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Button, Divider, Stack, Typography } from "@mui/material";
import ConsoleToneSection from "@/shared/components/console/ConsoleToneSection";
import type { AppSettingsRuntimeSectionProps } from "@/shared/types/appsComponents";

export default function AppSettingsRuntimeSection({ disabled, onOpenRestart }: AppSettingsRuntimeSectionProps) {
  return (
    <ConsoleToneSection tone="secondary">
      <Stack spacing={1.2}>
        <Typography fontWeight={800}>Runtime Operations</Typography>
        <Divider sx={{ opacity: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          Restart schedules a new boot cycle for this service. Existing in-flight requests may be interrupted.
        </Typography>
        <Button variant="outlined" color="warning" startIcon={<RestartAltIcon />} sx={{ alignSelf: "flex-start" }} onClick={onOpenRestart} disabled={disabled}>
          Restart App
        </Button>
      </Stack>
    </ConsoleToneSection>
  );
}
