import { request } from "./httpClient";
import type { AppService, Deployment, EnvVar } from "./types";

export const AppsAPI = {
  listByProject: (projectId: string) =>
    request<{ items: AppService[] }>(`/projects/${projectId}/apps`),

  create: (
    projectId: string,
    payload: { name: string; region: string; plan: string },
  ) =>
    request<AppService>(`/projects/${projectId}/apps`, {
      method: "POST",
      body: payload,
    }),

  getById: (appId: string) => request<AppService>(`/apps/${appId}`),

  getDeployments: (appId: string) =>
    request<{ items: Deployment[] }>(`/apps/${appId}/deployments`),

  getDeploymentsByProject: (projectId: string) =>
    request<{ items: Deployment[] }>(`/projects/${projectId}/deployments`),

  getEnvVars: (appId: string) =>
    request<{ items: EnvVar[] }>(`/apps/${appId}/env`),

  updateEnvVars: (appId: string, items: EnvVar[]) =>
    request<{ success: boolean }>(`/apps/${appId}/env`, {
      method: "PUT",
      body: { items },
    }),

  getLogs: (appId: string, level?: string) => {
    const query = level ? `?level=${encodeURIComponent(level)}` : "";
    return request<{ items: Array<{ id: string; appId: string; level: string; message: string }> }>(
      `/apps/${appId}/logs${query}`,
    );
  },

  restart: (appId: string) =>
    request<{ success: boolean }>(`/apps/${appId}/restart`, {
      method: "POST",
    }),

  rename: (appId: string, payload: { name: string }) =>
    request<AppService>(`/apps/${appId}`, {
      method: "PATCH",
      body: payload,
    }),

  remove: (appId: string) =>
    request<void>(`/apps/${appId}`, {
      method: "DELETE",
    }),
};
