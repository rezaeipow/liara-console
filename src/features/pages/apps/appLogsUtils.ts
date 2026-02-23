import { createTimeWithSecondsFormatter } from "@/shared/utils/dateTime";

const dateTimeFormatter = createTimeWithSecondsFormatter();

export const MAX_LOG_ITEMS = 120;
export const STREAM_INTERVAL_MS = 3500;

export function formatLogDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function getLogLevelColor(value: string) {
  if (value === "error") return "error";
  if (value === "warn") return "warning";
  return "info";
}
