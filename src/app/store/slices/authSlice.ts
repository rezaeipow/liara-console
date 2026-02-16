import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
}


interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}


const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;


export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.isLoggedIn;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;

export default authSlice.reducer;
