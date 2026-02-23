import type { ReactNode } from "react";

export type AuthFieldProps = {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  disabled: boolean;
  error: string | undefined;
};

export type AuthPasswordFieldProps = AuthFieldProps & {
  showPassword: boolean;
  onToggleShowPassword: () => void;
};

export type PasswordChecks = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
};

export type AuthPasswordInputFieldProps = AuthPasswordFieldProps & {
  label: string;
  name: string;
  autoComplete: string;
  helperText?: string | ReactNode;
};

export type AuthPasswordRulesHintProps = {
  checks: PasswordChecks;
  fieldError?: string;
  showRules: boolean;
  showCurrentPasswordConflict?: boolean;
};

export type SignupState = {
  isSubmitting: boolean;
  actionData?: {
    formError?: string;
    fieldErrors?: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nameFocused: boolean;
  emailFocused: boolean;
  passwordFocused: boolean;
  confirmPasswordFocused: boolean;
  showPasswordRules: boolean;
  passwordChecks: PasswordChecks;
  onSetShowPassword: (next: boolean) => void;
  onSetShowConfirmPassword: (next: boolean) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSetNameFocused: (next: boolean) => void;
  onSetEmailFocused: (next: boolean) => void;
  onSetPasswordFocused: (next: boolean) => void;
  onSetConfirmPasswordFocused: (next: boolean) => void;
};

export type SignupFormFieldsProps = {
  isSubmitting: boolean;
  actionData?: SignupState["actionData"];
  showPassword: boolean;
  showConfirmPassword: boolean;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nameFocused: boolean;
  emailFocused: boolean;
  passwordFocused: boolean;
  confirmPasswordFocused: boolean;
  showPasswordRules: boolean;
  passwordChecks: PasswordChecks;
  onSetShowPassword: (next: boolean) => void;
  onSetShowConfirmPassword: (next: boolean) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSetNameFocused: (next: boolean) => void;
  onSetEmailFocused: (next: boolean) => void;
  onSetPasswordFocused: (next: boolean) => void;
  onSetConfirmPasswordFocused: (next: boolean) => void;
};

export type ForgotPasswordEmailFieldProps = {
  value: string;
  focused: boolean;
  disabled: boolean;
  error: string | undefined;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
};
