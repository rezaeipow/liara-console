import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AuthAPI, type AuthResponse, type LoginRequest, type SignupRequest } from "../../../api/authApi";
import type { User } from "../../../api/types";
import type { RootState } from "../index";

type AuthStatus = "idle" | "loading" | "authenticated" | "error";

interface PersistedAuth {
  token: string | null;
  user: User | null;
}

type PersistedProfileCache = Record<string, Partial<User>>;

export interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
  initialized: boolean;
}

const STORAGE_KEY = "console-auth-session";
const PROFILE_CACHE_KEY = "console-auth-profile-cache";

function cacheKeyForUser(user: Pick<User, "id" | "email">): string {
  return user.id || user.email.toLowerCase();
}

function readProfileCache(): PersistedProfileCache {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PersistedProfileCache;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeProfileCache(cache: PersistedProfileCache) {
  try {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore persistence errors
  }
}

function mergeUserWithProfileCache(user: User | null): User | null {
  if (!user) return null;
  const cache = readProfileCache();
  const cached = cache[cacheKeyForUser(user)];
  if (!cached) return user;
  return {
    ...user,
    ...cached,
  };
}

function upsertProfileCache(user: User | null) {
  if (!user) return;
  const cache = readProfileCache();
  const key = cacheKeyForUser(user);
  cache[key] = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    twoFAEnabled: user.twoFAEnabled,
  };
  writeProfileCache(cache);
}

function readPersistedAuth(): PersistedAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw) as PersistedAuth;
    return {
      token: parsed.token ?? null,
      user: mergeUserWithProfileCache(parsed.user ?? null),
    };
  } catch {
    return { token: null, user: null };
  }
}

function persistAuth(payload: PersistedAuth) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    upsertProfileCache(payload.user);
  } catch {
    // ignore persistence errors
  }
}

function clearPersistedAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore persistence errors
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

const persisted = readPersistedAuth();

const initialState: AuthState = {
  user: persisted.user,
  token: persisted.token,
  status: persisted.token ? "authenticated" : "idle",
  error: null,
  initialized: false,
};

export const login = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    return await AuthAPI.login(credentials);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Login failed"));
  }
});

export const signup = createAsyncThunk<
  AuthResponse,
  SignupRequest,
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    return await AuthAPI.signup(payload);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Signup failed"));
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthAPI.logout();
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Logout failed"));
    }
  },
);

export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      return await AuthAPI.getMe();
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Fetch user failed"));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state) {
      if (state.initialized) return;
      const snapshot = readPersistedAuth();
      state.token = snapshot.token;
      state.user = snapshot.user;
      state.status = snapshot.token ? "authenticated" : "idle";
      state.initialized = true;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.status = action.payload ? "authenticated" : "idle";
      persistAuth({ token: state.token, user: state.user });
    },
    clearAuthError(state) {
      state.error = null;
      if (state.status === "error") {
        state.status = state.token ? "authenticated" : "idle";
      }
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      persistAuth({ token: state.token, user: state.user });
      upsertProfileCache(state.user);
    },
    enable2FA(state) {
      if (!state.user) return;
      state.user.twoFAEnabled = true;
      persistAuth({ token: state.token, user: state.user });
      upsertProfileCache(state.user);
    },
    disable2FA(state) {
      if (!state.user) return;
      state.user.twoFAEnabled = false;
      persistAuth({ token: state.token, user: state.user });
      upsertProfileCache(state.user);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.error = null;
        state.user = mergeUserWithProfileCache(action.payload.user);
        state.token = action.payload.token;
        state.initialized = true;
        persistAuth({ token: state.token, user: state.user });
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Login failed";
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.error = null;
        state.user = mergeUserWithProfileCache(action.payload.user);
        state.token = action.payload.token;
        state.initialized = true;
        persistAuth({ token: state.token, user: state.user });
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Signup failed";
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.error = null;
        state.user = mergeUserWithProfileCache(action.payload);
        state.initialized = true;
        persistAuth({ token: state.token, user: state.user });
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Fetch user failed";
        state.user = null;
        state.token = null;
        state.initialized = true;
        clearPersistedAuth();
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
        state.initialized = true;
        clearPersistedAuth();
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Logout failed";
      });
  },
});

export const {
  hydrateAuth,
  setToken,
  clearAuthError,
  updateProfile,
  enable2FA,
  disable2FA,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthInitialized = (state: RootState) => state.auth.initialized;
export const selectAuthLoading = (state: RootState) => state.auth.status === "loading";
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.token && state.auth.user);

export default authSlice.reducer;
