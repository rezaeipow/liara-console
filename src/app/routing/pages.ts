import { lazy } from "react";

export const LoginPage = lazy(() => import("../../features/pages/auth/LoginPage"));
export const SignupPage = lazy(() => import("../../features/pages/auth/SignupPage"));
export const ConsoleHomePage = lazy(
  () => import("../../features/pages/console/ConsoleHomePage"),
);
export const AccountsPage = lazy(
  () => import("../../features/pages/accounts/AccountsPage"),
);
export const ProjectsPage = lazy(
  () => import("../../features/pages/projects/ProjectsPage"),
);
export const NewProjectPage = lazy(
  () => import("../../features/pages/projects/NewProjectPage"),
);
export const ProjectOverviewPage = lazy(
  () => import("../../features/pages/projects/ProjectOverviewPage"),
);
export const ProjectAppsPage = lazy(
  () => import("../../features/pages/apps/ProjectAppsPage"),
);
export const AppLayoutPage = lazy(
  () => import("../../features/pages/apps/AppLayoutPage"),
);
export const AppOverviewPage = lazy(
  () => import("../../features/pages/apps/AppOverviewPage"),
);
export const AppDeploymentsPage = lazy(
  () => import("../../features/pages/apps/AppDeploymentsPage"),
);
export const AppEnvPage = lazy(() => import("../../features/pages/apps/AppEnvPage"));
export const AppLogsPage = lazy(
  () => import("../../features/pages/apps/AppLogsPage"),
);
export const AppSettingsPage = lazy(
  () => import("../../features/pages/apps/AppSettingsPage"),
);
export const ProjectVmsPage = lazy(
  () => import("../../features/pages/vms/ProjectVmsPage"),
);
export const VmLayoutPage = lazy(() => import("../../features/pages/vms/VmLayoutPage"));
export const VmOverviewPage = lazy(
  () => import("../../features/pages/vms/VmOverviewPage"),
);
export const VmMetricsPage = lazy(
  () => import("../../features/pages/vms/VmMetricsPage"),
);
export const VmSettingsPage = lazy(
  () => import("../../features/pages/vms/VmSettingsPage"),
);
export const BillingOverviewPage = lazy(
  () => import("../../features/pages/billing/BillingOverviewPage"),
);
export const BillingTopupPage = lazy(
  () => import("../../features/pages/billing/BillingTopupPage"),
);
export const BillingPaymentsPage = lazy(
  () => import("../../features/pages/billing/BillingPaymentsPage"),
);
export const BillingInvoicesPage = lazy(
  () => import("../../features/pages/billing/BillingInvoicesPage"),
);
export const TicketsPage = lazy(
  () => import("../../features/pages/support/TicketsPage"),
);
export const NewTicketPage = lazy(
  () => import("../../features/pages/support/NewTicketPage"),
);
export const TicketDetailPage = lazy(
  () => import("../../features/pages/support/TicketDetailPage"),
);
export const NotificationsPage = lazy(
  () => import("../../features/pages/notifications/NotificationsPage"),
);
export const ProfilePage = lazy(
  () => import("../../features/pages/profile/ProfilePage"),
);
export const SettingsPage = lazy(
  () => import("../../features/pages/settings/SettingsPage"),
);
export const RouteErrorPage = lazy(
  () => import("../../features/pages/RouteErrorPage"),
);
