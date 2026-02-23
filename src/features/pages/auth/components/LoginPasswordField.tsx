import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { authFieldSx, authLabelSx } from "../authFieldStyles";
import type { AuthPasswordFieldProps } from "../types";

export default function LoginPasswordField({
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  disabled,
  error,
  showPassword,
  onToggleShowPassword,
}: AuthPasswordFieldProps) {
  return (
    <TextField
      label="Password"
      name="password"
      type={showPassword ? "text" : "password"}
      required
      fullWidth
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      autoComplete="current-password"
      disabled={disabled}
      error={Boolean(error)}
      helperText={error}
      sx={authFieldSx}
      slotProps={{
        inputLabel: { shrink: focused || value.length > 0, sx: authLabelSx },
        input: {
          startAdornment: <InputAdornment position="start"><LockOutlined fontSize="small" /></InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label={showPassword ? "Hide password" : "Show password"} edge="end" onClick={onToggleShowPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
