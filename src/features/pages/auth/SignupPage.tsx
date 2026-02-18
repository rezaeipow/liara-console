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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Form, Link as RouterLink, useActionData, useNavigation } from "react-router-dom";
import type { AuthActionResult } from "../../../app/routing/authData";

export default function SignupPage() {
  const actionData = useActionData() as AuthActionResult | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            autoComplete="name"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.name)}
            helperText={actionData?.fieldErrors?.name}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            required
            fullWidth
            autoComplete="email"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.email)}
            helperText={actionData?.fieldErrors?.email}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            autoComplete="new-password"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.password)}
            helperText={
              actionData?.fieldErrors?.password ??
              "Use at least 8 chars with upper/lowercase, number, special."
            }
            slotProps={{
              input: {
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
            autoComplete="new-password"
            disabled={isSubmitting}
            error={Boolean(actionData?.fieldErrors?.confirmPassword)}
            helperText={actionData?.fieldErrors?.confirmPassword}
            slotProps={{
              input: {
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
