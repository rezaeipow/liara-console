import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppsAPI } from "@/api/appsApi";
import type { Deployment } from "@/api/types";
import { useQueryParams } from "@/shared/hooks/useQueryParams";
import type { ViewMode } from "@/shared/types/view";
import { CARD_TABLE_VIEW_OPTIONS } from "@/shared/constants/viewOptions";
import { appDeploymentsSortOptions, appDeploymentsStatusOptions } from "./appDeploymentsUtils";

export function useAppDeploymentsPageState() {
  const { appId } = useParams();
  const { getEnumParam, setQueryParam } = useQueryParams();
  const [items, setItems] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const statusFilter = getEnumParam("status", [...appDeploymentsStatusOptions], "all");
  const sortOrder = getEnumParam("sort", [...appDeploymentsSortOptions], "newest");
  const viewMode = getEnumParam("view", [...CARD_TABLE_VIEW_OPTIONS] as ViewMode[], "cards");

  const loadDeployments = useCallback(async () => {
    if (!appId) {
      setError("App id is missing.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await AppsAPI.getDeployments(appId);
      setItems(response.items);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Could not load deployments.");
    } finally {
      setIsLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    void loadDeployments();
  }, [loadDeployments]);

  const stats = useMemo(() => ({
    total: items.length,
    success: items.filter((item) => item.status === "success").length,
    failed: items.filter((item) => item.status === "failed").length,
    running: items.filter((item) => item.status === "running").length,
  }), [items]);

  const filteredItems = useMemo(() => {
    const next = statusFilter === "all" ? items : items.filter((item) => item.status === statusFilter);
    return [...next].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });
  }, [items, sortOrder, statusFilter]);

  const latestDeployment = useMemo(() => {
    if (items.length === 0) return null;
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }, [items]);

  return {
    items,
    isLoading,
    error,
    statusFilter,
    sortOrder,
    viewMode,
    setQueryParam,
    loadDeployments,
    stats,
    filteredItems,
    latestDeployment,
  };
}
