import TimelineIcon from "@mui/icons-material/Timeline";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ConsoleSectionCard from "@/shared/components/console/ConsoleSectionCard";
import type { ProjectOverviewActivitySectionProps } from "../types";

export default function ProjectOverviewActivitySection(props: ProjectOverviewActivitySectionProps) {
  const { items, formatDateTime } = props;
  const theme = useTheme();

  return (
    <ConsoleSectionCard>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
        <TimelineIcon fontSize="small" />
        <Typography fontWeight={800}>Recent Activity</Typography>
      </Stack>
      <Divider sx={{ mb: 1.5, opacity: 0.5 }} />
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
          No activity yet.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                p: 1.1,
                borderRadius: 1.25,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                backgroundColor: alpha(theme.palette.common.white, 0.5),
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                {item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(item.createdAt)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </ConsoleSectionCard>
  );
}
