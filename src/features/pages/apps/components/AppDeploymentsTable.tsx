import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import ConsoleDataTableContainer from "@/shared/components/common/ConsoleDataTableContainer";
import ConsoleStatusChip from "@/shared/components/console/ConsoleStatusChip";
import { getDeploymentStatusTone } from "@/shared/ui/statusTones";
import type { AppDeploymentsTableProps } from "@/shared/types/appsComponents";
import { getDeploymentDetail } from "../appDeploymentsUtils";

export default function AppDeploymentsTable({ items, formatDate }: AppDeploymentsTableProps) {
  return (
    <ConsoleDataTableContainer>
      <Table size="small" aria-label="deployments table">
        <TableHead>
          <TableRow>
            <TableCell>Version</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Commit</TableCell>
            <TableCell>Trigger</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const detail = getDeploymentDetail(item);
            return (
              <TableRow key={item.id} hover>
                <TableCell>{item.version}</TableCell>
                <TableCell>
                  <ConsoleStatusChip label={item.status} tone={getDeploymentStatusTone(item.status)} variant="soft" />
                </TableCell>
                <TableCell>{detail.commit}</TableCell>
                <TableCell>{detail.trigger}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.75} justifyContent="flex-end">
                    <Button component={Link} to="../logs" size="small" variant="outlined">Logs</Button>
                    <Button component={Link} to="../overview" size="small" variant="contained">Overview</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ConsoleDataTableContainer>
  );
}
