import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import ConsoleDataTableContainer from "@/shared/components/common/ConsoleDataTableContainer";
import ConsoleStatusChip from "@/shared/components/console/ConsoleStatusChip";
import { getAppLikeStatusTone } from "@/shared/ui/statusTones";
import type { ProjectAppsTableViewProps } from "@/shared/types/appsComponents";
import { formatDeploymentDate } from "../projectAppsFormat";

export default function ProjectAppsTableView({ apps, metaByAppId, projectId, theme, actionLoadingId, onRestart, onOpenDelete }: ProjectAppsTableViewProps) {
  return (
    <ConsoleDataTableContainer sx={{ borderRadius: 1.75, overflow: "hidden", border: `1px solid ${alpha(theme.palette.text.secondary, 0.22)}` }}>
      <Table size="small" aria-label="apps table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell><TableCell>Status</TableCell><TableCell>Region</TableCell><TableCell>Plan</TableCell><TableCell>Last deployment</TableCell><TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apps.map((app) => (
            <TableRow key={app.id} hover>
              <TableCell>{app.name}</TableCell>
              <TableCell><ConsoleStatusChip label={app.status} tone={getAppLikeStatusTone(app.status)} /></TableCell>
              <TableCell>{app.region.toUpperCase()}</TableCell>
              <TableCell>{app.plan}</TableCell>
              <TableCell>{formatDeploymentDate(metaByAppId[app.id]?.lastDeploymentAt ?? null)}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.6} justifyContent="flex-end">
                  <Button component={Link} to={`/console/projects/${projectId ?? app.projectId}/apps/${app.id}/overview`} size="small">Open</Button>
                  <Button size="small" onClick={() => onRestart(app.id)} disabled={actionLoadingId === `restart:${app.id}`}>Restart</Button>
                  <Button size="small" color="error" onClick={() => onOpenDelete(app.id)}>Delete</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ConsoleDataTableContainer>
  );
}
