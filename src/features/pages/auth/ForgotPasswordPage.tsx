import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MailOutline } from "@mui/icons-material";
import { useState } from "react";
import { Form, Link as RouterLink, useActionData, useNavigation } from "react-router-dom";
import type { AuthActionResult } from "../../../app/routing/authData";

export default function ForgotPasswordPage() {
  const actionData = useActionData() as AuthActionResult | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

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
            <Typography variant="h5" fontWeight={700}>Forgot password</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Enter your email and we will send reset instructions.
            </Typography>
          </Box>

          {actionData?.formError ? <Alert severity="error">{actionData.formError}</Alert> : null}
          {actionData?.successMessage ? <Alert severity="success">{actionData.successMessage}</Alert> : null}

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

          {actionData?.resetToken ? (
            <Alert severity="info">
              Mock reset link:{" "}
              <Link component={RouterLink} to={`/reset-password?token=${encodeURIComponent(actionData.resetToken)}`}>
                Open reset page
              </Link>
            </Alert>
          ) : null}

          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>

          <Typography variant="body2" color="text.secondary">
            Remembered your password?{" "}
            <Link component={RouterLink} to="/login" underline="hover">Back to login</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
