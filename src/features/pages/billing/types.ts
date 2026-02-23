import type { Invoice, Payment } from "@/api/types";
import type { TableDensity } from "@/app/store/slices/uiSlice";
import type { Dispatch, SetStateAction } from "react";
import type { BillingTopupActionData } from "./billingData";

export type PaymentStatusFilter = "all" | "success" | "failed";
export type PaymentSortMode = "newest" | "oldest" | "amount";

export type InvoiceStatusFilter = "all" | "paid" | "unpaid";
export type InvoiceSortMode = "newest" | "oldest" | "amount";

export type InvoiceNotice = {
  message: string;
  severity: "success" | "error";
  hint?: string;
  status?: number;
};

export type BillingInvoicesDensityLayout = {
  gridColumnGap: number;
  gridRowGap: number;
  itemPaddingX: number;
  itemPaddingY: number;
  itemInnerSpacing: number;
};

export type BillingInvoicesState = {
  items: Invoice[];
  status: InvoiceStatusFilter;
  sort: InvoiceSortMode;
  notice: InvoiceNotice | null;
  downloadingId: string | null;
  isRouteLoading: boolean;
  densityLayout: BillingInvoicesDensityLayout;
  unpaidCount: number;
  setStatus: Dispatch<SetStateAction<InvoiceStatusFilter>>;
  setSort: Dispatch<SetStateAction<InvoiceSortMode>>;
  setNotice: Dispatch<SetStateAction<InvoiceNotice | null>>;
  handleDownload: (invoiceId: string) => Promise<void>;
};

export type BillingInvoiceListProps = {
  items: Invoice[];
  downloadingId: string | null;
  gridColumnGap: number;
  gridRowGap: number;
  itemPaddingX: number;
  itemPaddingY: number;
  itemInnerSpacing: number;
  onDownload: (invoiceId: string) => void;
};

export type BillingInvoicesContentProps = {
  state: BillingInvoicesState;
};

export type BillingInvoicesFilterBarProps = {
  status: InvoiceStatusFilter;
  sort: InvoiceSortMode;
  setStatus: Dispatch<SetStateAction<InvoiceStatusFilter>>;
  setSort: Dispatch<SetStateAction<InvoiceSortMode>>;
};

export type BillingPaymentsSummary = {
  successCount: number;
  failedCount: number;
  totalSuccessAmount: number;
};

export type BillingPaymentsDensityLayout = {
  listSpacing: number;
  itemPaddingX: number;
  itemPaddingY: number;
  itemInnerSpacing: number;
};

export type BillingPaymentsState = {
  items: Payment[];
  status: PaymentStatusFilter;
  sort: PaymentSortMode;
  isRouteLoading: boolean;
  summary: BillingPaymentsSummary;
  densityLayout: BillingPaymentsDensityLayout;
  tableDensity: TableDensity;
  setStatus: Dispatch<SetStateAction<PaymentStatusFilter>>;
  setSort: Dispatch<SetStateAction<PaymentSortMode>>;
};

export type BillingPaymentsSummaryProps = {
  itemsCount: number;
  summary: BillingPaymentsSummary;
  tableDensity: TableDensity;
};

export type BillingPaymentsContentProps = {
  state: BillingPaymentsState;
};

export type BillingPaymentsMobileListProps = {
  items: Payment[];
  densityLayout: BillingPaymentsDensityLayout;
};

export type BillingPaymentsTableProps = {
  items: Payment[];
};

export type BillingTopupState = {
  credit: number;
  recentPayments: Payment[];
  actionData?: BillingTopupActionData;
  amountInput: string;
  isSubmitting: boolean;
  isRouteLoading: boolean;
  displayedCredit: number;
  parsedAmount: number;
  projectedCredit: number;
  amountInvalid: boolean;
  suggestions: number[];
  minimumTopup: number;
  feedbackOpen: boolean;
  feedbackSeverity: "success" | "error" | "info" | "warning";
  feedbackMessage: string;
  onAmountInputChange: (value: string) => void;
  onSelectAmount: (value: number) => void;
  onFeedbackClose: () => void;
};

export type BillingTopupHeroProps = {
  displayedCredit: number;
  projectedCredit: number;
  parsedAmount: number;
};

export type BillingTopupFormCardProps = {
  actionData?: BillingTopupActionData;
  amountInput: string;
  parsedAmount: number;
  isSubmitting: boolean;
  isRouteLoading: boolean;
  amountInvalid: boolean;
  suggestions: number[];
  minimumTopup: number;
  onAmountInputChange: (value: string) => void;
  onSelectAmount: (value: number) => void;
};

export type BillingTopupRecentPaymentsCardProps = {
  recentPayments: Payment[];
  isRouteLoading: boolean;
};

export type BillingTopupAmountFieldProps = {
  actionData?: BillingTopupActionData;
  amountInput: string;
  amountInvalid: boolean;
  onAmountInputChange: (value: string) => void;
};

export type BillingTopupSuggestionsProps = {
  suggestions: number[];
  parsedAmount: number;
  isSubmitting: boolean;
  onSelectAmount: (value: number) => void;
};

export type BillingTopupActionsProps = {
  isSubmitting: boolean;
  parsedAmount: number;
  minimumTopup: number;
};
