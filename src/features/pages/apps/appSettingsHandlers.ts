import { AppsAPI } from "@/api/appsApi";

export async function restartApp(appId: string) {
  await AppsAPI.restart(appId);
}

export async function deleteApp(appId: string) {
  await AppsAPI.remove(appId);
}
