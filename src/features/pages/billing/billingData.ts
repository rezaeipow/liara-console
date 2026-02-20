import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { BillingAPI } from "../../../api/billingApi";
import type { Invoice, Payment } from "../../../api/types";

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

export async function billingOverviewLoader(): Promise<BillingOverviewLoaderData> {
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
}

export async function billingTopupLoader(): Promise<BillingTopupLoaderData> {
  const [creditRes, paymentsRes] = await Promise.all([
    BillingAPI.getCredit(),
    BillingAPI.getPayments(),
  ]);

  return {
    credit: creditRes.credit,
    recentPayments: paymentsRes.items.slice(0, 5),
  };
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
    return { fieldErrors: { amount: "Maximum top-up amount is 500,000,000 IRR." } };
  }

  try {
    const result = await BillingAPI.topup(amount);
    return {
      successMessage: "Top-up completed successfully.",
      successAt: Date.now(),
      nextCredit: result.credit,
    };
  } catch (error: unknown) {
    return {
      formError: error instanceof Error ? error.message : "Could not complete top-up.",
    };
  }
}

export async function billingPaymentsLoader({
  request,
}: LoaderFunctionArgs): Promise<BillingPaymentsLoaderData> {
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
      return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    }
    if (sort === "amount") {
      return right.amount - left.amount;
    }
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });

  return { items: sorted };
}

export async function billingInvoicesLoader({
  request,
}: LoaderFunctionArgs): Promise<BillingInvoicesLoaderData> {
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
      return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    }
    if (sort === "amount") {
      return right.amount - left.amount;
    }
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });

  return { items: sorted };
}
