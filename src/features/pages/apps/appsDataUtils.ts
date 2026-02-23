import { api } from "@/app/store/api";
import { store } from "@/app/store/index";
import type { ProjectAppsActionData } from "./appsData";

export async function readActionFormData(request: Request) {
  try {
    return await request.formData();
  } catch {
    try {
      const raw = await request.clone().text();
      if (raw) {
        const params = new URLSearchParams(raw);
        const formData = new FormData();
        params.forEach((value, key) => formData.append(key, value));
        if (Array.from(formData.keys()).length > 0) return formData;
      }
    } catch {
      // continue
    }
    try {
      const payload = (await request.clone().json()) as Record<string, unknown>;
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, String(value));
      });
      return formData;
    } catch {
      return new FormData();
    }
  }
}

export async function refetchProjectApps(projectId: string) {
  await Promise.all([
    store.dispatch(api.endpoints.getAppsByProject.initiate(projectId, { forceRefetch: true })).unwrap(),
    store.dispatch(api.endpoints.getDeploymentsByProject.initiate(projectId, { forceRefetch: true })).unwrap(),
  ]);
}

export function validateCreateApp(name: string, region: string, plan: string) {
  const fieldErrors: ProjectAppsActionData["fieldErrors"] = {};
  if (name.length < 3) fieldErrors.name = "Name must be at least 3 characters.";
  if (!region) fieldErrors.region = "Region is required.";
  if (!plan) fieldErrors.plan = "Plan is required.";
  return fieldErrors;
}
