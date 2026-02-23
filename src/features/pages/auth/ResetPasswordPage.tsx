import { Alert, Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Form, Link as RouterLink, useActionData, useNavigation } from "react-router-dom";
import type { AuthActionResult } from "@/app/routing/authData";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import AuthPasswordInputField from "./components/AuthPasswordInputField";
import AuthPasswordRulesHint from "./components/AuthPasswordRulesHint";
import { buildPasswordChecks } from "./passwordChecks";

export default function ResetPasswordPage() {
  const actionData = useActionData() as AuthActionResult | undefined;
  const navigation = useNavigation();
  const { getParam } = useQueryParams();
  const token = getParam("token", "");
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false), [showConfirmPassword, setShowConfirmPassword] = useState(false), [password, setPassword] = useState(""), [confirmPassword, setConfirmPassword] = useState(""), [passwordFocused, setPasswordFocused] = useState(false), [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const passwordChecks = buildPasswordChecks(password);
  const showPasswordRules = password.length > 0 || Boolean(actionData?.fieldErrors?.password);
  const currentPasswordConflict = actionData?.fieldErrors?.password?.includes("different from your current password") ?? false;
  const passwordHelper = <AuthPasswordRulesHint checks={passwordChecks} fieldError={actionData?.fieldErrors?.password} showRules={showPasswordRules} showCurrentPasswordConflict={currentPasswordConflict} />;

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Paper sx={{ width: "100%", maxWidth: 460, p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={2.25} component={Form} method="post" noValidate>
          <Box>
            <Typography variant="h5" fontWeight={700}>Reset password</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>Set a new password for your account.</Typography>
          </Box>
          {!token ? <Alert severity="error">Reset token is missing. Please request a new reset link.</Alert> : null}
          {actionData?.formError ? <Alert severity="error">{actionData.formError}</Alert> : null}
          <input type="hidden" name="token" value={token} />
          <AuthPasswordInputField label="New Password" name="password" autoComplete="new-password" value={password} onChange={setPassword} focused={passwordFocused} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} disabled={isSubmitting || !token} error={actionData?.fieldErrors?.password} showPassword={showPassword} onToggleShowPassword={() => setShowPassword((prev) => !prev)} helperText={passwordHelper} />
          <AuthPasswordInputField label="Confirm Password" name="confirmPassword" autoComplete="new-password" value={confirmPassword} onChange={setConfirmPassword} focused={confirmPasswordFocused} onFocus={() => setConfirmPasswordFocused(true)} onBlur={() => setConfirmPasswordFocused(false)} disabled={isSubmitting || !token} error={actionData?.fieldErrors?.confirmPassword} showPassword={showConfirmPassword} onToggleShowPassword={() => setShowConfirmPassword((prev) => !prev)} />
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting || !token}>{isSubmitting ? "Updating..." : "Update password"}</Button>
          <Typography variant="body2" color="text.secondary"><Link component={RouterLink} to="/login" underline="hover">Back to login</Link></Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
