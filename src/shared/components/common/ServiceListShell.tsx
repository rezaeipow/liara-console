import { Alert, Box, Button, Paper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ConsoleHeroCard from "@/shared/components/console/ConsoleHeroCard";
import ConsolePageShell from "@/shared/components/console/ConsolePageShell";
import FilterToolbar from "./FilterToolbar";
import type { ServiceListShellProps } from "./types";

export default function ServiceListShell({
  title,
  description,
  icon,
  gradient,
  actions,
  summary,
  filterStart,
  filterEnd,
  errorMessage,
  onRetry,
  retryLabel = "Retry",
  children,
  spacing = 2.2,
  maxWidth = { xs: "100%", sm: 1080, xl: 1220 },
}: ServiceListShellProps) {
  return (
    <ConsolePageShell spacing={spacing} maxWidth={maxWidth}>
      <ConsoleHeroCard
        title={title}
        description={description}
        icon={icon}
        gradient={gradient}
        actions={actions}
      >
        {summary}
      </ConsoleHeroCard>

      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: { xs: 1.5, sm: 2 },
          border: (theme) => `1px solid ${alpha(theme.palette.text.secondary, 0.24)}`,
          background: (theme) =>
            `linear-gradient(180deg, ${alpha(theme.palette.text.secondary, 0.08)}, ${alpha(theme.palette.common.white, 0.64)})`,
        }}
      >
        <FilterToolbar start={filterStart} end={filterEnd} />
      </Paper>

      {errorMessage ? (
        <Alert
          severity="error"
          action={
            onRetry ? (
              <Button color="inherit" size="small" onClick={onRetry}>
                {retryLabel}
              </Button>
            ) : null
          }
        >
          {errorMessage}
        </Alert>
      ) : null}

      <Box>{children}</Box>
    </ConsolePageShell>
  );
}
