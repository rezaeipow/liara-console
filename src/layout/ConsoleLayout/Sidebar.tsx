import { Drawer, useMediaQuery, useTheme } from "@mui/material";
import { CreditCard as CreditCardIcon, Dashboard as DashboardIcon, Folder as FolderIcon, Notifications as NotificationsIcon, PeopleAlt as PeopleAltIcon, Settings as SettingsIcon, Support as SupportIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { closeMobileSidebar, selectMobileSidebarOpen, selectSidebarMode } from "@/app/store/slices/uiSlice";
import SidebarNavContent from "./SidebarNavContent";
import type { SidebarNavItem } from "./types";

const DRAWER_WIDTH = 260, COLLAPSED_WIDTH = 80;
const navItems: SidebarNavItem[] = [
  { label: "Dashboard", path: "/console", icon: <DashboardIcon />, end: true },
  { label: "Accounts", path: "/console/accounts", icon: <PeopleAltIcon /> },
  { label: "Projects", path: "/console/projects", icon: <FolderIcon />, matchPrefixes: ["/console/projects", "/console/apps", "/console/vms"] },
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
  const isXs = useMediaQuery(theme.breakpoints.down("sm")), isLgUp = useMediaQuery(theme.breakpoints.up("lg")), isSmMd = !isXs && !isLgUp, isCollapsed = isSmMd && sidebarMode === "collapsed";
  const drawerWidth = isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;
  const navContent = <SidebarNavContent drawerWidth={drawerWidth} isCollapsed={isCollapsed} isSmMd={isSmMd} isXs={isXs} navItems={navItems} />;

  if (isXs) {
    return <Drawer variant="temporary" open={mobileOpen} onClose={() => dispatch(closeMobileSidebar())} ModalProps={{ keepMounted: true }} sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box", borderRight: `1px solid ${theme.palette.divider}` } }}>{navContent}</Drawer>;
  }

  return <Drawer variant="permanent" open sx={{ width: isLgUp ? DRAWER_WIDTH : drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": { width: isLgUp ? DRAWER_WIDTH : drawerWidth, boxSizing: "border-box", borderRight: `1px solid ${theme.palette.divider}`, transition: "width .25s ease" } }}>{navContent}</Drawer>;
}
