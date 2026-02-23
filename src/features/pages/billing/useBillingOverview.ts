import type { BillingOverviewLoaderData } from "./billingData";

export function useBillingOverviewDerived(data: BillingOverviewLoaderData) {
  const { payments, invoices } = data;
  const successfulPayments = payments.filter((item) => item.status === "success");
  const totalTopup = successfulPayments.reduce((sum, item) => sum + item.amount, 0);
  const unpaidInvoicesCount = invoices.filter((item) => item.status === "unpaid").length;
  const totalInvoices = invoices.reduce((sum, item) => sum + item.amount, 0);
  return {
    successfulCount: successfulPayments.length,
    totalTopup,
    totalInvoices,
    unpaidInvoicesCount,
    recentPayments: payments.slice(0, 4),
  };
}
