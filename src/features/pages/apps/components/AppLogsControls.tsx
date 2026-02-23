import { Chip, FormControlLabel, MenuItem, Stack, Switch, TextField } from "@mui/material";
import type { AppLogsControlsProps } from "@/shared/types/appsComponents";

export default function AppLogsControls({
  level,
  autoStream,
  lastUpdatedAt,
  onLevelChange,
  onAutoStreamChange,
  formatDateTime,
}: AppLogsControlsProps) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ xs: "stretch", md: "center" }} justifyContent="space-between">
      <TextField select size="small" label="Level" value={level} onChange={(event) => onLevelChange(event.target.value as typeof level)} sx={{ minWidth: { xs: "100%", md: 160 } }}>
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="info">Info</MenuItem>
        <MenuItem value="warn">Warn</MenuItem>
        <MenuItem value="error">Error</MenuItem>
      </TextField>
      <Stack direction="row" spacing={1} alignItems="center">
        <FormControlLabel control={<Switch checked={autoStream} onChange={(event) => onAutoStreamChange(event.target.checked)} />} label="Live stream" />
        <Chip size="small" label={lastUpdatedAt ? `Updated ${formatDateTime(lastUpdatedAt)}` : "No updates yet"} variant="outlined" />
      </Stack>
    </Stack>
  );
}
