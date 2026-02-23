import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import ConsoleContentContainer from "@/shared/components/console/ConsoleContentContainer";
import ConsoleHeroCard from "@/shared/components/console/ConsoleHeroCard";
import TicketsPageContent from "./components/TicketsPageContent";
import TicketsSummaryStats from "./components/TicketsSummaryStats";
import { useTicketsPageState } from "./useTicketsPageState";

export default function TicketsPage() {
  const state = useTicketsPageState();

  return (
    <ConsoleContentContainer spacing={2.2} aria-busy={state.isRouteLoading}>
      <ConsoleHeroCard
        title="Support Tickets"
        description="Track issue reports and follow up with support replies."
        icon={<SupportAgentOutlinedIcon fontSize="small" />}
        compact={state.tableDensity === "compact"}
        actions={
          <Button
            component={Link}
            to="/console/support/tickets/new"
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            aria-label="Create a new support ticket"
          >
            New ticket
          </Button>
        }
      />

      <TicketsSummaryStats total={state.items.length} summary={state.summary} density={state.tableDensity} />
      <TicketsPageContent state={state} />
    </ConsoleContentContainer>
  );
}
