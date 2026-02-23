import type { Ticket } from "@/api/types";
import type { FilterChipOption } from "@/shared/components/common/types";
import type { TableDensity } from "@/app/store/slices/uiSlice";
import type { Dispatch, SetStateAction } from "react";
import type { TicketActionData } from "./supportData";

export type TicketStatusFilter = "all" | Ticket["status"];
export type TicketSortMode = "newest" | "oldest";

export type TimelineMessage = {
  id: string;
  label: string;
  body: string;
  timestamp: string;
  tone: "user" | "support";
};

export type MessageBubbleProps = {
  label: string;
  body: string;
  timestamp: string;
  tone: "user" | "support";
  tableDensity: TableDensity;
  pending?: boolean;
};

export type DraftPayload = {
  subject: string;
  category: string;
  body: string;
};

export type TicketSummary = {
  open: number;
  pending: number;
  closed: number;
};

export type TicketsDensityLayout = {
  listSpacing: number;
  itemPaddingX: number;
  itemPaddingY: number;
  itemInnerSpacing: number;
};

export type TicketsPageState = {
  items: Ticket[];
  status: TicketStatusFilter;
  category: string;
  sort: TicketSortMode;
  unresolved: boolean;
  query: string;
  categories: string[];
  summary: TicketSummary;
  tableDensity: TableDensity;
  isRouteLoading: boolean;
  densityLayout: TicketsDensityLayout;
  setStatus: Dispatch<SetStateAction<TicketStatusFilter>>;
  setSort: Dispatch<SetStateAction<TicketSortMode>>;
  setQueryParam: (key: string, value: string, defaultValue?: string) => void;
  clearQueryParams: (options?: { replace?: boolean }) => void;
};

export type TicketsFilterPanelProps = {
  isRouteLoading: boolean;
  query: string;
  unresolved: boolean;
  category: string;
  categories: string[];
  status: TicketStatusFilter;
  sort: TicketSortMode;
  onSearchChange: (value: string) => void;
  onToggleUnresolved: () => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: TicketStatusFilter) => void;
  onSortChange: (value: TicketSortMode) => void;
  categoryChips: FilterChipOption[];
};

export type TicketListProps = {
  items: Ticket[];
  tableDensity: TableDensity;
  listSpacing: number;
  itemPaddingX: number;
  itemPaddingY: number;
  itemInnerSpacing: number;
};

export type TicketsSummaryStatsProps = {
  total: number;
  summary: TicketSummary;
  density: TableDensity;
};

export type TicketsPageContentProps = {
  state: TicketsPageState;
};

export type TicketDetailState = {
  ticket: Ticket;
  actionData?: TicketActionData;
  isSubmitting: boolean;
  isRouteLoading: boolean;
  replyBody: string;
  pendingReply: string;
  messages: TimelineMessage[];
  tableDensity: TableDensity;
  isCompact: boolean;
  actionButtonSize: "small" | "medium";
  createdNotice: boolean;
  feedbackOpen: boolean;
  feedbackSeverity: "success" | "error" | "info" | "warning";
  feedbackMessage: string;
  onReplyBodyChange: (value: string) => void;
  onFeedbackClose: () => void;
};

export type TicketDetailHeroProps = {
  ticket: Ticket;
  isCompact: boolean;
};

export type TicketDetailConversationCardProps = {
  messages: TimelineMessage[];
  pendingReply: string;
  tableDensity: TableDensity;
  isRouteLoading: boolean;
  isCompact: boolean;
};

export type TicketDetailReplyFormCardProps = {
  actionData?: TicketActionData;
  replyBody: string;
  isSubmitting: boolean;
  isCompact: boolean;
  actionButtonSize: "small" | "medium";
  onReplyBodyChange: (value: string) => void;
};

export type NewTicketState = {
  categories: string[];
  actionData?: TicketActionData;
  isSubmitting: boolean;
  isRouteLoading: boolean;
  isCompact: boolean;
  actionButtonSize: "small" | "medium";
  subject: string;
  category: string;
  body: string;
  discardConfirmOpen: boolean;
  categoryOptions: Array<{ value: string; label: string }>;
  hasError: boolean;
  feedbackOpen: boolean;
  feedbackSeverity: "success" | "error" | "info" | "warning";
  feedbackMessage: string;
  onSubjectChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onOpenDiscardDialog: () => void;
  onCloseDiscardDialog: () => void;
  onConfirmDiscard: () => void;
  onFeedbackClose: () => void;
};

export type NewTicketHeroProps = {
  isCompact: boolean;
  actionButtonSize: "small" | "medium";
  onOpenDiscardDialog: () => void;
};

export type NewTicketFormCardProps = {
  categories: Array<{ value: string; label: string }>;
  actionData?: TicketActionData;
  hasError: boolean;
  subject: string;
  category: string;
  body: string;
  isSubmitting: boolean;
  isRouteLoading: boolean;
  isCompact: boolean;
  actionButtonSize: "small" | "medium";
  onSubjectChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBodyChange: (value: string) => void;
};

export type NewTicketFormFieldsProps = {
  categories: Array<{ value: string; label: string }>;
  actionData?: TicketActionData;
  subject: string;
  category: string;
  body: string;
  isCompact: boolean;
  onSubjectChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBodyChange: (value: string) => void;
};

export type NewTicketFormActionsProps = {
  isSubmitting: boolean;
  actionButtonSize: "small" | "medium";
};
