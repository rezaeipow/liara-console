import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { createId, db } from "../data/db";

export const billingHandlers: HttpHandler[] = [
  http.get("/billing/credit", () => {
    return HttpResponse.json({ credit: db.credit });
  }),

  http.post("/billing/topup", async ({ request }) => {
    const body = (await request.json()) as { amount?: number };
    if (!body.amount || body.amount <= 0) {
      return HttpResponse.json({ message: "amount must be greater than 0" }, { status: 400 });
    }

    db.credit += body.amount;
    db.payments.unshift({
      id: createId("pay"),
      amount: body.amount,
      createdAt: new Date().toISOString(),
      status: "success",
    });

    return HttpResponse.json({ success: true, credit: db.credit }, { status: 201 });
  }),

  http.get("/billing/payments", () => {
    return HttpResponse.json({ items: db.payments });
  }),

  http.get("/billing/invoices", () => {
    return HttpResponse.json({ items: db.invoices });
  }),

  http.get("/billing/invoices/:id/download", ({ params }) => {
    const invoice = db.invoices.find((i) => i.id === params.id);
    if (!invoice) {
      return HttpResponse.json({ message: "invoice not found" }, { status: 404 });
    }

    return HttpResponse.json({
      id: invoice.id,
      filename: `${invoice.id}.pdf`,
      url: `/mock-downloads/${invoice.id}.pdf`,
    });
  }),
];
