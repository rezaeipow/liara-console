import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import ConsoleHeroCard from "@/shared/components/console/ConsoleHeroCard";
import { createPrimaryHeroGradient, createPrimaryHeroSx } from "@/shared/ui/heroStyles";
import type { ProjectsHeroProps } from "../types";

export default function ProjectsHero(props: ProjectsHeroProps) {
  const { theme, searchInput, onSearchInputChange } = props;

  return (
    <ConsoleHeroCard
      title="Projects"
      description="Manage and explore your project workspaces."
      icon={<FolderOpenOutlinedIcon />}
      gradient={createPrimaryHeroGradient(theme)}
      sx={createPrimaryHeroSx(theme, { disableBackdrop: true })}
      actions={
        <TextField
          size="small"
          label="Search projects"
          placeholder="Search Projects"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          slotProps={{
            htmlInput: {
              "aria-label": "Search projects",
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ minWidth: { sm: 260 } }}
        />
      }
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <DashboardCustomizeOutlinedIcon />
        <Typography variant="body2" color="text.secondary">
          Project Directory
        </Typography>
      </Stack>
    </ConsoleHeroCard>
  );
}
