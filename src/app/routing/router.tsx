import { Alert } from "@mui/material";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  forgotPasswordAction,
  loginAction,
  logoutAction,
  protectedConsoleLoader,
  publicOnlyLoader,
  resetPasswordAction,
  signupAction,
} from "./authData";
import { GuardedConsole } from "./guards";
import { accountsAction, accountsLoader } from "../../features/pages/accounts/accountsData";
import {
  projectCreateAction,
  projectCreateLoader,
  projectOverviewAction,
  projectOverviewLoader,
  projectsLoader,
} from "../../features/pages/projects/projectsData";
import { projectAppsAction, projectAppsLoader } from "../../features/pages/apps/appsData";
import { projectVmsAction, projectVmsLoader } from "../../features/pages/vms/vmsData";
import {
  AccountsPage,
  AuthCompletePage,
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
  ForgotPasswordPage,
  LoginPage,
  NewProjectPage,
  NewTicketPage,
  NotificationsPage,
  ProfilePage,
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
  ResetPasswordPage,
  VmSettingsPage,
} from "./pages";
import { AppInitialFallback, RouteFallback } from "./routeElements";
import { appSettingsAction } from "../../features/pages/apps/appSettingsData";
import { vmSettingsAction } from "../../features/pages/vms/vmSettingsData";
import {
  billingInvoicesLoader,
  billingOverviewLoader,
  billingPaymentsLoader,
  billingTopupAction,
  billingTopupLoader,
} from "../../features/pages/billing/billingData";
import {
  newTicketAction,
  newTicketLoader,
  ticketDetailAction,
  ticketDetailLoader,
  ticketsLoader,
} from "../../features/pages/support/supportData";
import {
  notificationsAction,
  notificationsLoader,
} from "../../features/pages/notifications/notificationsData";

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<AppInitialFallback />}>{node}</Suspense>;
}

export function createAppRouter() {
  return createBrowserRouter([
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
    path: "/auth/complete",
    element: withSuspense(<AuthCompletePage />),
    errorElement: <RouteFallback />,
  },
  {
    loader: publicOnlyLoader,
    errorElement: <RouteFallback />,
    children: [
      { path: "/login", element: withSuspense(<LoginPage />), action: loginAction },
      { path: "/signup", element: withSuspense(<SignupPage />), action: signupAction },
      {
        path: "/forgot-password",
        element: withSuspense(<ForgotPasswordPage />),
        action: forgotPasswordAction,
      },
      {
        path: "/reset-password",
        element: withSuspense(<ResetPasswordPage />),
        action: resetPasswordAction,
      },
    ],
  },
  {
    path: "/console",
    element: <GuardedConsole />,
    loader: protectedConsoleLoader,
    errorElement: <RouteFallback />,
    children: [
      { index: true, element: withSuspense(<ConsoleHomePage />) },
      {
        path: "accounts",
        element: withSuspense(<AccountsPage />),
        loader: accountsLoader,
        action: accountsAction,
      },
      {
        path: "projects",
        element: withSuspense(<ProjectsPage />),
        loader: projectsLoader,
        errorElement: <RouteFallback />,
      },
      {
        path: "projects/new",
        element: withSuspense(<NewProjectPage />),
        loader: projectCreateLoader,
        action: projectCreateAction,
        errorElement: <RouteFallback />,
      },
      {
        path: "projects/:projectId",
        element: withSuspense(<ProjectOverviewPage />),
        loader: projectOverviewLoader,
        action: projectOverviewAction,
        errorElement: <RouteFallback />,
      },
      {
        path: "projects/:projectId/apps",
        element: withSuspense(<ProjectAppsPage />),
        loader: projectAppsLoader,
        action: projectAppsAction,
        errorElement: <RouteFallback />,
      },
      {
        path: "projects/:projectId/apps/:appId",
        element: withSuspense(<AppLayoutPage />),
        errorElement: <RouteFallback />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: "overview", element: withSuspense(<AppOverviewPage />) },
          {
            path: "deployments",
            element: withSuspense(<AppDeploymentsPage />),
          },
          { path: "env", element: withSuspense(<AppEnvPage />) },
          { path: "logs", element: withSuspense(<AppLogsPage />) },
          {
            path: "settings",
            element: withSuspense(<AppSettingsPage />),
            action: appSettingsAction,
          },
        ],
      },
      {
        path: "apps/:appId",
        element: withSuspense(<AppLayoutPage />),
        errorElement: <RouteFallback />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: "overview", element: withSuspense(<AppOverviewPage />) },
          {
            path: "deployments",
            element: withSuspense(<AppDeploymentsPage />),
          },
          { path: "env", element: withSuspense(<AppEnvPage />) },
          { path: "logs", element: withSuspense(<AppLogsPage />) },
          {
            path: "settings",
            element: withSuspense(<AppSettingsPage />),
            action: appSettingsAction,
          },
        ],
      },
      {
        path: "projects/:projectId/vms",
        element: withSuspense(<ProjectVmsPage />),
        loader: projectVmsLoader,
        action: projectVmsAction,
        errorElement: <RouteFallback />,
      },
      {
        path: "vms/:vmId",
        element: withSuspense(<VmLayoutPage />),
        errorElement: <RouteFallback />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: "overview", element: withSuspense(<VmOverviewPage />) },
          { path: "metrics", element: withSuspense(<VmMetricsPage />) },
          {
            path: "settings",
            element: withSuspense(<VmSettingsPage />),
            action: vmSettingsAction,
          },
        ],
      },
      {
        path: "billing",
        element: withSuspense(<BillingOverviewPage />),
        loader: billingOverviewLoader,
        errorElement: <RouteFallback />,
      },
      {
        path: "billing/topup",
        element: withSuspense(<BillingTopupPage />),
        loader: billingTopupLoader,
        action: billingTopupAction,
        errorElement: <RouteFallback />,
      },
      {
        path: "billing/payments",
        element: withSuspense(<BillingPaymentsPage />),
        loader: billingPaymentsLoader,
        errorElement: <RouteFallback />,
      },
      {
        path: "billing/invoices",
        element: withSuspense(<BillingInvoicesPage />),
        loader: billingInvoicesLoader,
        errorElement: <RouteFallback />,
      },
      {
        path: "support/tickets",
        element: withSuspense(<TicketsPage />),
        loader: ticketsLoader,
        errorElement: <RouteFallback />,
      },
      {
        path: "support/tickets/new",
        element: withSuspense(<NewTicketPage />),
        loader: newTicketLoader,
        action: newTicketAction,
        errorElement: <RouteFallback />,
      },
      {
        path: "support/tickets/:ticketId",
        element: withSuspense(<TicketDetailPage />),
        loader: ticketDetailLoader,
        action: ticketDetailAction,
        errorElement: <RouteFallback />,
      },
      {
        path: "notifications",
        element: withSuspense(<NotificationsPage />),
        loader: notificationsLoader,
        action: notificationsAction,
        errorElement: <RouteFallback />,
      },
      { path: "profile", element: withSuspense(<ProfilePage />) },
      { path: "settings", element: withSuspense(<SettingsPage />) },
      {
        path: "*",
        element: <Alert severity="warning">Route not found</Alert>,
      },
    ],
  },
  ]);
}
