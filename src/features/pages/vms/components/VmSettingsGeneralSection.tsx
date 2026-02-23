import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Button,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ConsoleToneSection from "@/shared/components/console/ConsoleToneSection";
import type { VmSettingsGeneralSectionProps } from "../pageTypes";

export default function VmSettingsGeneralSection(
  props: VmSettingsGeneralSectionProps,
) {
  const {
    vm,
    isLoading,
    name,
    onNameChange,
    renameHelper,
    renameFieldError,
    canRename,
    isRenaming,
    onRename,
  } = props;

  return (
    <ConsoleToneSection tone="primary">
      <Stack spacing={1.2}>
        <Typography fontWeight={800}>General</Typography>
        <Divider sx={{ opacity: 0.5 }} />
        <Stack spacing={1.1}>
          <TextField
            label="VM name"
            size="small"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            helperText={renameHelper}
            error={Boolean(renameFieldError)}
            disabled={isLoading || !vm || isRenaming}
            inputProps={{ "aria-label": "VM name" }}
          />
          {renameFieldError ? (
            <Alert severity="error">{renameFieldError}</Alert>
          ) : null}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                label={`Status: ${vm?.status ?? "-"}`}
                variant="outlined"
              />
              <Chip
                size="small"
                label={`vCPU: ${vm?.cpu ?? "-"}`}
                variant="outlined"
              />
              <Chip
                size="small"
                label={`RAM: ${vm?.ram ? `${(vm.ram / 1024).toFixed(1)} GB` : "-"}`}
                variant="outlined"
              />
              <Chip
                size="small"
                label={`Disk: ${vm?.disk ?? "-"} GB`}
                variant="outlined"
              />
            </Stack>
            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              onClick={onRename}
              disabled={!canRename}
            >
              {isRenaming ? "Saving..." : "Save Rename"}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </ConsoleToneSection>
  );
}
