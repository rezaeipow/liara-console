import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined, MailOutline, PersonOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Form, Link as RouterLink, useActionData, useNavigation } from "react-router-dom";
import type { AuthActionResult } from "../../../app/routing/authData";

export default function SignupPage() {
  const actionData = useActionData() as AuthActionResult | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const authFieldSx = {
    "& .MuiOutlinedInput-root": {
      alignItems: "center",
    },
    "& .MuiOutlinedInput-input": {
      py: 1.3,
      lineHeight: 1.4,
      "&::placeholder": {
        opacity: 1,
      },
    },
  } as const;
  const authLabelSx = {
    "&.MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      transform: "translate(42px, 12px) scale(1)",
    },
  } as const;

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Paper sx={{ width: "100%", maxWidth: 460, p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={2.25} component={Form} method="post" noValidate>
          <Box>
            <Typography variant="h5" fontWeight={700}>Signup</Typography>
            <Typography variant="body2" color="text.secondary">
              Create your account and continue to console.
            </Typography>
          </Box>

          {actionData?.formError ? <Alert severity="error">{actionData.formError}</Alert> : null}

          <TextField
            label="Name"
            name="name"
            required
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            autoComplete="name"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.name)}
            helperText={actionData?.fieldErrors?.name}
            sx={authFieldSx}
            slotProps={{
              inputLabel: { shrink: nameFocused || name.length > 0, sx: authLabelSx },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            autoComplete="email"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.email)}
            helperText={actionData?.fieldErrors?.email}
            sx={authFieldSx}
            slotProps={{
              inputLabel: { shrink: emailFocused || email.length > 0, sx: authLabelSx },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            autoComplete="new-password"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.password)}
            helperText={
              actionData?.fieldErrors?.password ??
              "Use at least 8 chars with upper/lowercase, number, special."
            }
            sx={authFieldSx}
            slotProps={{
              inputLabel: { shrink: passwordFocused || password.length > 0, sx: authLabelSx },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      edge="end"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            fullWidth
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={() => setConfirmPasswordFocused(false)}
            autoComplete="new-password"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.confirmPassword)}
            helperText={actionData?.fieldErrors?.confirmPassword}
            sx={authFieldSx}
            slotProps={{
              inputLabel: { shrink: confirmPasswordFocused || confirmPassword.length > 0, sx: authLabelSx },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      edge="end"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>

          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" underline="hover">Login</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
