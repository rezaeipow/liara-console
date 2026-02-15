import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleSidebar } from "@/store/uiSlice";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  // Mock user/account
  const user = useAppSelector((s) => s.auth.user) || {
    name: "Mohammad Rezaei",
    email: "user@email.com",
    avatar: "",
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    // dispatch(logout()) اگر واقعی هست
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backdropFilter: "blur(16px)",
        background:
          theme.palette.mode === "light"
            ? "rgba(255,255,255,0.7)"
            : "rgba(20,20,20,0.7)",
        borderBottom:
          theme.palette.mode === "light"
            ? "1px solid rgba(0,0,0,0.08)"
            : "1px solid rgba(255,255,255,0.08)",
        zIndex: (t) => t.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 64,
          px: 2,
        }}
      >
        {/* Left: Sidebar toggle + Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            aria-label="Toggle sidebar"
            onClick={() => dispatch(toggleSidebar())}
            edge="start"
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Liara Console
          </Typography>
        </Box>

        {/* Right: Credit, Notifications, User Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Credit */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: theme.palette.mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
              cursor: "pointer",
              "&:hover": {
                bgcolor: theme.palette.mode === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)",
              },
            }}
          >
            <CreditCardIcon fontSize="small" />
            <Typography variant="body2" fontWeight={500}>
              $120
            </Typography>
          </Box>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" aria-label="Notifications">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Account */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenuOpen}
              sx={{ p: 0 }}
              aria-controls={openMenu ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
            >
              <Avatar sx={{ width: 34, height: 34 }}>
                {user.avatar ? <img src={user.avatar} alt="Avatar" /> : user.name[0]}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: { mt: 1, borderRadius: 2, minWidth: 180, boxShadow: 3 },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography fontWeight={600}>{user.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>

            <Divider />

            <MenuItem
              onClick={() => {
                navigate("/console/accounts");
                handleMenuClose();
              }}
            >
              Accounts
            </MenuItem>

            <MenuItem
              onClick={() => {
                navigate("/console/settings");
                handleMenuClose();
              }}
            >
              Settings
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
