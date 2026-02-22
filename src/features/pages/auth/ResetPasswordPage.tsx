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
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import {
  Form,
  Link as RouterLink,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import type { AuthActionResult } from "../../../app/routing/authData";

export default function ResetPasswordPage() {
  const actionData = useActionData() as AuthActionResult | undefined;
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,<>/?`~]/.test(password),
  };
  const allPasswordChecksPassed = Object.values(passwordChecks).every(Boolean);
  const showPasswordRules = password.length > 0 || Boolean(actionData?.fieldErrors?.password);
  const currentPasswordConflict =
    actionData?.fieldErrors?.password?.includes("different from your current password") ?? false;
  const passwordHelper = currentPasswordConflict ? (
    <Typography component="span" variant="caption" sx={{ color: "text.primary" }}>
      <Box component="span" sx={{ color: "error.main", display: "block", mt: 0.35 }}>
        {actionData?.fieldErrors?.password}
      </Box>
    </Typography>
  ) : showPasswordRules && !allPasswordChecksPassed ? (
    <Typography component="span" variant="caption" sx={{ color: "text.primary" }}>
      Use at least{" "}
      <Box component="span" sx={{ color: passwordChecks.length ? "text.primary" : "error.main", fontWeight: 600 }}>
        8 chars
      </Box>{" "}
      with{" "}
      <Box component="span" sx={{ color: passwordChecks.upper ? "text.primary" : "error.main", fontWeight: 600 }}>
        uppercase
      </Box>
      /
      <Box component="span" sx={{ color: passwordChecks.lower ? "text.primary" : "error.main", fontWeight: 600 }}>
        lowercase
      </Box>
      ,{" "}
      <Box component="span" sx={{ color: passwordChecks.number ? "text.primary" : "error.main", fontWeight: 600 }}>
        number
      </Box>
      ,{" "}
      <Box component="span" sx={{ color: passwordChecks.special ? "text.primary" : "error.main", fontWeight: 600 }}>
        special
      </Box>
      .
    </Typography>
  ) : !allPasswordChecksPassed ? (
    "Use at least 8 chars with upper/lowercase, number, special."
  ) : (
    ""
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Paper sx={{ width: "100%", maxWidth: 460, p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={2.25} component={Form} method="post" noValidate>
          <Box>
            <Typography variant="h5" fontWeight={700}>Reset password</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Set a new password for your account.
            </Typography>
          </Box>

          {!token ? (
            <Alert severity="error">
              Reset token is missing. Please request a new reset link.
            </Alert>
          ) : null}
          {actionData?.formError ? <Alert severity="error">{actionData.formError}</Alert> : null}

          <input type="hidden" name="token" value={token} />

          <TextField
            label="New Password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            autoComplete="new-password"
            disabled={isSubmitting || !token}
            error={Boolean(actionData?.fieldErrors?.password)}
            helperText={passwordHelper}
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
            disabled={isSubmitting || !token}
            error={Boolean(actionData?.fieldErrors?.confirmPassword)}
            helperText={actionData?.fieldErrors?.confirmPassword}
            sx={authFieldSx}
            slotProps={{
              inputLabel: {
                shrink: confirmPasswordFocused || confirmPassword.length > 0,
                sx: authLabelSx,
              },
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

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting || !token}>
            {isSubmitting ? "Updating..." : "Update password"}
          </Button>

          <Typography variant="body2" color="text.secondary">
            <Link component={RouterLink} to="/login" underline="hover">Back to login</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
