import { Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import FilterChipGroup from "@/shared/components/common/FilterChipGroup";
import type { NotificationsFiltersPanelProps } from "@/shared/types/notificationsComponents";
import { glassBackdrop } from "@/shared/ui/glassTokens";
import { getStatusChipSx } from "@/shared/ui/statusChipSx";

export default function NotificationsFiltersPanel(props: NotificationsFiltersPanelProps) {
  const { tableDensity, itemsCount, unreadCount, readCount, filter, search, setQueryParam } = props;
  const theme = useTheme();

  const filterOptions = [
    {
      key: "all",
      label: `All (${itemsCount})`,
      selected: filter === "all",
      color: "primary" as const,
      onClick: () => setQueryParam("filter", "all", "all"),
      selectedSx: getStatusChipSx(theme, "neutral", "solid"),
    },
    {
      key: "unread",
      label: `Unread (${unreadCount})`,
      selected: filter === "unread",
      color: "warning" as const,
      onClick: () => setQueryParam("filter", "unread", "all"),
      selectedSx: getStatusChipSx(theme, "warning", "solid"),
    },
    {
      key: "read",
      label: `Read (${readCount})`,
      selected: filter === "read",
      color: "success" as const,
      onClick: () => setQueryParam("filter", "read", "all"),
      selectedSx: getStatusChipSx(theme, "success", "solid"),
    },
  ];

  return (
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
          label="Search"
          value={search}
          placeholder="Search notifications"
          onChange={(event) => setQueryParam("q", event.target.value)}
          sx={{ width: "100%" }}
          slotProps={{ htmlInput: { "aria-label": "Search notifications" } }}
        />

        <FilterChipGroup spacing={0.75} options={filterOptions} />

        <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
          <Chip label={`Total: ${itemsCount}`} size="small" variant="outlined" />
          <Chip label={`Unread: ${unreadCount}`} size="small" color="warning" variant="outlined" />
        </Stack>
      </Stack>
    </Paper>
  );
}
