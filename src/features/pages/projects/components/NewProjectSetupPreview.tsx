import PublicIcon from "@mui/icons-material/Public";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Chip, Divider, Stack, Typography } from "@mui/material";
import ConsoleSectionCard from "@/shared/components/console/ConsoleSectionCard";
import type { NewProjectSetupPreviewProps } from "./types";

export default function NewProjectSetupPreview({ defaultRegion, defaultPlan }: NewProjectSetupPreviewProps) {
  return (
    <ConsoleSectionCard padding={{ xs: 2, sm: 2.25 }}>
      <Stack spacing={1.3}>
        <Typography variant="subtitle1" fontWeight={800}>Setup Preview</Typography>
        <Typography variant="body2" color="text.secondary">Default options are preselected so you can create and start quickly.</Typography>
        <Divider sx={{ opacity: 0.45 }} />
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Chip icon={<PublicIcon sx={{ fontSize: 16 }} />} label={`Region: ${defaultRegion.toUpperCase()}`} size="small" />
          <Chip icon={<WorkspacePremiumIcon sx={{ fontSize: 16 }} />} label={`Plan: ${defaultPlan}`} size="small" sx={{ textTransform: "capitalize" }} />
          <Chip label="Apps enabled" size="small" variant="outlined" />
          <Chip label="VMs enabled" size="small" variant="outlined" />
          <Chip label="Billing linked" size="small" variant="outlined" />
        </Stack>
        <Divider sx={{ opacity: 0.45 }} />
        <Typography variant="subtitle2" fontWeight={700}>Next steps after creation</Typography>
        <Typography variant="body2" color="text.secondary">1. Create your first app or VM from the project overview.</Typography>
        <Typography variant="body2" color="text.secondary">2. Review billing snapshot and add credit if needed.</Typography>
        <Typography variant="caption" color="text.secondary">After creation, you can immediately add apps, VMs, and billing settings from the project overview page.</Typography>
      </Stack>
    </ConsoleSectionCard>
  );
}
