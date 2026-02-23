import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppsAPI } from "@/api/appsApi";
import type { LogItem, LogLevel } from "./pageTypes";
import { MAX_LOG_ITEMS, STREAM_INTERVAL_MS } from "./appLogsUtils";

export function useAppLogsPageState() {
  const { appId } = useParams();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<LogLevel>("all");
  const [autoStream, setAutoStream] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const fetchLogs = useCallback(async (mode: "replace" | "append") => {
    if (!appId) {
      setError("App id is missing.");
      setIsLoading(false);
      return;
    }
    if (mode === "replace") setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const response = await AppsAPI.getLogs(appId, level === "all" ? undefined : level);
      const now = new Date().toISOString();
      const normalized = response.items.map((item) => ({ ...item, fetchedAt: now }));
      setLogs((prev) => {
        if (mode === "replace") return normalized.slice(0, MAX_LOG_ITEMS);
        const merged = [...normalized, ...prev];
        const seen = new Set<string>();
        return merged.filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true))).slice(0, MAX_LOG_ITEMS);
      });
      setLastUpdatedAt(now);
      setError(null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Could not load logs.");
    } finally {
      if (mode === "replace") setIsLoading(false);
      else setIsRefreshing(false);
    }
  }, [appId, level]);

  useEffect(() => {
    void fetchLogs("replace");
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoStream || !appId) return;
    const intervalId = window.setInterval(() => void fetchLogs("append"), STREAM_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [appId, autoStream, fetchLogs]);

  return {
    logs, isLoading, isRefreshing, error, level, autoStream, lastUpdatedAt,
    setLogs, setLevel, setAutoStream, fetchLogs,
  };
}
