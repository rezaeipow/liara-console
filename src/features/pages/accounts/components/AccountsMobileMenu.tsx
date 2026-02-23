import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Menu, MenuItem } from "@mui/material";
import type { AccountsMobileMenuProps } from "../types";

export default function AccountsMobileMenu(props: AccountsMobileMenuProps) {
  const { state } = props;

  return (
    <Menu
      anchorEl={state.mobileMenuAnchorEl}
      open={state.mobileMenuOpen}
      onClose={state.closeMobileMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {!state.isMobile || !state.mobileMenuAccountId ? null : (
        <>
          {state.mobileMenuAccountId !== state.activeAccountId ? (
            <MenuItem
              onClick={() => {
                state.submitSwitch(state.mobileMenuAccountId as string);
                state.closeMobileMenu();
              }}
            >
              <SwapHorizIcon fontSize="small" sx={{ mr: 1 }} />
              Switch
            </MenuItem>
          ) : null}
          <MenuItem
            onClick={() => {
              const account = state.accounts.find((item) => item.id === state.mobileMenuAccountId);
              if (account) state.startEditing(account.id, account.name);
              state.closeMobileMenu();
            }}
          >
            <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              state.openDeleteDialog(state.mobileMenuAccountId as string);
              state.closeMobileMenu();
            }}
            disabled={state.accounts.length <= 1}
          >
            <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </>
      )}
    </Menu>
  );
}
