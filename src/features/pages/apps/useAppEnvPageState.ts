import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppsAPI } from "@/api/appsApi";
import type { EnvRow } from "./pageTypes";
import { createEnvLocalId, createRowErrors } from "./appEnvUtils";

export function useAppEnvPageState() {
  const { appId } = useParams();
  const [rows, setRows] = useState<EnvRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [revealSecrets, setRevealSecrets] = useState(false);

  const loadEnvVars = useCallback(async () => {
    if (!appId) {
      setError("App id is missing.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await AppsAPI.getEnvVars(appId);
      setRows(response.items.map((item) => ({ id: createEnvLocalId(), key: item.key, value: item.value, secret: Boolean(item.secret) })));
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Could not load env vars.");
    } finally {
      setIsLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    void loadEnvVars();
  }, [loadEnvVars]);

  const rowErrors = useMemo(() => createRowErrors(rows), [rows]);
  const hasValidationError = Object.keys(rowErrors).length > 0;
  const hasSecretRows = rows.some((row) => row.secret);

  const updateRow = (rowId: string, patch: Partial<EnvRow>) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row)));
  };
  const addRow = () => setRows((prev) => [...prev, { id: createEnvLocalId(), key: "", value: "", secret: false }]);
  const removeRow = (rowId: string) => setRows((prev) => prev.filter((row) => row.id !== rowId));

  const save = async () => {
    if (!appId || hasValidationError) return;
    setIsSaving(true);
    setError(null);
    setNotice(null);
    try {
      await AppsAPI.updateEnvVars(appId, rows.map((row) => ({ key: row.key.trim().toUpperCase(), value: row.value, secret: row.secret })));
      setNotice("Environment variables saved.");
      await loadEnvVars();
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Could not save env vars.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    rows, isLoading, isSaving, error, notice, revealSecrets, rowErrors, hasValidationError, hasSecretRows,
    setRevealSecrets, loadEnvVars, addRow, removeRow, updateRow, save,
  };
}
