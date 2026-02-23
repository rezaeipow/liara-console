import AppsIcon from "@mui/icons-material/Apps";
import StorageIcon from "@mui/icons-material/Storage";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import ConsoleStatusChip from "@/shared/components/console/ConsoleStatusChip";
import ProjectServiceCountCard from "./ProjectServiceCountCard";
import type { ProjectSummaryCardProps } from "./types";

const planSummary: Record<string, string> = {
  starter: "Starter capacity",
  basic: "Balanced capacity",
  pro: "Production-ready capacity",
  business: "Business-grade capacity",
  enterprise: "Enterprise-scale capacity",
};

function getProjectSummary(plan: string, region: string) {
  const normalizedPlan = plan.trim().toLowerCase();
  const planText = planSummary[normalizedPlan] ?? "Configured capacity";
  return `${planText} in ${region.toUpperCase()}`;
}

function getHealthLabel(status: string) {
  return status === "healthy" ? "Healthy" : "Provisioning";
}

export default function ProjectSummaryCardBody({ project, theme, dateFormatter }: ProjectSummaryCardProps) {
  return (
    <Stack direction="column" spacing={1.1} alignItems="stretch" sx={{ width: "100%", flex: 1 }}>
      <Stack direction="row" justifyContent="space-between" spacing={1.25} alignItems="flex-start">
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography fontWeight={800} title={project.name} sx={{ lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.4 }}>Created {dateFormatter.format(new Date(project.createdAt))}</Typography>
        </Box>
        <Chip size="small" label={project.plan} sx={{ textTransform: "capitalize", alignSelf: "flex-start", backgroundColor: alpha(theme.palette.text.primary, 0.9), color: theme.palette.common.white, border: `1px solid ${alpha(theme.palette.text.primary, 0.95)}`, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", "& .MuiChip-label": { display: "inline-flex", alignItems: "center", justifyContent: "center", height: "100%", lineHeight: 1, fontWeight: 700, px: 1 } }} />
      </Stack>
      <Box sx={{ px: 1.2, py: 1, borderRadius: 1.4, border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`, backgroundColor: alpha(theme.palette.common.white, 0.52) }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Deployment profile</Typography>
        <Typography variant="body2" fontWeight={700} sx={{ mt: 0.35, lineHeight: 1.45 }}>{getProjectSummary(project.plan, project.region)}</Typography>
      </Box>
      <Stack direction="row" spacing={0.9}>
        <ProjectServiceCountCard icon={<AppsIcon sx={{ fontSize: 15 }} />} label="Apps" value={project.servicesSummary.apps} theme={theme} />
        <ProjectServiceCountCard icon={<StorageIcon sx={{ fontSize: 15 }} />} label="VMs" value={project.servicesSummary.vms} theme={theme} />
      </Stack>
      <ConsoleStatusChip label={getHealthLabel(project.healthStatus)} tone={project.healthStatus === "healthy" ? "success" : "warning"} variant="soft" capitalize={false} sx={{ alignSelf: "flex-start" }} />
      <Stack direction="row" spacing={0.75}>
        <Button component={Link} to={`/console/projects/${project.id}/apps`} size="small" variant="outlined" sx={{ flex: 1, minHeight: 34 }}>Apps</Button>
        <Button component={Link} to={`/console/projects/${project.id}/vms`} size="small" variant="outlined" sx={{ flex: 1, minHeight: 34 }}>VMs</Button>
      </Stack>
      <Button component={Link} to={`/console/projects/${project.id}`} size="small" variant="contained" sx={{ mt: 0, alignSelf: "stretch", minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center", px: 1.2, fontWeight: 700 }}>Open overview</Button>
    </Stack>
  );
}
