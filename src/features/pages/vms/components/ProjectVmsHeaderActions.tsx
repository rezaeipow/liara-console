import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import type { ProjectVmsHeaderActionsProps } from "../pageTypes";

export default function ProjectVmsHeaderActions(props: ProjectVmsHeaderActionsProps) {
  const { projectId, isLoading, onRefresh, onOpenCreate } = props;

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
        Add VM
      </Button>
    </Stack>
  );
}
