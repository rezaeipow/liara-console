import { delay, http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { createId, getActiveBilling } from "../data/db";

const TIMEOUT_DELAY_MS = 13_000;

function readMockStatus(request: Request): number | "timeout" | null {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("mockStatus");
  const fromHeader = request.headers.get("x-mock-status");
  const raw = (fromQuery ?? fromHeader ?? "").trim().toLowerCase();

  if (!raw) return null;
  if (raw === "timeout") return "timeout";

  const status = Number(raw);
  if ([401, 403, 404, 500].includes(status)) {
    return status;
  }

  return null;
}

async function maybeMockFailure(request: Request): Promise<Response | null> {
  const mockStatus = readMockStatus(request);
  if (!mockStatus) return null;

  if (mockStatus === "timeout") {
    await delay(TIMEOUT_DELAY_MS);
    return HttpResponse.json({ message: "Request timed out. Please try again." }, { status: 504 });
  }

  const messageByStatus: Record<number, string> = {
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };

  return HttpResponse.json(
    { message: `Mocked billing error: ${messageByStatus[mockStatus]}` },
    { status: mockStatus },
  );
}

export const billingHandlers: HttpHandler[] = [
  http.get("/billing/credit", async ({ request }) => {
    const failure = await maybeMockFailure(request);
    if (failure) return failure;

    const billing = getActiveBilling();
    return HttpResponse.json({ credit: billing.credit });
  }),

  http.post("/billing/topup", async ({ request }) => {
    const failure = await maybeMockFailure(request);
    if (failure) return failure;

    const billing = getActiveBilling();
    const body = (await request.json()) as { amount?: number };
    const amount = typeof body.amount === "number" ? Math.floor(body.amount) : Number.NaN;

    if (!Number.isFinite(amount)) {
      return HttpResponse.json({ message: "Please enter a valid amount." }, { status: 400 });
    }

    if (amount < 10000) {
      return HttpResponse.json({ message: "Minimum top-up amount is 10,000 IRR." }, { status: 400 });
    }

    if (amount > 500000000) {
      return HttpResponse.json({ message: "Maximum top-up amount is 500,000,000 IRR." }, { status: 400 });
    }

    billing.credit += amount;
    billing.payments.unshift({
      id: createId("pay"),
      amount,
      createdAt: new Date().toISOString(),
      status: "success",
    });

    return HttpResponse.json({ success: true, credit: billing.credit }, { status: 201 });
  }),

  http.get("/billing/payments", async ({ request }) => {
    const failure = await maybeMockFailure(request);
    if (failure) return failure;

    const billing = getActiveBilling();
    return HttpResponse.json({ items: billing.payments });
  }),

  http.get("/billing/invoices", async ({ request }) => {
    const failure = await maybeMockFailure(request);
    if (failure) return failure;

    const billing = getActiveBilling();
    return HttpResponse.json({ items: billing.invoices });
  }),

  http.get("/billing/invoices/:id/download", async ({ request, params }) => {
    const failure = await maybeMockFailure(request);
    if (failure) return failure;

    const billing = getActiveBilling();
    const invoice = billing.invoices.find((i) => i.id === params.id);
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
