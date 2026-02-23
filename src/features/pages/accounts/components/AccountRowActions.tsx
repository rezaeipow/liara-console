import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import type { AccountRowActionsProps } from "../types";

export default function AccountRowActions(props: AccountRowActionsProps) {
  const { state, account, isActive } = props;
  const isEditing = state.editingAccountId === account.id;

  if (isEditing) {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip title="Save">
          <span>
            <IconButton size="small" color="primary" onClick={state.submitEdit} disabled={state.isMutatingRow || state.editingName.trim().length < 2}>
              <CheckIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Cancel">
          <span>
            <IconButton size="small" onClick={state.cancelEditing} disabled={state.isMutatingRow}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    );
  }

  return (
    <>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ display: { xs: "none", sm: "flex" } }}>
        {!isActive ? (
          <Button size="small" variant="contained" disabled={state.isMutatingRow} onClick={() => state.submitSwitch(account.id)} sx={{ minWidth: 88 }}>
            {state.isSwitching && state.rowAccountId === account.id ? "Switching..." : "Switch"}
          </Button>
        ) : null}
        <Tooltip title="Edit account">
          <span>
            <IconButton size="small" onClick={() => state.startEditing(account.id, account.name)} disabled={state.isMutatingRow}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete account">
          <span>
            <IconButton size="small" onClick={() => state.openDeleteDialog(account.id)} disabled={state.isMutatingRow || state.accounts.length <= 1}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
        {!isActive ? (
          <Button size="small" variant="outlined" onClick={() => state.submitSwitch(account.id)} disabled={state.isMutatingRow}>
            {state.isSwitching && state.rowAccountId === account.id ? "Switching..." : "Switch"}
          </Button>
        ) : null}
        <IconButton size="small" onClick={(event) => state.openMobileMenu(event, account.id)} disabled={state.isMutatingRow}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
    </>
  );
}
