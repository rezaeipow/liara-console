import { Alert, Box, Paper, Stack, Typography } from "@mui/material";
import { Form } from "react-router-dom";
import SignupFormFields from "./components/SignupFormFields";
import { useSignupPageState } from "./useSignupPageState";

export default function SignupPage() {
  const state = useSignupPageState();

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Paper sx={{ width: "100%", maxWidth: 460, p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={2.25} component={Form} method="post" noValidate>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Signup
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Create your account and continue to console.
            </Typography>
          </Box>

          {state.actionData?.formError ? <Alert severity="error">{state.actionData.formError}</Alert> : null}

          <SignupFormFields
            isSubmitting={state.isSubmitting}
            actionData={state.actionData}
            showPassword={state.showPassword}
            showConfirmPassword={state.showConfirmPassword}
            name={state.name}
            email={state.email}
            password={state.password}
            confirmPassword={state.confirmPassword}
            nameFocused={state.nameFocused}
            emailFocused={state.emailFocused}
            passwordFocused={state.passwordFocused}
            confirmPasswordFocused={state.confirmPasswordFocused}
            showPasswordRules={state.showPasswordRules}
            passwordChecks={state.passwordChecks}
            onSetShowPassword={state.onSetShowPassword}
            onSetShowConfirmPassword={state.onSetShowConfirmPassword}
            onNameChange={state.onNameChange}
            onEmailChange={state.onEmailChange}
            onPasswordChange={state.onPasswordChange}
            onConfirmPasswordChange={state.onConfirmPasswordChange}
            onSetNameFocused={state.onSetNameFocused}
            onSetEmailFocused={state.onSetEmailFocused}
            onSetPasswordFocused={state.onSetPasswordFocused}
            onSetConfirmPasswordFocused={state.onSetConfirmPasswordFocused}
          />
        </Stack>
      </Paper>
    </Box>
  );
}
