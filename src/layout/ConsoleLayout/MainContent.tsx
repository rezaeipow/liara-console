import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function MainContent({ children }: { children?: React.ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        p: 2,
        overflow: "auto",
        "& > *:last-child": {
          mb: { xs: 1.25, sm: 1.5 },
        },
      }}
    >
      {children || <Outlet />}
    </Box>
  );
}
