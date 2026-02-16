import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { db } from "../data/db";

export const authHandlers: HttpHandler[] = [
  http.post("/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return HttpResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    if (body.email === "fail@test.com") {
      return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    db.user.email = body.email;
    db.token = "mock-token";

    return HttpResponse.json({ user: db.user, token: db.token });
  }),

  http.post("/auth/signup", async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    db.user = {
      id: "u-2",
      name: body.name,
      email: body.email,
      twoFAEnabled: false,
    };
    db.token = "mock-token";

    return HttpResponse.json({ user: db.user, token: db.token }, { status: 201 });
  }),

  http.post("/auth/logout", () => {
    db.token = "";
    return HttpResponse.json({ success: true });
  }),

  http.get("/me", () => {
    if (!db.token) {
      return HttpResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    return HttpResponse.json(db.user);
  }),
];
