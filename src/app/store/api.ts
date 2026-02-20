import { createApi } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { request, ApiError } from "../../api/httpClient";
import type {
  AppService,
  Deployment,
  PaginatedResponse,
  Project,
  Vm,
} from "../../api/types";
import type { ProjectMeta, ProjectOverview } from "../../api/projectsApi";

type RequestArgs = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

const baseQuery: BaseQueryFn<RequestArgs, unknown, { status: number; data: { message: string } }> = async (
  args,
) => {
  try {
    const data = await request(args.url, {
      method: args.method,
      body: args.body,
    });
    return { data };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return { error: { status: error.status, data: { message: error.message } } };
    }
    return { error: { status: 500, data: { message: "Unknown error" } } };
  }
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Projects", "Project", "Apps", "App", "Vms", "Vm", "Deployments"],
  endpoints: (builder) => ({
    getProjects: builder.query<PaginatedResponse<Project>, { page?: number; pageSize?: number; q?: string }>({
      query: ({ page = 1, pageSize = 10, q = "" }) => ({
        url: `/projects?page=${page}&pageSize=${pageSize}${q ? `&q=${encodeURIComponent(q)}` : ""}`,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Projects" as const, id: "LIST" },
              ...result.items.map((item) => ({ type: "Project" as const, id: item.id })),
            ]
          : [{ type: "Projects" as const, id: "LIST" }],
    }),
    getProjectById: builder.query<ProjectOverview, string>({
      query: (projectId) => ({ url: `/projects/${projectId}` }),
      providesTags: (_result, _error, projectId) => [{ type: "Project" as const, id: projectId }],
    }),
    getProjectMeta: builder.query<ProjectMeta, void>({
      query: () => ({ url: "/projects/meta" }),
    }),
    createProject: builder.mutation<Project, { name: string; region: string; plan: string }>({
      query: (body) => ({ url: "/projects", method: "POST", body }),
      invalidatesTags: [{ type: "Projects" as const, id: "LIST" }],
    }),
    renameProject: builder.mutation<Project, { projectId: string; name: string }>({
      query: ({ projectId, name }) => ({
        url: `/projects/${projectId}`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Project" as const, id: projectId }],
    }),
    deleteProject: builder.mutation<{ id: string }, string>({
      query: (projectId) => ({ url: `/projects/${projectId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, projectId) => [
        { type: "Project" as const, id: projectId },
        { type: "Projects" as const, id: "LIST" },
      ],
    }),
    getAppsByProject: builder.query<{ items: AppService[] }, string>({
      query: (projectId) => ({ url: `/projects/${projectId}/apps` }),
      providesTags: (_result, _error, projectId) => [{ type: "Apps" as const, id: projectId }],
    }),
    getDeploymentsByProject: builder.query<{ items: Deployment[] }, string>({
      query: (projectId) => ({ url: `/projects/${projectId}/deployments` }),
      providesTags: (_result, _error, projectId) => [{ type: "Deployments" as const, id: projectId }],
    }),
    createApp: builder.mutation<AppService, { projectId: string; name: string; region: string; plan: string }>({
      query: ({ projectId, ...body }) => ({ url: `/projects/${projectId}/apps`, method: "POST", body }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Apps" as const, id: projectId },
        { type: "Deployments" as const, id: projectId },
      ],
    }),
    restartApp: builder.mutation<{ success: boolean }, string>({
      query: (appId) => ({ url: `/apps/${appId}/restart`, method: "POST" }),
      invalidatesTags: [{ type: "Apps" as const, id: "LIST" }],
    }),
    deleteApp: builder.mutation<void, { appId: string; projectId: string }>({
      query: ({ appId }) => ({ url: `/apps/${appId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Apps" as const, id: projectId },
        { type: "Deployments" as const, id: projectId },
      ],
    }),
    getVmsByProject: builder.query<{ items: Vm[] }, string>({
      query: (projectId) => ({ url: `/projects/${projectId}/vms` }),
      providesTags: (_result, _error, projectId) => [{ type: "Vms" as const, id: projectId }],
    }),
    createVm: builder.mutation<Vm, { projectId: string; name: string; cpu: number; ram: number; disk: number }>({
      query: ({ projectId, ...body }) => ({ url: `/projects/${projectId}/vms`, method: "POST", body }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Vms" as const, id: projectId }],
    }),
    startVm: builder.mutation<{ success: boolean }, { vmId: string; projectId: string }>({
      query: ({ vmId }) => ({ url: `/vms/${vmId}/start`, method: "POST" }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Vms" as const, id: projectId }],
    }),
    stopVm: builder.mutation<{ success: boolean }, { vmId: string; projectId: string }>({
      query: ({ vmId }) => ({ url: `/vms/${vmId}/stop`, method: "POST" }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Vms" as const, id: projectId }],
    }),
    rebootVm: builder.mutation<{ success: boolean }, { vmId: string; projectId: string }>({
      query: ({ vmId }) => ({ url: `/vms/${vmId}/reboot`, method: "POST" }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Vms" as const, id: projectId }],
    }),
    deleteVm: builder.mutation<void, { vmId: string; projectId: string }>({
      query: ({ vmId }) => ({ url: `/vms/${vmId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { projectId }) => [{ type: "Vms" as const, id: projectId }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useGetProjectMetaQuery,
  useCreateProjectMutation,
  useRenameProjectMutation,
  useDeleteProjectMutation,
  useGetAppsByProjectQuery,
  useGetDeploymentsByProjectQuery,
  useCreateAppMutation,
  useRestartAppMutation,
  useDeleteAppMutation,
  useGetVmsByProjectQuery,
  useCreateVmMutation,
  useStartVmMutation,
  useStopVmMutation,
  useRebootVmMutation,
  useDeleteVmMutation,
} = api;
