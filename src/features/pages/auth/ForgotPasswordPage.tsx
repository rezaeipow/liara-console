import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Form, Link as RouterLink, useActionData, useNavigation } from "react-router-dom";
import type { AuthActionResult } from "@/app/routing/authData";
import ForgotPasswordEmailField from "./components/ForgotPasswordEmailField";

export default function ForgotPasswordPage() {
  const actionData = useActionData() as AuthActionResult | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

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

          <ForgotPasswordEmailField
            value={email}
            onChange={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            focused={emailFocused}
            disabled={isSubmitting}
            error={actionData?.fieldErrors?.email}
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
