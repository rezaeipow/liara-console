import { Alert, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { createDateFormatter } from "@/shared/utils/dateTime";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import TicketMessageBubble from "./TicketMessageBubble";
import type { TicketDetailConversationCardProps } from "../types";

function formatDayLabel(date: string): string {
  return createDateFormatter().format(new Date(date));
}

export default function TicketDetailConversationCard(props: TicketDetailConversationCardProps) {
  const { messages, pendingReply, tableDensity, isRouteLoading, isCompact } = props;

  return (
    <Paper
      sx={{
        p: isCompact ? { xs: 0.85, sm: 1 } : { xs: 2, sm: 2.5 },
        borderRadius: isCompact ? { xs: 0.55, sm: 0.7 } : { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}

      <Stack spacing={isCompact ? 0.45 : 1.2}>
        <Typography fontWeight={800} sx={isCompact ? { fontSize: "0.82rem", lineHeight: 1.1 } : undefined}>
          Conversation
        </Typography>

        {messages.length === 0 ? (
          <Alert
            severity="info"
            sx={isCompact ? { py: 0.15, "& .MuiAlert-message": { py: 0.2, fontSize: "0.74rem" } } : undefined}
          >
            No messages yet.
          </Alert>
        ) : (
          <Stack spacing={isCompact ? 0.25 : 1} role="list" aria-label="Ticket replies">
            {messages.map((message, index) => {
              const currentDay = formatDayLabel(message.timestamp);
              const previousDay = index > 0 ? formatDayLabel(messages[index - 1].timestamp) : "";
              const showDay = index === 0 || currentDay !== previousDay;

              return (
                <Stack key={message.id} spacing={isCompact ? 0.2 : 0.8}>
                  {showDay ? (
                    <Chip
                      size="small"
                      label={currentDay}
                      variant="outlined"
                      sx={{
                        alignSelf: "center",
                        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.8),
                        ...(isCompact ? { borderRadius: 0.45, height: 16, fontSize: "0.58rem", px: 0.25 } : undefined),
                      }}
                    />
                  ) : null}
                  <TicketMessageBubble
                    label={message.label}
                    body={message.body}
                    timestamp={message.timestamp}
                    tone={message.tone}
                    tableDensity={tableDensity}
                  />
                </Stack>
              );
            })}

            {pendingReply ? (
              <TicketMessageBubble
                label="You"
                body={pendingReply}
                timestamp={new Date().toISOString()}
                tone="user"
                pending
                tableDensity={tableDensity}
              />
            ) : null}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
