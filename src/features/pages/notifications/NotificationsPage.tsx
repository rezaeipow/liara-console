import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { selectTableDensity, setUnreadNotificationsCount } from "../../../app/store/slices/uiSlice";
import { glassBackdrop } from "../../../shared/ui/glassTokens";
import { formatDateTime } from "../billing/billingFormat";
import type { NotificationsActionData, NotificationsLoaderData } from "./notificationsData";

type FilterMode = "all" | "unread" | "read";

function toFilterMode(raw: string | null): FilterMode {
  if (raw === "read") return "read";
  if (raw === "unread") return "unread";
  return "all";
}

export default function NotificationsPage() {
  const { items } = useLoaderData() as NotificationsLoaderData;
  const actionData = useActionData() as NotificationsActionData | undefined;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dismissedNoticeKey, setDismissedNoticeKey] = useState<string | null>(null);
  const tableDensity = useAppSelector(selectTableDensity);
  const filter = toFilterMode(searchParams.get("filter"));
  const search = searchParams.get("q") ?? "";
  const listSpacing = tableDensity === "comfortable" ? 1.8 : tableDensity === "compact" ? 0.18 : 1;
  const itemPaddingX = tableDensity === "comfortable" ? 2.2 : tableDensity === "compact" ? 0.5 : 1.3;
  const itemPaddingY = tableDensity === "comfortable" ? 2.2 : tableDensity === "compact" ? 0.35 : 1.3;
  const itemInnerSpacing =
    tableDensity === "comfortable" ? 1.4 : tableDensity === "compact" ? 0.12 : 0.8;

  const isRouteLoading =
    navigation.state === "loading" &&
    (navigation.location?.pathname ?? "").startsWith("/console/notifications");
  const isSubmitting = navigation.state === "submitting";

  const unreadCount = items.filter((item) => !item.read).length;
  const readCount = items.length - unreadCount;

  useEffect(() => {
    dispatch(setUnreadNotificationsCount(unreadCount));
  }, [dispatch, unreadCount]);

  const filteredItems = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return items.filter((item) => {
      if (filter === "read" && !item.read) return false;
      if (filter === "unread" && item.read) return false;
      if (!normalized) return true;
      return (
        item.title.toLowerCase().includes(normalized) ||
        item.body.toLowerCase().includes(normalized)
      );
    });
  }, [filter, items, search]);

  const updateParam = (key: string, value: string, defaultValue = "") => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const noticeMessage = actionData?.formError ?? actionData?.successMessage;
  const noticeKey = actionData?.successAt
    ? `success-${actionData.successAt}`
    : actionData?.formError
      ? `error-${actionData.formError}`
      : null;
  const snackbarOpen = Boolean(noticeKey) && noticeKey !== dismissedNoticeKey;

  return (
    <>
      <Stack
        spacing={2.2}
        aria-busy={isRouteLoading}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 980, lg: 1080 },
          mx: { xs: 0, sm: "auto" },
          mt: { xs: 1.25, sm: 1.5 },
          px: { xs: 1.25, sm: 1.5, md: 2, lg: 2 },
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: tableDensity === "compact" ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.32)}`,
            background: (theme) =>
              `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.14)})`,
            backdropFilter: glassBackdrop.hero,
          }}
        >
          {isRouteLoading ? <LinearProgress sx={{ mb: 1.1 }} /> : null}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <NotificationsActiveOutlinedIcon fontSize="small" />
                <Typography variant="h5" fontWeight={800}>
                  Notifications
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Review account activity, service alerts, and system updates.
              </Typography>
            </Stack>

            <Form method="post" replace>
              <input type="hidden" name="intent" value="mark-all-read" />
              <Button
                type="submit"
                variant="contained"
                startIcon={<DoneAllOutlinedIcon />}
                aria-label="Mark all notifications as read"
                disabled={isSubmitting || unreadCount === 0}
              >
                Mark all as read
              </Button>
            </Form>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 1,
          }}
        >
          <SummaryCard
            label="Total"
            value={String(items.length)}
            icon={<NotificationsActiveOutlinedIcon fontSize="small" />}
            tone="primary"
            density={tableDensity}
          />
          <SummaryCard
            label="Unread"
            value={String(unreadCount)}
            icon={<NotificationsNoneOutlinedIcon fontSize="small" />}
            tone="warning"
            density={tableDensity}
          />
          <SummaryCard
            label="Read"
            value={String(readCount)}
            icon={<DoneAllOutlinedIcon fontSize="small" />}
            tone="success"
            density={tableDensity}
          />
        </Box>

        <Paper
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: tableDensity === "compact" ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
            border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
            background: (theme) =>
              `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
            backdropFilter: glassBackdrop.card,
          }}
        >
          <Stack spacing={1.4}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                <Chip
                  label="All"
                  clickable
                  color={filter === "all" ? "primary" : "default"}
                  variant={filter === "all" ? "filled" : "outlined"}
                  onClick={() => updateParam("filter", "all", "all")}
                  aria-label="Show all notifications"
                    sx={{
                      color: filter === "all" ? "primary.dark" : "text.primary",
                      backgroundColor:
                        filter === "all"
                          ? (theme) => alpha(theme.palette.primary.main, 0.18)
                          : "transparent",
                      borderColor: (theme) => alpha(theme.palette.primary.main, 0.28),
                      fontWeight: 700,
                    }}
                  />
                <Chip
                  label="Unread"
                  clickable
                  color={filter === "unread" ? "warning" : "default"}
                  variant={filter === "unread" ? "filled" : "outlined"}
                  onClick={() => updateParam("filter", "unread", "all")}
                  aria-label="Filter unread notifications"
                    sx={{
                      color: filter === "unread" ? "warning.dark" : "text.primary",
                      backgroundColor:
                        filter === "unread"
                          ? (theme) => alpha(theme.palette.warning.main, 0.18)
                          : "transparent",
                      borderColor: (theme) => alpha(theme.palette.warning.main, 0.3),
                      fontWeight: 700,
                    }}
                  />
                <Chip
                  label="Read"
                  clickable
                  color={filter === "read" ? "success" : "default"}
                  variant={filter === "read" ? "filled" : "outlined"}
                  onClick={() => updateParam("filter", "read", "all")}
                  aria-label="Filter read notifications"
                    sx={{
                      color: filter === "read" ? "success.dark" : "text.primary",
                      backgroundColor:
                        filter === "read"
                          ? (theme) => alpha(theme.palette.success.main, 0.16)
                          : "transparent",
                      borderColor: (theme) => alpha(theme.palette.success.main, 0.3),
                      fontWeight: 700,
                    }}
                  />
              </Stack>
              <TextField
                size="small"
                value={search}
                onChange={(event) => updateParam("q", event.target.value)}
                placeholder="Search notifications"
                sx={{ minWidth: { xs: "100%", md: 260 } }}
                slotProps={{ htmlInput: { "aria-label": "Search notifications" } }}
              />
            </Stack>

            {filteredItems.length === 0 ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: tableDensity === "compact" ? 0.7 : 1.4,
                  borderColor: (theme) => alpha(theme.palette.text.primary, 0.12),
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.62),
                }}
              >
                <Typography fontWeight={800}>No notifications found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Try changing the search text or the selected filter.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={listSpacing} role="list" aria-label="Notifications list">
                {filteredItems.map((item) => (
                  <Paper
                    key={item.id}
                    role="listitem"
                    variant="outlined"
                    sx={{
                      px: itemPaddingX,
                      py: itemPaddingY,
                      borderRadius: tableDensity === "compact" ? 0.7 : 1.4,
                      borderColor: (theme) =>
                        alpha(theme.palette.text.primary, item.read ? 0.12 : 0.2),
                      backgroundColor: (theme) =>
                        item.read
                          ? alpha(theme.palette.common.white, 0.6)
                          : alpha(theme.palette.primary.light, 0.24),
                    }}
                  >
                    <Stack spacing={itemInnerSpacing}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Typography
                          fontWeight={800}
                          sx={tableDensity === "compact" ? { fontSize: "0.82rem", lineHeight: 1.2 } : undefined}
                        >
                          {item.title}
                        </Typography>
                        <Chip
                          size="small"
                          color={item.read ? "success" : "warning"}
                          variant="outlined"
                          label={item.read ? "Read" : "Unread"}
                        />
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={tableDensity === "compact" ? { fontSize: "0.73rem", lineHeight: 1.25 } : undefined}
                      >
                        {item.body}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={tableDensity === "compact" ? { fontSize: "0.64rem", lineHeight: 1.15 } : undefined}
                        >
                          {formatDateTime(item.createdAt)}
                        </Typography>

                        <Form method="post" replace>
                          <input type="hidden" name="intent" value="mark-read" />
                          <input type="hidden" name="notificationId" value={item.id} />
                          <Button
                            type="submit"
                            size="small"
                            variant="text"
                            disabled={item.read || isSubmitting}
                            aria-label={`Mark notification ${item.id} as read`}
                          >
                            Mark as read
                          </Button>
                        </Form>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setDismissedNoticeKey(noticeKey)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={actionData?.formError ? "error" : "success"}
          variant="filled"
          onClose={() => setDismissedNoticeKey(noticeKey)}
          aria-live="assertive"
        >
          <Stack spacing={0.2}>
            <Typography variant="body2">{noticeMessage}</Typography>
            {actionData?.errorStatus ? (
              <Typography variant="caption">Error code: {actionData.errorStatus}</Typography>
            ) : null}
            {actionData?.errorHint ? <Typography variant="caption">{actionData.errorHint}</Typography> : null}
          </Stack>
        </Alert>
      </Snackbar>
    </>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  tone: "primary" | "warning" | "success";
  density: "compact" | "standard" | "comfortable";
};

function SummaryCard({ label, value, icon, tone, density }: SummaryCardProps) {
  const paddingX = density === "comfortable" ? 2.1 : density === "compact" ? 0.35 : 1.3;
  const paddingY = density === "comfortable" ? 2.1 : density === "compact" ? 0.35 : 1.3;
  const spacing = density === "comfortable" ? 1.2 : density === "compact" ? 0.12 : 0.6;

  return (
    <Paper
      variant="outlined"
      sx={{
        px: paddingX,
        py: paddingY,
        borderRadius: density === "compact" ? 0.7 : 1.4,
        borderColor: (theme) => {
          const base =
            tone === "warning"
              ? theme.palette.warning.main
              : tone === "success"
                ? theme.palette.success.main
                : theme.palette.primary.main;
          return alpha(base, 0.25);
        },
        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.82),
      }}
    >
      <Stack spacing={spacing}>
        <Stack direction="row" alignItems="center" spacing={0.7}>
          {icon}
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Stack>
        <Typography variant="h6" fontWeight={800}>
          {value}
        </Typography>
      </Stack>
    </Paper>
  );
}

