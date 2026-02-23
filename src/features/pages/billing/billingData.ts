import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { BillingAPI } from "@/api/billingApi";
import { ApiError } from "@/api/httpClient";
import type { Invoice, Payment } from "@/api/types";

export type BillingOverviewLoaderData = {
  credit: number;
  payments: Payment[];
  invoices: Invoice[];
};

export type BillingTopupLoaderData = {
  credit: number;
  recentPayments: Payment[];
};

export type BillingTopupActionData = {
  successMessage?: string;
  successAt?: number;
  formError?: string;
  errorStatus?: number;
  errorHint?: string;
  fieldErrors?: {
    amount?: string;
  };
  nextCredit?: number;
};

export type BillingPaymentsLoaderData = {
  items: Payment[];
};

export type BillingInvoicesLoaderData = {
  items: Invoice[];
};

function toPositiveInt(raw: FormDataEntryValue | null): number {
  const value = typeof raw === "string" ? Number(raw) : Number.NaN;
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.floor(value);
}

function mapStatusText(status: number): string {
  if (status === 408) return "Request Timeout";
  if (status === 401) return "Unauthorized";
  if (status === 403) return "Forbidden";
  if (status === 404) return "Not Found";
  if (status >= 500) return "Server Error";
  return "Request Failed";
}

function mapStatusHint(status: number): string {
  if (status === 408) return "The request timed out. Please retry.";
  if (status === 401) return "Your session may be expired. Please login again.";
  if (status === 403)
    return "You do not have permission to perform this top-up.";
  if (status === 404)
    return "Billing endpoint not found. Please retry shortly.";
  if (status >= 500) return "Server problem detected. Retry in a few moments.";
  return "Please check your request and try again.";
}

function toRouteErrorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return new Response(error.message, {
      status: error.status,
      statusText: mapStatusText(error.status),
    });
  }

  return new Response("Unexpected error", {
    status: 500,
    statusText: "Server Error",
  });
}

export async function billingOverviewLoader(): Promise<BillingOverviewLoaderData> {
  try {
    const [creditRes, paymentsRes, invoicesRes] = await Promise.all([
      BillingAPI.getCredit(),
      BillingAPI.getPayments(),
      BillingAPI.getInvoices(),
    ]);

    return {
      credit: creditRes.credit,
      payments: paymentsRes.items,
      invoices: invoicesRes.items,
    };
  } catch (error) {
    throw toRouteErrorResponse(error);
  }
}

export async function billingTopupLoader(): Promise<BillingTopupLoaderData> {
  try {
    const [creditRes, paymentsRes] = await Promise.all([
      BillingAPI.getCredit(),
      BillingAPI.getPayments(),
    ]);

    return {
      credit: creditRes.credit,
      recentPayments: paymentsRes.items.slice(0, 5),
    };
  } catch (error) {
    throw toRouteErrorResponse(error);
  }
}

export async function billingTopupAction({
  request,
}: ActionFunctionArgs): Promise<BillingTopupActionData> {
  const formData = await request.formData();
  const amount = toPositiveInt(formData.get("amount"));

  if (!Number.isFinite(amount)) {
    return { fieldErrors: { amount: "Please enter a valid amount." } };
  }

  if (amount < 10000) {
    return { fieldErrors: { amount: "Minimum top-up amount is 10,000 IRR." } };
  }

  if (amount > 500000000) {
    return {
      fieldErrors: { amount: "Maximum top-up amount is 500,000,000 IRR." },
    };
  }

  try {
    const result = await BillingAPI.topup(amount);
    return {
      successMessage: "Top-up completed successfully.",
      successAt: Date.now(),
      nextCredit: result.credit,
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        formError: error.message,
        errorStatus: error.status,
        errorHint: mapStatusHint(error.status),
      };
    }

    return {
      formError:
        error instanceof Error ? error.message : "Could not complete top-up.",
      errorStatus: 500,
      errorHint: mapStatusHint(500),
    };
  }
}

export async function billingPaymentsLoader({
  request,
}: LoaderFunctionArgs): Promise<BillingPaymentsLoaderData> {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const sort = url.searchParams.get("sort") ?? "newest";
    const { items } = await BillingAPI.getPayments();

    const filtered =
      status === "success" || status === "failed"
        ? items.filter((item) => item.status === status)
        : items;

    const sorted = [...filtered].sort((left, right) => {
      if (sort === "oldest") {
        return (
          new Date(left.createdAt).getTime() -
          new Date(right.createdAt).getTime()
        );
      }
      if (sort === "amount") {
        return right.amount - left.amount;
      }
      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });

    return { items: sorted };
  } catch (error) {
    throw toRouteErrorResponse(error);
  }
}

export async function billingInvoicesLoader({
  request,
}: LoaderFunctionArgs): Promise<BillingInvoicesLoaderData> {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const sort = url.searchParams.get("sort") ?? "newest";
    const { items } = await BillingAPI.getInvoices();

    const filtered =
      status === "paid" || status === "unpaid"
        ? items.filter((item) => item.status === status)
        : items;

    const sorted = [...filtered].sort((left, right) => {
      if (sort === "oldest") {
        return (
          new Date(left.createdAt).getTime() -
          new Date(right.createdAt).getTime()
        );
      }
      if (sort === "amount") {
        return right.amount - left.amount;
      }
      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });

    return { items: sorted };
  } catch (error) {
    throw toRouteErrorResponse(error);
  }
}
