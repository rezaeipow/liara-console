import { Menu as MenuIcon } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import type { TopbarBrandProps } from "../types";

export default function TopbarBrand(props: TopbarBrandProps) {
  const { isXs, isLgUp, onSidebarToggle } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1.5 }, minWidth: 0 }}>
      {!isLgUp ? (
        <IconButton aria-label="Open sidebar navigation" onClick={onSidebarToggle} size="large">
          <MenuIcon />
        </IconButton>
      ) : null}

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1rem", sm: "1.25rem" },
          whiteSpace: "nowrap",
        }}
      >
        {isXs ? "Console" : "Liara Console"}
      </Typography>
    </Box>
  );
}
