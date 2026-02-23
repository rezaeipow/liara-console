import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ServiceCountCardProps } from "./types";

export default function ProjectServiceCountCard({ icon, label, value, theme }: ServiceCountCardProps) {
  return (
    <Box sx={{ flex: 1, px: 1, py: 0.75, borderRadius: 1.2, border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`, backgroundColor: alpha(theme.palette.common.white, 0.48) }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>{icon}<Typography variant="caption" color="text.secondary">{label}</Typography></Stack>
      <Typography variant="body2" fontWeight={800} sx={{ mt: 0.35 }}>{value}</Typography>
    </Box>
  );
}
