import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import type { ConsoleResourceLayoutHeaderContentProps } from "./types";

export default function ConsoleResourceLayoutHeaderContent({
  icon,
  title,
  badgeLabel,
  backTo,
  backLabel = "Back",
  tabs,
  smTabColumns,
}: ConsoleResourceLayoutHeaderContentProps) {
  const theme = useTheme();
  return (
    <Stack spacing={1}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          {icon}
          <Box>
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="h5" fontWeight={800}>{title}</Typography>
              <Chip size="small" label={badgeLabel} variant="outlined" />
            </Stack>
          </Box>
        </Stack>
        {backTo ? <Button component={NavLink} to={backTo} variant="outlined" size="small" startIcon={<ArrowBackIcon />}>{backLabel}</Button> : null}
      </Stack>

      <Box sx={{ pt: 0.25, display: "grid", gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: `repeat(${smTabColumns ?? tabs.length}, max-content)` }, gap: 0.8, justifyContent: { sm: "flex-start" } }}>
        {tabs.map((tab) => (
          <Button key={tab.path} component={NavLink} to={tab.path} size="small" variant="outlined" sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { xs: 0, sm: 88 }, whiteSpace: "nowrap", "&.active": { borderColor: alpha(theme.palette.primary.main, 0.42), backgroundColor: alpha(theme.palette.primary.main, 0.12) } }}>
            {tab.label}
          </Button>
        ))}
      </Box>
    </Stack>
  );
}
