import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { NotificationItem } from "../../../api/types";
import { formatDateTime } from "../billing/billingFormat";

const demoItems: NotificationItem[] = [
  {
    id: "n-1",
    title: "New deployment completed",
    body: "frontend app deployed successfully in de-fra.",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "n-2",
    title: "Invoice issued",
    body: "Invoice inv-1204 is now available for download.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "n-3",
    title: "Credit running low",
    body: "Your account credit is below the recommended threshold.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "n-4",
    title: "Support ticket replied",
    body: "Support team responded to ticket t-1289.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
];

type FilterMode = "all" | "unread" | "read";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");

  const unreadCount = demoItems.filter((item) => !item.read).length;
  const readCount = demoItems.length - unreadCount;

  const filteredItems = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return demoItems.filter((item) => {
      if (filter === "read" && !item.read) return false;
      if (filter === "unread" && item.read) return false;
      if (!normalized) return true;
      return (
        item.title.toLowerCase().includes(normalized) ||
        item.body.toLowerCase().includes(normalized)
      );
    });
  }, [filter, search]);

  return (
    <Stack
      spacing={2.2}
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
          borderRadius: { xs: 1.5, sm: 2 },
          border: "1px solid rgba(31,111,235,0.32)",
          background:
            "linear-gradient(120deg, rgba(31,111,235,0.20), rgba(14,165,164,0.14))",
          backdropFilter: "blur(14px)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Stack spacing={0.5}>
            <Typography variant="h5" fontWeight={800}>
              Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review account activity, service alerts, and system updates.
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<DoneAllOutlinedIcon />}
            aria-label="Mark all notifications as read"
          >
            Mark all as read
          </Button>
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
          value={String(demoItems.length)}
          icon={<NotificationsActiveOutlinedIcon fontSize="small" />}
          color="#2563eb"
        />
        <SummaryCard
          label="Unread"
          value={String(unreadCount)}
          icon={<NotificationsNoneOutlinedIcon fontSize="small" />}
          color="#f59e0b"
        />
        <SummaryCard
          label="Read"
          value={String(readCount)}
          icon={<DoneAllOutlinedIcon fontSize="small" />}
          color="#16a34a"
        />
      </Box>

      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: { xs: 1.5, sm: 2 },
          border: `1px solid ${alpha("#1f6feb", 0.24)}`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.76))",
          backdropFilter: "blur(10px)",
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
                onClick={() => setFilter("all")}
              />
              <Chip
                label="Unread"
                clickable
                color={filter === "unread" ? "warning" : "default"}
                variant={filter === "unread" ? "filled" : "outlined"}
                onClick={() => setFilter("unread")}
              />
              <Chip
                label="Read"
                clickable
                color={filter === "read" ? "success" : "default"}
                variant={filter === "read" ? "filled" : "outlined"}
                onClick={() => setFilter("read")}
              />
            </Stack>
            <TextField
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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
                borderRadius: 1.4,
                borderColor: alpha("#0f172a", 0.12),
                backgroundColor: alpha("#ffffff", 0.62),
              }}
            >
              <Typography fontWeight={800}>No notifications found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Try changing the search text or the selected filter.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1} role="list" aria-label="Notifications list">
              {filteredItems.map((item) => (
                <Paper
                  key={item.id}
                  role="listitem"
                  variant="outlined"
                  sx={{
                    p: 1.3,
                    borderRadius: 1.4,
                    borderColor: alpha("#0f172a", item.read ? 0.12 : 0.2),
                    backgroundColor: item.read ? alpha("#ffffff", 0.6) : alpha("#eff6ff", 0.78),
                  }}
                >
                  <Stack spacing={0.8}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Typography fontWeight={800}>{item.title}</Typography>
                      <Chip
                        size="small"
                        color={item.read ? "success" : "warning"}
                        variant="outlined"
                        label={item.read ? "Read" : "Unread"}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {item.body}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(item.createdAt)}
                      </Typography>
                      <Button size="small" variant="text">
                        Mark as read
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  color: string;
};

function SummaryCard({ label, value, icon, color }: SummaryCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.3,
        borderRadius: 1.4,
        borderColor: alpha(color, 0.25),
        backgroundColor: alpha("#ffffff", 0.82),
      }}
    >
      <Stack spacing={0.6}>
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
