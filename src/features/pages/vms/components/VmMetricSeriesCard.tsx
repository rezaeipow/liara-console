import { Box, Divider, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import type { VmMetricSeriesCardProps } from "../pageTypes";

export default function VmMetricSeriesCard({ title, color = "primary", series }: VmMetricSeriesCardProps) {
  return (
    <Paper sx={{ p: { xs: 1.5, sm: 1.75 }, borderRadius: 1.75 }}>
      <Stack spacing={1.2}>
        <Typography fontWeight={800}>{title}</Typography>
        <Divider />
        <Stack spacing={0.6}>
          {series.map((value, index) => (
            <Box key={`${title}-${index}`}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">Sample {index + 1}</Typography>
                <Typography variant="caption" color="text.secondary">{value}%</Typography>
              </Stack>
              <LinearProgress value={value} variant="determinate" color={color} sx={{ height: 7, borderRadius: 999 }} />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
