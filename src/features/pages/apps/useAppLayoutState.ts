import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { getAppLikeStatusTone } from "@/shared/ui/statusTones";
import type { AppLayoutLoaderData } from "./appsData";
import type { AppLayoutPageState } from "./pageTypes";

export function useAppLayoutState(): AppLayoutPageState {
  const { app: loadedApp } = useLoaderData() as AppLayoutLoaderData;
  const { projectId } = useParams();
  const [app, setApp] = useState<typeof loadedApp | null>(loadedApp);

  useEffect(() => {
    setApp(loadedApp);
  }, [loadedApp]);

  return {
    app,
    isLoading: false,
    error: null,
    setApp,
    projectAppsHref:
      projectId ?? app?.projectId ? `/console/projects/${projectId ?? app?.projectId}/apps` : null,
    statusChipTone: app?.status ? getAppLikeStatusTone(app.status) : "neutral",
  };
}
