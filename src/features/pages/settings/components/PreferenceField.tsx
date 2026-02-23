import { Box, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { PreferenceFieldProps } from "../types";

export default function PreferenceField({ icon, title, description, children }: PreferenceFieldProps) {
  return (
    <Paper variant="outlined" sx={{ p: 1.2, borderRadius: 1.4, borderColor: (theme) => alpha(theme.palette.text.primary, 0.12), backgroundColor: (theme) => alpha(theme.palette.common.white, 0.7) }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between">
        <Stack direction="row" spacing={0.9} alignItems="flex-start" sx={{ minWidth: 0 }}>
          {icon}
          <Stack spacing={0.3}>
            <Typography variant="body2" fontWeight={700}>{title}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>{description}</Typography>
          </Stack>
        </Stack>
        <Box>{children}</Box>
      </Stack>
    </Paper>
  );
}
