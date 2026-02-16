import { useParams } from "react-router-dom";
import { PagePlaceholder } from "../PagePlaceholder";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  return <PagePlaceholder title={`Ticket Detail: ${ticketId ?? "-"}`} description="/console/support/tickets/:ticketId" />;
}
