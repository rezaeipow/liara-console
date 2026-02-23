import type { Payment } from "@/api/types";

export type BillingOverviewStatsProps = {
  credit: number;
  totalTopup: number;
  successfulCount: number;
  totalInvoices: number;
  invoicesCount: number;
  unpaidInvoicesCount: number;
};

export type BillingRecentPaymentsCardProps = {
  isRouteLoading: boolean;
  payments: Payment[];
};

export type BillingRecentPaymentRowProps = {
  payment: Payment;
};
