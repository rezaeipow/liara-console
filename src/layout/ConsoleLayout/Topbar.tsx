
import { AppBar, Toolbar, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function Topbar() {
  return (
    <AppBar
      position="static"
      className="bg-surface/80 backdrop-blur-md shadow-sm"
      elevation={2}
    >
      <Toolbar className="flex justify-between">
        <Typography variant="h6">Liara Console</Typography>
        <div className="flex items-center space-x-4">
          <NotificationsIcon />
          <AccountCircleIcon />
        </div>
      </Toolbar>
    </AppBar>
  );
}
