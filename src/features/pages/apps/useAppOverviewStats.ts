import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppsAPI } from "@/api/appsApi";

export function useAppOverviewStats() {
  const { appId } = useParams();
  const [deploymentsCount, setDeploymentsCount] = useState<number | null>(null);
  const [envCount, setEnvCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const loadOverviewStats = async () => {
      if (!appId) return;
      try {
        const [deploymentsResponse, envResponse] = await Promise.all([AppsAPI.getDeployments(appId), AppsAPI.getEnvVars(appId)]);
        if (!active) return;
        setDeploymentsCount(deploymentsResponse.items.length);
        setEnvCount(envResponse.items.length);
      } catch {
        if (!active) return;
        setDeploymentsCount(null);
        setEnvCount(null);
      }
    };
    void loadOverviewStats();
    return () => {
      active = false;
    };
  }, [appId]);

  return { deploymentsCount, envCount };
}
