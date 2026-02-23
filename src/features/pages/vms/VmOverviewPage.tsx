import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import VmOverviewActionsCard from "./components/VmOverviewActionsCard";
import VmOverviewHeaderCard from "./components/VmOverviewHeaderCard";
import VmOverviewLoading from "./components/VmOverviewLoading";
import VmOverviewResourceCard from "./components/VmOverviewResourceCard";
import { useVmOverviewState } from "./useVmOverviewState";

export default function VmOverviewPage() {
  const theme = useTheme();
  const state = useVmOverviewState();

  if (state.isLoading) {
    return <VmOverviewLoading />;
  }

  if (state.error) {
    return (
      <Alert
        severity="error"
        action={
          <Button size="small" color="inherit" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
      >
        {state.error}
      </Alert>
    );
  }

  if (!state.vm) {
    return <Alert severity="warning">VM data is not available.</Alert>;
  }

  return (
    <>
      <Stack spacing={1.4}>
        <VmOverviewHeaderCard theme={theme} vm={state.vm} />
        <VmOverviewActionsCard
          vm={state.vm}
          actionLoading={state.actionLoading}
          onAction={(type) => {
            void state.runAction(type);
          }}
        />
        <VmOverviewResourceCard vm={state.vm} />
      </Stack>

      <Snackbar
        open={Boolean(state.notice)}
        autoHideDuration={2800}
        onClose={() => state.setNotice(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={state.notice?.severity ?? "success"} variant="filled" onClose={() => state.setNotice(null)}>
          {state.notice?.message ?? ""}
        </Alert>
      </Snackbar>
    </>
  );
}
