import ConsoleStatCard from "@/shared/components/console/ConsoleStatCard";
import { Box } from "@mui/material";
import { formatIrr } from "../billingFormat";
import type { BillingPaymentsSummaryProps } from "../types";

export default function BillingPaymentsSummary(props: BillingPaymentsSummaryProps) {
  const { itemsCount, summary, tableDensity } = props;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        },
        gap: 1,
      }}
    >
      <ConsoleStatCard label="Transactions" value={String(itemsCount)} density={tableDensity} />
      <ConsoleStatCard label="Successful" value={String(summary.successCount)} tone="success" density={tableDensity} />
      <ConsoleStatCard label="Successful Total" value={formatIrr(summary.totalSuccessAmount)} tone="primary" density={tableDensity} />
    </Box>
  );
}
