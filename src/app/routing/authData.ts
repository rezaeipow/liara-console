import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router-dom";
import { AccountsAPI } from "@/api/accountsApi";
import { AuthAPI } from "@/api/authApi";
import { ApiError } from "@/api/httpClient";
import { setAccounts } from "@/app/store/slices/accountSlice";
import { fetchMe, login, logout, signup } from "@/app/store/slices/authSlice";
import { store } from "@/app/store/index";

type AuthActionResult = {
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  formError?: string;
  successMessage?: string;
  resetToken?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,<>/?`~]).{8,}$/;

function validateCredentials(input: {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  requireName?: boolean;
  requirePasswordConfirmation?: boolean;
  enforceStrongPassword?: boolean;
}): AuthActionResult | null {
  const fieldErrors: NonNullable<AuthActionResult["fieldErrors"]> = {};

  if (input.requireName && (!input.name || input.name.trim().length < 2)) {
    fieldErrors.name = "Name must be at least 2 characters.";
  }
  if (!input.email || !EMAIL_REGEX.test(input.email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  if (!input.password) {
    fieldErrors.password = "Password is required.";
  } else if ((input.enforceStrongPassword ?? true) && !STRONG_PASSWORD_REGEX.test(input.password)) {
    fieldErrors.password =
      "Password must include uppercase, lowercase, number, and special character.";
  }
  if (
    input.requirePasswordConfirmation &&
    input.password !== (input.confirmPassword ?? "")
  ) {
    fieldErrors.confirmPassword = "Password confirmation does not match.";
  }

  return Object.keys(fieldErrors).length > 0 ? { fieldErrors } : null;
}

function getAuthState() {
  return store.getState().auth;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export async function publicOnlyLoader({ request }: LoaderFunctionArgs) {
  const { token } = getAuthState();
  if (token) {
    const url = new URL(request.url);
    const next = url.searchParams.get("next") ?? "/console";
    throw redirect(next.startsWith("/") ? next : "/console");
  }
  return null;
}

export async function protectedConsoleLoader({ request }: LoaderFunctionArgs) {
  const auth = getAuthState();
  const requestUrl = new URL(request.url);
  const currentPath = `${requestUrl.pathname}${requestUrl.search}`;

  if (!auth.token) {
    throw redirect(`/login?next=${encodeURIComponent(currentPath)}`);
  }

  if (!auth.user) {
    const result = await store.dispatch(fetchMe());
    if (fetchMe.rejected.match(result)) {
      throw redirect(`/login?next=${encodeURIComponent(currentPath)}`);
    }
  }

  try {
    const accountsResponse = await AccountsAPI.list();
    store.dispatch(
      setAccounts({
        accounts: accountsResponse.items,
        activeAccountId: accountsResponse.activeAccountId,
      }),
    );
  } catch {
    // Keep console available even if accounts fetch fails for this navigation.
  }

  return null;
}

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const validation = validateCredentials({ email, password, enforceStrongPassword: false });
  if (validation) return validation;

  const result = await store.dispatch(login({ email, password }));
  if (login.rejected.match(result)) {
    return {
      fieldErrors: { password: "The password you entered is incorrect." },
    } satisfies AuthActionResult;
  }

  const url = new URL(request.url);
  const next = url.searchParams.get("next") ?? "/console";
  const safeNext = next.startsWith("/") ? next : "/console";
  throw redirect(`/auth/complete?mode=login&next=${encodeURIComponent(safeNext)}`);
}

export async function signupAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const validation = validateCredentials({
    name,
    email,
    password,
    confirmPassword,
    requireName: true,
    requirePasswordConfirmation: true,
  });
  if (validation) return validation;

  const result = await store.dispatch(signup({ name, email, password }));
  if (signup.rejected.match(result)) {
    const message = result.payload ?? "Signup failed.";
    if (message.toLowerCase().includes("email already exists")) {
      return {
        fieldErrors: { email: "This email is already registered." },
      } satisfies AuthActionResult;
    }
    return { formError: message } satisfies AuthActionResult;
  }

  throw redirect("/auth/complete?mode=signup&next=%2Fconsole");
}

export async function forgotPasswordAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !EMAIL_REGEX.test(email)) {
    return {
      fieldErrors: { email: "Please enter a valid email address." },
    } satisfies AuthActionResult;
  }

  try {
    const response = await AuthAPI.forgotPassword({ email });
    return {
      successMessage: response.message,
      resetToken: response.resetToken,
    } satisfies AuthActionResult;
  } catch (error: unknown) {
    return {
      formError: getErrorMessage(error, "Could not process forgot password request."),
    } satisfies AuthActionResult;
  }
}

export async function resetPasswordAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { formError: "Reset token is missing or invalid." } satisfies AuthActionResult;
  }

  const fieldErrors: NonNullable<AuthActionResult["fieldErrors"]> = {};
  if (!password || !STRONG_PASSWORD_REGEX.test(password)) {
    fieldErrors.password =
      "Password must include uppercase, lowercase, number, and special character.";
  }
  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = "Password confirmation does not match.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors } satisfies AuthActionResult;
  }

  try {
    await AuthAPI.resetPassword({ token, password });
    throw redirect("/login?reset=1");
  } catch (error: unknown) {
    if (error instanceof Response) throw error;
    if (error instanceof ApiError && error.message.includes("different from current")) {
      return {
        fieldErrors: {
          password: "New password must be different from your current password.",
        },
      } satisfies AuthActionResult;
    }
    return {
      formError: getErrorMessage(error, "Reset password failed."),
    } satisfies AuthActionResult;
  }
}

export async function logoutAction() {
  await store.dispatch(logout());
  throw redirect("/auth/complete?mode=logout&next=%2Flogin");
}

export type { AuthActionResult };
