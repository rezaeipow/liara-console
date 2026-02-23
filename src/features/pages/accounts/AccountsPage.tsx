import { Box } from "@mui/material";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import AccountsDialogs from "./components/AccountsDialogs";
import AccountsHeader from "./components/AccountsHeader";
import AccountsListPanel from "./components/AccountsListPanel";
import AccountsMobileMenu from "./components/AccountsMobileMenu";
import { useAccountsPageState } from "./useAccountsPageState";

export default function AccountsPage() {
  const state = useAccountsPageState();

  return (
    <ConsoleContentContainer spacing={2.5}>
      <AccountsHeader onOpenCreate={() => state.setIsCreateDialogOpen(true)} />
      <Box>
        <AccountsListPanel state={state} />
      </Box>
      <AccountsDialogs state={state} />
      <AccountsMobileMenu state={state} />
    </ConsoleContentContainer>
  );
}
