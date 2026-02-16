import { useParams } from "react-router-dom";
import { PagePlaceholder } from "../PagePlaceholder";

export default function ProjectOverviewPage() {
  const { projectId } = useParams();
  return <PagePlaceholder title={`Project Overview: ${projectId ?? "-"}`} description="/console/projects/:projectId" />;
}
