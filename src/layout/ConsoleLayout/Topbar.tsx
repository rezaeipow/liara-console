import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { toggleSidebarMode, selectTheme } from "../../app/store/slices/uiSlice";

export default function Topbar() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const themeMode = useAppSelector(selectTheme);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const glassStyles = {
    backdropFilter: "blur(12px)",
    backgroundColor:
      themeMode === "light" ? "rgba(255,255,255,0.8)" : "rgba(30,30,30,0.8)",
    boxShadow: theme.shadows[1],
  };

  return (
    <AppBar position="static" sx={glassStyles}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 64,
          px: 2,
        }}
      >
        {/* Left: Menu + Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            aria-label="Toggle sidebar"
            onClick={() => dispatch(toggleSidebarMode())}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            Console
          </Typography>
        </Box>

        {/* Right: Credit + Notifications + User */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor:
                themeMode === "light"
                  ? "rgba(0,0,0,0.05)"
                  : "rgba(255,255,255,0.08)",
              cursor: "pointer",
            }}
          >
            <CreditCardIcon fontSize="small" />
            <Typography
              variant="body2"
              fontWeight={500}
              color={theme.palette.text.primary}
            >
              $120
            </Typography>
          </Box>

          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon sx={{ color: theme.palette.text.primary }} />
            </Badge>
          </IconButton>

          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircleIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
