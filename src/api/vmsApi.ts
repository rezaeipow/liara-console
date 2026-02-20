import { request } from "./httpClient";
import type { Vm } from "./types";

export const VmsAPI = {
  listByProject: (projectId: string) =>
    request<{ items: Vm[] }>(`/projects/${projectId}/vms`),

  create: (
    projectId: string,
    payload: { name: string; cpu: number; ram: number; disk: number },
  ) =>
    request<Vm>(`/projects/${projectId}/vms`, {
      method: "POST",
      body: payload,
    }),

  getById: (vmId: string) => request<Vm>(`/vms/${vmId}`),

  start: (vmId: string) =>
    request<{ success: boolean }>(`/vms/${vmId}/start`, { method: "POST" }),

  stop: (vmId: string) =>
    request<{ success: boolean }>(`/vms/${vmId}/stop`, { method: "POST" }),

  reboot: (vmId: string) =>
    request<{ success: boolean }>(`/vms/${vmId}/reboot`, { method: "POST" }),

  rename: (vmId: string, payload: { name: string }) =>
    request<Vm>(`/vms/${vmId}`, { method: "PATCH", body: payload }),

  remove: (vmId: string) => request<void>(`/vms/${vmId}`, { method: "DELETE" }),
};
