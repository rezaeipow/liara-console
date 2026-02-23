import { useState } from "react";
import { useActionData, useNavigation } from "react-router-dom";
import type { AuthActionResult } from "@/app/routing/authData";
import { buildPasswordChecks } from "./passwordChecks";
import type { SignupState } from "./types";

export function useSignupPageState(): SignupState {
  const actionData = useActionData() as AuthActionResult | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const passwordChecks = buildPasswordChecks(password);
  const showPasswordRules = password.length > 0 || Boolean(actionData?.fieldErrors?.password);

  return {
    isSubmitting,
    actionData,
    showPassword,
    showConfirmPassword,
    name,
    email,
    password,
    confirmPassword,
    nameFocused,
    emailFocused,
    passwordFocused,
    confirmPasswordFocused,
    showPasswordRules,
    passwordChecks,
    onSetShowPassword: setShowPassword,
    onSetShowConfirmPassword: setShowConfirmPassword,
    onNameChange: setName,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onConfirmPasswordChange: setConfirmPassword,
    onSetNameFocused: setNameFocused,
    onSetEmailFocused: setEmailFocused,
    onSetPasswordFocused: setPasswordFocused,
    onSetConfirmPasswordFocused: setConfirmPasswordFocused,
  };
}
