import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import {
  ProjectsAPI,
  type ProjectMeta,
  type ProjectOverview,
} from "../../../api/projectsApi";
import type { Project } from "../../../api/types";

export type ProjectHealthStatus = "healthy" | "provisioning";

export type ProjectListItem = Project & {
  servicesSummary: {
    apps: number;
    vms: number;
  };
  healthStatus: ProjectHealthStatus;
};

export type ProjectsLoaderData = {
  items: ProjectListItem[];
  page: number;
  pageSize: number;
  total: number;
  query: string;
};

export type ProjectOverviewLoaderData = {
  project: ProjectOverview;
};

export type ProjectCreateActionData = {
  formError?: string;
  fieldErrors?: {
    name?: string;
    region?: string;
    plan?: string;
  };
};

export type ProjectCreateLoaderData = {
  meta: ProjectMeta;
};

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export async function projectsLoader({
  request,
}: LoaderFunctionArgs): Promise<ProjectsLoaderData> {
  const url = new URL(request.url);
  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(url.searchParams.get("pageSize"), 8);
  const query = (url.searchParams.get("q") ?? "").trim().toLowerCase();

  const response = await ProjectsAPI.list({ page, pageSize, q: query });
  const items: ProjectListItem[] = await Promise.all(
    response.items.map(async (project) => {
      try {
        const overview = await ProjectsAPI.getById(project.id);
        const totalServices =
          overview.servicesSummary.apps + overview.servicesSummary.vms;

        return {
          ...project,
          servicesSummary: overview.servicesSummary,
          healthStatus: totalServices > 0 ? "healthy" : "provisioning",
        };
      } catch {
        return {
          ...project,
          servicesSummary: { apps: 0, vms: 0 },
          healthStatus: "provisioning",
        };
      }
    }),
  );

  return {
    items,
    page: response.page,
    pageSize: response.pageSize,
    total: response.total,
    query,
  };
}

export async function projectCreateAction({
  request,
}: ActionFunctionArgs): Promise<ProjectCreateActionData | Response> {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const plan = String(formData.get("plan") ?? "").trim();

  const fieldErrors: ProjectCreateActionData["fieldErrors"] = {};
  const meta = await ProjectsAPI.getMeta();

  if (name.length < 3) {
    fieldErrors.name = "Project name must be at least 3 characters.";
  }
  if (!region || !meta.regions.includes(region)) {
    fieldErrors.region = "Please choose a valid region.";
  }
  if (!plan || !meta.plans.includes(plan)) {
    fieldErrors.plan = "Please choose a valid plan.";
  }

  if (fieldErrors.name || fieldErrors.region || fieldErrors.plan) {
    return { fieldErrors };
  }

  try {
    const project = await ProjectsAPI.create({ name, region, plan });
    return redirect(`/console/projects/${project.id}`);
  } catch (error: unknown) {
    return {
      formError: error instanceof Error ? error.message : "Could not create project.",
    };
  }
}

export async function projectCreateLoader(): Promise<ProjectCreateLoaderData> {
  const meta = await ProjectsAPI.getMeta();
  return { meta };
}

export async function projectOverviewLoader({
  params,
}: LoaderFunctionArgs): Promise<ProjectOverviewLoaderData> {
  const projectId = String(params.projectId ?? "").trim();
  if (!projectId) {
    throw new Response("Project id is required", { status: 400 });
  }

  const project = await ProjectsAPI.getById(projectId);
  return { project };
}
