import { Box, Paper, Typography } from "@mui/material";
import type { PagePlaceholderProps } from "./types";

export function PagePlaceholder({ title, description, children }: PagePlaceholderProps) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      ) : null}
      <Box>{children}</Box>
    </Paper>
  );
}
