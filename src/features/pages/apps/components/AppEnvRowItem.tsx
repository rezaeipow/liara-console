import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Chip, FormControlLabel, IconButton, InputAdornment, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { AppEnvRowItemProps } from "@/shared/types/appsComponents";

export default function AppEnvRowItem({ row, index, errors, revealSecrets, onUpdate, onRemove, theme }: AppEnvRowItemProps) {
  const isMasked = row.secret && !revealSecrets;
  return (
    <Paper variant="outlined" sx={{ p: 1.2, borderRadius: 1.25, borderColor: alpha(theme.palette.text.primary, 0.12), backgroundColor: alpha(theme.palette.common.white, 0.46) }}>
      <Stack spacing={0.8}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
          <TextField size="small" label="Key" value={row.key} onChange={(event) => onUpdate(row.id, { key: event.target.value })} error={Boolean(errors?.key)} helperText={errors?.key} sx={{ flex: 1 }} />
          <TextField
            size="small"
            label="Value"
            type={isMasked ? "password" : "text"}
            value={row.value}
            onChange={(event) => onUpdate(row.id, { value: event.target.value })}
            error={Boolean(errors?.value)}
            helperText={errors?.value}
            sx={{ flex: 1 }}
            slotProps={{ input: { endAdornment: row.secret ? <InputAdornment position="end">{revealSecrets ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</InputAdornment> : undefined } }}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Chip size="small" label={`Var ${index + 1}`} variant="outlined" />
            <FormControlLabel
              sx={{ m: 0 }}
              control={<Switch size="small" checked={row.secret} onChange={(event) => onUpdate(row.id, { secret: event.target.checked })} />}
              label={<Typography variant="caption" color="text.secondary">Secret</Typography>}
            />
          </Stack>
          <IconButton size="small" color="error" onClick={() => onRemove(row.id)} aria-label="Delete environment variable">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
