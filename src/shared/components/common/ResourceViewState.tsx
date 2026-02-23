import type { ResourceViewStateProps } from "./types";

export default function ResourceViewState({
  isLoading,
  hasVisibleItems,
  hasAnyItems,
  viewMode,
  loading,
  emptyNoItems,
  emptyFiltered,
  cards,
  table,
}: ResourceViewStateProps) {
  if (isLoading) {
    return <>{loading}</>;
  }

  if (!hasVisibleItems) {
    if (hasAnyItems === false) {
      return <>{emptyNoItems}</>;
    }
    return <>{emptyFiltered ?? emptyNoItems}</>;
  }

  return <>{viewMode === "cards" ? cards : table}</>;
}
