import { AppBar, Box, Toolbar } from "@mui/material";
import FeedbackSnackbar from "@/shared/components/common/FeedbackSnackbar";
import TopbarAccountSelect from "./components/TopbarAccountSelect";
import TopbarActionIcons from "./components/TopbarActionIcons";
import TopbarBrand from "./components/TopbarBrand";
import TopbarCreditSummary from "./components/TopbarCreditSummary";
import { useTopbarState } from "./useTopbarState";

export default function Topbar() {
  const state = useTopbarState();

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderRadius: 0,
          borderBottom: `1px solid ${state.theme.palette.divider}`,
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 62, sm: 68 },
            px: { xs: 1, sm: 2, md: 3 },
            pl: state.isSmMd && state.sidebarMode === "collapsed" ? { sm: 3, md: 3.5 } : { xs: 1, sm: 2, md: 3 },
            display: "flex",
            justifyContent: "space-between",
            gap: { xs: 0.75, sm: 1.5 },
            overflow: "visible",
          }}
        >
          <TopbarBrand
            isXs={state.isXs}
            isLgUp={state.isLgUp}
            onSidebarToggle={state.onSidebarToggle}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.25, sm: 1.5 }, minWidth: 0 }}>
            <TopbarAccountSelect
              accountItems={state.accountItems}
              selectedAccountId={state.selectedAccountId}
              accountSwitching={state.accountSwitching}
              accountMenuMaxHeight={state.accountMenuMaxHeight}
              accountMenuItemHeight={state.accountMenuItemHeight}
              onAccountChange={state.onAccountChange}
            />

            {!state.isXs ? <TopbarCreditSummary creditAmount={state.creditAmount} /> : null}

            <TopbarActionIcons
              isXs={state.isXs}
              unreadNotificationsCount={state.unreadNotificationsCount}
              userName={state.userName}
              userAvatar={state.userAvatar}
              menuAnchorEl={state.menuAnchorEl}
              isMenuOpen={state.isMenuOpen}
              onMenuOpen={state.onMenuOpen}
              onMenuClose={state.onMenuClose}
              onLogout={state.onLogout}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <FeedbackSnackbar
        open={state.toastOpen}
        autoHideDuration={3000}
        onClose={state.onToastClose}
        severity={state.toastSeverity}
        message={state.toastMessage}
      />
    </>
  );
}
