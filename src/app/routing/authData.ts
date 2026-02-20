import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router-dom";
import { AccountsAPI } from "../../api/accountsApi";
import { store } from "../store/index";
import { fetchMe, login, logout, signup } from "../store/slices/authSlice";
import { setAccounts } from "../store/slices/accountSlice";

type AuthActionResult = {
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  formError?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

function validateCredentials(input: {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  requireName?: boolean;
  requirePasswordConfirmation?: boolean;
}): AuthActionResult | null {
  const fieldErrors: NonNullable<AuthActionResult["fieldErrors"]> = {};

  if (input.requireName && (!input.name || input.name.trim().length < 2)) {
    fieldErrors.name = "Name must be at least 2 characters.";
  }
  if (!input.email || !EMAIL_REGEX.test(input.email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  if (!input.password || !STRONG_PASSWORD_REGEX.test(input.password)) {
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

  const validation = validateCredentials({ email, password });
  if (validation) return validation;

  const result = await store.dispatch(login({ email, password }));
  if (login.rejected.match(result)) {
    return { formError: result.payload ?? "Invalid credentials." } satisfies AuthActionResult;
  }

  const url = new URL(request.url);
  const next = url.searchParams.get("next") ?? "/console";
  throw redirect(next.startsWith("/") ? next : "/console");
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

  throw redirect("/console");
}

export async function logoutAction() {
  await store.dispatch(logout());
  throw redirect("/login");
}

export type { AuthActionResult };

