import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import { Alert, Collapse, Divider, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AccountsSearchBar from "./AccountsSearchBar";
import AccountRow from "./AccountRow";
import type { AccountsListPanelProps } from "../types";

export default function AccountsListPanel(props: AccountsListPanelProps) {
  const { state } = props;

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        border: (theme) => `1px solid ${alpha(theme.palette.text.secondary, 0.24)}`,
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.text.secondary, 0.06)}, ${alpha(theme.palette.common.white, 0.52)})`,
        borderRadius: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ViewListOutlinedIcon />
            <Typography variant="h6" fontWeight={800}>Accounts List</Typography>
          </Stack>
          <AccountsSearchBar query={state.query} onQueryChange={state.setQuery} />
        </Stack>
        <Divider sx={{ opacity: 0.4 }} />
        <Collapse in={state.showSuccessInline}>
          <Alert severity="success" onClose={state.dismissSuccess}>{state.latestSuccessMessage}</Alert>
        </Collapse>
        {state.rowFormError ? <Alert severity="error">{state.rowFormError}</Alert> : null}
        {state.filteredAccounts.length === 0 ? (
          <Alert severity="info">
            {state.accounts.length === 0 ? "No accounts found. Create your first account." : "No account matches your search."}
          </Alert>
        ) : (
          <Stack spacing={1.25}>
            {state.filteredAccounts.map((account) => (
              <AccountRow key={account.id} state={state} account={account} />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
