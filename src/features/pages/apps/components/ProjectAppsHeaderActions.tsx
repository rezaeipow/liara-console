import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import type { ProjectAppsHeaderActionsProps } from "@/shared/types/appsComponents";

export default function ProjectAppsHeaderActions({ projectId, isLoading, onRefresh, onOpenCreate }: ProjectAppsHeaderActionsProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
      {projectId ? (
        <Button component={Link} to={`/console/projects/${projectId}`} variant="outlined" startIcon={<ArrowBackIcon />}>
          Back to Project
        </Button>
      ) : null}
      <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh} disabled={isLoading}>
        Refresh
      </Button>
      <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={onOpenCreate}>
        Create App
      </Button>
    </Stack>
  );
}
