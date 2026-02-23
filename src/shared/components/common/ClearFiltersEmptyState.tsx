import EmptyStateAlert from "@/shared/components/common/EmptyStateAlert";
import type { ClearFiltersEmptyStateProps } from "./types";

export default function ClearFiltersEmptyState({
  onClear,
  children,
  actionLabel = "Clear filters",
}: ClearFiltersEmptyStateProps) {
  return (
    <EmptyStateAlert actionLabel={actionLabel} onAction={onClear}>
      {children}
    </EmptyStateAlert>
  );
}
