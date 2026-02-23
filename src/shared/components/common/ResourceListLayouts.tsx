import { Box } from "@mui/material";
import type { ResourceCardsGridProps, ResourceLoadingGridProps } from "./types";

export function ResourceCardsGrid({ children }: ResourceCardsGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
        gap: 1.25,
      }}
    >
      {children}
    </Box>
  );
}

export function ResourceLoadingGrid({ count, keyPrefix, renderItem }: ResourceLoadingGridProps) {
  return (
    <ResourceCardsGrid>
      {Array.from({ length: count }).map((_, idx) => (
        <Box key={`${keyPrefix}-${idx}`}>{renderItem(idx)}</Box>
      ))}
    </ResourceCardsGrid>
  );
}
