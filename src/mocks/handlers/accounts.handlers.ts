import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { createId, db } from "../data/db";

export const accountHandlers: HttpHandler[] = [
  http.get("/accounts", () => {
    return HttpResponse.json({
      items: db.accounts,
      activeAccountId: db.activeAccountId,
    });
  }),

  http.post("/accounts", async ({ request }) => {
    const body = (await request.json()) as { name?: string };
    if (!body.name) {
      return HttpResponse.json({ message: "name is required" }, { status: 400 });
    }

    const account = { id: createId("acc"), name: body.name };
    db.accounts.unshift(account);

    return HttpResponse.json(account, { status: 201 });
  }),

  http.post("/accounts/switch", async ({ request }) => {
    const body = (await request.json()) as { accountId?: string };
    if (!body.accountId || !db.accounts.some((a) => a.id === body.accountId)) {
      return HttpResponse.json({ message: "account not found" }, { status: 404 });
    }

    db.activeAccountId = body.accountId;
    return HttpResponse.json({ activeAccountId: db.activeAccountId });
  }),
];
