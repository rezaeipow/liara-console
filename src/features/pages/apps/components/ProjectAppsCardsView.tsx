import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { ResourceCardsGrid } from "@/shared/components/common/ResourceListLayouts";
import ConsoleStatusChip from "@/shared/components/console/ConsoleStatusChip";
import { getAppLikeStatusTone } from "@/shared/ui/statusTones";
import type { ProjectAppsCardsViewProps } from "@/shared/types/appsComponents";
import { formatDeploymentDate } from "../projectAppsFormat";

export default function ProjectAppsCardsView({ apps, metaByAppId, projectId, theme, actionLoadingId, onRestart, onOpenDelete }: ProjectAppsCardsViewProps) {
  return (
    <ResourceCardsGrid>
      {apps.map((app) => (
        <Paper key={app.id} variant="outlined" sx={{ p: 1.35, borderRadius: 1.5, borderColor: alpha(theme.palette.primary.main, 0.16), transition: "transform 160ms ease, border-color 160ms ease", "&:hover": { transform: "translateY(-2px)", borderColor: alpha(theme.palette.primary.main, 0.34) } }}>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={800} title={app.name} sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{app.name}</Typography>
                <Typography variant="caption" color="text.secondary">{app.region.toUpperCase()} | {app.plan}</Typography>
              </Box>
              <ConsoleStatusChip label={app.status} tone={getAppLikeStatusTone(app.status)} />
            </Stack>
            <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
              <Chip size="small" variant="outlined" label={`Deploys: ${metaByAppId[app.id]?.totalDeployments ?? 0}`} />
              <Chip size="small" variant="outlined" label={`Last: ${formatDeploymentDate(metaByAppId[app.id]?.lastDeploymentAt ?? null)}`} />
            </Stack>
            <Stack direction="row" spacing={0.65} flexWrap="wrap" useFlexGap>
              <Button component={Link} to={`/console/projects/${projectId ?? app.projectId}/apps/${app.id}/overview`} variant="contained" size="small" endIcon={<OpenInNewIcon fontSize="small" />}>Open</Button>
              <Button component={Link} to={`/console/projects/${projectId ?? app.projectId}/apps/${app.id}/logs`} variant="outlined" size="small" startIcon={<SubjectOutlinedIcon fontSize="small" />}>Logs</Button>
              <Button component={Link} to={`/console/projects/${projectId ?? app.projectId}/apps/${app.id}/settings`} variant="outlined" size="small" startIcon={<SettingsOutlinedIcon fontSize="small" />}>Settings</Button>
            </Stack>
            <Stack direction="row" spacing={0.65}>
              <Button variant="outlined" size="small" startIcon={<RestartAltIcon fontSize="small" />} onClick={() => onRestart(app.id)} disabled={actionLoadingId === `restart:${app.id}`}>Restart</Button>
              <Button variant="outlined" color="error" size="small" startIcon={<DeleteOutlineIcon fontSize="small" />} onClick={() => onOpenDelete(app.id)}>Delete</Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </ResourceCardsGrid>
  );
}
