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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export interface ResetPasswordRequest {
  token: string;
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

  forgotPassword: (payload: ForgotPasswordRequest) =>
    request<ForgotPasswordResponse>("/auth/forgot-password", { method: "POST", body: payload }),

  resetPassword: (payload: ResetPasswordRequest) =>
    request<{ success: boolean }>("/auth/reset-password", { method: "POST", body: payload }),

  logout: () => request<{ success: boolean }>("/auth/logout", { method: "POST" }),

  getMe: () => request<User>("/me"),
};
