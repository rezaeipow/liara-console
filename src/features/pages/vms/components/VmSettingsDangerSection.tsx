import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Button, Divider, Stack, Typography } from "@mui/material";
import ConsoleToneSection from "@/shared/components/console/ConsoleToneSection";
import type { VmSettingsDangerSectionProps } from "../pageTypes";

export default function VmSettingsDangerSection(props: VmSettingsDangerSectionProps) {
  const { vm, isLoading, onOpenDeleteDialog } = props;

  return (
    <ConsoleToneSection tone="error">
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <WarningAmberIcon color="error" />
          <Typography fontWeight={800} color="error.main">
            Danger Zone
          </Typography>
        </Stack>
        <Divider sx={{ opacity: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          Deleting this VM permanently removes its resources.
        </Typography>
        <Button
          variant="contained"
          color="error"
          sx={{ alignSelf: "flex-start" }}
          onClick={onOpenDeleteDialog}
          disabled={isLoading || !vm}
        >
          Delete VM
        </Button>
      </Stack>
    </ConsoleToneSection>
  );
}
