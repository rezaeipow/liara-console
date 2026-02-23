import type { ButtonProps } from "@mui/material/Button";
import type { ChipProps, DialogProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ComponentProps, ReactNode } from "react";
import type ConsolePageShell from "@/shared/components/console/ConsolePageShell";
import type { ViewMode } from "@/shared/types/view";

export type ConfirmDialogProps = {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  description?: ReactNode;
  children?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  confirmColor?: ButtonProps["color"];
  confirmVariant?: ButtonProps["variant"];
  confirmDisabled?: boolean;
  isSubmitting?: boolean;
  fullWidth?: boolean;
  maxWidth?: DialogProps["maxWidth"];
  ariaLabelledby?: string;
};

export type EmptyStateAlertProps = {
  children: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  action?: ReactNode;
};

export type ClearFiltersEmptyStateProps = {
  onClear: () => void;
  children: ReactNode;
  actionLabel?: string;
};

export type SnackbarSeverity = "success" | "error" | "info" | "warning";

export type FeedbackSnackbarProps = {
  open: boolean;
  onClose: () => void;
  severity: SnackbarSeverity;
  message?: ReactNode;
  autoHideDuration?: number;
  details?: ReactNode;
  statusCode?: number;
  hint?: string;
};

export type FilterToolbarProps = {
  start: ReactNode;
  end?: ReactNode;
  compact?: boolean;
};

export type ConsoleDataTableContainerProps = {
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export type ViewModeToggleProps = {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  cardsLabel?: string;
  tableLabel?: string;
  size?: "small" | "medium" | "large";
};

export type TypedConfirmDeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  expectedName: string;
  inputLabel: string;
  confirmText: string;
  onConfirmTextChange: (value: string) => void;
  confirmDisabled?: boolean;
  confirmLabel?: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
  description?: ReactNode;
  error?: string | null;
};

export type ResourceActionConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  submittingLabel?: string;
  confirmColor?: ButtonProps["color"];
  isSubmitting?: boolean;
  showWarningIcon?: boolean;
  metaLabel?: string;
  metaValue?: string;
};

export type ResourceCreateDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  submitLabel?: string;
  submittingLabel?: string;
  children: ReactNode;
};

export type ResourceCreatePageActionsProps = {
  backTo: string;
  backLabel: string;
  submitLabel?: string;
  submittingLabel?: string;
  isSubmitting: boolean;
};

export type ResourceFormDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
  submitLabel?: string;
  submittingLabel?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
  compactContent?: boolean;
};

export type ResourceCardsGridProps = {
  children: ReactNode;
};

export type ResourceLoadingGridProps = {
  count: number;
  keyPrefix: string;
  renderItem: (index: number) => ReactNode;
};

export type ResourceSettingsActionDialogsProps = {
  restart: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: ReactNode;
    confirmLabel: string;
    submittingLabel: string;
    isSubmitting: boolean;
  };
  remove: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    expectedName: string;
    inputLabel: string;
    confirmText: string;
    onConfirmTextChange: (value: string) => void;
    confirmDisabled: boolean;
    isSubmitting: boolean;
    error?: string | null;
  };
};

export type ResourceViewMode = "cards" | "table";

export type ResourceViewStateProps = {
  isLoading: boolean;
  hasVisibleItems: boolean;
  hasAnyItems?: boolean;
  viewMode: ResourceViewMode;
  loading: ReactNode;
  emptyNoItems: ReactNode;
  emptyFiltered?: ReactNode;
  cards: ReactNode;
  table: ReactNode;
};

export type FilterChipOption = {
  key: string;
  label: string;
  selected: boolean;
  color?: ChipProps["color"];
  onClick: () => void;
  ariaLabel?: string;
  selectedSx?: SxProps<Theme>;
  unselectedSx?: SxProps<Theme>;
};

export type FilterChipGroupProps = {
  options: FilterChipOption[];
  spacing?: number;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type StatusSortFilterBarProps = {
  chips: FilterChipOption[];
  searchLabel?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  searchMinWidth?: number;
  searchAriaLabel?: string;
  showStatusSelect?: boolean;
  statusLabel?: string;
  statusValue?: string;
  statusOptions?: SelectOption[];
  onStatusChange?: (value: string) => void;
  statusMinWidth?: number;
  showSortSelect?: boolean;
  sortLabel?: string;
  sortValue?: string;
  sortOptions?: SelectOption[];
  onSortChange?: (value: string) => void;
  sortMinWidth?: number;
  statusAriaLabel?: string;
  sortAriaLabel?: string;
};

export type ServiceListShellProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  gradient?: string;
  actions?: ReactNode;
  summary?: ReactNode;
  filterStart: ReactNode;
  filterEnd?: ReactNode;
  errorMessage?: string;
  onRetry?: () => void;
  retryLabel?: string;
  children: ReactNode;
  spacing?: number;
  maxWidth?: ComponentProps<typeof ConsolePageShell>["maxWidth"];
};
