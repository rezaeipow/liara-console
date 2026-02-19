import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  CreditCard as CreditCardIcon,
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  PeopleAlt as PeopleAltIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Support as SupportIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  closeMobileSidebar,
  selectMobileSidebarOpen,
  selectSidebarMode,
  toggleSidebarMode,
} from "../../app/store/slices/uiSlice";

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 80;

const navItems = [
  { label: "Dashboard", path: "/console", icon: <DashboardIcon />, end: true },
  { label: "Accounts", path: "/console/accounts", icon: <PeopleAltIcon /> },
  { label: "Projects", path: "/console/projects", icon: <FolderIcon /> },
  { label: "Billing", path: "/console/billing", icon: <CreditCardIcon /> },
  { label: "Support", path: "/console/support/tickets", icon: <SupportIcon /> },
  { label: "Notifications", path: "/console/notifications", icon: <NotificationsIcon /> },
  { label: "Settings", path: "/console/settings", icon: <SettingsIcon /> },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const sidebarMode = useAppSelector(selectSidebarMode);
  const mobileOpen = useAppSelector(selectMobileSidebarOpen);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isSmMd = !isXs && !isLgUp;
  const isCollapsed = isSmMd && sidebarMode === "collapsed";
  const drawerWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const navContent = (
    <Box sx={{ width: drawerWidth, height: "100%" }}>
      <Toolbar
        sx={{
          minHeight: 68,
          px: isCollapsed ? 1 : 2,
          display: "flex",
          justifyContent: isCollapsed ? "center" : "space-between",
        }}
      >
        {!isCollapsed && (
          <Typography variant="subtitle1" fontWeight={700}>
            Navigation
          </Typography>
        )}

        {isSmMd && (
          <IconButton
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => dispatch(toggleSidebarMode())}
          >
            <ChevronLeftIcon
              sx={{
                transform: isCollapsed ? "rotate(180deg)" : "none",
                transition: "transform .2s ease",
              }}
            />
          </IconButton>
        )}
      </Toolbar>

      <Divider />

      <List sx={{ px: 1, py: 1.5 }}>
        {navItems.map((item) => (
          <Tooltip
            key={item.path}
            title={isCollapsed ? item.label : ""}
            placement="right"
          >
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.end}
              onClick={() => {
                if (isXs) {
                  dispatch(closeMobileSidebar());
                }
              }}
              sx={{
                minHeight: 46,
                mb: 0.5,
                borderRadius: 2,
                justifyContent: isCollapsed ? "center" : "flex-start",
                px: isCollapsed ? 1 : 1.25,
                "&.active": {
                  backgroundColor: "rgba(31, 111, 235, 0.14)",
                  border: "1px solid rgba(31, 111, 235, 0.20)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 1.25,
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600, variant: "body2" }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  if (isXs) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => dispatch(closeMobileSidebar())}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {navContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: isLgUp ? DRAWER_WIDTH : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isLgUp ? DRAWER_WIDTH : drawerWidth,
          boxSizing: "border-box",
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: "width .25s ease",
        },
      }}
    >
      {navContent}
    </Drawer>
  );
}
