import { Box } from "@mui/material";
import { consoleStatItems } from "../consoleHomeData";
import ConsoleHomeNavCard from "./ConsoleHomeNavCard";
import type { ConsoleHomeStatGridProps } from "../types";

export default function ConsoleHomeStatGrid(props: ConsoleHomeStatGridProps) {
  const { unreadNotifications } = props;
  const items = consoleStatItems.map((item) =>
    item.id === "notifications"
      ? { ...item, value: unreadNotifications > 0 ? `${unreadNotifications} unread` : "Up to date" }
      : item,
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
        gap: 1.5,
      }}
    >
      {items.map((item) => (
        <ConsoleHomeNavCard key={item.id} item={item} />
      ))}
    </Box>
  );
}
