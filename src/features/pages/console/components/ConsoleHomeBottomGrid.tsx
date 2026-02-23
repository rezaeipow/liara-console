import { Box } from "@mui/material";
import ConsoleHomeActivityCard from "./ConsoleHomeActivityCard";
import ConsoleHomeQuickActionsCard from "./ConsoleHomeQuickActionsCard";
import type { ConsoleHomeBottomGridProps } from "../types";

export default function ConsoleHomeBottomGrid(props: ConsoleHomeBottomGridProps) {
  const { quickActions, activityItems, isCompact } = props;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1.35fr 1fr" },
        gap: isCompact ? 1 : 1.5,
      }}
    >
      <ConsoleHomeQuickActionsCard quickActions={quickActions} isCompact={isCompact} />
      <ConsoleHomeActivityCard activityItems={activityItems} isCompact={isCompact} />
    </Box>
  );
}
