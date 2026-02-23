import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import { useState } from "react";
import {
  Form,
  useActionData,
  useNavigation,
} from "react-router-dom";
import type { AuthActionResult } from "@/app/routing/authData";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import LoginEmailField from "./components/LoginEmailField";
import LoginHeader from "./components/LoginHeader";
import LoginLinks from "./components/LoginLinks";
import LoginPasswordField from "./components/LoginPasswordField";

export default function LoginPage() {
  const actionData = useActionData() as AuthActionResult | undefined;
  const navigation = useNavigation();
  const { getParam, getBooleanParam } = useQueryParams();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [emailFocused, setEmailFocused] = useState(false),
    [passwordFocused, setPasswordFocused] = useState(false);
  const next = getParam("next", ""),
    passwordResetDone = getBooleanParam("reset");

  return (
    <Box
      sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}
    >
      <Paper sx={{ width: "100%", maxWidth: 440, p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={2.25} component={Form} method="post" noValidate>
          <LoginHeader />
          {next ? <input type="hidden" name="next" value={next} /> : null}
          {actionData?.formError ? (
            <Alert severity="error">{actionData.formError}</Alert>
          ) : null}
          {passwordResetDone ? (
            <Alert severity="success">
              Password updated successfully. Please login with your new
              password.
            </Alert>
          ) : null}
          <LoginEmailField
            value={email}
            onChange={setEmail}
            focused={emailFocused}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            disabled={isSubmitting}
            error={actionData?.fieldErrors?.email}
          />
          <LoginPasswordField
            value={password}
            onChange={setPassword}
            focused={passwordFocused}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            disabled={isSubmitting}
            error={actionData?.fieldErrors?.password}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword((prev) => !prev)}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
          <LoginLinks />
        </Stack>
      </Paper>
    </Box>
  );
}
