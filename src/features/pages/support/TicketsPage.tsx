import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { Link, useLoaderData, useNavigation, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../app/store/hooks";
import { selectTableDensity } from "../../../app/store/slices/uiSlice";
import type { Ticket } from "../../../api/types";
import type { TicketsLoaderData } from "./supportData";
import { formatDateTime } from "../billing/billingFormat";

function statusTone(status: Ticket["status"]): "warning" | "info" | "success" {
  if (status === "open") return "warning";
  if (status === "pending") return "info";
  return "success";
}

export default function TicketsPage() {
  const { items } = useLoaderData() as TicketsLoaderData;
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tableDensity = useAppSelector(selectTableDensity);
  const listSpacing = tableDensity === "comfortable" ? 1.8 : tableDensity === "compact" ? 0.18 : 1;
  const itemPaddingX = tableDensity === "comfortable" ? 2.2 : tableDensity === "compact" ? 0.5 : 1.2;
  const itemPaddingY = tableDensity === "comfortable" ? 2.2 : tableDensity === "compact" ? 0.35 : 1.2;
  const itemInnerSpacing =
    tableDensity === "comfortable" ? 1.4 : tableDensity === "compact" ? 0.12 : 0.8;
  const isRouteLoading =
    navigation.state === "loading" &&
    (navigation.location?.pathname ?? "").startsWith("/console/support/tickets");

  const status = searchParams.get("status") ?? "all";
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";
  const unresolved = searchParams.get("unresolved") === "1";
  const query = searchParams.get("q") ?? "";
  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))).sort(),
    [items],
  );

  const summary = useMemo(() => {
    const open = items.filter((item) => item.status === "open").length;
    const pending = items.filter((item) => item.status === "pending").length;
    const closed = items.filter((item) => item.status === "closed").length;
    return { open, pending, closed };
  }, [items]);

  const updateParam = (key: string, value: string, defaultValue = "") => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  return (
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
          <Stack spacing={0.55}>
            <Typography variant="h5" fontWeight={800}>
              Support Tickets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track issue reports and follow up with support replies.
            </Typography>
          </Stack>
          <Button
            component={Link}
            to="/console/support/tickets/new"
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            aria-label="Create a new support ticket"
          >
            New ticket
          </Button>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1,
        }}
      >
        <SummaryCard label="Total" value={String(items.length)} density={tableDensity} />
        <SummaryCard label="Open" value={String(summary.open)} color="#f59e0b" density={tableDensity} />
        <SummaryCard label="Pending" value={String(summary.pending)} color="#0ea5e9" density={tableDensity} />
        <SummaryCard label="Closed" value={String(summary.closed)} color="#16a34a" density={tableDensity} />
      </Box>

      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: tableDensity === "compact" ? { xs: 0.75, sm: 1 } : { xs: 1.5, sm: 2 },
          border: `1px solid ${alpha("#1f6feb", 0.24)}`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.76))",
          backdropFilter: "blur(10px)",
        }}
      >
        {isRouteLoading ? <LinearProgress sx={{ mb: 1.2 }} /> : null}
        <Stack spacing={1.3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Chip
                label="Unresolved only"
                clickable
                color={unresolved ? "warning" : "default"}
                variant={unresolved ? "filled" : "outlined"}
                onClick={() => updateParam("unresolved", unresolved ? "0" : "1")}
                aria-label="Toggle unresolved tickets only"
              />
              <TextField
                size="small"
                value={query}
                onChange={(event) => updateParam("q", event.target.value)}
                placeholder="Search by subject, category, body"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                  htmlInput: { "aria-label": "Search tickets" },
                }}
                sx={{ minWidth: { xs: "100%", sm: 280 } }}
              />
              <TextField
                select
                size="small"
                label="Category"
                value={category}
                onChange={(event) => updateParam("category", event.target.value, "all")}
                sx={{ minWidth: { xs: "100%", sm: 160 } }}
                slotProps={{ htmlInput: { "aria-label": "Ticket category filter" } }}
              >
                <MenuItem value="all">All</MenuItem>
                {categories.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                size="small"
                label="Status"
                value={status}
                onChange={(event) => updateParam("status", event.target.value, "all")}
                sx={{ minWidth: { xs: "100%", sm: 150 } }}
                slotProps={{ htmlInput: { "aria-label": "Ticket status filter" } }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                label="Sort"
                value={sort}
                onChange={(event) => updateParam("sort", event.target.value, "newest")}
                sx={{ minWidth: { xs: "100%", sm: 150 } }}
                slotProps={{ htmlInput: { "aria-label": "Ticket sort order" } }}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="oldest">Oldest</MenuItem>
              </TextField>
            </Stack>
          </Stack>

          {isRouteLoading ? (
            <Stack spacing={1}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`ticket-loading-${index}`} variant="rounded" height={80} />
              ))}
            </Stack>
          ) : items.length === 0 ? (
            <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: tableDensity === "compact" ? 0.8 : 1.6,
                  borderColor: alpha("#0f172a", 0.12),
                  backgroundColor: alpha("#ffffff", 0.65),
                }}
            >
              <Stack spacing={1.2} alignItems="flex-start">
                <Typography fontWeight={800}>No tickets found</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try clearing filters or create a new ticket for your current issue.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
                  >
                    Clear filters
                  </Button>
                  <Button
                    component={Link}
                    to={`/console/support/tickets/new${category !== "all" ? `?category=${category}` : ""}`}
                    variant="contained"
                    size="small"
                    startIcon={<AddCircleOutlineIcon fontSize="small" />}
                  >
                    Create ticket
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ) : (
            <Stack spacing={listSpacing} role="list" aria-label="Support tickets list">
              {items.map((ticket) => (
                <Paper
                  key={ticket.id}
                  role="listitem"
                  variant="outlined"
                  sx={{
                    px: itemPaddingX,
                    py: itemPaddingY,
                    borderRadius: tableDensity === "compact" ? 0.7 : 1.4,
                    borderColor: alpha("#0f172a", 0.12),
                    backgroundColor: alpha("#ffffff", 0.62),
                  }}
                >
                  <Stack spacing={itemInnerSpacing}>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Stack spacing={0.2}>
                        <Typography
                          fontWeight={800}
                          sx={tableDensity === "compact" ? { fontSize: "0.82rem", lineHeight: 1.2 } : undefined}
                        >
                          {ticket.subject}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={tableDensity === "compact" ? { fontSize: "0.64rem", lineHeight: 1.15 } : undefined}
                        >
                          {ticket.category.toUpperCase()} | {formatDateTime(ticket.createdAt)}
                        </Typography>
                      </Stack>
                      <Chip
                        size="small"
                        color={statusTone(ticket.status)}
                        variant="outlined"
                        label={ticket.status}
                      />
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={
                        tableDensity === "compact"
                          ? { lineHeight: 1.25, fontSize: "0.73rem" }
                          : { lineHeight: 1.45 }
                      }
                    >
                      {ticket.body}
                    </Typography>

                    <Button
                      component={Link}
                      to={`/console/support/tickets/${ticket.id}`}
                      size="small"
                      endIcon={<ArrowOutwardIcon fontSize="small" />}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      Open ticket
                    </Button>
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
  color?: string;
  density: "compact" | "standard" | "comfortable";
};

function SummaryCard({ label, value, color = "#475569", density }: SummaryCardProps) {
  const paddingX = density === "comfortable" ? 1.4 : density === "compact" ? 0.3 : 1.2;
  const paddingY = density === "comfortable" ? 1.9 : density === "compact" ? 0.3 : 1;

  return (
    <Paper
      variant="outlined"
      role="status"
      aria-live="polite"
      aria-label={`${label}: ${value}`}
      sx={{
        px: paddingX,
        py: paddingY,
        borderRadius: density === "compact" ? 0.65 : 1.3,
        borderColor: alpha(color, 0.25),
        backgroundColor: alpha("#ffffff", 0.82),
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={800} sx={{ mt: 0.3 }}>
        {value}
      </Typography>
    </Paper>
  );
}
