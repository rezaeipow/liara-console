import { Button, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AuthPasswordInputField from "./AuthPasswordInputField";
import AuthPasswordRulesHint from "./AuthPasswordRulesHint";
import LoginEmailField from "./LoginEmailField";
import SignupNameField from "./SignupNameField";
import type { SignupFormFieldsProps } from "../types";

export default function SignupFormFields(props: SignupFormFieldsProps) {
  return (
    <>
      <SignupNameField
        value={props.name}
        onChange={props.onNameChange}
        focused={props.nameFocused}
        onFocus={() => props.onSetNameFocused(true)}
        onBlur={() => props.onSetNameFocused(false)}
        disabled={props.isSubmitting}
        error={props.actionData?.fieldErrors?.name}
      />
      <LoginEmailField
        value={props.email}
        onChange={props.onEmailChange}
        focused={props.emailFocused}
        onFocus={() => props.onSetEmailFocused(true)}
        onBlur={() => props.onSetEmailFocused(false)}
        disabled={props.isSubmitting}
        error={props.actionData?.fieldErrors?.email}
      />
      <AuthPasswordInputField
        label="Password"
        name="password"
        autoComplete="new-password"
        value={props.password}
        onChange={props.onPasswordChange}
        focused={props.passwordFocused}
        onFocus={() => props.onSetPasswordFocused(true)}
        onBlur={() => props.onSetPasswordFocused(false)}
        disabled={props.isSubmitting}
        error={props.actionData?.fieldErrors?.password}
        showPassword={props.showPassword}
        onToggleShowPassword={() => props.onSetShowPassword(!props.showPassword)}
        helperText={
          <AuthPasswordRulesHint
            checks={props.passwordChecks}
            fieldError={props.actionData?.fieldErrors?.password}
            showRules={props.showPasswordRules}
          />
        }
      />
      <AuthPasswordInputField
        label="Confirm Password"
        name="confirmPassword"
        autoComplete="new-password"
        value={props.confirmPassword}
        onChange={props.onConfirmPasswordChange}
        focused={props.confirmPasswordFocused}
        onFocus={() => props.onSetConfirmPasswordFocused(true)}
        onBlur={() => props.onSetConfirmPasswordFocused(false)}
        disabled={props.isSubmitting}
        error={props.actionData?.fieldErrors?.confirmPassword}
        showPassword={props.showConfirmPassword}
        onToggleShowPassword={() => props.onSetShowConfirmPassword(!props.showConfirmPassword)}
      />
      <Button type="submit" variant="contained" size="large" disabled={props.isSubmitting}>
        {props.isSubmitting ? "Creating..." : "Create account"}
      </Button>
      <Typography variant="body2" color="text.secondary">
        Already have an account?{" "}
        <Link component={RouterLink} to="/login" underline="hover">
          Login
        </Link>
      </Typography>
    </>
  );
}
