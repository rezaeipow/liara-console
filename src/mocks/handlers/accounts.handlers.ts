import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import {
  createId,
  db,
  getBillingByAccountId,
  persistAccountsState,
  persistRuntimeState,
} from "../data/db";

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
    getBillingByAccountId(account.id);
    persistAccountsState();
    persistRuntimeState();

    return HttpResponse.json(account, { status: 201 });
  }),

  http.post("/accounts/switch", async ({ request }) => {
    const body = (await request.json()) as { accountId?: string };
    if (!body.accountId || !db.accounts.some((a) => a.id === body.accountId)) {
      return HttpResponse.json({ message: "account not found" }, { status: 404 });
    }

    db.activeAccountId = body.accountId;
    persistAccountsState();
    return HttpResponse.json({ activeAccountId: db.activeAccountId });
  }),

  http.put("/accounts/:accountId", async ({ params, request }) => {
    const accountId = String(params.accountId ?? "");
    const body = (await request.json()) as { name?: string };

    if (!accountId) {
      return HttpResponse.json({ message: "account id is required" }, { status: 400 });
    }

    if (!body.name || body.name.trim().length < 2) {
      return HttpResponse.json(
        { message: "name must be at least 2 characters" },
        { status: 400 },
      );
    }

    const account = db.accounts.find((item) => item.id === accountId);
    if (!account) {
      return HttpResponse.json({ message: "account not found" }, { status: 404 });
    }

    account.name = body.name.trim();
    persistAccountsState();
    return HttpResponse.json(account);
  }),

  http.delete("/accounts/:accountId", ({ params }) => {
    const accountId = String(params.accountId ?? "");
    const targetIndex = db.accounts.findIndex((item) => item.id === accountId);

    if (targetIndex === -1) {
      return HttpResponse.json({ message: "account not found" }, { status: 404 });
    }

    db.accounts.splice(targetIndex, 1);
    delete db.billingByAccountId[accountId];

    if (db.activeAccountId === accountId) {
      db.activeAccountId = db.accounts[0]?.id ?? null;
    }
    persistAccountsState();
    persistRuntimeState();

    return HttpResponse.json({ id: accountId, activeAccountId: db.activeAccountId });
  }),
];
