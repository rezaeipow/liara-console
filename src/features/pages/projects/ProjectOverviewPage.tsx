import AppsIcon from "@mui/icons-material/Apps";
import StorageIcon from "@mui/icons-material/Storage";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";
import type { ProjectOverviewLoaderData } from "./projectsData";

export default function ProjectOverviewPage() {
  const { project } = useLoaderData() as ProjectOverviewLoaderData;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography variant="h5" fontWeight={800}>
          {project.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {project.region} . {project.plan} . Created {new Date(project.createdAt).toLocaleDateString()}
        </Typography>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
          gap: 1.25,
        }}
      >
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AppsIcon fontSize="small" />
            <Typography fontWeight={700}>Apps</Typography>
          </Stack>
          <Typography variant="h6" sx={{ mt: 0.5 }}>
            {project.servicesSummary.apps}
          </Typography>
          <Typography
            component={Link}
            to={`/console/projects/${project.id}/apps`}
            variant="body2"
            sx={{ textDecoration: "none" }}
          >
            Open apps
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <StorageIcon fontSize="small" />
            <Typography fontWeight={700}>VMs</Typography>
          </Stack>
          <Typography variant="h6" sx={{ mt: 0.5 }}>
            {project.servicesSummary.vms}
          </Typography>
          <Typography
            component={Link}
            to={`/console/projects/${project.id}/vms`}
            variant="body2"
            sx={{ textDecoration: "none" }}
          >
            Open VMs
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ReceiptLongIcon fontSize="small" />
            <Typography fontWeight={700}>Credit Snapshot</Typography>
          </Stack>
          <Typography variant="h6" sx={{ mt: 0.5 }}>
            {project.billingSnapshot.credit.toLocaleString()} IRR
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current account credit
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TimelineIcon fontSize="small" />
            <Typography fontWeight={700}>Activity</Typography>
          </Stack>
          <Typography variant="h6" sx={{ mt: 0.5 }}>
            {project.activity.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Recent events
          </Typography>
        </Paper>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Recent Activity
        </Typography>
        {project.activity.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No activity yet.
          </Typography>
        ) : (
          <Stack spacing={0.75}>
            {project.activity.map((item) => (
              <Typography key={item.id} variant="body2">
                {item.title}
              </Typography>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
