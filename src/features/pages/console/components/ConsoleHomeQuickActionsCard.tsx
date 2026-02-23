import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { ConsoleHomeQuickActionsCardProps } from "../types";

export default function ConsoleHomeQuickActionsCard(props: ConsoleHomeQuickActionsCardProps) {
  const { quickActions, isCompact } = props;

  return (
    <Paper
      sx={{
        p: isCompact ? { xs: 1.1, sm: 1.3 } : { xs: 1.8, sm: 2.2 },
        borderRadius: isCompact ? { xs: 0.9, sm: 1.1 } : { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      <Stack spacing={isCompact ? 0.65 : 1.1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography fontWeight={800}>Quick Actions</Typography>
          <Chip size="small" label="Priority" color="primary" variant="outlined" />
        </Stack>
        <Stack spacing={isCompact ? 0.5 : 0.9} role="list" aria-label="Console quick actions">
          {quickActions.map((action) => (
            <Stack
              key={action.id}
              role="listitem"
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={isCompact ? 0.45 : 0.8}
              sx={{
                p: isCompact ? 0.75 : 1.1,
                borderRadius: isCompact ? 0.8 : 1.3,
                border: (theme) => `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.56),
              }}
            >
              <Stack spacing={0.2}>
                <Stack direction="row" spacing={0.7} alignItems="center">
                  {action.icon}
                  <Typography variant="body2" fontWeight={700}>{action.title}</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">{action.description}</Typography>
              </Stack>
              <Button
                component={Link}
                to={action.to}
                size="small"
                variant={action.primary ? "contained" : "outlined"}
                endIcon={<ArrowOutwardIcon fontSize="small" />}
              >
                Open
              </Button>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
