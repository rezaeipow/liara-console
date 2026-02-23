import { Divider, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ConsoleStatusChip from "@/shared/components/console/ConsoleStatusChip";
import { getAppLikeStatusTone } from "@/shared/ui/statusTones";
import type { ProjectAppsActivityPanelProps } from "@/shared/types/appsComponents";
import { formatDeploymentDate } from "../projectAppsFormat";

export default function ProjectAppsActivityPanel({ theme, activity, visible }: ProjectAppsActivityPanelProps) {
  if (!visible) return null;
  return (
    <Paper sx={{ p: 1.4, borderRadius: 2, border: `1px solid ${alpha(theme.palette.text.secondary, 0.24)}`, background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.78)}, ${alpha(theme.palette.background.default, 0.9)})` }}>
      <Stack spacing={1}>
        <Typography fontWeight={800}>Recent Activity</Typography>
        <Divider />
        {activity.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No activity available.</Typography>
        ) : (
          activity.map((item) => (
            <Paper key={`${item.appId}-${item.createdAt ?? "na"}`} variant="outlined" sx={{ p: 1, borderRadius: 1.3, borderColor: alpha(theme.palette.primary.main, 0.16) }}>
              <Stack spacing={0.4}>
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography fontWeight={700} noWrap>{item.appName}</Typography>
                  <ConsoleStatusChip label={item.status} tone={getAppLikeStatusTone(item.status)} />
                </Stack>
                <Typography variant="caption" color="text.secondary">Last deployment: {formatDeploymentDate(item.createdAt)}</Typography>
              </Stack>
            </Paper>
          ))
        )}
      </Stack>
    </Paper>
  );
}
