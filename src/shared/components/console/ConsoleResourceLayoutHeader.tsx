import { Alert, Paper } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ConsoleResourceLayoutHeaderContent from "./ConsoleResourceLayoutHeaderContent";
import ConsoleResourceLayoutHeaderLoading from "./ConsoleResourceLayoutHeaderLoading";
import type { ConsoleResourceLayoutHeaderProps } from "./types";

export default function ConsoleResourceLayoutHeader(
  props: ConsoleResourceLayoutHeaderProps,
) {
  const theme = useTheme();
  const { isLoading, error } = props;
  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: { xs: 1.5, sm: 2 },
        border: `1px solid ${alpha(theme.palette.primary.main, 0.22)}`,
        background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
      }}
    >
      {isLoading ? (
        <ConsoleResourceLayoutHeaderLoading isLoading={isLoading} />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <ConsoleResourceLayoutHeaderContent
          icon={props.icon}
          title={props.title}
          badgeLabel={props.badgeLabel}
          backTo={props.backTo}
          backLabel={props.backLabel}
          tabs={props.tabs}
          smTabColumns={props.smTabColumns}
        />
      )}
    </Paper>
  );
}
