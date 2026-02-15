import { useState } from "react";
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
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import StorageIcon from "@mui/icons-material/Storage";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/uiSlice";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

const navItems = [
  { label: "Dashboard", path: "/console/dashboard", icon: <DashboardIcon /> },
  { label: "Projects", path: "/console/projects", icon: <FolderIcon /> },
  { label: "Services", path: "/console/services", icon: <StorageIcon /> },
  { label: "Billing", path: "/console/billing", icon: <CreditCardIcon /> },
  { label: "Settings", path: "/console/settings", icon: <SettingsIcon /> },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const sidebarMode = useAppSelector((s) => s.ui.sidebarMode);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const isCollapsed = sidebarMode === "collapsed" && !isXs && !isLgUp;

  const drawerWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const glassStyles = {
    backdropFilter: "blur(16px)",
    background:
      theme.palette.mode === "light"
        ? "rgba(255,255,255,0.6)"
        : "rgba(20,20,20,0.6)",
    borderRight:
      theme.palette.mode === "light"
        ? "1px solid rgba(0,0,0,0.06)"
        : "1px solid rgba(255,255,255,0.08)",
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        width: drawerWidth,
        transition: "width .25s ease",
        ...glassStyles,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: isCollapsed ? "center" : "space-between",
          px: 1.5,
        }}
      >
        {!isCollapsed && "Console"}

        {!isXs && !isLgUp && (
          <IconButton
            aria-label="Toggle sidebar"
            onClick={() => dispatch(toggleSidebar())}
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
              onClick={() => setMobileOpen(false)}
              sx={{
                justifyContent: isCollapsed ? "center" : "flex-start",
                px: isCollapsed ? 1 : 2,
                "&.active": {
                  background:
                    theme.palette.mode === "light"
                      ? "rgba(0,0,0,0.08)"
                      : "rgba(255,255,255,0.12)",
                },
                borderRadius: 2,
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* xs → temporary */}
      {isXs && (
        <>
          <IconButton
            aria-label="Open sidebar"
            onClick={() => setMobileOpen(true)}
            sx={{ position: "fixed", top: 16, left: 16, zIndex: 1400 }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
          >
            {drawerContent}
          </Drawer>
        </>
      )}

      {/* sm/md */}
      {!isXs && !isLgUp && (
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
          {drawerContent}
        </Drawer>
      )}

      {/* lg */}
      {isLgUp && (
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
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
