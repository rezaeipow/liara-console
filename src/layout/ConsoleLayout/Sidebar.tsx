
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Box,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  Storage as StorageIcon,
  CreditCard as CreditCardIcon,
  Support as SupportIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  selectSidebarMode,
  selectMobileSidebarOpen,
  toggleSidebarMode,
  openMobileSidebar,
  closeMobileSidebar,
} from "../../app/store/slices/uiSlice";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

const navItems = [
  { label: "Dashboard", path: "/console", icon: <DashboardIcon /> },
  { label: "Projects", path: "/console/projects", icon: <FolderIcon /> },
  { label: "Services", path: "/console/services", icon: <StorageIcon /> },
  { label: "Billing", path: "/console/billing", icon: <CreditCardIcon /> },
  { label: "Support", path: "/console/support/tickets", icon: <SupportIcon /> },
  {
    label: "Notifications",
    path: "/console/notifications",
    icon: <NotificationsIcon />,
  },
  { label: "Settings", path: "/console/settings", icon: <SettingsIcon /> },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const sidebarMode = useAppSelector(selectSidebarMode);
  const mobileOpen = useAppSelector(selectMobileSidebarOpen);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const isCollapsed = !isXs && !isLgUp && sidebarMode === "collapsed";
  const drawerWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const glassStyles = {
    backdropFilter: "blur(16px)",
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(255,255,255,0.7)"
        : "rgba(30,30,30,0.65)",
    borderRight: `1px solid ${
      theme.palette.mode === "light"
        ? theme.palette.divider
        : "rgba(255,255,255,0.08)"
    }`,
  };

  const content = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        transition: "width .25s ease",
        ...glassStyles,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: isCollapsed ? "center" : "space-between",
          px: 2,
        }}
      >
        {!isCollapsed && <Box sx={{ fontWeight: 600 }}>Console</Box>}

        {!isXs && !isLgUp && (
          <IconButton
            aria-label="Collapse sidebar"
            onClick={() => dispatch(toggleSidebarMode())}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider />

      <List>
        {navItems.map((item) => (
          <Tooltip
            key={item.label}
            title={isCollapsed ? item.label : ""}
            placement="right"
          >
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={() => isXs && dispatch(closeMobileSidebar())}
              sx={{
                justifyContent: isCollapsed ? "center" : "flex-start",
                px: isCollapsed ? 1 : 2,
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                "&.active": {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.08)"
                      : "rgba(255,255,255,0.12)",
                },
                color: theme.palette.text.primary,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: "center",
                  color: theme.palette.text.primary,
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  // -------- Mobile Drawer --------
  if (isXs) {
    return (
      <>
        {!mobileOpen && (
          <IconButton
            aria-label="Open sidebar"
            onClick={() => dispatch(openMobileSidebar())}
            sx={{ position: "fixed", top: 16, left: 16, zIndex: 1400 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => dispatch(closeMobileSidebar())}
          ModalProps={{ keepMounted: true }}
        >
          {content}
        </Drawer>
      </>
    );
  }

  // -------- Large screens --------
  if (isLgUp) {
    return (
      <Drawer
        variant="permanent"
        open
        sx={{
          width: DRAWER_WIDTH,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            ...glassStyles,
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  // -------- sm/md screens (collapsible) --------
  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          ...glassStyles,
          transition: "width .25s ease",
        },
      }}
    >
      {content}
    </Drawer>
  );
}
