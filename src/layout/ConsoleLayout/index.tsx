import { Box } from "@mui/material";
import type { ReactNode } from "react";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function ConsoleLayout({ children }: { children?: ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Topbar />
      <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <MainContent>{children}</MainContent>
        </Box>
      </Box>
    </Box>
  );
}
