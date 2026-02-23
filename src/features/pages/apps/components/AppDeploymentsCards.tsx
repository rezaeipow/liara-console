import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import ConsoleStatusChip from "@/shared/components/console/ConsoleStatusChip";
import { getDeploymentStatusTone } from "@/shared/ui/statusTones";
import { getDeploymentDetail } from "../appDeploymentsUtils";
import type { AppDeploymentsCardsProps } from "@/shared/types/appsComponents";

export default function AppDeploymentsCards({ items, theme, formatDate }: AppDeploymentsCardsProps) {
  return (
    <Stack spacing={1}>
      {items.map((item) => {
        const detail = getDeploymentDetail(item);
        return (
          <Paper key={item.id} variant="outlined" sx={{ p: 1.4, borderRadius: 1.5, borderColor: alpha(theme.palette.primary.main, 0.14), transition: "border-color 140ms ease, transform 140ms ease", "&:hover": { borderColor: alpha(theme.palette.primary.main, 0.3), transform: "translateY(-1px)" } }}>
            <Stack spacing={0.85}>
              <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography fontWeight={700}>Version {item.version}</Typography><ConsoleStatusChip label={item.status} tone={getDeploymentStatusTone(item.status)} variant="soft" /></Stack>
              <Typography variant="body2" color="text.secondary">Deployment ID: {item.id}</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={0.6} flexWrap="wrap" useFlexGap>
                <Typography variant="caption" color="text.secondary">Commit: {detail.commit}</Typography>
                <Typography variant="caption" color="text.secondary">Trigger: {detail.trigger}</Typography>
                <Typography variant="caption" color="text.secondary">Actor: {detail.actor}</Typography>
              </Stack>
              <Divider sx={{ opacity: 0.55 }} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={0.75} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                <Typography variant="caption" color="text.secondary">{formatDate(item.createdAt)}</Typography>
                <Stack direction="row" spacing={0.75}><Button component={Link} to="../logs" size="small" variant="outlined">Logs</Button><Button component={Link} to="../overview" size="small" variant="contained">Overview</Button></Stack>
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
