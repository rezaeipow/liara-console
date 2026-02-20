import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { store } from "../../../app/store/index";
import { api } from "../../../app/store/api";

export async function projectAppsLoader({ params }: LoaderFunctionArgs) {
  const projectId = String(params.projectId ?? "").trim();
  if (!projectId) {
    throw new Response("Project id is required", { status: 400 });
  }

  await Promise.all([
    store.dispatch(api.endpoints.getAppsByProject.initiate(projectId)).unwrap(),
    store.dispatch(api.endpoints.getDeploymentsByProject.initiate(projectId)).unwrap(),
  ]);

  return { projectId };
}

async function readActionFormData(request: Request) {
  try {
    return await request.formData();
  } catch {
    try {
      const raw = await request.clone().text();
      if (raw) {
        const params = new URLSearchParams(raw);
        const formData = new FormData();
        params.forEach((value, key) => {
          formData.append(key, value);
        });
        if (Array.from(formData.keys()).length > 0) {
          return formData;
        }
      }
    } catch {
      // continue to JSON fallback
    }

    try {
      const payload = (await request.clone().json()) as Record<string, unknown>;
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      return formData;
    } catch {
      return new FormData();
    }
  }
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

    const fieldErrors: ProjectAppsActionData["fieldErrors"] = {};
    if (name.length < 3) fieldErrors.name = "Name must be at least 3 characters.";
    if (!region) fieldErrors.region = "Region is required.";
    if (!plan) fieldErrors.plan = "Plan is required.";

    if (fieldErrors.name || fieldErrors.region || fieldErrors.plan) {
      return { fieldErrors };
    }

    try {
      await store
        .dispatch(api.endpoints.createApp.initiate({ projectId, name, region, plan }))
        .unwrap();
      await Promise.all([
        store
          .dispatch(
            api.endpoints.getAppsByProject.initiate(projectId, { forceRefetch: true }),
          )
          .unwrap(),
        store
          .dispatch(
            api.endpoints.getDeploymentsByProject.initiate(projectId, {
              forceRefetch: true,
            }),
          )
          .unwrap(),
      ]);
      return { ok: true, message: "App created successfully." };
    } catch (error: unknown) {
      return {
        formError: error instanceof Error ? error.message : "Could not create app.",
      };
    }
  }

  if (intent === "delete") {
    const appId = String(formData.get("appId") ?? "").trim();
    if (!appId) {
      return { formError: "App id is required." };
    }

    try {
      await store.dispatch(api.endpoints.deleteApp.initiate({ appId, projectId })).unwrap();
      await Promise.all([
        store
          .dispatch(
            api.endpoints.getAppsByProject.initiate(projectId, { forceRefetch: true }),
          )
          .unwrap(),
        store
          .dispatch(
            api.endpoints.getDeploymentsByProject.initiate(projectId, {
              forceRefetch: true,
            }),
          )
          .unwrap(),
      ]);
      return { ok: true, message: "App deleted." };
    } catch (error: unknown) {
      return {
        formError: error instanceof Error ? error.message : "Could not delete app.",
      };
    }
  }

  return { formError: "Unsupported action." };
}

