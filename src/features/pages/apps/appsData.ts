import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { store } from "@/app/store/index";
import { api } from "@/app/store/api";
import { readActionFormData } from "./appsDataUtils";
import {
  handleCreateAppAction,
  handleDeleteAppAction,
} from "./projectAppsActionHandlers";

export async function projectAppsLoader({ params }: LoaderFunctionArgs) {
  const projectId = String(params.projectId ?? "").trim();
  if (!projectId) {
    throw new Response("Project id is required", { status: 400 });
  }

  await Promise.all([
    store.dispatch(api.endpoints.getAppsByProject.initiate(projectId)).unwrap(),
    store
      .dispatch(api.endpoints.getDeploymentsByProject.initiate(projectId))
      .unwrap(),
  ]);

  return { projectId };
}

export type ProjectAppsActionData = {
  ok?: boolean;
  message?: string;
  formError?: string;
  fieldErrors?: {
    name?: string;
    region?: string;
    plan?: string;
  };
};

export async function projectAppsAction({
  request,
  params,
}: ActionFunctionArgs): Promise<ProjectAppsActionData> {
  const projectId = String(params.projectId ?? "").trim();
  if (!projectId) {
    return { formError: "Project id is required." };
  }

  const formData = await readActionFormData(request);
  const intent = String(formData.get("intent") ?? "").trim();

  if (intent === "create") {
    const name = String(formData.get("name") ?? "").trim();
    const region = String(formData.get("region") ?? "").trim();
    const plan = String(formData.get("plan") ?? "").trim();
    return handleCreateAppAction(projectId, name, region, plan);
  }

  if (intent === "delete") {
    const appId = String(formData.get("appId") ?? "").trim();
    return handleDeleteAppAction(projectId, appId);
  }

  return { formError: "Unsupported action." };
}
