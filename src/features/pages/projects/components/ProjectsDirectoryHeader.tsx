import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import type { ProjectsDirectoryHeaderProps } from "../types";

export default function ProjectsDirectoryHeader(props: ProjectsDirectoryHeaderProps) {
  const { title, createProjectLabel } = props;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      spacing={0.75}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <DashboardCustomizeOutlinedIcon />
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
      </Stack>
      <Button
        component={Link}
        to="/console/projects/new"
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        {createProjectLabel}
      </Button>
    </Stack>
  );
}
