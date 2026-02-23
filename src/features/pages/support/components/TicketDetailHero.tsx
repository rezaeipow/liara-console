import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { createDateTimeFormatter, formatWith } from "@/shared/utils/dateTime";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import { getTicketStatusTone } from "@/shared/ui/statusTones";
import type { TicketDetailHeroProps } from "../types";

const ticketDateTimeFormatter = createDateTimeFormatter();

export default function TicketDetailHero(props: TicketDetailHeroProps) {
  const { ticket, isCompact } = props;

  return (
    <Paper
      sx={{
        p: isCompact ? { xs: 1.2, sm: 1.4 } : { xs: 2, sm: 2.5 },
        borderRadius: isCompact ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.32)}`,
        background: (theme) =>
          `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.14)})`,
        backdropFilter: glassBackdrop.hero,
      }}
    >
      <Stack spacing={isCompact ? 0.55 : 1.1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Stack direction="row" spacing={0.9} alignItems="center">
            <ForumOutlinedIcon fontSize="small" />
            <Typography variant={isCompact ? "h6" : "h5"} fontWeight={800}>
              {ticket.subject}
            </Typography>
          </Stack>
          <Chip
            size="small"
            color={getTicketStatusTone(ticket.status)}
            variant="outlined"
            label={ticket.status}
            sx={isCompact ? { borderRadius: 0.7, height: 20, fontSize: "0.66rem" } : undefined}
          />
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={isCompact ? { fontSize: "0.76rem", lineHeight: 1.25 } : undefined}
        >
          Ticket ID: {ticket.id} | Category: {ticket.category.toUpperCase()} | Created:{" "}
          {formatWith(ticketDateTimeFormatter, ticket.createdAt)}
        </Typography>

        <Button
          component={Link}
          to="/console/support/tickets"
          size="small"
          startIcon={<ArrowBackIcon fontSize="small" />}
          sx={{ alignSelf: "flex-start" }}
          aria-label="Back to support tickets"
          variant={isCompact ? "outlined" : "text"}
        >
          Back to tickets
        </Button>
      </Stack>
    </Paper>
  );
}
