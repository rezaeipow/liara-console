import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PowerOffOutlinedIcon from "@mui/icons-material/PowerOffOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { Box, Button, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import ConsoleStatusChip from "@/shared/components/console/ConsoleStatusChip";
import { getVmStatusTone } from "@/shared/ui/statusTones";
import type { ProjectVmCardProps } from "../pageTypes";
import { formatMemory } from "../projectVmsUtils";

export default function ProjectVmCard(props: ProjectVmCardProps) {
  const { theme, vm, actionLoadingId, onAskAction, onOpenMenu } = props;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.35,
        borderRadius: 1.5,
        borderColor: alpha(theme.palette.primary.main, 0.16),
        transition: "transform 160ms ease, border-color 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: alpha(theme.palette.primary.main, 0.34),
        },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800} noWrap title={vm.name}>
              {vm.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {vm.id}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <ConsoleStatusChip label={vm.status} tone={getVmStatusTone(vm.status)} />
            <IconButton size="small" aria-label={`More actions for ${vm.name}`} onClick={(event) => onOpenMenu(event, vm.id)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
          <Chip size="small" variant="outlined" label={`CPU: ${vm.cpu} vCPU`} />
          <Chip size="small" variant="outlined" label={`RAM: ${formatMemory(vm.ram)}`} />
          <Chip size="small" variant="outlined" label={`Disk: ${vm.disk} GB`} />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.65} useFlexGap>
          <Button component={Link} to={`/console/vms/${vm.id}/overview`} variant="contained" size="small" endIcon={<OpenInNewIcon fontSize="small" />}>
            Open
          </Button>
          <Button component={Link} to={`/console/vms/${vm.id}/settings`} variant="outlined" size="small">
            Settings
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.65} useFlexGap>
          {vm.status === "stopped" ? (
            <Button size="small" variant="outlined" startIcon={<PowerSettingsNewOutlinedIcon fontSize="small" />} onClick={() => onAskAction(vm.id, "start")} disabled={actionLoadingId === `start:${vm.id}`}>
              Start
            </Button>
          ) : (
            <Button size="small" variant="outlined" startIcon={<PowerOffOutlinedIcon fontSize="small" />} onClick={() => onAskAction(vm.id, "stop")} disabled={actionLoadingId === `stop:${vm.id}`}>
              Stop
            </Button>
          )}

          <Button size="small" variant="outlined" startIcon={<RestartAltOutlinedIcon fontSize="small" />} onClick={() => onAskAction(vm.id, "reboot")} disabled={actionLoadingId === `reboot:${vm.id}`}>
            Reboot
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
