// src/app/store/slices/authSlice.ts
import { createSlice,type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { type RootState } from "../../store";
import { AuthAPI } from "../../api/authApi";
 

// ---------------------------
// Types
// ---------------------------
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  twoFAEnabled?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ---------------------------
// Initial state
// ---------------------------
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// ---------------------------
// Async Thunks
// ---------------------------

// Login
export const login = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await AuthAPI.login(credentials); // mock API call
    return res;
  } catch (err: any) {
    return rejectWithValue(err.message || "Login failed");
  }
});

// Signup
export const signup = createAsyncThunk<
  { user: User; token: string },
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    const res = await AuthAPI.signup(payload); // mock API call
    return res;
  } catch (err: any) {
    return rejectWithValue(err.message || "Signup failed");
  }
});

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await AuthAPI.logout(); // mock API
  return;
});

// Get current user (e.g., after refresh)
export const fetchMe = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const user = await AuthAPI.getMe();
    return user;
  } catch (err: any) {
    return rejectWithValue(err.message || "Fetch user failed");
  }
});

// ---------------------------
// Slice
// ---------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    enable2FA(state) {
      if (state.user) state.user.twoFAEnabled = true;
    },
    disable2FA(state) {
      if (state.user) state.user.twoFAEnabled = false;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Login failed";
    });

    // Signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Signup failed";
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    });

    // fetchMe
    builder.addCase(fetchMe.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchMe.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload ?? "Failed to fetch user";
    });
  },
});

// ---------------------------
// Selectors
// ---------------------------
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// ---------------------------
// Actions
// ---------------------------
export const { updateProfile, enable2FA, disable2FA, setToken } =
  authSlice.actions;

// ---------------------------
// Export
// ---------------------------
export default authSlice.reducer;
