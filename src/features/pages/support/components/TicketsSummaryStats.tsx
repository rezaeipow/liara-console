import { Box } from "@mui/material";
import ConsoleStatCard from "@/shared/components/console/ConsoleStatCard";
import type { TicketsSummaryStatsProps } from "../types";

export default function TicketsSummaryStats(props: TicketsSummaryStatsProps) {
  const { total, summary, density } = props;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
        gap: 1,
      }}
    >
      <ConsoleStatCard label="Total" value={String(total)} density={density} />
      <ConsoleStatCard label="Open" value={String(summary.open)} tone="warning" density={density} />
      <ConsoleStatCard label="Pending" value={String(summary.pending)} tone="info" density={density} />
      <ConsoleStatCard label="Closed" value={String(summary.closed)} tone="success" density={density} />
    </Box>
  );
}
