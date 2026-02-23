import { Chip, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ProjectAppsSummaryProps } from "@/shared/types/appsComponents";

export default function ProjectAppsSummary({ theme, summary }: ProjectAppsSummaryProps) {
  return (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
      <Chip size="small" label={`Total: ${summary.total}`} variant="outlined" />
      <Chip size="small" label={`Running: ${summary.running}`} variant="outlined" />
      <Chip size="small" label={`Deploying: ${summary.deploying}`} variant="outlined" />
      <Chip size="small" label={`Failed: ${summary.failed}`} variant="outlined" />
      <Chip
        size="small"
        label={`Needs attention: ${summary.attention}`}
        color={summary.attention > 0 ? "warning" : "default"}
        variant="outlined"
        sx={
          summary.attention > 0
            ? {
                backgroundColor: alpha(theme.palette.warning.main, 0.18),
                borderColor: alpha(theme.palette.warning.main, 0.5),
                color: theme.palette.warning.dark,
                "& .MuiChip-label": { color: theme.palette.warning.dark, fontWeight: 700 },
              }
            : undefined
        }
      />
    </Stack>
  );
}
