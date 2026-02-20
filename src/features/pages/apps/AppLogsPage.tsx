import ArticleIcon from "@mui/icons-material/Article";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppsAPI } from "../../../api/appsApi";

type LogLevel = "all" | "info" | "warn" | "error";
type LogItem = {
  id: string;
  appId: string;
  level: string;
  message: string;
  fetchedAt: string;
};

const MAX_LOG_ITEMS = 120;
const STREAM_INTERVAL_MS = 3500;

export default function AppLogsPage() {
  const { appId } = useParams();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<LogLevel>("all");
  const [autoStream, setAutoStream] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [],
  );

  const getChipColor = (value: string) => {
    if (value === "error") return "error";
    if (value === "warn") return "warning";
    return "info";
  };

  const fetchLogs = useCallback(
    async (mode: "replace" | "append") => {
      if (!appId) {
        setError("App id is missing.");
        setIsLoading(false);
        return;
      }

      if (mode === "replace") {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const response = await AppsAPI.getLogs(appId, level === "all" ? undefined : level);
        const now = new Date().toISOString();
        const normalized = response.items.map((item) => ({ ...item, fetchedAt: now }));

        setLogs((prev) => {
          if (mode === "replace") {
            return normalized.slice(0, MAX_LOG_ITEMS);
          }
          const merged = [...normalized, ...prev];
          const seen = new Set<string>();
          return merged
            .filter((item) => {
              if (seen.has(item.id)) return false;
              seen.add(item.id);
              return true;
            })
            .slice(0, MAX_LOG_ITEMS);
        });

        setLastUpdatedAt(now);
        setError(null);
      } catch (requestError: unknown) {
        setError(requestError instanceof Error ? requestError.message : "Could not load logs.");
      } finally {
        if (mode === "replace") {
          setIsLoading(false);
        } else {
          setIsRefreshing(false);
        }
      }
    },
    [appId, level],
  );

  useEffect(() => {
    void fetchLogs("replace");
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoStream || !appId) return;
    const intervalId = window.setInterval(() => {
      void fetchLogs("append");
    }, STREAM_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [appId, autoStream, fetchLogs]);

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ArticleIcon />
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Logs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stream app logs and filter by severity level.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => void fetchLogs("replace")}
            disabled={isLoading || isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={() => setLogs([])}
          >
            Clear
          </Button>
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        <TextField
          select
          size="small"
          label="Level"
          value={level}
          onChange={(event) => setLevel(event.target.value as LogLevel)}
          sx={{ minWidth: { xs: "100%", md: 160 } }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="info">Info</MenuItem>
          <MenuItem value="warn">Warn</MenuItem>
          <MenuItem value="error">Error</MenuItem>
        </TextField>

        <Stack direction="row" spacing={1} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={autoStream}
                onChange={(event) => setAutoStream(event.target.checked)}
              />
            }
            label="Live stream"
          />
          <Chip
            size="small"
            label={
              lastUpdatedAt
                ? `Updated ${dateTimeFormatter.format(new Date(lastUpdatedAt))}`
                : "No updates yet"
            }
            variant="outlined"
          />
        </Stack>
      </Stack>

      {error ? (
        <Alert
          severity="error"
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => void fetchLogs("replace")}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      ) : null}

      <Paper
        sx={{
          p: { xs: 1.5, sm: 1.75 },
          borderRadius: 1.5,
          border: `1px solid ${alpha("#1f6feb", 0.15)}`,
          background: "linear-gradient(180deg, rgba(2,6,23,0.84), rgba(15,23,42,0.82))",
        }}
      >
        {isLoading ? (
          <Stack spacing={1}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Paper
                key={`logs-skeleton-${idx}`}
                variant="outlined"
                sx={{ p: 1, borderColor: alpha("#ffffff", 0.12) }}
              >
                <Stack spacing={0.75}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="35%" />
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : logs.length === 0 ? (
          <Alert severity="info">
            No logs available for the selected filter.
          </Alert>
        ) : (
          <Stack spacing={0.9}>
            {logs.map((item) => (
              <Box
                key={item.id}
                sx={{
                  px: 1,
                  py: 0.9,
                  borderRadius: 1.1,
                  border: `1px solid ${alpha("#94a3b8", 0.22)}`,
                  backgroundColor: alpha("#0f172a", 0.45),
                }}
              >
                <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.55 }}>
                  <Chip
                    size="small"
                    label={item.level}
                    color={getChipColor(item.level)}
                    sx={{ textTransform: "uppercase", fontWeight: 700, height: 22 }}
                  />
                  <Typography variant="caption" sx={{ color: alpha("#cbd5e1", 0.88) }}>
                    {dateTimeFormatter.format(new Date(item.fetchedAt))}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha("#e2e8f0", 0.96),
                    fontFamily: '"Cascadia Code", "Consolas", monospace',
                    wordBreak: "break-word",
                  }}
                >
                  {item.message}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
