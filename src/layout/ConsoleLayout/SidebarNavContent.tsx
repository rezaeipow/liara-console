

import { Box, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ChevronLeft as ChevronLeftIcon } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { closeMobileSidebar, toggleSidebarMode } from "@/app/store/slices/uiSlice";
import type { SidebarNavContentProps } from "./types";

export default function SidebarNavContent({ drawerWidth, isCollapsed, isSmMd, isXs, navItems }: SidebarNavContentProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const theme = useTheme();
  return (
    <Box sx={{ width: drawerWidth, height: "100%" }}>
      <Toolbar sx={{ minHeight: 68, px: isCollapsed ? 1 : 2, display: "flex", justifyContent: isCollapsed ? "center" : "space-between" }}>
        {!isCollapsed && <Typography variant="subtitle1" fontWeight={700}>Navigation</Typography>}
        {isSmMd && <IconButton aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => dispatch(toggleSidebarMode())}><ChevronLeftIcon sx={{ transform: isCollapsed ? "rotate(180deg)" : "none", transition: "transform .2s ease" }} /></IconButton>}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 1.5 }}>
        {navItems.map((item) => {
          const isSelected = item.end ? location.pathname === item.path : item.matchPrefixes ? item.matchPrefixes.some((prefix) => location.pathname.startsWith(prefix)) : location.pathname.startsWith(item.path);
          return (
            <Tooltip key={item.path} title={isCollapsed ? item.label : ""} placement="right">
              <ListItemButton component={NavLink} to={item.path} end={item.end} onClick={() => { if (isXs) dispatch(closeMobileSidebar()); }} sx={{ minHeight: 46, mb: 0.5, borderRadius: 2, justifyContent: isCollapsed ? "center" : "flex-start", px: isCollapsed ? 1 : 1.25, ...(isSelected ? { backgroundColor: alpha(theme.palette.primary.main, 0.14), border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` } : {}) }}>
                <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 1.25, justifyContent: "center", color: "inherit" }}>{item.icon}</ListItemIcon>
                {!isCollapsed ? <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, variant: "body2" }} /> : null}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
}
