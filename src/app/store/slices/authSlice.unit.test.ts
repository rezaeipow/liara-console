import { beforeEach, describe, expect, it } from "vitest";
import type { User } from "@/api/types";
import { store } from "@/app/store";
import authReducer, {
  clearAuthError,
  disable2FA,
  enable2FA,
  fetchMe,
  login,
  logout,
  selectAuthError,
  selectAuthInitialized,
  selectAuthLoading,
  selectAuthStatus,
  selectIsAuthenticated,
  selectToken,
  selectUser,
  setToken,
  signup,
  updateProfile,
} from "./authSlice";

const user: User = {
  id: "u-1",
  name: "Mohamad",
  email: "mohamad@example.com",
  twoFAEnabled: false,
};

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("sets token with authenticated status", () => {
    const state = authReducer(undefined, setToken("token-1"));
    expect(state.token).toBe("token-1");
    expect(state.status).toBe("authenticated");
  });

  it("updates profile fields", () => {
    const authenticated = authReducer(
      undefined,
      login.fulfilled({ user, token: "seed-token" }, "req-1", {
        email: user.email,
        password: "Password123!",
      }),
    );
    const next = authReducer(authenticated, updateProfile({ name: "Mo" }));
    expect(next.user?.name).toBe("Mo");
  });

  it("enables and disables 2fa", () => {
    const authenticated = authReducer(
      undefined,
      login.fulfilled({ user, token: "seed-token" }, "req-1", {
        email: user.email,
        password: "Password123!",
      }),
    );
    const enabled = authReducer(authenticated, enable2FA());
    const disabled = authReducer(enabled, disable2FA());
    expect(enabled.user?.twoFAEnabled).toBe(true);
    expect(disabled.user?.twoFAEnabled).toBe(false);
  });

  it("handles pending and rejected login", () => {
    const pending = authReducer(undefined, login.pending("req-1", { email: "a", password: "b" }));
    const rejected = authReducer(
      pending,
      login.rejected(new Error("bad credentials"), "req-1", { email: "a", password: "b" }, "Login failed"),
    );
    expect(pending.status).toBe("loading");
    expect(rejected.status).toBe("error");
    expect(rejected.error).toBe("Login failed");
  });

  it("handles fulfilled signup and fetchMe", () => {
    const signed = authReducer(
      undefined,
      signup.fulfilled({ user, token: "t-1" }, "req-2", {
        name: user.name,
        email: user.email,
        password: "Password123!",
      }),
    );
    const fetched = authReducer(signed, fetchMe.fulfilled({ ...user, name: "Fetched" }, "req-3"));
    expect(signed.status).toBe("authenticated");
    expect(fetched.user?.name).toBe("Mohamad");
  });

  it("clears auth on logout fulfilled", () => {
    const authenticated = authReducer(
      undefined,
      login.fulfilled({ user, token: "seed-token" }, "req-1", {
        email: user.email,
        password: "Password123!",
      }),
    );
    const loggedOut = authReducer(authenticated, logout.fulfilled(undefined, "req-4", undefined));
    expect(loggedOut.user).toBeNull();
    expect(loggedOut.token).toBeNull();
    expect(loggedOut.status).toBe("idle");
  });

  it("selectors read auth fields", () => {
    const auth = authReducer(
      undefined,
      login.fulfilled({ user, token: "seed-token" }, "req-1", {
        email: user.email,
        password: "Password123!",
      }),
    );
    const root = { ...store.getState(), auth };
    expect(selectUser(root)).toEqual(user);
    expect(selectToken(root)).toBe("seed-token");
    expect(selectAuthStatus(root)).toBe("authenticated");
    expect(selectAuthLoading(root)).toBe(false);
    expect(selectAuthError(root)).toBeNull();
    expect(selectAuthInitialized(root)).toBe(true);
    expect(selectIsAuthenticated(root)).toBe(true);
  });

  it("clearAuthError resets error state to idle/authenticated", () => {
    const errored = authReducer(
      undefined,
      login.rejected(new Error("bad"), "req-1", { email: "a", password: "b" }, "Login failed"),
    );
    const cleared = authReducer(errored, clearAuthError());
    expect(cleared.error).toBeNull();
    expect(cleared.status).toBe("idle");
  });
});
