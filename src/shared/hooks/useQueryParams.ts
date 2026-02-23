import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type UpdateOptions = {
  replace?: boolean;
  resetPageKey?: string;
};

type QueryParamValue = string | number | boolean | null | undefined;
type BatchUpdateOptions = UpdateOptions & {
  removeWhen?: Record<string, string>;
};

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback(
    (key: string, fallback = "") => searchParams.get(key) ?? fallback,
    [searchParams],
  );

  const getEnumParam = useCallback(
    <T extends string>(key: string, allowedValues: readonly T[], fallback: T): T => {
      const raw = searchParams.get(key);
      if (!raw) return fallback;
      return allowedValues.includes(raw as T) ? (raw as T) : fallback;
    },
    [searchParams],
  );

  const getBooleanParam = useCallback(
    (key: string, trueValue = "1", fallback = false) => {
      const raw = searchParams.get(key);
      if (raw === null) return fallback;
      return raw === trueValue;
    },
    [searchParams],
  );

  const setQueryParam = useCallback(
    (key: string, value: QueryParamValue, removeWhen = "", options?: UpdateOptions) => {
      const next = new URLSearchParams(searchParams);
      const normalizedValue = value === undefined || value === null ? "" : String(value);
      if (!normalizedValue || normalizedValue === removeWhen) next.delete(key);
      else next.set(key, normalizedValue);

      if (options?.resetPageKey) {
        next.set(options.resetPageKey, "1");
      }

      setSearchParams(next, { replace: options?.replace ?? true });
    },
    [searchParams, setSearchParams],
  );

  const setQueryParams = useCallback(
    (updates: Record<string, QueryParamValue>, options?: BatchUpdateOptions) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        const normalizedValue = value === undefined || value === null ? "" : String(value);
        const removeWhen = options?.removeWhen?.[key] ?? "";
        if (!normalizedValue || normalizedValue === removeWhen) {
          next.delete(key);
          return;
        }
        next.set(key, normalizedValue);
      });

      if (options?.resetPageKey) {
        next.set(options.resetPageKey, "1");
      }

      setSearchParams(next, { replace: options?.replace ?? true });
    },
    [searchParams, setSearchParams],
  );

  const clearQueryParams = useCallback(
    (options?: Pick<UpdateOptions, "replace">) => {
      setSearchParams(new URLSearchParams(), { replace: options?.replace ?? true });
    },
    [setSearchParams],
  );

  return {
    searchParams,
    setSearchParams,
    getParam,
    getEnumParam,
    getBooleanParam,
    setQueryParam,
    setQueryParams,
    clearQueryParams,
  };
}
