import { api } from "@/app/store/api";
import { store } from "@/app/store/index";
import type { ProjectAppsActionData } from "./appsData";
import { refetchProjectApps, validateCreateApp } from "./appsDataUtils";

export async function handleCreateAppAction(projectId: string, name: string, region: string, plan: string): Promise<ProjectAppsActionData> {
  const fieldErrors = validateCreateApp(name, region, plan);
  if (fieldErrors.name || fieldErrors.region || fieldErrors.plan) return { fieldErrors };
  try {
    await store.dispatch(api.endpoints.createApp.initiate({ projectId, name, region, plan })).unwrap();
    await refetchProjectApps(projectId);
    return { ok: true, message: "App created successfully." };
  } catch (error: unknown) {
    return { formError: error instanceof Error ? error.message : "Could not create app." };
  }
}

export async function handleDeleteAppAction(projectId: string, appId: string): Promise<ProjectAppsActionData> {
  if (!appId) return { formError: "App id is required." };
  try {
    await store.dispatch(api.endpoints.deleteApp.initiate({ appId, projectId })).unwrap();
    await refetchProjectApps(projectId);
    return { ok: true, message: "App deleted." };
  } catch (error: unknown) {
    return { formError: error instanceof Error ? error.message : "Could not delete app." };
  }
}
