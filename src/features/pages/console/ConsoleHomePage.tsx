import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import ConsoleHomeBottomGrid from "./components/ConsoleHomeBottomGrid";
import ConsoleHomeHero from "./components/ConsoleHomeHero";
import ConsoleHomeStatGrid from "./components/ConsoleHomeStatGrid";
import { activityItems, quickActions } from "./consoleHomeData";
import { useConsoleHomeState } from "./useConsoleHomeState";

export default function ConsoleHomePage() {
  const state = useConsoleHomeState();

  return (
    <ConsoleContentContainer
      spacing={state.isCompact ? 1.2 : 2.2}
      maxWidth={{ xs: "100%", sm: 980, lg: 1120 }}
    >
      <ConsoleHomeHero
        activeAccountName={state.activeAccountName}
        hasActiveAccount={state.hasActiveAccount}
        unreadNotifications={state.unreadNotifications}
        tableDensity={state.tableDensity}
        isCompact={state.isCompact}
      />

      <ConsoleHomeStatGrid unreadNotifications={state.unreadNotifications} />

      <ConsoleHomeBottomGrid
        quickActions={quickActions}
        activityItems={activityItems}
        isCompact={state.isCompact}
      />
    </ConsoleContentContainer>
  );
}
