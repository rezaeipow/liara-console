import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { NewTicketHeroProps } from "../types";

export default function NewTicketHero(props: NewTicketHeroProps) {
  const { isCompact, actionButtonSize, onOpenDiscardDialog } = props;

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
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={isCompact ? 0.8 : 1.4}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Stack spacing={isCompact ? 0.3 : 0.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <SupportAgentOutlinedIcon fontSize="small" />
            <Typography variant={isCompact ? "h6" : "h5"} fontWeight={800}>
              Create Support Ticket
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={isCompact ? { fontSize: "0.78rem", lineHeight: 1.25 } : undefined}>
            Share issue details and the support team will follow up in this thread.
          </Typography>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={isCompact ? 0.55 : 1}>
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            startIcon={<DeleteOutlineIcon fontSize="small" />}
            onClick={onOpenDiscardDialog}
            size={actionButtonSize}
          >
            Discard draft
          </Button>
          <Button component={Link} to="/console/support/tickets" variant="outlined" startIcon={<ArrowBackIcon fontSize="small" />} size={actionButtonSize}>
            Back to list
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
