import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Snackbar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  CreditCard as CreditCardIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { Link, useFetcher, useLocation, useNavigate } from "react-router-dom";
import { NotificationsAPI } from "../../api/notificationsApi";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { selectUser } from "../../app/store/slices/authSlice";
import { selectAccounts, selectActiveAccountId } from "../../app/store/slices/accountSlice";
import {
  hideToast,
  openMobileSidebar,
  selectUnreadNotificationsCount,
  setUnreadNotificationsCount,
  selectSidebarMode,
  selectToast,
  toggleSidebarMode,
} from "../../app/store/slices/uiSlice";

export default function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const accountSwitchFetcher = useFetcher();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isSmMd = !isXs && !isLgUp;
  const sidebarMode = useAppSelector(selectSidebarMode);
  const toast = useAppSelector(selectToast);
  const unreadNotificationsCount = useAppSelector(selectUnreadNotificationsCount);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  const accounts = useAppSelector(selectAccounts);
  const activeAccountId = useAppSelector(selectActiveAccountId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate("/auth/complete?mode=logout&next=%2Flogin&logout=1");
  };

  const accountItems = useMemo(
    () =>
      accounts.length > 0
        ? accounts
        : [{ id: "default-account", name: "Default Account" }],
    [accounts],
  );

  const selectedAccountId = activeAccountId ?? accountItems[0].id;

  const handleAccountChange = (event: SelectChangeEvent) => {
    accountSwitchFetcher.submit(
      { intent: "switch", accountId: event.target.value },
      { method: "post", action: "/console/accounts" },
    );
  };

  const handleSidebarToggle = () => {
    if (isXs) {
      dispatch(openMobileSidebar());
      return;
    }
    if (!isLgUp) {
      dispatch(toggleSidebarMode());
    }
  };

  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await NotificationsAPI.list();
      const unread = response.items.filter((item) => !item.read).length;
      dispatch(setUnreadNotificationsCount(unread));
    } catch {
      // Keep previous count on transient failures.
    }
  }, [dispatch]);

  useEffect(() => {
    void refreshUnreadCount();
  }, [refreshUnreadCount, location.pathname]);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 62, sm: 68 },
            px: { xs: 1, sm: 2, md: 3 },
            pl:
              isSmMd && sidebarMode === "collapsed"
                ? { sm: 3, md: 3.5 }
                : { xs: 1, sm: 2, md: 3 },
            display: "flex",
            justifyContent: "space-between",
            gap: { xs: 0.75, sm: 1.5 },
            overflow: "visible",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1.5 }, minWidth: 0 }}>
            {!isLgUp && (
              <IconButton
                aria-label="Open sidebar navigation"
                onClick={handleSidebarToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            )}

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              whiteSpace: "nowrap",
            }}
          >
            {isXs ? "Console" : "Liara Console"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.25, sm: 1.5 }, minWidth: 0 }}>
          <FormControl size="small" sx={{ minWidth: { xs: 112, sm: 210 }, maxWidth: { xs: 124, sm: 260 } }}>
            <Select
              aria-label="Switch active account"
              value={selectedAccountId}
              onChange={handleAccountChange}
              disabled={accountSwitchFetcher.state !== "idle"}
              sx={{
                "& .MuiSelect-select": {
                  pr: { xs: 3.5, sm: 4 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: { xs: 0.75, sm: 1 },
                },
              }}
            >
              {accountItems.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!isXs && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.75,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: "rgba(255,255,255,0.52)",
              }}
            >
              <CreditCardIcon fontSize="small" />
              <Typography variant="body2" fontWeight={600}>
                750,000 IRR
              </Typography>
            </Box>
          )}

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
            onClick={handleMenuOpen}
            size={isXs ? "medium" : "large"}
            sx={{ p: { xs: 0.75, sm: 1 } }}
          >
            <Avatar
              src={user?.avatar}
              sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}
            >
              {user?.name?.trim()?.[0]?.toUpperCase() ?? <AccountCircleIcon />}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem component={Link} to="/console/profile" onClick={handleMenuClose}>
              Profile
            </MenuItem>
            <MenuItem component={Link} to="/console/settings" onClick={handleMenuClose}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => dispatch(hideToast())}
        anchorOrigin={
          isXs
            ? { vertical: "bottom", horizontal: "center" }
            : { vertical: "top", horizontal: "right" }
        }
        sx={isXs ? { pb: 1 } : { top: { sm: "84px !important" }, right: { sm: 24 } }}
      >
        <Alert
          onClose={() => dispatch(hideToast())}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
