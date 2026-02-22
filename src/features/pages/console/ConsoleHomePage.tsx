import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../app/store/hooks";
import { selectActiveAccount } from "../../../app/store/slices/accountSlice";
import { selectTableDensity, selectUnreadNotificationsCount } from "../../../app/store/slices/uiSlice";

type QuickAction = {
  id: string;
  title: string;
  description: string;
  to: string;
  icon: ReactNode;
  primary?: boolean;
};

const quickActions: QuickAction[] = [
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

const activityItems = [
  { id: "a1", title: "Billing", detail: "Latest invoice is ready", to: "/console/billing/invoices" },
  { id: "a2", title: "Projects", detail: "Review active services and health", to: "/console/projects" },
  { id: "a3", title: "Notifications", detail: "Check unread operational updates", to: "/console/notifications" },
];

export default function ConsoleHomePage() {
  const activeAccount = useAppSelector(selectActiveAccount);
  const unreadNotifications = useAppSelector(selectUnreadNotificationsCount);
  const tableDensity = useAppSelector(selectTableDensity);
  const isCompact = tableDensity === "compact";

  return (
    <Stack
      spacing={isCompact ? 1.2 : 2.2}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 980, lg: 1120 },
        mx: { xs: 0, sm: "auto" },
        mt: { xs: 1.25, sm: 1.5 },
        px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
      }}
    >
      <Paper
        sx={{
          p: isCompact ? { xs: 1.2, sm: 1.4 } : { xs: 2.1, sm: 2.6 },
          borderRadius: isCompact ? { xs: 0.9, sm: 1.1 } : { xs: 1.5, sm: 2 },
          border: "1px solid rgba(31,111,235,0.34)",
          background:
            "linear-gradient(120deg, rgba(31,111,235,0.24), rgba(14,165,164,0.16))",
          backdropFilter: "blur(14px)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={isCompact ? 1 : 1.8}
        >
          <Stack spacing={isCompact ? 0.45 : 0.7}>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <BoltOutlinedIcon fontSize="small" />
              <Typography variant={isCompact ? "h6" : "h5"} fontWeight={800}>
                Console Overview
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {activeAccount
                ? `Active account: ${activeAccount.name}`
                : "No active account selected. Please switch or create an account."}
            </Typography>
            <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={`Density: ${tableDensity}`}
              />
              <Chip
                size="small"
                color={unreadNotifications > 0 ? "warning" : "success"}
                variant="outlined"
                label={`${unreadNotifications} unread notifications`}
              />
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={0.8} sx={{ width: { xs: "100%", md: "auto" } }}>
            <Button
              component={Link}
              to="/console/projects/new"
              variant="contained"
              startIcon={<RocketLaunchOutlinedIcon />}
              aria-label="Create a new project"
            >
              New project
            </Button>
            <Button
              component={Link}
              to="/console/notifications"
              variant="outlined"
              endIcon={<ArrowOutwardIcon />}
              aria-label="Open notifications center"
            >
              Notifications
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: isCompact ? 1 : 1.5,
        }}
      >
        <StatCard
          title="Projects"
          value="Workspace"
          hint="Browse, create and manage project environments."
          icon={<RocketLaunchOutlinedIcon fontSize="small" />}
          to="/console/projects"
        />
        <StatCard
          title="Billing"
          value="Finance"
          hint="Track credit, top-ups and invoices in one flow."
          icon={<CreditCardOutlinedIcon fontSize="small" />}
          to="/console/billing"
        />
        <StatCard
          title="Support"
          value="Tickets"
          hint="Create and follow support requests and replies."
          icon={<SupportAgentOutlinedIcon fontSize="small" />}
          to="/console/support/tickets"
        />
        <StatCard
          title="Notifications"
          value={unreadNotifications > 0 ? `${unreadNotifications} unread` : "Up to date"}
          hint="Read and clear platform updates."
          icon={<NotificationsOutlinedIcon fontSize="small" />}
          to="/console/notifications"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.35fr 1fr" },
          gap: isCompact ? 1 : 1.5,
        }}
      >
        <Paper
          sx={{
            p: isCompact ? { xs: 1.1, sm: 1.3 } : { xs: 1.8, sm: 2.2 },
            borderRadius: isCompact ? { xs: 0.9, sm: 1.1 } : { xs: 1.5, sm: 2 },
            border: `1px solid ${alpha("#1f6feb", 0.24)}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.76))",
            backdropFilter: "blur(10px)",
          }}
        >
          <Stack spacing={isCompact ? 0.65 : 1.1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography fontWeight={800}>Quick Actions</Typography>
              <Chip size="small" label="Priority" color="primary" variant="outlined" />
            </Stack>

            <Stack spacing={isCompact ? 0.5 : 0.9} role="list" aria-label="Console quick actions">
              {quickActions.map((action) => (
                <Stack
                  key={action.id}
                  role="listitem"
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  spacing={isCompact ? 0.45 : 0.8}
                  sx={{
                    p: isCompact ? 0.75 : 1.1,
                    borderRadius: isCompact ? 0.8 : 1.3,
                    border: `1px solid ${alpha("#0f172a", 0.1)}`,
                    backgroundColor: alpha("#ffffff", 0.56),
                  }}
                >
                  <Stack spacing={0.2}>
                    <Stack direction="row" spacing={0.7} alignItems="center">
                      {action.icon}
                      <Typography variant="body2" fontWeight={700}>
                        {action.title}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {action.description}
                    </Typography>
                  </Stack>
                  <Button
                    component={Link}
                    to={action.to}
                    size="small"
                    variant={action.primary ? "contained" : "outlined"}
                    endIcon={<ArrowOutwardIcon fontSize="small" />}
                    aria-label={`Open ${action.title}`}
                  >
                    Open
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: isCompact ? { xs: 1.1, sm: 1.3 } : { xs: 1.8, sm: 2.2 },
            borderRadius: isCompact ? { xs: 0.9, sm: 1.1 } : { xs: 1.5, sm: 2 },
            border: `1px solid ${alpha("#1f6feb", 0.24)}`,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.74))",
            backdropFilter: "blur(10px)",
          }}
        >
          <Stack spacing={isCompact ? 0.65 : 1.1}>
            <Typography fontWeight={800}>Recent Activity</Typography>
            <Stack spacing={isCompact ? 0.5 : 0.9} role="list" aria-label="Recent console activities">
              {activityItems.map((item) => (
                <Stack
                  key={item.id}
                  role="listitem"
                  direction="row"
                  spacing={0.9}
                  alignItems="flex-start"
                  sx={{
                    p: isCompact ? 0.7 : 1,
                    borderRadius: isCompact ? 0.75 : 1.2,
                    border: `1px solid ${alpha("#0f172a", 0.08)}`,
                    backgroundColor: alpha("#ffffff", 0.48),
                  }}
                >
                  <ReceiptLongOutlinedIcon fontSize="small" />
                  <Stack spacing={0.2} sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.detail}
                    </Typography>
                  </Stack>
                  <Button
                    component={Link}
                    to={item.to}
                    size="small"
                    variant="text"
                    aria-label={`Open ${item.title}`}
                  >
                    View
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  hint: string;
  icon: ReactNode;
  to: string;
};

function StatCard({ title, value, hint, icon, to }: StatCardProps) {
  return (
    <Paper
      variant="outlined"
      role="group"
      aria-label={`${title}: ${value}`}
      sx={{
        p: 1.6,
        borderRadius: 1.5,
        borderColor: alpha("#1f6feb", 0.24),
        background:
          "linear-gradient(165deg, rgba(255,255,255,0.9), rgba(255,255,255,0.78))",
        backdropFilter: "blur(10px)",
      }}
    >
      <Stack spacing={0.8}>
        <Stack direction="row" spacing={0.8} alignItems="center">
          {icon}
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Stack>
        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
        <Button
          component={Link}
          to={to}
          size="small"
          variant="text"
          endIcon={<ArrowOutwardIcon fontSize="small" />}
          sx={{ alignSelf: "flex-start" }}
          aria-label={`Open ${title} section`}
        >
          Open
        </Button>
      </Stack>
    </Paper>
  );
}
