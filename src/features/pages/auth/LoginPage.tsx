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
import { LockOutlined, MailOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Form, Link as RouterLink, useActionData, useNavigation, useSearchParams } from "react-router-dom";
import type { AuthActionResult } from "../../../app/routing/authData";

export default function LoginPage() {
  const actionData = useActionData() as AuthActionResult | undefined;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const next = searchParams.get("next");
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
      <Paper sx={{ width: "100%", maxWidth: 440, p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={2.25} component={Form} method="post" noValidate>
          <Box>
            <Typography variant="h5" fontWeight={700}>Login</Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in with email/password.
            </Typography>
          </Box>

          {next ? <input type="hidden" name="next" value={next} /> : null}

          {actionData?.formError ? <Alert severity="error">{actionData.formError}</Alert> : null}

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
            autoComplete="current-password"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.password)}
            helperText={actionData?.fieldErrors?.password}
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

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>

          <Typography variant="body2" color="text.secondary">
            Do not have an account?{" "}
            <Link component={RouterLink} to="/signup" underline="hover">Create one</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
