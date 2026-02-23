import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import ConsoleDataTableContainer from "@/shared/components/common/ConsoleDataTableContainer";
import ConsoleStatusChip from "@/shared/components/console/ConsoleStatusChip";
import { getVmStatusTone } from "@/shared/ui/statusTones";
import type { ProjectVmsTableViewProps } from "../pageTypes";
import { formatMemory } from "../projectVmsUtils";

export default function ProjectVmsTableView(props: ProjectVmsTableViewProps) {
  const { items, actionLoadingId, onAskAction } = props;

  return (
    <ConsoleDataTableContainer sx={{ borderRadius: { xs: 1.5, sm: 2 }, overflow: "hidden" }}>
      <Table size="small" aria-label="vms table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>CPU</TableCell>
            <TableCell>RAM</TableCell>
            <TableCell>Disk</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((vm) => (
            <TableRow key={vm.id} hover>
              <TableCell>{vm.name}</TableCell>
              <TableCell>
                <ConsoleStatusChip label={vm.status} tone={getVmStatusTone(vm.status)} />
              </TableCell>
              <TableCell>{vm.cpu} vCPU</TableCell>
              <TableCell>{formatMemory(vm.ram)}</TableCell>
              <TableCell>{vm.disk} GB</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.6} justifyContent="flex-end">
                  <Button component={Link} to={`/console/vms/${vm.id}/overview`} size="small">Open</Button>
                  {vm.status === "stopped" ? (
                    <Button size="small" onClick={() => onAskAction(vm.id, "start")} disabled={actionLoadingId === `start:${vm.id}`}>Start</Button>
                  ) : (
                    <Button size="small" onClick={() => onAskAction(vm.id, "stop")} disabled={actionLoadingId === `stop:${vm.id}`}>Stop</Button>
                  )}
                  <Button size="small" onClick={() => onAskAction(vm.id, "reboot")} disabled={actionLoadingId === `reboot:${vm.id}`}>Reboot</Button>
                  <Button size="small" color="error" onClick={() => onAskAction(vm.id, "delete")} disabled={actionLoadingId === `delete:${vm.id}`}>Delete</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ConsoleDataTableContainer>
  );
}
