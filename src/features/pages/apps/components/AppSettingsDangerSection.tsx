import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Button, Divider, Stack, Typography } from "@mui/material";
import ConsoleToneSection from "@/shared/components/console/ConsoleToneSection";
import type { AppSettingsDangerSectionProps } from "@/shared/types/appsComponents";

export default function AppSettingsDangerSection({ disabled, onOpenDelete }: AppSettingsDangerSectionProps) {
  return (
    <ConsoleToneSection tone="error">
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <WarningAmberIcon color="error" />
          <Typography fontWeight={800} color="error.main">Danger Zone</Typography>
        </Stack>
        <Divider sx={{ opacity: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          Deleting this app permanently removes all related runtime resources in this mock flow.
        </Typography>
        <Button variant="contained" color="error" sx={{ alignSelf: "flex-start" }} onClick={onOpenDelete} disabled={disabled}>
          Delete App
        </Button>
      </Stack>
    </ConsoleToneSection>
  );
}
