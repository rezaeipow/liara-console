import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppsAPI } from "@/api/appsApi";
import type { AppService } from "@/api/types";
import { getAppLikeStatusTone } from "@/shared/ui/statusTones";
import type { AppLayoutPageState } from "./pageTypes";

export function useAppLayoutState(): AppLayoutPageState {
  const { appId, projectId } = useParams();
  const [app, setApp] = useState<AppService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadApp = async () => {
      if (!appId) {
        if (active) {
          setError("App id is missing.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await AppsAPI.getById(appId);
        if (active) {
          setApp(response);
        }
      } catch (requestError: unknown) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Could not load app.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadApp();
    return () => {
      active = false;
    };
  }, [appId]);

  return {
    app,
    isLoading,
    error,
    setApp,
    projectAppsHref:
      projectId ?? app?.projectId ? `/console/projects/${projectId ?? app?.projectId}/apps` : null,
    statusChipTone: app?.status ? getAppLikeStatusTone(app.status) : "neutral",
  };
}
