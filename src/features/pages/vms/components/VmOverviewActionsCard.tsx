import PowerOffOutlinedIcon from "@mui/icons-material/PowerOffOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import type { VmOverviewActionsCardProps } from "../pageTypes";

export default function VmOverviewActionsCard(props: VmOverviewActionsCardProps) {
  const { vm, actionLoading, onAction } = props;

  return (
    <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: 1.75 }}>
      <Stack spacing={1.15}>
        <Typography fontWeight={800}>Actions</Typography>
        <Divider />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} useFlexGap>
          {vm.status === "stopped" ? (
            <Button
              variant="outlined"
              startIcon={<PowerSettingsNewOutlinedIcon />}
              onClick={() => onAction("start")}
              disabled={actionLoading !== null}
            >
              {actionLoading === "start" ? "Starting..." : "Start"}
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<PowerOffOutlinedIcon />}
              onClick={() => onAction("stop")}
              disabled={actionLoading !== null}
            >
              {actionLoading === "stop" ? "Stopping..." : "Stop"}
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<RestartAltOutlinedIcon />}
            onClick={() => onAction("reboot")}
            disabled={actionLoading !== null}
          >
            {actionLoading === "reboot" ? "Rebooting..." : "Reboot"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
