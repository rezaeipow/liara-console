import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import type { ConsoleActivityItem, ConsoleHomeStatItem, QuickAction } from "./types";

export const quickActions: QuickAction[] = [
  {
    id: "new-project",
    title: "Create Project",
    description: "Start a new environment for your workload.",
    to: "/console/projects/new",
    icon: <AddCircleOutlineIcon fontSize="small" />,
    primary: true,
  },
  {
    id: "topup",
    title: "Top-up Credit",
    description: "Increase your available balance for deployments.",
    to: "/console/billing/topup",
    icon: <CreditCardOutlinedIcon fontSize="small" />,
  },
  {
    id: "support",
    title: "Open Ticket",
    description: "Get help from support for urgent issues.",
    to: "/console/support/tickets/new",
    icon: <SupportAgentOutlinedIcon fontSize="small" />,
  },
];

export const activityItems: ConsoleActivityItem[] = [
  { id: "a1", title: "Billing", detail: "Latest invoice is ready", to: "/console/billing/invoices" },
  { id: "a2", title: "Projects", detail: "Review active services and health", to: "/console/projects" },
  { id: "a3", title: "Notifications", detail: "Check unread operational updates", to: "/console/notifications" },
];

export const consoleStatItems: ConsoleHomeStatItem[] = [
  {
    id: "projects",
    label: "Projects",
    value: "Workspace",
    hint: "Browse, create and manage project environments.",
    to: "/console/projects",
    icon: <RocketLaunchOutlinedIcon fontSize="small" />,
  },
  {
    id: "billing",
    label: "Billing",
    value: "Finance",
    hint: "Track credit, top-ups and invoices in one flow.",
    to: "/console/billing",
    icon: <CreditCardOutlinedIcon fontSize="small" />,
  },
  {
    id: "support",
    label: "Support",
    value: "Tickets",
    hint: "Create and follow support requests and replies.",
    to: "/console/support/tickets",
    icon: <SupportAgentOutlinedIcon fontSize="small" />,
  },
  {
    id: "notifications",
    label: "Notifications",
    value: "Up to date",
    hint: "Read and clear platform updates.",
    to: "/console/notifications",
    icon: <NotificationsOutlinedIcon fontSize="small" />,
  },
];
