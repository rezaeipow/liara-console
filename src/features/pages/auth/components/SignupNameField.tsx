import { PersonOutline } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { authFieldSx, authLabelSx } from "../authFieldStyles";
import type { AuthFieldProps } from "../types";

export default function SignupNameField({
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
      label="Full name"
      name="name"
      required
      fullWidth
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      autoComplete="name"
      disabled={disabled}
      error={Boolean(error)}
      helperText={error}
      sx={authFieldSx}
      slotProps={{
        inputLabel: { shrink: focused || value.length > 0, sx: authLabelSx },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutline fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
