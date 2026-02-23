import { Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AppLogsContent from "./components/AppLogsContent";
import AppLogsControls from "./components/AppLogsControls";
import AppLogsError from "./components/AppLogsError";
import AppLogsHeader from "./components/AppLogsHeader";
import { formatLogDateTime } from "./appLogsUtils";
import { useAppLogsPageState } from "./useAppLogsPageState";

export default function AppLogsPage() {
  const theme = useTheme();
  const state = useAppLogsPageState();

  return (
    <Stack spacing={1.5}>
      <AppLogsHeader
        isLoading={state.isLoading}
        isRefreshing={state.isRefreshing}
        onRefresh={() => void state.fetchLogs("replace")}
        onClear={() => state.setLogs([])}
      />
      <AppLogsControls
        level={state.level}
        autoStream={state.autoStream}
        lastUpdatedAt={state.lastUpdatedAt}
        onLevelChange={state.setLevel}
        onAutoStreamChange={state.setAutoStream}
        formatDateTime={formatLogDateTime}
      />
      <AppLogsError
        error={state.error}
        onRetry={() => void state.fetchLogs("replace")}
      />
      <AppLogsContent
        isLoading={state.isLoading}
        logs={state.logs}
        theme={theme}
        formatDateTime={formatLogDateTime}
      />
    </Stack>
  );
}
