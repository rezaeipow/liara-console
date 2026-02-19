import { request } from "./httpClient";
import type { PaginatedResponse, Project } from "./types";

export interface ProjectOverview extends Project {
  servicesSummary: {
    apps: number;
    vms: number;
  };
  billingSnapshot: {
    credit: number;
  };
  activity: Array<{
    id: string;
    title: string;
  }>;
}

export interface ProjectMeta {
  regions: string[];
  plans: string[];
}

export const ProjectsAPI = {
  list: (params?: { page?: number; pageSize?: number; q?: string }) => {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const query = params?.q?.trim() ? `&q=${encodeURIComponent(params.q.trim())}` : "";
    return request<PaginatedResponse<Project>>(
      `/projects?page=${page}&pageSize=${pageSize}${query}`,
    );
  },

  create: (payload: { name: string; region: string; plan: string }) =>
    request<Project>("/projects", { method: "POST", body: payload }),

  getById: (projectId: string) => request<ProjectOverview>(`/projects/${projectId}`),

  getMeta: () => request<ProjectMeta>("/projects/meta"),
};
