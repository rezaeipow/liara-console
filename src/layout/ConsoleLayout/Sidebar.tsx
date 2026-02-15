import { useState } from "react";
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
import { Link } from "react-router-dom";

export default function Sidebar() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  const navItems = [
    { label: "Dashboard", path: "/console/dashboard" },
    { label: "Projects", path: "/console/projects" },
    { label: "Accounts", path: "/console/accounts" },
    { label: "Billing", path: "/console/billing" },
    { label: "Support", path: "/console/support" },
  ];

  // Drawer برای mobile
  if (isXs) {
    return (
      <>
        <IconButton onClick={toggleDrawer} className="m-2">
          <MenuIcon />
        </IconButton>
        <Drawer variant="temporary" open={open} onClose={toggleDrawer}>
          <List className="w-64">
            {navItems.map((item) => (
              <ListItem
                component={Link}
                to={item.path}
                key={item.label}
                onClick={toggleDrawer}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </>
    );
  }

  // Sidebar دسکتاپ
  return (
    <div className="w-64 p-4 bg-surface/80 backdrop-blur-md rounded-r-lg shadow-lg">
      <List>
        {navItems.map((item) => (
          <ListItem component={Link} to={item.path} key={item.label}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
