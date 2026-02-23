import { Box, CircularProgress, Fade, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logout, selectIsAuthenticated } from "@/app/store/slices/authSlice";
import { useQueryParams } from "@/shared/hooks/useQueryParams";

export default function AuthCompletePage() {
  const dispatch = useAppDispatch();
  const { getEnumParam, getParam, getBooleanParam } = useQueryParams();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const mode = getEnumParam("mode", ["signup", "login", "logout"] as const, "login");
  const next = getParam("next", "/console");
  const safeNext = useMemo(() => (next.startsWith("/") ? next : "/console"), [next]);
  const isLogoutMode = mode === "logout";
  const shouldPerformLogout = getBooleanParam("logout");

  const title =
    mode === "signup" ? "Account Created" : isLogoutMode ? "Signed Out" : "Welcome Back";
  const subtitle = isLogoutMode
    ? "Closing your session safely..."
    : mode === "signup"
      ? "Preparing your console workspace..."
      : "Signing you into your console...";

  useEffect(() => {
    if (!isLogoutMode || !shouldPerformLogout) return;
    void dispatch(logout());
  }, [dispatch, isLogoutMode, shouldPerformLogout]);

  useEffect(() => {
    if (!isAuthenticated && !isLogoutMode) {
      navigate("/login", { replace: true });
      return;
    }

    const timer = window.setTimeout(() => {
      navigate(safeNext, { replace: true });
    }, isLogoutMode ? 1500 : 1200);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, isLogoutMode, navigate, safeNext]);

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", px: 2 }}>
      <Fade in timeout={280}>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 460,
            p: { xs: 3, sm: 3.5 },
            borderRadius: 3,
            background: (theme) =>
              `linear-gradient(150deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack spacing={2.2} alignItems="center" textAlign="center">
            <CircularProgress size={42} thickness={4.6} />
            <Typography variant="h5" fontWeight={700}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
}
