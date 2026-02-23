import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import type { ConsoleHomeActivityCardProps } from "../types";

export default function ConsoleHomeActivityCard(props: ConsoleHomeActivityCardProps) {
  const { activityItems, isCompact } = props;

  return (
    <Paper
      sx={{
        p: isCompact ? { xs: 1.1, sm: 1.3 } : { xs: 1.8, sm: 2.2 },
        borderRadius: isCompact ? { xs: 0.9, sm: 1.1 } : { xs: 1.5, sm: 2 },
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.86)}, ${alpha(theme.palette.common.white, 0.74)})`,
        backdropFilter: glassBackdrop.card,
      }}
    >
      <Stack spacing={isCompact ? 0.65 : 1.1}>
        <Typography fontWeight={800}>Recent Activity</Typography>
        <Stack spacing={isCompact ? 0.5 : 0.9} role="list" aria-label="Recent console activities">
          {activityItems.map((item) => (
            <Stack
              key={item.id}
              role="listitem"
              direction="row"
              spacing={0.9}
              alignItems="flex-start"
              sx={{
                p: isCompact ? 0.7 : 1,
                borderRadius: isCompact ? 0.75 : 1.2,
                border: (theme) => `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.48),
              }}
            >
              <ReceiptLongOutlinedIcon fontSize="small" />
              <Stack spacing={0.2} sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={700}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.detail}
                </Typography>
              </Stack>
              <Button component={Link} to={item.to} size="small" variant="text">
                View
              </Button>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
