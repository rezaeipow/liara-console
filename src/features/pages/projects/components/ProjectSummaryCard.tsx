import { Paper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ProjectSummaryCardBody from "./ProjectSummaryCardBody";
import ProjectSummaryCardSkeleton from "./ProjectSummaryCardSkeleton";
import type { ProjectSummaryCardProps } from "./types";

export default function ProjectSummaryCard({
  project,
  theme,
  dateFormatter,
}: ProjectSummaryCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 1.75 },
        borderRadius: { xs: 1.25, sm: 1.75 },
        width: "100%",
        minHeight: 196,
        display: "flex",
        flexDirection: "column",
        borderColor: alpha(theme.palette.primary.main, 0.12),
        background: `linear-gradient(180deg, ${alpha(theme.palette.common.white, 0.72)}, ${alpha(theme.palette.common.white, 0.52)})`,
        transition:
          "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: alpha(theme.palette.primary.main, 0.32),
          boxShadow: `0 16px 30px ${alpha(theme.palette.text.primary, 0.14)}`,
        },
      }}
    >
      <ProjectSummaryCardBody
        project={project}
        theme={theme}
        dateFormatter={dateFormatter}
      />
    </Paper>
  );
}

export { ProjectSummaryCardSkeleton };
