import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { createId, db } from "../data/db";

export const authHandlers: HttpHandler[] = [
  http.post("/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return HttpResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    const account = db.authUsers.find(
      (user) => user.email.toLowerCase() === email && user.password === body.password,
    );
    if (!account) {
      return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    db.user = {
      id: account.id,
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      twoFAEnabled: account.twoFAEnabled,
    };
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

    const email = body.email.trim().toLowerCase();
    const exists = db.authUsers.some((user) => user.email.toLowerCase() === email);
    if (exists) {
      return HttpResponse.json({ message: "Email already exists" }, { status: 409 });
    }

    const nextUser = {
      id: createId("u"),
      name: body.name,
      email,
      twoFAEnabled: false,
      password: body.password,
    };
    db.authUsers.unshift(nextUser);
    db.user = {
      id: nextUser.id,
      name: nextUser.name,
      email: nextUser.email,
      twoFAEnabled: nextUser.twoFAEnabled,
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

