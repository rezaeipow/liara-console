import { request } from "./httpClient";
import type { Invoice, Payment } from "./types";

export interface InvoiceDownload {
  id: string;
  filename: string;
  url: string;
}

export const BillingAPI = {
  getCredit: () => request<{ credit: number }>("/billing/credit"),

  topup: (amount: number) =>
    request<{ success: boolean; credit: number }>("/billing/topup", {
      method: "POST",
      body: { amount },
    }),

  getPayments: () => request<{ items: Payment[] }>("/billing/payments"),

  getInvoices: () => request<{ items: Invoice[] }>("/billing/invoices"),

  downloadInvoice: (id: string) =>
    request<InvoiceDownload>(`/billing/invoices/${id}/download`),
};

