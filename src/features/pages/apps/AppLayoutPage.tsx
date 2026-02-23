import AppsIcon from "@mui/icons-material/Apps";
import { Chip } from "@mui/material";
import { Outlet } from "react-router-dom";
import {
  ConsolePageShell,
  ConsoleResourceLayoutBody,
  ConsoleResourceLayoutHeader,
  ResourceStatusMetaChips,
} from "@/shared/components/console";
import { useAppLayoutState } from "./useAppLayoutState";

const appTabs = [
  { label: "Overview", path: "overview" },
  { label: "Deployments", path: "deployments" },
  { label: "Env", path: "env" },
  { label: "Logs", path: "logs" },
  { label: "Settings", path: "settings" },
];

export default function AppLayoutPage() {
  const state = useAppLayoutState();

  return (
    <ConsolePageShell spacing={2}>
      <ConsoleResourceLayoutHeader
        icon={<AppsIcon />}
        title={state.app?.name ?? "Application"}
        badgeLabel="App Console"
        backTo={state.projectAppsHref}
        backLabel="Back to Apps List"
        tabs={appTabs}
        isLoading={state.isLoading}
        error={state.error}
        smTabColumns={5}
      />

      <ConsoleResourceLayoutBody
        chips={
          <ResourceStatusMetaChips
            statusLabel={state.app?.status ?? "unknown"}
            statusTone={state.statusChipTone}
          >
            <Chip size="small" label={state.app?.region?.toUpperCase() ?? "-"} />
            <Chip
              size="small"
              label={state.app?.plan ?? "-"}
              sx={{ textTransform: "capitalize" }}
              variant="outlined"
            />
          </ResourceStatusMetaChips>
        }
      >
        <Outlet context={{ app: state.app, isLoading: state.isLoading, error: state.error, setApp: state.setApp }} />
      </ConsoleResourceLayoutBody>
    </ConsolePageShell>
  );
}
