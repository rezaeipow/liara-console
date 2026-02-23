import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import EmptyStateAlert from "@/shared/components/common/EmptyStateAlert";
import TicketsFilterPanel from "./TicketsFilterPanel";
import TicketsList from "./TicketsList";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { TicketsPageContentProps } from "../types";

export default function TicketsPageContent(props: TicketsPageContentProps) {
  const { state } = props;

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: state.tableDensity === "compact" ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      <TicketsFilterPanel
        isRouteLoading={state.isRouteLoading}
        query={state.query}
        unresolved={state.unresolved}
        category={state.category}
        categories={state.categories}
        status={state.status}
        sort={state.sort}
        onSearchChange={(value) => state.setQueryParam("q", value)}
        onToggleUnresolved={() => state.setQueryParam("unresolved", state.unresolved ? "0" : "1")}
        onCategoryChange={(value) => state.setQueryParam("category", value, "all")}
        onStatusChange={(value) => state.setStatus(value)}
        onSortChange={(value) => state.setSort(value)}
        categoryChips={state.categories.map((item) => ({
          key: `category-${item}`,
          label: item.toUpperCase(),
          selected: state.category === item,
          onClick: () => state.setQueryParam("category", item, "all"),
        }))}
      />

      {state.isRouteLoading ? (
        <Stack spacing={1} sx={{ mt: 1.3 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`ticket-loading-${index}`} variant="rounded" height={80} />
          ))}
        </Stack>
      ) : state.items.length === 0 ? (
        <EmptyStateAlert
          action={
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button variant="outlined" size="small" onClick={() => state.clearQueryParams({ replace: true })}>
                Clear filters
              </Button>
              <Button
                component={Link}
                to={`/console/support/tickets/new${state.category !== "all" ? `?category=${state.category}` : ""}`}
                variant="contained"
                size="small"
                startIcon={<AddCircleOutlineIcon fontSize="small" />}
              >
                Create ticket
              </Button>
            </Stack>
          }
        >
          <Stack spacing={0.4}>
            <Typography fontWeight={800}>No tickets found</Typography>
            <Typography variant="body2" color="text.secondary">
              Try clearing filters or create a new ticket for your current issue.
            </Typography>
          </Stack>
        </EmptyStateAlert>
      ) : (
        <Stack sx={{ mt: 1.3 }}>
          <TicketsList
            items={state.items}
            tableDensity={state.tableDensity}
            listSpacing={state.densityLayout.listSpacing}
            itemPaddingX={state.densityLayout.itemPaddingX}
            itemPaddingY={state.densityLayout.itemPaddingY}
            itemInnerSpacing={state.densityLayout.itemInnerSpacing}
          />
        </Stack>
      )}
    </Paper>
  );
}
