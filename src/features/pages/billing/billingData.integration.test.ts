import { describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { BillingAPI } from "@/api/billingApi";
import { ApiError } from "@/api/httpClient";
import {
  billingInvoicesLoader,
  billingPaymentsLoader,
  billingTopupAction,
} from "./billingData";

function buildRequest(url: string, form: Record<string, string>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(form)) {
    params.set(key, value);
  }

  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: params.toString(),
  });
}

describe("billingData integration", () => {
  it("validates invalid top-up amount", async () => {
    const result = await billingTopupAction({
      request: buildRequest("http://localhost/console/billing/topup", { amount: "abc" }),
    } as unknown as ActionFunctionArgs);

    expect(result.fieldErrors?.amount).toBe("Please enter a valid amount.");
  });

  it("validates minimum and maximum top-up amount", async () => {
    const low = await billingTopupAction({
      request: buildRequest("http://localhost/console/billing/topup", { amount: "9999" }),
    } as unknown as ActionFunctionArgs);
    const high = await billingTopupAction({
      request: buildRequest("http://localhost/console/billing/topup", { amount: "500000001" }),
    } as unknown as ActionFunctionArgs);

    expect(low.fieldErrors?.amount).toContain("Minimum");
    expect(high.fieldErrors?.amount).toContain("Maximum");
  });

  it("returns success payload after valid top-up", async () => {
    vi.spyOn(BillingAPI, "topup").mockResolvedValue({ success: true, credit: 870000 });

    const result = await billingTopupAction({
      request: buildRequest("http://localhost/console/billing/topup", { amount: "120000" }),
    } as unknown as ActionFunctionArgs);

    expect(result.successMessage).toBe("Top-up completed successfully.");
    expect(result.nextCredit).toBe(870000);
    expect(typeof result.successAt).toBe("number");
  });

  it("maps api errors from top-up action", async () => {
    vi.spyOn(BillingAPI, "topup").mockRejectedValue(
      new ApiError(403, "Mocked billing error: Forbidden"),
    );

    const result = await billingTopupAction({
      request: buildRequest("http://localhost/console/billing/topup", { amount: "120000" }),
    } as unknown as ActionFunctionArgs);

    expect(result.formError).toBe("Mocked billing error: Forbidden");
    expect(result.errorStatus).toBe(403);
    expect(result.errorHint).toContain("permission");
  });

  it("filters and sorts billing payments", async () => {
    vi.spyOn(BillingAPI, "getPayments").mockResolvedValue({
      items: [
        { id: "p-1", amount: 100000, status: "failed", createdAt: "2026-02-20T12:00:00.000Z" },
        { id: "p-2", amount: 300000, status: "success", createdAt: "2026-02-21T12:00:00.000Z" },
        { id: "p-3", amount: 200000, status: "success", createdAt: "2026-02-22T12:00:00.000Z" },
      ],
    });

    const result = await billingPaymentsLoader({
      request: new Request("http://localhost/console/billing/payments?status=success&sort=amount"),
    } as unknown as LoaderFunctionArgs);

    expect(result.items.map((item) => item.id)).toEqual(["p-2", "p-3"]);
  });

  it("filters and sorts invoices", async () => {
    vi.spyOn(BillingAPI, "getInvoices").mockResolvedValue({
      items: [
        { id: "inv-1", amount: 100000, status: "paid", createdAt: "2026-02-21T12:00:00.000Z" },
        { id: "inv-2", amount: 300000, status: "unpaid", createdAt: "2026-02-20T12:00:00.000Z" },
        { id: "inv-3", amount: 200000, status: "unpaid", createdAt: "2026-02-22T12:00:00.000Z" },
      ],
    });

    const result = await billingInvoicesLoader({
      request: new Request("http://localhost/console/billing/invoices?status=unpaid&sort=oldest"),
    } as unknown as LoaderFunctionArgs);

    expect(result.items.map((item) => item.id)).toEqual(["inv-2", "inv-3"]);
  });
});

