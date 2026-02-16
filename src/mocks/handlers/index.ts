import type { HttpHandler } from "msw";
import { authHandlers } from "./auth.handlers";
import { accountHandlers } from "./accounts.handlers";
import { projectHandlers } from "./projects.handlers";
import { appHandlers } from "./apps.handlers";
import { vmHandlers } from "./vms.handlers";
import { billingHandlers } from "./billing.handlers";
import { ticketHandlers } from "./tickets.handlers";
import { notificationHandlers } from "./notifications.handlers";

export const handlers: HttpHandler[] = [
  ...authHandlers,
  ...accountHandlers,
  ...billingHandlers,
  ...projectHandlers,
  ...appHandlers,
  ...vmHandlers,
  ...ticketHandlers,
  ...notificationHandlers,
];
