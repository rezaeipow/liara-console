import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ResourceStatusMetaChips from "@/shared/components/console/ResourceStatusMetaChips";
import { getVmStatusTone } from "@/shared/ui/statusTones";
import { formatMemory } from "../vmOverviewUtils";
import type { VmOverviewHeaderCardProps } from "../pageTypes";

export default function VmOverviewHeaderCard(props: VmOverviewHeaderCardProps) {
  const { theme, vm } = props;
  const statusChipTone = getVmStatusTone(vm.status);

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 1.8 },
        borderRadius: 1.75,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        background: `linear-gradient(160deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
      }}
    >
      <Stack spacing={1.1}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <StorageOutlinedIcon />
            <Box>
              <Typography variant="h6" fontWeight={800}>
                VM Overview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Runtime and resource snapshot for {vm.name}.
              </Typography>
            </Box>
          </Stack>
        </Stack>
        <ResourceStatusMetaChips statusLabel={vm.status} statusTone={statusChipTone}>
          <Chip size="small" variant="outlined" label={`vCPU: ${vm.cpu}`} />
          <Chip size="small" variant="outlined" label={`RAM: ${formatMemory(vm.ram)}`} />
          <Chip size="small" variant="outlined" label={`Disk: ${vm.disk} GB`} />
        </ResourceStatusMetaChips>
      </Stack>
    </Paper>
  );
}
