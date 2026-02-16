import { request } from "./httpClient";
import type { User } from "./types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const AuthAPI = {
  login: (payload: LoginRequest) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: payload }),

  signup: (payload: SignupRequest) =>
    request<AuthResponse>("/auth/signup", { method: "POST", body: payload }),

  logout: () => request<{ success: boolean }>("/auth/logout", { method: "POST" }),

  getMe: () => request<User>("/me"),
};

