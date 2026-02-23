import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import { InputAdornment, OutlinedInput, Stack, Typography } from "@mui/material";
import type { ProfileContactFieldsProps } from "../types";

export default function ProfileContactFields(props: ProfileContactFieldsProps) {
  const { name, email, phone, errors, onNameChange, onEmailChange, onPhoneChange } = props;

  return (
    <Stack spacing={1}>
      <OutlinedInput
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder="Your name"
        error={Boolean(errors.name)}
        startAdornment={
          <InputAdornment position="start" sx={{ mr: 0.5 }}>
            <AccountCircleOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </InputAdornment>
        }
      />
      {errors.name ? <Typography variant="caption" color="error">{errors.name}</Typography> : null}

      <OutlinedInput
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        placeholder="you@example.com"
        error={Boolean(errors.email)}
        startAdornment={
          <InputAdornment position="start" sx={{ mr: 0.5 }}>
            <EmailOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </InputAdornment>
        }
      />
      {errors.email ? <Typography variant="caption" color="error">{errors.email}</Typography> : null}

      <OutlinedInput
        value={phone}
        onChange={(event) => onPhoneChange(event.target.value)}
        placeholder="+98..."
        error={Boolean(errors.phone)}
        startAdornment={
          <InputAdornment position="start" sx={{ mr: 0.5 }}>
            <PhoneIphoneOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </InputAdornment>
        }
      />
      {errors.phone ? <Typography variant="caption" color="error">{errors.phone}</Typography> : null}
    </Stack>
  );
}
