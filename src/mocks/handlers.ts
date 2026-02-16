import { rest } from "msw";
import type { LoginRequest, SignupRequest, AuthResponse } from "../api/authApi";

let mockUser: AuthResponse["user"] = {
  id: "1",
  name: "John Doe",
  email: "john@test.com",
  avatar: "",
  twoFAEnabled: false,
};

let mockToken = "fake-jwt-token";

export const handlers = [
  // Login
  rest.post("/api/auth/login", async (req, res, ctx) => {
    const body: LoginRequest = await req.json();
    if (body.email === "fail@test.com") {
      return res(ctx.status(401), ctx.json({ message: "Invalid credentials" }));
    }
    mockUser = { ...mockUser, email: body.email };
    mockToken = "fake-jwt-token";
    return res(ctx.status(200), ctx.json({ user: mockUser, token: mockToken }));
  }),

  // Signup
  rest.post("/api/auth/signup", async (req, res, ctx) => {
    const body: SignupRequest = await req.json();
    mockUser = {
      id: "2",
      name: body.name,
      email: body.email,
      twoFAEnabled: false,
    };
    mockToken = "fake-jwt-token";
    return res(ctx.status(200), ctx.json({ user: mockUser, token: mockToken }));
  }),

  // Logout
  rest.post("/api/auth/logout", (req, res, ctx) => {
    mockToken = "";
    return res(ctx.status(200), ctx.json({ success: true }));
  }),

  // Fetch me
  rest.get("/api/auth/me", (req, res, ctx) => {
    if (!mockToken) {
      return res(ctx.status(401), ctx.json({ message: "Not authenticated" }));
    }
    return res(ctx.status(200), ctx.json(mockUser));
  }),
];
