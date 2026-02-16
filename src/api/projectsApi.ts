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

export const ProjectsAPI = {
  list: (params?: { page?: number; pageSize?: number }) => {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    return request<PaginatedResponse<Project>>(`/projects?page=${page}&pageSize=${pageSize}`);
  },

  create: (payload: { name: string; region: string; plan: string }) =>
    request<Project>("/projects", { method: "POST", body: payload }),

  getById: (projectId: string) => request<ProjectOverview>(`/projects/${projectId}`),
};

