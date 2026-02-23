import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import type { ProjectVmsActionsMenuProps } from "../pageTypes";

export default function ProjectVmsActionsMenu(props: ProjectVmsActionsMenuProps) {
  const { menuAnchorEl, menuVmId, actionLoadingId, onClose, onDelete } = props;

  return (
    <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl) && Boolean(menuVmId)} onClose={onClose}>
      <MenuItem component={Link} to={`/console/vms/${menuVmId ?? ""}/overview`} onClick={onClose}>
        Open Overview
      </MenuItem>
      <MenuItem component={Link} to={`/console/vms/${menuVmId ?? ""}/settings`} onClick={onClose}>
        Settings
      </MenuItem>
      <MenuItem
        sx={{ color: "error.main" }}
        onClick={() => {
          if (menuVmId) onDelete(menuVmId);
          onClose();
        }}
        disabled={menuVmId ? actionLoadingId === `delete:${menuVmId}` : false}
      >
        Delete
      </MenuItem>
    </Menu>
  );
}
