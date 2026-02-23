import { Alert, Box, Chip, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { AppLogsContentProps } from "@/shared/types/appsComponents";
import { getLogLevelColor } from "../appLogsUtils";

export default function AppLogsContent({ isLoading, logs, theme, formatDateTime }: AppLogsContentProps) {
  return (
    <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: 1.5, border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`, background: `linear-gradient(180deg, ${alpha(theme.palette.text.primary, 0.9)}, ${alpha(theme.palette.text.primary, 0.82)})` }}>
      {isLoading ? (
        <Stack spacing={1}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Paper key={`logs-skeleton-${idx}`} variant="outlined" sx={{ p: 1, borderColor: alpha(theme.palette.common.white, 0.12) }}>
              <Stack spacing={0.75}><Skeleton variant="text" width="80%" /><Skeleton variant="text" width="35%" /></Stack>
            </Paper>
          ))}
        </Stack>
      ) : logs.length === 0 ? (
        <Alert severity="info">No logs available for the selected filter.</Alert>
      ) : (
        <Stack spacing={0.9}>
          {logs.map((item) => (
            <Box key={item.id} sx={{ px: 1, py: 0.9, borderRadius: 1.1, border: `1px solid ${alpha(theme.palette.text.secondary, 0.22)}`, backgroundColor: alpha(theme.palette.text.primary, 0.45) }}>
              <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.55 }}>
                <Chip size="small" label={item.level} color={getLogLevelColor(item.level)} sx={{ textTransform: "uppercase", fontWeight: 700, height: 22 }} />
                <Typography variant="caption" sx={{ color: alpha(theme.palette.common.white, 0.82) }}>{formatDateTime(item.fetchedAt)}</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.95), fontFamily: '"Cascadia Code", "Consolas", monospace', wordBreak: "break-word" }}>
                {item.message}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
