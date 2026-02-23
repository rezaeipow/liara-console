import { Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { createDateTimeFormatter, formatWith } from "@/shared/utils/dateTime";
import type { MessageBubbleProps } from "../types";

const ticketDateTimeFormatter = createDateTimeFormatter();

export default function TicketMessageBubble(props: MessageBubbleProps) {
  const { label, body, timestamp, tone, tableDensity, pending = false } = props;
  const leftAligned = tone === "support";
  const isCompact = tableDensity === "compact";

  return (
    <Stack
      role="listitem"
      sx={{
        alignItems: leftAligned ? "flex-start" : "flex-end",
        opacity: pending ? 0.72 : 1,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          maxWidth: { xs: "100%", sm: "82%" },
          px: isCompact ? 0.45 : 1.2,
          py: isCompact ? 0.35 : 0.9,
          borderRadius: isCompact ? 0.45 : 1.4,
          borderColor: (theme) =>
            leftAligned ? alpha(theme.palette.info.main, 0.24) : alpha(theme.palette.primary.main, 0.24),
          backgroundColor: (theme) =>
            leftAligned ? alpha(theme.palette.info.light, 0.28) : alpha(theme.palette.primary.light, 0.28),
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={isCompact ? { fontSize: "0.58rem", lineHeight: 1.1 } : undefined}
        >
          {label} | {formatWith(ticketDateTimeFormatter, timestamp)}
          {pending ? " | Sending" : ""}
        </Typography>
        <Typography
          variant="body2"
          sx={isCompact ? { mt: 0.2, lineHeight: 1.15, fontSize: "0.68rem" } : { mt: 0.4, lineHeight: 1.5 }}
        >
          {body}
        </Typography>
      </Paper>
    </Stack>
  );
}
