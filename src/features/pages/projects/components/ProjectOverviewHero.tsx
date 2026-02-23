import BoltIcon from "@mui/icons-material/Bolt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Button, Chip, Stack } from "@mui/material";
import ConsoleHeroCard from "@/shared/components/console/ConsoleHeroCard";
import type { ProjectOverviewHeroProps } from "../types";

export default function ProjectOverviewHero(props: ProjectOverviewHeroProps) {
  const {
    projectName,
    projectRegion,
    projectPlan,
    createdAt,
    isHealthy,
    onRenameClick,
    onDeleteClick,
  } = props;

  return (
    <ConsoleHeroCard
      title={projectName}
      actions={
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Chip
            size="small"
            icon={<BoltIcon sx={{ fontSize: 16 }} />}
            label={isHealthy ? "Healthy" : "Provisioning"}
            color={isHealthy ? "success" : "warning"}
            variant="outlined"
          />
          <Button size="small" variant="outlined" startIcon={<DriveFileRenameOutlineIcon fontSize="small" />} onClick={onRenameClick}>
            Rename
          </Button>
          <Button size="small" variant="outlined" color="error" startIcon={<DeleteOutlineIcon fontSize="small" />} onClick={onDeleteClick}>
            Delete
          </Button>
        </Stack>
      }
    >
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
        <Chip size="small" label={projectRegion.toUpperCase()} />
        <Chip size="small" label={projectPlan} sx={{ textTransform: "capitalize" }} />
        <Chip size="small" label={`Created ${createdAt}`} variant="outlined" />
      </Stack>
    </ConsoleHeroCard>
  );
}
