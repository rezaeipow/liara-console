import { Alert } from "@mui/material";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { logoutAction, loginAction, protectedConsoleLoader, publicOnlyLoader, signupAction } from "./authData";
import { GuardedConsole } from "./guards";
import {
  AccountsPage,
  AppDeploymentsPage,
  AppEnvPage,
  AppLayoutPage,
  AppLogsPage,
  AppOverviewPage,
  AppSettingsPage,
  BillingInvoicesPage,
  BillingOverviewPage,
  BillingPaymentsPage,
  BillingTopupPage,
  ConsoleHomePage,
  LoginPage,
  NewProjectPage,
  NewTicketPage,
  NotificationsPage,
  ProjectAppsPage,
  ProjectOverviewPage,
  ProjectsPage,
  ProjectVmsPage,
  SettingsPage,
  SignupPage,
  TicketDetailPage,
  TicketsPage,
  VmLayoutPage,
  VmMetricsPage,
  VmOverviewPage,
  VmSettingsPage,
} from "./pages";
import { RouteFallback } from "./routeElements";

function withSuspense(node: ReactNode) {
  return <Suspense fallback={null}>{node}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/console" replace />,
    errorElement: <RouteFallback />,
  },
  {
    path: "/logout",
    action: logoutAction,
  },
  {
    loader: publicOnlyLoader,
    errorElement: <RouteFallback />,
    children: [
      { path: "/login", element: withSuspense(<LoginPage />), action: loginAction },
      { path: "/signup", element: withSuspense(<SignupPage />), action: signupAction },
    ],
  },
  {
    path: "/console",
    element: <GuardedConsole />,
    loader: protectedConsoleLoader,
    errorElement: <RouteFallback />,
    children: [
      { index: true, element: withSuspense(<ConsoleHomePage />) },
      { path: "accounts", element: withSuspense(<AccountsPage />) },
      { path: "projects", element: withSuspense(<ProjectsPage />) },
      { path: "projects/new", element: withSuspense(<NewProjectPage />) },
      {
        path: "projects/:projectId",
        element: withSuspense(<ProjectOverviewPage />),
      },
      {
        path: "projects/:projectId/apps",
        element: withSuspense(<ProjectAppsPage />),
      },
      {
        path: "apps/:appId",
        element: withSuspense(<AppLayoutPage />),
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: "overview", element: withSuspense(<AppOverviewPage />) },
          {
            path: "deployments",
            element: withSuspense(<AppDeploymentsPage />),
          },
          { path: "env", element: withSuspense(<AppEnvPage />) },
          { path: "logs", element: withSuspense(<AppLogsPage />) },
          { path: "settings", element: withSuspense(<AppSettingsPage />) },
        ],
      },
      {
        path: "projects/:projectId/vms",
        element: withSuspense(<ProjectVmsPage />),
      },
      {
        path: "vms/:vmId",
        element: withSuspense(<VmLayoutPage />),
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: "overview", element: withSuspense(<VmOverviewPage />) },
          { path: "metrics", element: withSuspense(<VmMetricsPage />) },
          { path: "settings", element: withSuspense(<VmSettingsPage />) },
        ],
      },
      { path: "billing", element: withSuspense(<BillingOverviewPage />) },
      { path: "billing/topup", element: withSuspense(<BillingTopupPage />) },
      {
        path: "billing/payments",
        element: withSuspense(<BillingPaymentsPage />),
      },
      {
        path: "billing/invoices",
        element: withSuspense(<BillingInvoicesPage />),
      },
      { path: "support/tickets", element: withSuspense(<TicketsPage />) },
      { path: "support/tickets/new", element: withSuspense(<NewTicketPage />) },
      {
        path: "support/tickets/:ticketId",
        element: withSuspense(<TicketDetailPage />),
      },
      { path: "notifications", element: withSuspense(<NotificationsPage />) },
      { path: "settings", element: withSuspense(<SettingsPage />) },
      {
        path: "*",
        element: <Alert severity="warning">Route not found</Alert>,
      },
    ],
  },
]);
