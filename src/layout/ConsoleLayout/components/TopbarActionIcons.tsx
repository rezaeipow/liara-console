import {
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { Avatar, Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import type { TopbarActionIconsProps } from "../types";

export default function TopbarActionIcons(props: TopbarActionIconsProps) {
  const {
    isXs,
    unreadNotificationsCount,
    userName,
    userAvatar,
    menuAnchorEl,
    isMenuOpen,
    onMenuOpen,
    onMenuClose,
    onLogout,
  } = props;

  return (
    <>
      <IconButton
        component={Link}
        to="/console/notifications"
        aria-label="Open notifications"
        size={isXs ? "medium" : "large"}
        sx={{ p: { xs: 0.75, sm: 1 } }}
      >
        <Badge
          color="error"
          variant={isXs ? (unreadNotificationsCount > 0 ? "dot" : "standard") : "standard"}
          badgeContent={isXs ? undefined : unreadNotificationsCount}
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <NotificationsIcon fontSize={isXs ? "small" : "medium"} />
        </Badge>
      </IconButton>

      <IconButton
        aria-label="Open user menu"
        onClick={onMenuOpen}
        size={isXs ? "medium" : "large"}
        sx={{ p: { xs: 0.75, sm: 1 } }}
      >
        <Avatar src={userAvatar} sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}>
          {userName?.trim()?.[0]?.toUpperCase() ?? <AccountCircleIcon />}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={onMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem component={Link} to="/console/profile" onClick={onMenuClose}>
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/console/settings" onClick={onMenuClose}>
          Settings
        </MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
