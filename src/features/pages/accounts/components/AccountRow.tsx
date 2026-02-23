import { Box, Chip, TextField, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { getStatusChipSx } from "@/shared/ui/statusChipSx";
import type { AccountRowProps } from "../types";
import AccountRowActions from "./AccountRowActions";

export default function AccountRow(props: AccountRowProps) {
  const { state, account } = props;
  const theme = useTheme();
  const isActive = account.id === state.activeAccountId;
  const isEditing = state.editingAccountId === account.id;
  const showLoadingChip = state.isMutatingRow && state.rowAccountId === account.id;
  const loadingLabel = state.rowIntent === "switch" ? "Switching" : state.rowIntent === "edit" ? "Saving" : "Updating";

  return (
    <Box
      sx={{
        p: 1.6,
        borderRadius: { xs: 1.5, sm: 2 },
        border: "1px solid",
        borderColor: isActive ? alpha(theme.palette.primary.main, 0.45) : "divider",
        backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.common.white, 0.35),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1.25,
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", minWidth: 0 }}>
        {isEditing ? (
          <TextField size="small" value={state.editingName} onChange={(event) => state.setEditingName(event.target.value)} sx={{ minWidth: { xs: 120, sm: 200 } }} />
        ) : (
          <Typography fontWeight={700} noWrap sx={{ maxWidth: { xs: 160, sm: 260 } }} title={account.name}>
            {account.name}
          </Typography>
        )}
        {isActive ? (
          <Chip
            label="Active"
            size="small"
            color="primary"
            sx={getStatusChipSx(theme, "success", "solid")}
          />
        ) : null}
        {showLoadingChip ? <Chip label={loadingLabel} size="small" variant="outlined" /> : null}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <AccountRowActions state={state} account={account} isActive={isActive} />
      </Box>
    </Box>
  );
}
