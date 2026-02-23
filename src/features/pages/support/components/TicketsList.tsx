import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { createDateTimeFormatter, formatWith } from "@/shared/utils/dateTime";
import { getTicketStatusTone } from "@/shared/ui/statusTones";
import type { TicketListProps } from "../types";

const ticketDateFormatter = createDateTimeFormatter();

export default function TicketsList(props: TicketListProps) {
  const {
    items,
    tableDensity,
    listSpacing,
    itemPaddingX,
    itemPaddingY,
    itemInnerSpacing,
  } = props;

  return (
    <Stack spacing={listSpacing} role="list" aria-label="Support tickets list">
      {items.map((ticket) => (
        <Paper
          key={ticket.id}
          role="listitem"
          variant="outlined"
          sx={{
            px: itemPaddingX,
            py: itemPaddingY,
            borderRadius: tableDensity === "compact" ? 0.7 : 1.4,
            borderColor: (theme) => alpha(theme.palette.text.primary, 0.12),
            backgroundColor: (theme) => alpha(theme.palette.common.white, 0.62),
          }}
        >
          <Stack spacing={itemInnerSpacing}>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Stack spacing={0.2}>
                <Typography
                  fontWeight={800}
                  sx={tableDensity === "compact" ? { fontSize: "0.82rem", lineHeight: 1.2 } : undefined}
                >
                  {ticket.subject}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={tableDensity === "compact" ? { fontSize: "0.64rem", lineHeight: 1.15 } : undefined}
                >
                  {ticket.category.toUpperCase()} | {formatWith(ticketDateFormatter, ticket.createdAt)}
                </Typography>
              </Stack>
              <Chip size="small" color={getTicketStatusTone(ticket.status)} variant="outlined" label={ticket.status} />
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={tableDensity === "compact" ? { lineHeight: 1.25, fontSize: "0.73rem" } : { lineHeight: 1.45 }}
            >
              {ticket.body}
            </Typography>

            <Button
              component={Link}
              to={`/console/support/tickets/${ticket.id}`}
              size="small"
              endIcon={<ArrowOutwardIcon fontSize="small" />}
              sx={{ alignSelf: "flex-start" }}
            >
              Open ticket
            </Button>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
