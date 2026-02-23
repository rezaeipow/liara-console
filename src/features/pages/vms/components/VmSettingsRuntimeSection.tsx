import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { Button, Divider, Stack, Typography } from "@mui/material";
import ConsoleToneSection from "@/shared/components/console/ConsoleToneSection";
import type { VmSettingsRuntimeSectionProps } from "../pageTypes";

export default function VmSettingsRuntimeSection(props: VmSettingsRuntimeSectionProps) {
  const { vm, isLoading, onOpenRestartDialog } = props;

  return (
    <ConsoleToneSection tone="secondary">
      <Stack spacing={1.2}>
        <Typography fontWeight={800}>Runtime Operations</Typography>
        <Divider sx={{ opacity: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          Reboot schedules a fresh boot cycle for this VM. Running sessions may be interrupted.
        </Typography>
        <Button
          variant="outlined"
          color="warning"
          startIcon={<RestartAltOutlinedIcon />}
          sx={{ alignSelf: "flex-start" }}
          onClick={onOpenRestartDialog}
          disabled={isLoading || !vm}
        >
          Reboot VM
        </Button>
      </Stack>
    </ConsoleToneSection>
  );
}
