import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Sidebar() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  const navItems = ["Dashboard", "Projects", "Accounts", "Billing", "Support"];

  if (isXs) {
    return (
      <>
        <IconButton onClick={toggleDrawer} className="m-2">
          <MenuIcon />
        </IconButton>
        <Drawer variant="temporary" open={open} onClose={toggleDrawer}>
          <List className="w-64">
            {navItems.map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </>
    );
  }

  return (
    <div className="w-64 p-4 bg-surface/80 backdrop-blur-md rounded-r-lg shadow-lg">
      <List>
        {navItems.map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
