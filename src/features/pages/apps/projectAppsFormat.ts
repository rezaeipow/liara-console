import { createMonthDayTimeFormatter } from "@/shared/utils/dateTime";

const dateFormatter = createMonthDayTimeFormatter("en-US");

export function formatDeploymentDate(value: string | null) {
  if (!value) return "No deployments";
  return dateFormatter.format(new Date(value));
}
