import { InputAdornment, TextField } from "@mui/material";
import { MailOutline } from "@mui/icons-material";
import { authFieldSx, authLabelSx } from "../authFieldStyles";
import type { AuthFieldProps } from "../types";

export default function LoginEmailField({
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  disabled,
  error,
}: AuthFieldProps) {
  return (
    <TextField
      label="Email"
      name="email"
      type="email"
      required
      fullWidth
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      autoComplete="email"
      disabled={disabled}
      error={Boolean(error)}
      helperText={error}
      sx={authFieldSx}
      slotProps={{
        inputLabel: { shrink: focused || value.length > 0, sx: authLabelSx },
        input: { startAdornment: <InputAdornment position="start"><MailOutline fontSize="small" /></InputAdornment> },
      }}
    />
  );
}
