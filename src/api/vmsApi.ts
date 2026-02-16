import { request } from "./httpClient";
import type { Vm } from "./types";

export const VmsAPI = {
  listByProject: (projectId: string) =>
    request<{ items: Vm[] }>(`/projects/${projectId}/vms`),

  getById: (vmId: string) => request<Vm>(`/vms/${vmId}`),

  start: (vmId: string) =>
    request<{ success: boolean }>(`/vms/${vmId}/start`, { method: "POST" }),

  stop: (vmId: string) =>
    request<{ success: boolean }>(`/vms/${vmId}/stop`, { method: "POST" }),

  reboot: (vmId: string) =>
    request<{ success: boolean }>(`/vms/${vmId}/reboot`, { method: "POST" }),

  remove: (vmId: string) => request<void>(`/vms/${vmId}`, { method: "DELETE" }),
};

