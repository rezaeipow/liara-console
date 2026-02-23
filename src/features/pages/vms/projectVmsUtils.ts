import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { Vm } from "@/api/types";
import type { ProjectVmsSortMode, ProjectVmsStatusFilter, VmActionType } from "./pageTypes";

export const PROJECT_VMS_STATUS_OPTIONS: ProjectVmsStatusFilter[] = ["all", "running", "stopped"];
export const PROJECT_VMS_SORT_OPTIONS: ProjectVmsSortMode[] = ["name-asc", "name-desc", "cpu-desc", "ram-desc"];

export function formatMemory(mb: number) {
  return `${(mb / 1024).toFixed(1)} GB`;
}

export function getFilteredVms(
  vms: Vm[],
  query: string,
  statusFilter: ProjectVmsStatusFilter,
  sortMode: ProjectVmsSortMode,
) {
  const normalized = query.trim().toLowerCase();
  const next = vms.filter((vm) => {
    const matchesQuery = normalized ? vm.name.toLowerCase().includes(normalized) : true;
    const matchesStatus = statusFilter === "all" ? true : vm.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  next.sort((left, right) => {
    if (sortMode === "name-asc") return left.name.localeCompare(right.name);
    if (sortMode === "name-desc") return right.name.localeCompare(left.name);
    if (sortMode === "cpu-desc") return right.cpu - left.cpu;
    return right.ram - left.ram;
  });

  return next;
}

export function getProjectVmsSummary(vms: Vm[]) {
  const running = vms.filter((vm) => vm.status === "running").length;
  const stopped = vms.filter((vm) => vm.status === "stopped").length;
  const totalCpu = vms.reduce((total, vm) => total + vm.cpu, 0);
  const totalRam = vms.reduce((total, vm) => total + vm.ram, 0);
  return { total: vms.length, running, stopped, totalCpu, totalRam };
}

export function getProjectVmsErrorMessage(error: FetchBaseQueryError | SerializedError | undefined) {
  if (!error) return undefined;
  if ("data" in error) {
    const payload = error.data as { message?: string };
    return payload.message ?? "Could not load virtual machines.";
  }
  return "Could not load virtual machines.";
}

export function getVmStatusChipSelectedSx(theme: Theme, status: ProjectVmsStatusFilter) {
  if (status === "stopped") {
    return {
      backgroundColor: alpha(theme.palette.text.secondary, 0.9),
      color: theme.palette.common.white,
      borderColor: alpha(theme.palette.text.secondary, 0.98),
      "& .MuiChip-label": { color: theme.palette.common.white, fontWeight: 700 },
    };
  }
  return {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.dark,
    "& .MuiChip-label": { color: theme.palette.primary.contrastText, fontWeight: 700 },
  };
}

export function getConfirmDialogContent(type: VmActionType | undefined, vmName: string) {
  const title =
    type === "start"
      ? "Start VM"
      : type === "stop"
        ? "Stop VM"
        : type === "reboot"
          ? "Reboot VM"
          : "Delete VM";

  const message =
    type === "delete"
      ? `Delete ${vmName}? This action is destructive and cannot be undone.`
      : `${title} will change runtime state for ${vmName}.`;

  return { title, message };
}
