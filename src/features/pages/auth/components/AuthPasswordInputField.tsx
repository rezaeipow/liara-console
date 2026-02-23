import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { authFieldSx, authLabelSx } from "../authFieldStyles";
import type { AuthPasswordInputFieldProps } from "../types";

export default function AuthPasswordInputField({
  label,
  name,
  autoComplete,
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  disabled,
  error,
  showPassword,
  onToggleShowPassword,
  helperText,
}: AuthPasswordInputFieldProps) {
  return (
    <TextField
      label={label}
      name={name}
      type={showPassword ? "text" : "password"}
      required
      fullWidth
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      autoComplete={autoComplete}
      disabled={disabled}
      error={Boolean(error)}
      helperText={helperText ?? error}
      sx={authFieldSx}
      slotProps={{
        inputLabel: { shrink: focused || value.length > 0, sx: authLabelSx },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlined fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword
                    ? `Hide ${label.toLowerCase()}`
                    : `Show ${label.toLowerCase()}`
                }
                edge="end"
                onClick={onToggleShowPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
