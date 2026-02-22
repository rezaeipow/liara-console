import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
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
  const unreadFiltered = filteredItems.filter((item) => !item.read);
  const readFiltered = filteredItems.filter((item) => item.read);

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
            gridTemplateColumns: { xs: "1fr", lg: "280px minmax(0, 1fr)" },
            gap: 1.25,
          }}
        >
          <Paper
            sx={{
              p: { xs: 1.3, sm: 1.6 },
              borderRadius: tableDensity === "compact" ? { xs: 0.7, sm: 1 } : { xs: 1.4, sm: 1.8 },
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
              background: (theme) =>
                `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
              backdropFilter: glassBackdrop.card,
              alignSelf: "start",
            }}
          >
            <Stack spacing={1.2}>
              <Typography fontWeight={800}>Inbox Filters</Typography>
              <TextField
                size="small"
                value={search}
                onChange={(event) => updateParam("q", event.target.value)}
                placeholder="Search notifications"
                slotProps={{ htmlInput: { "aria-label": "Search notifications" } }}
              />
              <List disablePadding>
                {[
                  { key: "all", label: "All", count: items.length },
                  { key: "unread", label: "Unread", count: unreadCount },
                  { key: "read", label: "Read", count: readCount },
                ].map((entry) => (
                  <ListItem key={entry.key} disablePadding sx={{ mb: 0.35 }}>
                    <ListItemButton
                      selected={filter === entry.key}
                      onClick={() => updateParam("filter", entry.key, "all")}
                      sx={{
                        borderRadius: 1,
                        border: (theme) => `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
                        "&.Mui-selected": {
                          borderColor: (theme) => alpha(theme.palette.primary.main, 0.36),
                          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                        },
                      }}
                    >
                      <ListItemText primary={entry.label} />
                      <Chip size="small" label={entry.count} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                <Chip label={`Total: ${items.length}`} size="small" variant="outlined" />
                <Chip label={`Unread: ${unreadCount}`} size="small" color="warning" variant="outlined" />
              </Stack>
            </Stack>
          </Paper>

          <Paper
            sx={{
              p: { xs: 1.4, sm: 1.8 },
              borderRadius: tableDensity === "compact" ? { xs: 0.7, sm: 1 } : { xs: 1.4, sm: 1.8 },
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
              background: (theme) =>
                `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.88)}, ${alpha(theme.palette.common.white, 0.76)})`,
              backdropFilter: glassBackdrop.card,
            }}
          >
            <Stack spacing={1.1}>
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
                    Try changing search text or filter.
                  </Typography>
                </Paper>
              ) : (
                <>
                  {filter !== "read" && unreadFiltered.length > 0 ? (
                    <NotificationSection
                      title="Unread"
                      items={unreadFiltered}
                      listSpacing={listSpacing}
                      itemPaddingX={itemPaddingX}
                      itemPaddingY={itemPaddingY}
                      itemInnerSpacing={itemInnerSpacing}
                      tableDensity={tableDensity}
                      isSubmitting={isSubmitting}
                    />
                  ) : null}
                  {filter !== "unread" && readFiltered.length > 0 ? (
                    <NotificationSection
                      title="Read"
                      items={readFiltered}
                      listSpacing={listSpacing}
                      itemPaddingX={itemPaddingX}
                      itemPaddingY={itemPaddingY}
                      itemInnerSpacing={itemInnerSpacing}
                      tableDensity={tableDensity}
                      isSubmitting={isSubmitting}
                    />
                  ) : null}
                </>
              )}
            </Stack>
          </Paper>
        </Box>
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

type NotificationSectionProps = {
  title: string;
  items: NotificationsLoaderData["items"];
  listSpacing: number;
  itemPaddingX: number;
  itemPaddingY: number;
  itemInnerSpacing: number;
  tableDensity: "compact" | "standard" | "comfortable";
  isSubmitting: boolean;
};

function NotificationSection({
  title,
  items,
  listSpacing,
  itemPaddingX,
  itemPaddingY,
  itemInnerSpacing,
  tableDensity,
  isSubmitting,
}: NotificationSectionProps) {
  return (
    <Stack spacing={0.9}>
      <Stack direction="row" alignItems="center" spacing={0.8}>
        <Typography fontWeight={800}>{title}</Typography>
        <Chip size="small" label={items.length} />
      </Stack>
      <Stack spacing={listSpacing} role="list" aria-label={`${title} notifications`}>
        {items.map((item) => (
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
                item.read ? alpha(theme.palette.common.white, 0.6) : alpha(theme.palette.primary.light, 0.24),
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
    </Stack>
  );
}

